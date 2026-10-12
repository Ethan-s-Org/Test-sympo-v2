/* =========================================================
   THREE.JS BACKGROUND
========================================================= */

const canvas = document.getElementById("webgl-bg");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  65,
  innerWidth / innerHeight,
  0.1,
  1000
);

camera.position.z = 4.8;


/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(
  Math.min(devicePixelRatio, 2)
);

renderer.setSize(
  innerWidth,
  innerHeight
);


/* =========================================================
   GROUP
========================================================= */

const group = new THREE.Group();

scene.add(group);


/* =========================================================
   PARTICLES
========================================================= */

const geometry = new THREE.BufferGeometry();

const count = 850;

const positions = new Float32Array(
  count * 3
);

for (
  let i = 0;
  i < count * 3;
  i += 3
) {

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


/* =========================================================
   PARTICLE MATERIAL
========================================================= */

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


/* =========================================================
   GRID
========================================================= */

const grid = new THREE.GridHelper(
  18,
  30,
  0x00f3ff,
  0x07343c
);

grid.rotation.x =
  Math.PI / 2;

grid.position.z = -4;

grid.material.transparent = true;

grid.material.opacity = 0.12;

scene.add(grid);


/* =========================================================
   MOUSE MOVEMENT
========================================================= */

let mx = 0;
let my = 0;

window.addEventListener(
  "pointermove",
  (e) => {

    mx =
      (e.clientX / innerWidth - 0.5) * 0.6;

    my =
      (e.clientY / innerHeight - 0.5) * 0.4;

  }
);


/* =========================================================
   ANIMATION
========================================================= */

function animate() {

  requestAnimationFrame(
    animate
  );


  stars.rotation.y += 0.00045;

  stars.rotation.x += 0.00012;


  group.rotation.y +=
    (mx - group.rotation.y) * 0.012;


  group.rotation.x +=
    (-my - group.rotation.x) * 0.012;


  renderer.render(
    scene,
    camera
  );

}

animate();


/* =========================================================
   RESPONSIVE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      innerWidth / innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      innerWidth,
      innerHeight
    );

  }
);


/* =========================================================
   MODAL HISTORY (MOBILE BACK BUTTON SUPPORT)
========================================================= */

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
    .querySelectorAll(".modal-overlay")
    .forEach(m => m.classList.remove("open"));
  document.body.style.overflow = "";
}

/* =========================================================
   REGISTRATION MODAL
========================================================= */

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

/* =========================================================
   RULES MODAL
========================================================= */

function openRulesModal(
  title,
  time,
  venue,
  rules,
  judgingCriteria,
  coordinator,
  teamSize
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


/* =========================================================
   CLOSE MODALS
========================================================= */

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


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

document
  .querySelectorAll(
    ".modal-overlay"
  )
  .forEach(
    overlay => {

      overlay.addEventListener(
        "click",
        e => {

          if (
            e.target === overlay
          ) {

            closeModals();

          }

        }
      );

    }
  );


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
  "keydown",
  e => {

    if (
      e.key === "Escape"
    ) {

      closeModals();

    }

  }
);


/* =========================================================
   PARTICIPANT COUNTER
========================================================= */

const counter =
  document.getElementById(
    "counter"
  );

let n = 40;


setInterval(
  () => {

    n +=
      Math.random() > 0.72
        ? 1
        : 0;


    counter.textContent =
      String(n).padStart(
        3,
        "0"
      ) + "+";

  },
  2600
);


/* =========================================================
   EVENT CARD ANIMATION
========================================================= */

document
  .querySelectorAll(
    ".event-card"
  )
  .forEach(
    (card, i) => {

      card.style.opacity =
        "0";

      card.style.transform =
        "translateY(25px)";


      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(
              entry => {

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
// ECE 3D VLSI SILICON CORE & RF MATRIX
// ==========================================
(function initECEChipCore() {
  function start() {
    const canvas = document.getElementById("eceChipCanvas");
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
    let rotX = 0.45; // angled to see 3D chip face and pin leads
    let rotY = 0.3;
    let rotZ = 0.08;
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

    // Chip Package dimensions
    const CHIP_SIZE = 48;
    const CHIP_HALF = CHIP_SIZE / 2;
    const CHIP_THICK = 5;

    // Pin configurations: 5 pins per side
    const PINS_PER_SIDE = 5;
    const pinSignals = [];
    for (let i = 0; i < 20; i++) {
      pinSignals.push({
        pinIdx: i,
        t: Math.random(),
        speed: 0.018 + Math.random() * 0.025,
        inward: Math.random() > 0.4
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
      const fov = 180;

      function project(p3) {
        const rot = rotate3D(p3, rotX, rotY, rotZ);
        const scale = fov / (fov + rot.z);
        return {
          x: cx + rot.x * scale,
          y: cy + rot.y * scale,
          z: rot.z,
          scale: scale
        };
      }

      // 1. Draw Expanding RF Electromagnetic Wireless Wave Rings
      ctx.save();
      for (let r = 0; r < 3; r++) {
        const rfRadius = ((time * 24 + r * 28) % 84) + 10;
        const rfAlpha = Math.max(0, 1 - rfRadius / 94) * 0.45;
        const rfSegments = 32;

        ctx.beginPath();
        for (let i = 0; i <= rfSegments; i++) {
          const angle = (i / rfSegments) * Math.PI * 2;
          const px = Math.cos(angle) * rfRadius;
          const pz = Math.sin(angle) * rfRadius;
          const pt = project({ x: px, y: 0, z: pz });
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(0, 243, 255, ${rfAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw 3D RF Sinusoidal Waveform Ribbon (Modulated RF Carrier)
      ctx.save();
      const RF_RADIUS = 62;
      const WAVE_SEG = 48;
      ctx.beginPath();
      for (let i = 0; i <= WAVE_SEG; i++) {
        const angle = (i / WAVE_SEG) * Math.PI * 2;
        const waveY = Math.sin(angle * 6 - time * 5) * 11;
        const px = Math.cos(angle) * RF_RADIUS;
        const pz = Math.sin(angle) * RF_RADIUS;
        const pt = project({ x: px, y: waveY, z: pz });
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = "rgba(0, 243, 255, 0.45)";
      ctx.lineWidth = 1.4;
      ctx.setLineDash([]);
      ctx.stroke();

      // Vertical RF carrier amplitude stems
      for (let i = 0; i < WAVE_SEG; i += 3) {
        const angle = (i / WAVE_SEG) * Math.PI * 2;
        const waveY = Math.sin(angle * 6 - time * 5) * 11;
        const px = Math.cos(angle) * RF_RADIUS;
        const pz = Math.sin(angle) * RF_RADIUS;
        const pTop = project({ x: px, y: waveY, z: pz });
        const pBase = project({ x: px, y: 0, z: pz });

        ctx.beginPath();
        ctx.moveTo(pBase.x, pBase.y);
        ctx.lineTo(pTop.x, pTop.y);
        ctx.strokeStyle = "rgba(25, 255, 156, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Draw Microprocessor Chip Package (3D Cube/Bevel Body)
      const topY = -CHIP_THICK / 2;
      const btmY = CHIP_THICK / 2;

      const topCorners = [
        project({ x: -CHIP_HALF, y: topY, z: -CHIP_HALF }),
        project({ x: CHIP_HALF, y: topY, z: -CHIP_HALF }),
        project({ x: CHIP_HALF, y: topY, z: CHIP_HALF }),
        project({ x: -CHIP_HALF, y: topY, z: CHIP_HALF })
      ];

      const btmCorners = [
        project({ x: -CHIP_HALF, y: btmY, z: -CHIP_HALF }),
        project({ x: CHIP_HALF, y: btmY, z: -CHIP_HALF }),
        project({ x: CHIP_HALF, y: btmY, z: CHIP_HALF }),
        project({ x: -CHIP_HALF, y: btmY, z: CHIP_HALF })
      ];

      // Draw sides of chip package
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const next = (i + 1) % 4;
        ctx.beginPath();
        ctx.moveTo(topCorners[i].x, topCorners[i].y);
        ctx.lineTo(topCorners[next].x, topCorners[next].y);
        ctx.lineTo(btmCorners[next].x, btmCorners[next].y);
        ctx.lineTo(btmCorners[i].x, btmCorners[i].y);
        ctx.closePath();
        ctx.fillStyle = "rgba(4, 18, 28, 0.85)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 243, 255, 0.3)";
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      // Draw Top Face of Microchip
      ctx.beginPath();
      topCorners.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(5, 24, 38, 0.75)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 243, 255, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pin 1 Index Marker (Notch on top-left corner)
      const notchPt = project({ x: -CHIP_HALF + 5, y: topY, z: -CHIP_HALF + 5 });
      ctx.beginPath();
      ctx.arc(notchPt.x, notchPt.y, 2 * notchPt.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#19ff9c";
      ctx.fill();

      // Inner Silicon Die Boundary (26x26)
      const DIE_HALF = 13;
      const dieCorners = [
        project({ x: -DIE_HALF, y: topY, z: -DIE_HALF }),
        project({ x: DIE_HALF, y: topY, z: -DIE_HALF }),
        project({ x: DIE_HALF, y: topY, z: DIE_HALF }),
        project({ x: -DIE_HALF, y: topY, z: DIE_HALF })
      ];

      ctx.beginPath();
      dieCorners.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 243, 255, 0.12)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 243, 255, 0.7)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Silicon Core Logic Crosshair / VLSI Matrix
      const dieCenter = project({ x: 0, y: topY, z: 0 });
      const clockPulse = 1 + Math.sin(time * 6) * 0.25;

      const coreGrad = ctx.createRadialGradient(dieCenter.x, dieCenter.y, 1, dieCenter.x, dieCenter.y, 10 * clockPulse);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.3, "rgba(0, 243, 255, 0.85)");
      coreGrad.addColorStop(0.7, "rgba(25, 255, 156, 0.35)");
      coreGrad.addColorStop(1, "rgba(0, 243, 255, 0)");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(dieCenter.x, dieCenter.y, 12 * clockPulse, 0, Math.PI * 2);
      ctx.fill();

      // Microcircuit bus lines etched onto top die
      const busLines = [
        [{ x: -DIE_HALF, y: topY, z: 0 }, { x: DIE_HALF, y: topY, z: 0 }],
        [{ x: 0, y: topY, z: -DIE_HALF }, { x: 0, y: topY, z: DIE_HALF }],
        [{ x: -DIE_HALF, y: topY, z: -6 }, { x: -4, y: topY, z: -6 }, { x: -4, y: topY, z: -DIE_HALF }],
        [{ x: DIE_HALF, y: topY, z: 6 }, { x: 4, y: topY, z: 6 }, { x: 4, y: topY, z: DIE_HALF }]
      ];
      busLines.forEach(line => {
        ctx.beginPath();
        line.forEach((p, idx) => {
          const pt = project(p);
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
      ctx.restore();

      // 4. Draw Metallic Pin Leads (20 pins radiating from 4 sides)
      ctx.save();
      const pinCoords = [];
      const PIN_LEN = 11;
      const step = CHIP_SIZE / (PINS_PER_SIDE + 1);

      for (let i = 1; i <= PINS_PER_SIDE; i++) {
        const offset = -CHIP_HALF + i * step;
        // North
        pinCoords.push({
          start: { x: offset, y: 0, z: -CHIP_HALF },
          end: { x: offset, y: 0, z: -CHIP_HALF - PIN_LEN }
        });
        // South
        pinCoords.push({
          start: { x: offset, y: 0, z: CHIP_HALF },
          end: { x: offset, y: 0, z: CHIP_HALF + PIN_LEN }
        });
        // West
        pinCoords.push({
          start: { x: -CHIP_HALF, y: 0, z: offset },
          end: { x: -CHIP_HALF - PIN_LEN, y: 0, z: offset }
        });
        // East
        pinCoords.push({
          start: { x: CHIP_HALF, y: 0, z: offset },
          end: { x: CHIP_HALF + PIN_LEN, y: 0, z: offset }
        });
      }

      pinCoords.forEach(pin => {
        const p1 = project(pin.start);
        const p2 = project(pin.end);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.55)";
        ctx.lineWidth = 1.4 * p1.scale;
        ctx.stroke();

        // Pin solder pad dot
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, 1.6 * p2.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#19ff9c";
        ctx.fill();
      });

      // 5. Update and Draw Bus Signal Pulses Along Pins
      pinSignals.forEach(sig => {
        sig.t += sig.speed;
        if (sig.t > 1) {
          sig.t = 0;
          sig.pinIdx = Math.floor(Math.random() * pinCoords.length);
          sig.inward = Math.random() > 0.4;
        }

        const pin = pinCoords[sig.pinIdx];
        if (!pin) return;

        const from = sig.inward ? pin.end : pin.start;
        const to = sig.inward ? pin.start : pin.end;

        const curX = from.x + (to.x - from.x) * sig.t;
        const curY = from.y + (to.y - from.y) * sig.t;
        const curZ = from.z + (to.z - from.z) * sig.t;
        const pt = project({ x: curX, y: curY, z: curZ });

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.2 * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      ctx.restore();

      // 6. Laser Logic Diagnostic Scanner Line
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