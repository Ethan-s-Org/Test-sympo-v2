// ==========================================
// INFINITE TECHFEST' 26
// EEE DEPARTMENT - SCRIPT.JS
// ==========================================


// ==========================================
// THREE.JS BACKGROUND
// ==========================================

const canvas = document.getElementById("webgl-bg");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  65,
  innerWidth / innerHeight,
  0.1,
  1000
);

camera.position.z = 4.8;


const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio || 1, 1.6)
);

renderer.setSize(
  innerWidth,
  innerHeight
);


// ==========================================
// PARTICLE GROUP
// ==========================================

const group = new THREE.Group();

scene.add(group);


const geometry = new THREE.BufferGeometry();

const count = 850;

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


const stars =
  new THREE.Points(
    geometry,
    material
  );

group.add(stars);


// ==========================================
// GRID
// ==========================================

const grid = new THREE.GridHelper(
  18,
  30,
  0x00f3ff,
  0x07343c
);

grid.rotation.x = Math.PI / 2;

grid.position.z = -4;

grid.material.transparent = true;

grid.material.opacity = 0.12;

scene.add(grid);


// ==========================================
// MOUSE MOVEMENT
// ==========================================

let mx = 0;
let my = 0;


window.addEventListener(
  "pointermove",
  (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 0.6;
    my = (e.clientY / innerHeight - 0.5) * 0.4;
  },
  { passive: true }
);


// ==========================================
// ANIMATION
// ==========================================

let isTabVisible = true;
document.addEventListener("visibilitychange", () => {
  isTabVisible = !document.hidden;
  if (isTabVisible) requestAnimationFrame(animate);
});

function animate() {
  if (!isTabVisible) return;

  requestAnimationFrame(animate);

  stars.rotation.y += 0.00045;
  stars.rotation.x += 0.00012;

  group.rotation.y += (mx - group.rotation.y) * 0.012;
  group.rotation.x += (-my - group.rotation.x) * 0.012;

  renderer.render(scene, camera);
}

animate();


// ==========================================
// WINDOW RESIZE
// ==========================================

window.addEventListener(
  "resize",
  () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(innerWidth, innerHeight);
  },
  { passive: true }
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
    .querySelectorAll(".modal-overlay")
    .forEach(modal => {
      modal.classList.remove("open");
    });
  document.body.style.overflow = "";
}

// ==========================================
// REGISTRATION MODAL
// ==========================================

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

  document.body.style.overflow =
    "hidden";

  pushModalHistory();
}


// ==========================================
// RULES MODAL
// ==========================================

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
    rules.map(rule => `<li>${rule}</li>`).join("");

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
    overlay => {

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
// ESC KEY CLOSE MODAL
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


// ==========================================
// EVENT CARD SCROLL ANIMATION
// ==========================================

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
// EEE 3D TESLA FLUX REACTOR & PLASMA MATRIX
// ==========================================
(function initEEETorus() {
  function start() {
    const canvas = document.getElementById("eeeTorusCanvas");
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
    let rotX = 0.55; // angled to see 3D torus doughnut hole and vortex
    let rotY = 0.25;
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

    // Torus Parametric Mesh Dimensions
    const MAJOR_R = 36;
    const MINOR_R = 14;
    const RINGS = 16;
    const TUBE_SEGS = 10;

    // Power Phase Marker Tokens
    const PHASE_TOKENS = ["PHASE A: 440V", "PHASE B: 440V", "PHASE C: 440V", "50.0 Hz"];
    const phaseNodes = [];
    for (let i = 0; i < 4; i++) {
      phaseNodes.push({
        text: PHASE_TOKENS[i],
        angle: (i / 4) * Math.PI * 2,
        radius: 64,
        speed: 0.01
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

      // 1. Draw High-Voltage Central Plasma Eye & Arc Reactor Glow
      const centerPt = project({ x: 0, y: 0, z: 0 });
      const reactorPulse = 1 + Math.sin(time * 5) * 0.25;

      ctx.save();
      const reactorGrad = ctx.createRadialGradient(centerPt.sx, centerPt.sy, 1, centerPt.sx, centerPt.sy, 18 * reactorPulse);
      reactorGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      reactorGrad.addColorStop(0.35, "rgba(0, 243, 255, 0.85)");
      reactorGrad.addColorStop(0.7, "rgba(25, 255, 156, 0.4)");
      reactorGrad.addColorStop(1, "rgba(0, 243, 255, 0)");

      ctx.fillStyle = reactorGrad;
      ctx.beginPath();
      ctx.arc(centerPt.sx, centerPt.sy, 22 * reactorPulse, 0, Math.PI * 2);
      ctx.fill();

      // High-voltage Electric Arc Sparks (Jumping through center eye)
      for (let s = 0; s < 3; s++) {
        const sparkAng = (s / 3) * Math.PI * 2 + time * 3;
        const p1 = project({ x: Math.cos(sparkAng) * (MAJOR_R - MINOR_R), y: (Math.random() - 0.5) * 10, z: Math.sin(sparkAng) * (MAJOR_R - MINOR_R) });
        const p2 = project({ x: 0, y: (Math.random() - 0.5) * 8, z: 0 });

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        // Jagged lightning midpoint
        const midX = (p1.sx + p2.sx) / 2 + (Math.random() - 0.5) * 10;
        const midY = (p1.sy + p2.sy) / 2 + (Math.random() - 0.5) * 10;
        ctx.lineTo(midX, midY);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = Math.random() > 0.5 ? "#ffffff" : "#19ff9c";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw 3D Electromagnetic Torus Coil Wireframe
      ctx.save();
      const torusPoints = [];

      for (let i = 0; i < RINGS; i++) {
        const u = (i / RINGS) * Math.PI * 2 + time * 0.4;
        const ring = [];

        for (let j = 0; j < TUBE_SEGS; j++) {
          const v = (j / TUBE_SEGS) * Math.PI * 2;
          const px = (MAJOR_R + MINOR_R * Math.cos(v)) * Math.cos(u);
          const py = MINOR_R * Math.sin(v);
          const pz = (MAJOR_R + MINOR_R * Math.cos(v)) * Math.sin(u);

          ring.push(project({ x: px, y: py, z: pz }));
        }
        torusPoints.push(ring);
      }

      // Draw Circular Tube Cross-Sections
      torusPoints.forEach((ring, idx) => {
        const avgZ = ring.reduce((sum, p) => sum + p.sz, 0) / ring.length;
        const alpha = Math.max(0.12, Math.min(0.75, (avgZ + 50) / 100));

        ctx.beginPath();
        ring.forEach((p, j) => {
          if (j === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        });
        ctx.closePath();
        ctx.strokeStyle = `rgba(0, 243, 255, ${alpha * 0.75})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Glowing coil pulse beads along selected windings
        if (idx % 4 === 0) {
          const bead = ring[Math.floor((time * 8 + idx) % ring.length)];
          ctx.beginPath();
          ctx.arc(bead.sx, bead.sy, 2 * bead.scale, 0, Math.PI * 2);
          ctx.fillStyle = "#19ff9c";
          ctx.shadowColor = "#19ff9c";
          ctx.shadowBlur = 8;
          ctx.fill();
        }
      });

      // Draw Longitudinal Torus Ribs
      for (let j = 0; j < TUBE_SEGS; j += 2) {
        ctx.beginPath();
        for (let i = 0; i <= RINGS; i++) {
          const pt = torusPoints[i % RINGS][j];
          if (i === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.strokeStyle = "rgba(0, 243, 255, 0.28)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Draw Concentric 3D Power Flux Telemetry Rings
      ctx.save();
      const FLUX_R = 64;
      const RING_SEG = 36;
      ctx.beginPath();
      for (let i = 0; i <= RING_SEG; i++) {
        const angle = (i / RING_SEG) * Math.PI * 2;
        const rx = Math.cos(angle) * FLUX_R;
        const rz = Math.sin(angle) * FLUX_R;
        const pt = rotate3D({ x: rx, y: 0, z: rz }, rotX + 0.35, rotY * 0.7 + time * 0.35, rotZ);
        const scale = fov / (fov + pt.z);
        const sx = cx + pt.x * scale;
        const sy = cy + pt.y * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = "rgba(0, 243, 255, 0.32)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 6]);
      ctx.stroke();

      // Orbiting Phase Satellites
      for (let s = 0; s < 3; s++) {
        const satAngle = (s / 3) * Math.PI * 2 + time * 0.8;
        const sx = Math.cos(satAngle) * FLUX_R;
        const sz = Math.sin(satAngle) * FLUX_R;
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

      // 4. Orbiting Power Phase Labels
      ctx.save();
      ctx.font = "8px 'Share Tech Mono', monospace";
      phaseNodes.forEach(node => {
        node.angle += node.speed;
        const px = Math.cos(node.angle) * node.radius;
        const pz = Math.sin(node.angle) * node.radius;
        const pt = rotate3D({ x: px, y: 0, z: pz }, rotX + 0.35, rotY * 0.7 + time * 0.35, rotZ);
        const scale = fov / (fov + pt.z);

        ctx.fillStyle = "rgba(0, 243, 255, 0.65)";
        ctx.fillText(node.text, cx + pt.x * scale - 20, cy + pt.y * scale);
      });
      ctx.restore();

      // 5. Laser Flux Diagnostic Scanner
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
// EEE SYSTEM MESSAGE
// ==========================================

console.log(
  "⚡ EEE ARENA // INFINITE TECHFEST' 26"
);

console.log(
  "Department: Electrical & Electronics Engineering"
);

console.log(
  "System Status: ONLINE"
);

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