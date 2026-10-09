const canvas = document.getElementById("webgl-bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 4.8;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.BufferGeometry();
const count = 850;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 3) {
  positions[i] = (Math.random() - .5) * 18;
  positions[i + 1] = (Math.random() - .5) * 11;
  positions[i + 2] = (Math.random() - .5) * 12;
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0x00f3ff,
  size: .025,
  transparent: true,
  opacity: .55
});
const stars = new THREE.Points(geometry, material);
group.add(stars);

const grid = new THREE.GridHelper(18, 30, 0x00f3ff, 0x07343c);
grid.rotation.x = Math.PI / 2;
grid.position.z = -4;
grid.material.transparent = true;
grid.material.opacity = .12;
scene.add(grid);

let mx = 0, my = 0;
window.addEventListener("pointermove", e => {
  mx = (e.clientX / innerWidth - .5) * .6;
  my = (e.clientY / innerHeight - .5) * .4;
});

function animate() {
  requestAnimationFrame(animate);
  stars.rotation.y += .00045;
  stars.rotation.x += .00012;
  group.rotation.y += (mx - group.rotation.y) * .012;
  group.rotation.x += (-my - group.rotation.x) * .012;
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

let isModalHistoryPushed = false;

function isMobileView() {
  return window.innerWidth <= 900 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function pushModalHistory() {
  if (isMobileView() && !isModalHistoryPushed) {
    isModalHistoryPushed = true;
    try {
      history.pushState({ modalOpen: true }, "");
    } catch (e) { }
  }
}

function closeModalsInternal() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
  document.body.style.overflow = "";
}

function openRegisterModal(eventName) {
  const regTextEl = document.getElementById("registerText");
  if (regTextEl) {
    regTextEl.textContent = "";
  }
  const regModal = document.getElementById("registerModal");
  regModal.classList.add("open");
  const modalBox = regModal.querySelector(".modal");
  if (modalBox) {
    modalBox.scrollTop = 0;
  }
  document.body.style.overflow = "hidden";
  pushModalHistory();
}

function openRulesModal(
  title,
  time,
  venue,
  rules,
  judgingCriteria,
  coordinator,
  teamSize,
  guestJury,
  prizePool
) {
  document.getElementById("rulesTitle").textContent = title;

  const timeEl = document.getElementById("rulesTime");
  if (timeEl) {
    if (time) {
      timeEl.textContent = "◷ " + time;
      timeEl.style.display = "inline-block";
    } else {
      timeEl.style.display = "none";
    }
  }

  const venueEl = document.getElementById("rulesVenue");
  if (venueEl) {
    if (venue) {
      venueEl.textContent = "⌖ " + venue;
      venueEl.style.display = "inline-block";
    } else {
      venueEl.style.display = "none";
    }
  }

  const teamEl = document.getElementById("rulesTeam");
  if (teamEl) {
    if (teamSize) {
      teamEl.textContent = "👥 " + teamSize;
      teamEl.style.display = "inline-block";
    } else {
      teamEl.style.display = "none";
    }
  }

  document.getElementById("rulesBody").innerHTML =
    rules.map(r => `<li>${r}</li>`).join("");

  const criteriaTextEl = document.getElementById("rulesCriteriaText");
  const criteriaBoxEl = document.getElementById("modalCriteriaBox");
  if (criteriaTextEl && criteriaBoxEl) {
    if (judgingCriteria) {
      criteriaTextEl.innerHTML = judgingCriteria;
      criteriaBoxEl.style.display = "block";
    } else {
      criteriaBoxEl.style.display = "none";
    }
  }

  const guestTextEl = document.getElementById("rulesGuestText");
  const guestBoxEl = document.getElementById("modalGuestBox");
  if (guestTextEl && guestBoxEl) {
    if (guestJury) {
      guestTextEl.innerHTML = guestJury;
      guestBoxEl.style.display = "block";
    } else {
      guestBoxEl.style.display = "none";
    }
  }

  const prizeTextEl = document.getElementById("rulesPrizeText");
  const prizeBoxEl = document.getElementById("modalPrizeBox");
  if (prizeTextEl && prizeBoxEl) {
    if (prizePool) {
      prizeTextEl.innerHTML = prizePool;
      prizeBoxEl.style.display = "block";
    } else {
      prizeBoxEl.style.display = "none";
    }
  }

  const coordTextEl = document.getElementById("rulesCoordText");
  const coordBoxEl = document.getElementById("modalCoordBox");
  if (coordTextEl && coordBoxEl) {
    if (coordinator) {
      coordTextEl.innerHTML = coordinator;
      coordBoxEl.style.display = "block";
    } else {
      coordBoxEl.style.display = "none";
    }
  }

  const rulesModal = document.getElementById("rulesModal");
  rulesModal.classList.add("open");
  const modalBox = rulesModal.querySelector(".modal");
  if (modalBox) {
    modalBox.scrollTop = 0;
  }

  document.body.style.overflow = "hidden";
  pushModalHistory();
}

function closeModals() {
  if (isModalHistoryPushed) {
    isModalHistoryPushed = false;
    try {
      history.back();
    } catch (e) { }
  }
  closeModalsInternal();
}

window.addEventListener("popstate", () => {
  if (isModalHistoryPushed) {
    isModalHistoryPushed = false;
    closeModalsInternal();
  } else {
    const openModal = document.querySelector(".modal-overlay.open");
    if (openModal && isMobileView()) {
      closeModalsInternal();
    }
  }
});

if (window.history.state && window.history.state.modalOpen) {
  try {
    history.replaceState(null, "");
  } catch (e) { }
}

document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeModals();
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModals();
});

const counter = document.getElementById("counter");
let n = 40;
setInterval(() => {
  n += Math.random() > .72 ? 1 : 0;
  counter.textContent = String(n).padStart(3, "0") + "+";
}, 2600);

document.querySelectorAll(".event-card").forEach((card, i) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(25px)";
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          card.style.transition = "opacity .6s ease, transform .6s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, i * 90);
        observer.disconnect();
      }
    });
  }, { threshold: .12 });
  observer.observe(card);
});

// ==========================================
// AI & DS 3D CYBERNETIC ROBOTICS & AI ENGINE
// ==========================================
(function initAIRoboticsEngine() {
  function start() {
    const canvas = document.getElementById("neuralCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = 300;
    let height = 150;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width > 0 ? rect.width : 300;
      height = rect.height > 0 ? rect.height : 150;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ========================================================
    // 1. 3D HUMANOID ROBOTIC CHASSIS & FACEPLATE GEOMETRY
    // ========================================================
    // 3D structural vertices defining the robotic head, armor plates,
    // ocular sensors, and mechatronic neck assembly
    const robotNodes = [
      // 0-4: Cranial Top Dome & Forehead Plate
      { id: "forehead_top", x: 0, y: 26, z: 10, type: "chassis" },
      { id: "brow_l", x: -11, y: 15, z: 21, type: "brow" },
      { id: "brow_r", x: 11, y: 15, z: 21, type: "brow" },
      { id: "temple_l", x: -23, y: 17, z: 7, type: "chassis" },
      { id: "temple_r", x: 23, y: 17, z: 7, type: "chassis" },

      // 5-8: Cranial Vault & Rear Skull Armor
      { id: "crown_apex", x: 0, y: 29, z: -8, type: "chassis" },
      { id: "crown_l", x: -18, y: 23, z: -9, type: "chassis" },
      { id: "crown_r", x: 18, y: 23, z: -9, type: "chassis" },
      { id: "occipital_l", x: -13, y: 12, z: -21, type: "chassis" },
      { id: "occipital_r", x: 13, y: 12, z: -21, type: "chassis" },

      // 10-11: Bionic Ocular AI Sensors (Eyes)
      { id: "eye_l", x: -9, y: 9, z: 21, type: "eye", isLeft: true },
      { id: "eye_r", x: 9, y: 9, z: 21, type: "eye", isLeft: false },

      // 12-14: Nose Bridge & Center Optical Array
      { id: "nose_bridge", x: 0, y: 14, z: 22, type: "chassis" },
      { id: "nose_tip", x: 0, y: 7, z: 25, type: "sensor" },
      { id: "nasal_base", x: 0, y: 2, z: 23, type: "chassis" },

      // 15-18: Cheekbone Plates & Mandible
      { id: "cheek_l", x: -19, y: 4, z: 18, type: "plate" },
      { id: "cheek_r", x: 19, y: 4, z: 18, type: "plate" },
      { id: "jaw_angle_l", x: -17, y: -7, z: 6, type: "joint" },
      { id: "jaw_angle_r", x: 17, y: -7, z: 6, type: "joint" },

      // 19-21: Audio-Vocoder Mouth & Equalizer Slit
      { id: "mouth_l", x: -8, y: -5, z: 21, type: "vocoder" },
      { id: "mouth_c", x: 0, y: -5, z: 22, type: "vocoder" },
      { id: "mouth_r", x: 8, y: -5, z: 21, type: "vocoder" },

      // 22-24: Chin Armor Plate
      { id: "chin_l", x: -5, y: -15, z: 17, type: "plate" },
      { id: "chin_c", x: 0, y: -16, z: 18, type: "chassis" },
      { id: "chin_r", x: 5, y: -15, z: 17, type: "plate" },

      // 25-26: Ear Hydrophones & Rotational Gyros
      { id: "ear_l", x: -25, y: 2, z: -4, type: "gyro" },
      { id: "ear_r", x: 25, y: 2, z: -4, type: "gyro" },

      // 27-29: Neck Articulation & Ball-Socket Pivot
      { id: "neck_pivot", x: 0, y: -21, z: -3, type: "joint" },
      { id: "neck_mid", x: 0, y: -27, z: -5, type: "joint" },
      { id: "neck_base", x: 0, y: -34, z: -6, type: "joint" },

      // 30-33: Hydraulic Pistons (Actuators)
      { id: "piston_top_l", x: -13, y: -9, z: 4, type: "piston" },
      { id: "piston_top_r", x: 13, y: -9, z: 4, type: "piston" },
      { id: "piston_bot_l", x: -16, y: -33, z: -4, type: "piston" },
      { id: "piston_bot_r", x: 16, y: -33, z: -4, type: "piston" },

      // 34-37: Collarbone Chassis & Chest Core
      { id: "collar_l", x: -27, y: -35, z: 0, type: "chassis" },
      { id: "collar_r", x: 27, y: -35, z: 0, type: "chassis" },
      { id: "chest_core", x: 0, y: -33, z: 8, type: "reactor" }
    ];

    // ========================================================
    // 2. INTERNAL CRANIAL AI NEURAL BRAIN CORE
    // ========================================================
    // A glowing 3D neural node cluster inside the translucent skull dome
    const aiCoreNodes = [];
    const AI_CORE_COUNT = 14;
    for (let i = 0; i < AI_CORE_COUNT; i++) {
      const angle = (i / AI_CORE_COUNT) * Math.PI * 2;
      const rad = 7 + (i % 3) * 3;
      aiCoreNodes.push({
        x: Math.cos(angle) * rad,
        y: 19 + Math.sin(i * 1.7) * 4,
        z: -6 + Math.sin(angle) * (rad * 0.75),
        pulse: Math.random() * Math.PI * 2
      });
    }

    // AI Core center quantum processor
    const QUANTUM_CHIP = { x: 0, y: 19, z: -6 };

    // ========================================================
    // 3. MECHATRONIC CHASSIS EDGES & ARMOR FACETS
    // ========================================================
    // Connections between robotic vertices defining titanium armor panels
    const robotEdges = [
      // Brow & Forehead
      [1, 12], [2, 12], [1, 3], [2, 4], [0, 1], [0, 2], [0, 3], [0, 4],
      // Cranium Vault Dome
      [0, 5], [3, 6], [4, 7], [5, 6], [5, 7], [6, 8], [7, 9], [8, 9],
      // Nose & Face Bridge
      [12, 13], [13, 14], [1, 13], [2, 13],
      // Cheekbones & Mandible
      [1, 15], [2, 16], [15, 17], [16, 18], [3, 15], [4, 16], [3, 25], [4, 26],
      [17, 25], [18, 26], [25, 8], [26, 9],
      // Vocoder Mouth Grille
      [14, 19], [14, 21], [14, 20], [19, 20], [20, 21],
      // Jawline to Chin Plate
      [17, 22], [18, 24], [22, 23], [23, 24], [19, 22], [21, 24], [20, 23],
      // Neck Articulation & Spine
      [23, 27], [17, 27], [18, 27], [27, 28], [28, 29],
      // Hydraulic Actuator Dampers
      [30, 32], [31, 33],
      // Collarbone & Torso Base
      [32, 29], [33, 29], [32, 34], [33, 35], [29, 36], [34, 36], [35, 36]
    ];

    // Travelling Data Signals along Mechatronic Bus Lines
    const BUS_SIGNALS = [];
    for (let s = 0; s < 18; s++) {
      BUS_SIGNALS.push({
        edgeIdx: Math.floor(Math.random() * robotEdges.length),
        t: Math.random(),
        speed: 0.02 + Math.random() * 0.025
      });
    }

    // ========================================================
    // 4. INTERACTION & 3D ROTATION STATE
    // ========================================================
    let rotX = 0.12;
    let rotY = 0;
    let rotZ = 0;
    let velX = 0;
    let velY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // Real-Time Autonomous Eye & Head Tracking
    let targetLookX = 0;
    let targetLookY = 0;
    let currentLookX = 0;
    let currentLookY = 0;

    const terminal = canvas.closest(".hero-terminal") || canvas;

    canvas.addEventListener("pointerdown", e => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });

    window.addEventListener("pointermove", e => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        velY = dx * 0.0075;
        velX = -dy * 0.0075;
        rotY += velY;
        rotX += velX;
        startX = e.clientX;
        startY = e.clientY;
      }
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    // Autonomous Look-At Cursor Tracking
    terminal.addEventListener("pointermove", e => {
      const rect = terminal.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetLookX = nx * 0.45;
      targetLookY = -ny * 0.35;

      if (!isDragging) {
        velY += (nx * 0.015 - velY) * 0.08;
        velX += (-ny * 0.012 - velX) * 0.08;
      }
    });

    terminal.addEventListener("pointerleave", () => {
      targetLookX = 0;
      targetLookY = 0;
    });

    // 3D Matrix Euler Rotation
    function rotate3D(p, rx, ry, rz) {
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;
      const y1 = p.y;

      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;
      const x2 = x1;

      const cosZ = Math.cos(rz), sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y2 * sinZ;
      const y3 = x2 * sinZ + y2 * cosZ;
      const z3 = z2;

      return { x: x3, y: y3, z: z3 };
    }

    // ========================================================
    // 5. MAIN RENDER LOOP (60 FPS)
    // ========================================================
    let time = 0;

    function render() {
      requestAnimationFrame(render);
      time += 0.024;

      // Smooth eye & head tracking interpolation
      currentLookX += (targetLookX - currentLookX) * 0.08;
      currentLookY += (targetLookY - currentLookY) * 0.08;

      if (!isDragging) {
        rotY += Math.sin(time * 0.7) * 0.003 + velY;
        rotX += Math.sin(time * 0.5) * 0.002 + velX;
        velX *= 0.92;
        velY *= 0.92;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 2;
      const fov = 210;

      // Effective combined rotation (drag + autonomous tracking)
      const effRotX = rotX + currentLookY * 0.45;
      const effRotY = rotY + currentLookX * 0.55;
      const effRotZ = rotZ;

      // ----------------------------------------------------
      // A. Project Robotic Vertices
      // ----------------------------------------------------
      const projNodes = robotNodes.map(n => {
        const rot = rotate3D(n, effRotX, effRotY, effRotZ);
        const scale = fov / (fov + rot.z);
        return {
          x: cx + rot.x * scale,
          y: cy - rot.y * scale, // Inverted Y for screen coords
          z: rot.z,
          scale,
          orig: n
        };
      });

      // ----------------------------------------------------
      // B. Draw Internal Translucent Cranial AI Neural Brain
      // ----------------------------------------------------
      ctx.save();
      const projCoreCenter = rotate3D(QUANTUM_CHIP, effRotX, effRotY, effRotZ);
      const coreScale = fov / (fov + projCoreCenter.z);
      const coreX = cx + projCoreCenter.x * coreScale;
      const coreY = cy - projCoreCenter.y * coreScale;

      // Pulsing AI Quantum Core Aura
      const corePulse = 1 + Math.sin(time * 3.5) * 0.22;
      const coreGrad = ctx.createRadialGradient(coreX, coreY, 1, coreX, coreY, 20 * corePulse * coreScale);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.3, "rgba(0, 243, 255, 0.75)");
      coreGrad.addColorStop(0.7, "rgba(168, 85, 247, 0.3)");
      coreGrad.addColorStop(1, "rgba(0, 243, 255, 0)");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 22 * corePulse * coreScale, 0, Math.PI * 2);
      ctx.fill();

      // Neural Nodes inside Cranial Dome
      const projAINodes = aiCoreNodes.map(an => {
        const rot = rotate3D(an, effRotX, effRotY, effRotZ);
        const sc = fov / (fov + rot.z);
        return { x: cx + rot.x * sc, y: cy - rot.y * sc, z: rot.z, sc };
      });

      // Connect AI brain nodes with synaptic lines
      ctx.beginPath();
      for (let i = 0; i < projAINodes.length; i++) {
        const p1 = projAINodes[i];
        // Connect to center core
        ctx.moveTo(coreX, coreY);
        ctx.lineTo(p1.x, p1.y);
        // Connect to neighboring node
        const p2 = projAINodes[(i + 1) % projAINodes.length];
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.strokeStyle = "rgba(0, 243, 255, 0.28)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Draw AI nodes
      projAINodes.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8 * p.sc, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
      });
      ctx.restore();

      // ----------------------------------------------------
      // C. Draw Hydraulic Pistons & Neck Actuators
      // ----------------------------------------------------
      ctx.save();
      // Left and Right Hydraulic Pistons (thicker mechanical cylinders)
      const pTopL = projNodes[30];
      const pBotL = projNodes[32];
      const pTopR = projNodes[31];
      const pBotR = projNodes[33];

      [
        { top: pTopL, bot: pBotL },
        { top: pTopR, bot: pBotR }
      ].forEach(pis => {
        // Outer Cylinder
        ctx.beginPath();
        ctx.moveTo(pis.top.x, pis.top.y);
        ctx.lineTo(pis.bot.x, pis.bot.y);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.65)";
        ctx.lineWidth = 2.4 * pis.top.scale;
        ctx.stroke();

        // Inner Piston Rod Highlight
        ctx.beginPath();
        ctx.moveTo(pis.top.x, pis.top.y);
        ctx.lineTo(pis.bot.x, pis.bot.y);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.9 * pis.top.scale;
        ctx.stroke();
      });
      ctx.restore();

      // ----------------------------------------------------
      // D. Draw Mechatronic Chassis Edges (Robotic Armor Panels)
      // ----------------------------------------------------
      ctx.save();
      robotEdges.forEach(([i, j]) => {
        const p1 = projNodes[i];
        const p2 = projNodes[j];
        const avgZ = (p1.z + p2.z) / 2;
        const depthAlpha = Math.max(0.12, Math.min(0.9, (avgZ + 50) / 100));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        ctx.strokeStyle = `rgba(0, 243, 255, ${depthAlpha * 0.7})`;
        ctx.lineWidth = Math.max(0.8, 1.3 * ((p1.scale + p2.scale) / 2));
        ctx.stroke();
      });
      ctx.restore();

      // ----------------------------------------------------
      // E. Travelling Data Signals along Mechatronic Bus Lines
      // ----------------------------------------------------
      ctx.save();
      BUS_SIGNALS.forEach(sig => {
        const edge = robotEdges[sig.edgeIdx];
        if (!edge) return;
        sig.t += sig.speed;
        if (sig.t >= 1) {
          sig.t = 0;
          sig.edgeIdx = Math.floor(Math.random() * robotEdges.length);
        }

        const p1 = projNodes[edge[0]];
        const p2 = projNodes[edge[1]];
        const curX = p1.x + (p2.x - p1.x) * sig.t;
        const curY = p1.y + (p2.y - p1.y) * sig.t;
        const sc = p1.scale + (p2.scale - p1.scale) * sig.t;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.2 * sc, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 10;
        ctx.fill();
      });
      ctx.restore();

      // ----------------------------------------------------
      // F. Draw Bionic Ocular AI Sensors (Eyes) with Active Tracking
      // ----------------------------------------------------
      ctx.save();
      const eyeL = projNodes[10];
      const eyeR = projNodes[11];

      [eyeL, eyeR].forEach(eye => {
        const eyeRScale = 4.8 * eye.scale;

        // Outer Metallic Socket Ring
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, eyeRScale, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.75)";
        ctx.lineWidth = 1.2;
        ctx.fillStyle = "#001219";
        ctx.fill();
        ctx.stroke();

        // Ocular Aperture Iris Ring
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, eyeRScale * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.9)";
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Pupil Optical Beacon (Tracks current look direction)
        const pupilOffX = currentLookX * 2.2 * eye.scale;
        const pupilOffY = -currentLookY * 2.2 * eye.scale;

        ctx.beginPath();
        ctx.arc(eye.x + pupilOffX, eye.y + pupilOffY, eyeRScale * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 14;
        ctx.fill();

        // Targeting HUD Reticle on Eye
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, eyeRScale * 1.5, time * 2, time * 2 + Math.PI * 1.4);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      ctx.restore();

      // ----------------------------------------------------
      // G. Audio-Vocoder Equalizer (Mouth Grille Pulses)
      // ----------------------------------------------------
      ctx.save();
      const mouthL = projNodes[19];
      const mouthR = projNodes[21];
      const mouthC = projNodes[20];

      // Draw horizontal vocoder bars that pulse with audio frequency
      const barCount = 7;
      for (let b = 0; b < barCount; b++) {
        const prg = b / (barCount - 1);
        const bx = mouthL.x + (mouthR.x - mouthL.x) * prg;
        const by = mouthL.y + (mouthR.y - mouthL.y) * prg;
        const bHeight = (Math.sin(time * 6 + b * 1.2) * 0.5 + 0.5) * 4.5 * mouthC.scale;

        ctx.beginPath();
        ctx.moveTo(bx, by - bHeight);
        ctx.lineTo(bx, by + bHeight);
        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 1.1;
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 6;
        ctx.stroke();
      }
      ctx.restore();

      // ----------------------------------------------------
      // H. Chest Arc Reactor Power Core (Base of Torso)
      // ----------------------------------------------------
      ctx.save();
      const chest = projNodes[36];
      if (chest) {
        const rPulse = 1 + Math.sin(time * 4) * 0.15;
        const rRadius = 6.5 * chest.scale * rPulse;

        ctx.beginPath();
        ctx.arc(chest.x, chest.y, rRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 16;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(chest.x, chest.y, rRadius * 1.6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // ----------------------------------------------------
      // I. Computer Vision Tracking HUD & Target Calipers
      // ----------------------------------------------------
      ctx.save();
      // Facial Recognition Bounding Cage Brackets
      ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
      ctx.lineWidth = 1;
      const bW = 65;
      const bH = 54;
      const arm = 9;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(cx - bW, cy - bH + arm);
      ctx.lineTo(cx - bW, cy - bH);
      ctx.lineTo(cx - bW + arm, cy - bH);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(cx + bW - arm, cy - bH);
      ctx.lineTo(cx + bW, cy - bH);
      ctx.lineTo(cx + bW, cy - bH + arm);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(cx - bW, cy + bH - arm);
      ctx.lineTo(cx - bW, cy + bH);
      ctx.lineTo(cx - bW + arm, cy + bH);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(cx + bW - arm, cy + bH);
      ctx.lineTo(cx + bW, cy + bH);
      ctx.lineTo(cx + bW, cy + bH - arm);
      ctx.stroke();

      // Computer Vision Telemetry Labels
      ctx.font = "7.5px 'Share Tech Mono', monospace";
      ctx.fillStyle = "rgba(0, 243, 255, 0.85)";
      ctx.shadowColor = "#00f3ff";
      ctx.shadowBlur = 6;
      ctx.fillText("AI_VISION // DETECT: HUMANOID", cx - bW + 4, cy - bH - 4);
      ctx.fillText("LOCK: 99.8%", cx + bW - 46, cy - bH - 4);

      // Scanning Laser Radar Line
      const scanBarY = cy + Math.sin(time * 1.6) * 44;
      const scanGrad = ctx.createLinearGradient(cx - bW, scanBarY, cx + bW, scanBarY);
      scanGrad.addColorStop(0, "rgba(0, 243, 255, 0)");
      scanGrad.addColorStop(0.3, "rgba(0, 243, 255, 0.35)");
      scanGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.75)");
      scanGrad.addColorStop(0.7, "rgba(0, 243, 255, 0.35)");
      scanGrad.addColorStop(1, "rgba(0, 243, 255, 0)");

      ctx.fillStyle = scanGrad;
      ctx.fillRect(cx - bW, scanBarY - 1, bW * 2, 2);
      ctx.restore();

      // ----------------------------------------------------
      // J. Real-Time Servo Kinematics Oscilloscope (Bottom Monitor)
      // ----------------------------------------------------
      ctx.save();
      const waveY = height - 10;
      ctx.beginPath();
      for (let x = 16; x <= width - 16; x += 3) {
        const waveProgress = (x / width) * 16 + time * 4.0;
        const amp = (Math.sin(waveProgress) * 0.45 + Math.sin(waveProgress * 2.4) * 0.35 + (Math.random() - 0.5) * 0.1) * 3.5;
        if (x === 16) ctx.moveTo(x, waveY + amp);
        else ctx.lineTo(x, waveY + amp);
      }
      ctx.strokeStyle = "rgba(0, 243, 255, 0.45)";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Actuator Status Indicator Dot
      ctx.beginPath();
      ctx.arc(width - 20, waveY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "#19ff9c";
      ctx.shadowColor = "#19ff9c";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

// ==========================================
// MOBILE DEPARTMENT NAVIGATION SCROLL PRESERVATION
// ==========================================
(function initMobileDeptNav() {
  function getDeptSwitcher() {
    return document.querySelector('.dept-switcher');
  }

  function positionDeptNav() {
    if (window.innerWidth > 900) return;
    const switcher = getDeptSwitcher();
    if (!switcher) return;

    const maxScroll = switcher.scrollWidth - switcher.clientWidth;
    if (maxScroll <= 0) return;

    const activeTab = switcher.querySelector('a.active') || switcher.querySelector('.active');
    if (!activeTab) return;

    const savedRaw = sessionStorage.getItem('deptNavScrollLeft');
    let currentScroll = switcher.scrollLeft;
    if (savedRaw !== null) {
      const parsed = parseFloat(savedRaw);
      if (!isNaN(parsed)) {
        currentScroll = Math.max(0, Math.min(parsed, maxScroll));
      }
    }

    const tabLeft = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    const tabRight = tabLeft + tabWidth;
    const pad = 16;

    const visibleLeft = currentScroll + pad;
    const visibleRight = currentScroll + switcher.clientWidth - pad;

    let targetScroll = currentScroll;

    if (tabLeft < visibleLeft) {
      targetScroll = tabLeft - pad;
    } else if (tabRight > visibleRight) {
      targetScroll = tabRight - switcher.clientWidth + pad;
    } else {
      targetScroll = currentScroll;
    }

    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    const prevBehavior = switcher.style.scrollBehavior;
    switcher.style.scrollBehavior = 'auto';
    switcher.scrollLeft = targetScroll;
    switcher.style.scrollBehavior = prevBehavior;

    sessionStorage.setItem('deptNavScrollLeft', String(targetScroll));
  }

  function attachDeptNavEvents() {
    const switcher = getDeptSwitcher();
    if (!switcher) return;

    switcher.addEventListener(
      'scroll',
      () => {
        if (window.innerWidth <= 900) {
          sessionStorage.setItem('deptNavScrollLeft', String(switcher.scrollLeft));
        }
      },
      { passive: true }
    );

    switcher.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) {
        if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
          e.preventDefault();
        }
        if (window.innerWidth <= 900) {
          sessionStorage.setItem('deptNavScrollLeft', String(switcher.scrollLeft));
        }
      }
    });

    document.addEventListener('click', (e) => {
      const homeLink = e.target.closest('a[href*="home page"], a.back-link, a.brand');
      if (homeLink) {
        sessionStorage.removeItem('deptNavScrollLeft');
      }
    });

    positionDeptNav();
    requestAnimationFrame(positionDeptNav);
    setTimeout(positionDeptNav, 50);
    setTimeout(positionDeptNav, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachDeptNavEvents);
  } else {
    attachDeptNavEvents();
  }

  window.addEventListener('load', positionDeptNav);
  window.addEventListener('pageshow', positionDeptNav);
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) {
      positionDeptNav();
    }
  });
})();

