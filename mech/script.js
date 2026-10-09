// ==========================================
// MECHANICAL ENGINEERING - INFINITE TECHFEST
// ==========================================


// ==========================================
// THREE.JS BACKGROUND
// ==========================================

const canvas = document.getElementById("webgl-bg");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 4.8;


// ==========================================
// RENDERER
// ==========================================

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


// ==========================================
// MAIN GROUP
// ==========================================

const group = new THREE.Group();

scene.add(group);


// ==========================================
// MECHANICAL PARTICLES
// ==========================================

const geometry = new THREE.BufferGeometry();

const count = 1000;

const positions = new Float32Array(
  count * 3
);


for (let i = 0; i < count * 3; i += 3) {

  positions[i] =
    (Math.random() - 0.5) * 18;

  positions[i + 1] =
    (Math.random() - 0.5) * 11;

  positions[i + 2] =
    (Math.random() - 0.5) * 12;

}


geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    positions,
    3
  )
);


// ==========================================
// PARTICLE MATERIAL
// ==========================================

const material = new THREE.PointsMaterial({

  color: 0x00f3ff,

  size: 0.025,

  transparent: true,

  opacity: 0.55

});


const stars = new THREE.Points(
  geometry,
  material
);

group.add(stars);


// ==========================================
// 3D GRID
// ==========================================

const grid = new THREE.GridHelper(
  18,
  30,
  0x00f3ff,
  0x07343c
);

grid.rotation.x =
  Math.PI / 2;

grid.position.z =
  -4;

grid.material.transparent =
  true;

grid.material.opacity =
  0.12;

scene.add(grid);


// ==========================================
// MOUSE MOVEMENT
// ==========================================

let mx = 0;
let my = 0;


window.addEventListener(
  "pointermove",
  (e) => {

    mx =
      (e.clientX / window.innerWidth - 0.5) *
      0.6;

    my =
      (e.clientY / window.innerHeight - 0.5) *
      0.4;

  }
);


// ==========================================
// ANIMATION LOOP
// ==========================================

function animate() {

  requestAnimationFrame(
    animate
  );


  // Rotate particles

  stars.rotation.y +=
    0.00045;

  stars.rotation.x +=
    0.00012;


  // Mouse interaction

  group.rotation.y +=
    (mx - group.rotation.y) *
    0.012;

  group.rotation.x +=
    (-my - group.rotation.x) *
    0.012;


  renderer.render(
    scene,
    camera
  );

}


animate();


// ==========================================
// WINDOW RESIZE
// ==========================================

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

  }
);


// ==========================================
// MODAL HISTORY (MOBILE BACK BUTTON SUPPORT)
// ==========================================

let isModalHistoryPushed = false;

function isMobileView() {
  return window.innerWidth <= 900 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function pushModalHistory() {
  if (isMobileView() && !isModalHistoryPushed) {
    isModalHistoryPushed = true;
    try {
      history.pushState({ modalOpen: true }, "");
    } catch (e) {}
  }
}

function closeModalsInternal() {
  document
    .querySelectorAll(
      ".modal-overlay"
    )
    .forEach(
      (modal) => {
        modal.classList.remove(
          "open"
        );
      }
    );
  document.body.style.overflow = "";
}

// ==========================================
// REGISTRATION MODAL
// ==========================================

function openRegisterModal(eventName) {
  const registerText =
    document.getElementById(
      "registerText"
    );

  if (registerText) {
    registerText.textContent = "";
  }

  const regModal = document.getElementById("registerModal");
  regModal.classList.add("open");
  const modalBox = regModal.querySelector(".modal");
  if (modalBox) {
    modalBox.scrollTop = 0;
  }

  document.body.style.overflow =
    "hidden";

  pushModalHistory();
}


// ==========================================
// EVENT RULES MODAL
// ==========================================

function openRulesModal(
  title,
  time,
  venue,
  rules,
  jury,
  coordinator,
  teamSize,
  prize
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

  const rulesBody = document.getElementById("rulesBody");
  rulesBody.innerHTML = rules.map(rule => `<li>${rule}</li>`).join("");

  const criteriaTextEl = document.getElementById("rulesCriteriaText");
  const criteriaBoxEl = document.getElementById("modalCriteriaBox");
  if (criteriaTextEl && criteriaBoxEl) {
    if (jury) {
      criteriaTextEl.innerHTML = jury;
      criteriaBoxEl.style.display = "block";
    } else {
      criteriaBoxEl.style.display = "none";
    }
  }

  const prizeTextEl = document.getElementById("rulesPrizeText");
  const prizeBoxEl = document.getElementById("modalPrizeBox");
  if (prizeTextEl && prizeBoxEl) {
    if (prize) {
      prizeTextEl.innerHTML = prize;
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


// ==========================================
// CLOSE MODALS
// ==========================================

function closeModals() {
  if (isModalHistoryPushed) {
    isModalHistoryPushed = false;
    try {
      history.back();
    } catch (e) {}
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
  } catch (e) {}
}


// ==========================================
// CLICK OUTSIDE MODAL
// ==========================================

document
  .querySelectorAll(
    ".modal-overlay"
  )
  .forEach(
    (overlay) => {

      overlay.addEventListener(
        "click",
        (e) => {

          if (
            e.target === overlay
          ) {

            closeModals();

          }

        }
      );

    }
  );


// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Escape"
    ) {

      closeModals();

    }

  }
);


// ==========================================
// PARTICIPANT COUNTER
// ==========================================

const counter =
  document.getElementById(
    "counter"
  );

let n = 40;


if (counter) {

  setInterval(
    () => {

      n +=
        Math.random() > 0.72
          ? 1
          : 0;


      counter.textContent =
        String(n).padStart(3, "0") +
        "+";

    },
    2600
  );

}


// ==========================================
// EVENT CARD SCROLL ANIMATION
// ==========================================

const eventCards =
  document.querySelectorAll(
    ".event-card"
  );


eventCards.forEach(
  (card, i) => {

    card.style.opacity =
      "0";

    card.style.transform =
      "translateY(25px)";


    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                setTimeout(
                  () => {

                    card.style.transition =
                      "opacity .6s ease, transform .6s ease";

                    card.style.opacity =
                      "1";

                    card.style.transform =
                      "translateY(0)";

                  },
                  i * 90
                );


                observer.disconnect();

              }

            }
          );

        },

        {
          threshold: 0.12
        }

      );


    observer.observe(card);

  }
);


// ==========================================
// ACTIVE DEPARTMENT
// ==========================================

const departmentLinks =
  document.querySelectorAll(
    ".dept-switcher a"
  );


departmentLinks.forEach(
  (link) => {

    link.addEventListener(
      "click",
      (e) => {

        // Prevent empty "#" links
        // from jumping to the top.

        if (
          link.getAttribute("href") === "#"
        ) {

          e.preventDefault();

        }

      }
    );

  }
);


// ==========================================
// SMOOTH SCROLL
// ==========================================

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        (e) => {

          const targetId =
            link.getAttribute("href");


          if (
            targetId === "#" ||
            targetId === ""
          ) {

            return;

          }


          const target =
            document.querySelector(
              targetId
            );


          if (target) {

            e.preventDefault();


            target.scrollIntoView({
              behavior: "smooth"
            });

          }

        }
      );

    }
  );


// ==========================================
// INITIAL STATUS
// ==========================================

console.log(
  "MECH_CORE // INFINITE TECHFEST'26"
);

console.log(
  "Mechanical Engineering Department loaded."
);

// ==========================================
// MECH 3D PLANETARY GEAR DRIVE & KINEMATICS
// ==========================================
(function initMechGears() {
  function start() {
    const canvas = document.getElementById("mechGearCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = 280;
    let height = 135;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width > 0 ? rect.width : 280;
      height = rect.height > 0 ? rect.height : 135;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 3D rotation state
    let rotX = 0.5; // angled to see 3D gear thickness and teeth engagement
    let rotY = 0.25;
    let rotZ = 0.05;
    let velX = 0;
    let velY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

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
        velY = dx * 0.007;
        velX = -dy * 0.007;
        rotY += velY;
        rotX += velX;
        startX = e.clientX;
        startY = e.clientY;
      }
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    terminal.addEventListener("pointermove", e => {
      if (!isDragging) {
        const rect = terminal.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        velY += (nx * 0.02 - velY) * 0.08;
        velX += (-ny * 0.015 - velX) * 0.08;
      }
    });

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

    // Kinematic Marker Tokens
    const KINEMATIC_TOKENS = ["3600 RPM", "850 Nm", "η = 98.4%", "TORQUE // ACTIVE"];
    const kinNodes = [];
    for (let i = 0; i < 4; i++) {
      kinNodes.push({
        text: KINEMATIC_TOKENS[i],
        angle: (i / 4) * Math.PI * 2,
        radius: 64,
        speed: 0.012
      });
    }

    let time = 0;

    function render() {
      requestAnimationFrame(render);
      time += 0.025;

      if (!isDragging) {
        rotY += 0.009 + velY;
        rotX += Math.sin(time * 0.4) * 0.0018 + velX;
        velX *= 0.94;
        velY *= 0.94;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 175;

      function project(p3) {
        const rot = rotate3D(p3, rotX, rotY, rotZ);
        const scale = fov / (fov + rot.z);
        return {
          sx: cx + rot.x * scale,
          sy: cy + rot.y * scale,
          sz: rot.z,
          scale: scale
        };
      }

      // Helper function to draw a 3D Gear with teeth
      function draw3DGear(centerX, centerZ, radius, teeth, rotAngle, toothDepth, color, hasHub) {
        const THICK = 4;
        const totalPoints = teeth * 2;

        const frontPts = [];
        const backPts = [];

        for (let i = 0; i < totalPoints; i++) {
          const a = (i / totalPoints) * Math.PI * 2 + rotAngle;
          const isTip = i % 2 === 0;
          const r = isTip ? radius + toothDepth : radius - toothDepth;
          const gx = centerX + Math.cos(a) * r;
          const gz = centerZ + Math.sin(a) * r;

          frontPts.push(project({ x: gx, y: -THICK, z: gz }));
          backPts.push(project({ x: gx, y: THICK, z: gz }));
        }

        // Draw Gear side teeth
        ctx.save();
        for (let i = 0; i < totalPoints; i++) {
          const next = (i + 1) % totalPoints;
          ctx.beginPath();
          ctx.moveTo(frontPts[i].sx, frontPts[i].sy);
          ctx.lineTo(frontPts[next].sx, frontPts[next].sy);
          ctx.lineTo(backPts[next].sx, backPts[next].sy);
          ctx.lineTo(backPts[i].sx, backPts[i].sy);
          ctx.closePath();
          ctx.fillStyle = "rgba(5, 22, 34, 0.75)";
          ctx.fill();
          ctx.strokeStyle = "rgba(0, 243, 255, 0.25)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Draw Front Face of Gear
        ctx.beginPath();
        frontPts.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 243, 255, 0.08)";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Hub / Spoke circle
        if (hasHub) {
          const hubPt = project({ x: centerX, y: -THICK, z: centerZ });
          ctx.beginPath();
          ctx.arc(hubPt.sx, hubPt.sy, (radius * 0.4) * hubPt.scale, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Center shaft axis
          ctx.beginPath();
          ctx.arc(hubPt.sx, hubPt.sy, 2.5 * hubPt.scale, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#00f3ff";
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();
      }

      // 1. Central Sun Gear
      const SUN_R = 14;
      const SUN_TEETH = 10;
      const sunAngle = time * 2.4;
      draw3DGear(0, 0, SUN_R, SUN_TEETH, sunAngle, 3, "#00f3ff", true);

      // 2. 3 Planet Pinion Gears Meshed Around Sun Gear
      const PLANET_R = 13;
      const PLANET_TEETH = 9;
      const ORBIT_R = 29;
      const planetOrbitAngle = time * 0.8;

      for (let p = 0; p < 3; p++) {
        const orbitAngle = planetOrbitAngle + (p / 3) * Math.PI * 2;
        const px = Math.cos(orbitAngle) * ORBIT_R;
        const pz = Math.sin(orbitAngle) * ORBIT_R;
        // Counter-rotation on its own axis according to gear ratio
        const planetSpin = -sunAngle * (SUN_R / PLANET_R) + orbitAngle;

        draw3DGear(px, pz, PLANET_R, PLANET_TEETH, planetSpin, 2.6, "#19ff9c", true);

        // Planet Carrier arm line connecting to center
        const pCenter = project({ x: px, y: -4, z: pz });
        const sunCenter = project({ x: 0, y: -4, z: 0 });
        ctx.beginPath();
        ctx.moveTo(sunCenter.sx, sunCenter.sy);
        ctx.lineTo(pCenter.sx, pCenter.sy);
        ctx.strokeStyle = "rgba(25, 255, 156, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. Outer Ring Gear (Internal teeth simulation & housing rim)
      const RING_R = 43;
      const RING_SEGS = 32;
      ctx.save();
      const ringFront = [];
      const ringBack = [];

      for (let i = 0; i <= RING_SEGS; i++) {
        const a = (i / RING_SEGS) * Math.PI * 2;
        const tooth = Math.sin(a * 24) * 2;
        const rx = Math.cos(a) * (RING_R + tooth);
        const rz = Math.sin(a) * (RING_R + tooth);

        ringFront.push(project({ x: rx, y: -4, z: rz }));
        ringBack.push(project({ x: rx, y: 4, z: rz }));
      }

      ctx.beginPath();
      ringFront.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      });
      ctx.closePath();
      ctx.strokeStyle = "rgba(0, 243, 255, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 4. Concentric 3D Kinematic RPM Telemetry Ring
      ctx.save();
      const KIN_R = 64;
      const KIN_SEG = 36;
      ctx.beginPath();
      for (let i = 0; i <= KIN_SEG; i++) {
        const angle = (i / KIN_SEG) * Math.PI * 2;
        const rx = Math.cos(angle) * KIN_R;
        const rz = Math.sin(angle) * KIN_R;
        const pt = rotate3D({ x: rx, y: 0, z: rz }, rotX + 0.35, rotY * 0.7 + time * 0.35, rotZ);
        const scale = fov / (fov + pt.z);
        const sx = cx + pt.x * scale;
        const sy = cy + pt.y * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = "rgba(0, 243, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 6]);
      ctx.stroke();

      // Orbiting Velocity Satellites
      for (let s = 0; s < 3; s++) {
        const satAngle = (s / 3) * Math.PI * 2 + time * 0.8;
        const sx = Math.cos(satAngle) * KIN_R;
        const sz = Math.sin(satAngle) * KIN_R;
        const pt = rotate3D({ x: sx, y: 0, z: sz }, rotX + 0.35, rotY * 0.7 + time * 0.35, rotZ);
        const scale = fov / (fov + pt.z);

        ctx.beginPath();
        ctx.arc(cx + pt.x * scale, cy + pt.y * scale, 2.6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = s === 0 ? "#19ff9c" : "#00f3ff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();

      // 5. Orbiting Kinematic Data Labels
      ctx.save();
      ctx.font = "8px 'Share Tech Mono', monospace";
      kinNodes.forEach(node => {
        node.angle += node.speed;
        const px = Math.cos(node.angle) * node.radius;
        const pz = Math.sin(node.angle) * node.radius;
        const pt = rotate3D({ x: px, y: 0, z: pz }, rotX + 0.35, rotY * 0.7 + time * 0.35, rotZ);
        const scale = fov / (fov + pt.z);

        ctx.fillStyle = "rgba(0, 243, 255, 0.65)";
        ctx.fillText(node.text, cx + pt.x * scale - 18, cy + pt.y * scale);
      });
      ctx.restore();

      // 6. Laser Kinematic Diagnostic Scanner
      const scanY = cy + Math.sin(time * 1.5) * (height * 0.35);
      const scanGrad = ctx.createLinearGradient(0, scanY - 5, 0, scanY + 5);
      scanGrad.addColorStop(0, "rgba(0, 243, 255, 0)");
      scanGrad.addColorStop(0.5, "rgba(0, 243, 255, 0.16)");
      scanGrad.addColorStop(1, "rgba(0, 243, 255, 0)");

      ctx.save();
      ctx.fillStyle = scanGrad;
      ctx.fillRect(cx - 75, scanY - 5, 150, 10);
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