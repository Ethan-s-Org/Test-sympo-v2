const canvas = document.getElementById("webgl-bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 4.8;

const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth, innerHeight);

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.BufferGeometry();
const count = 850;
const positions = new Float32Array(count * 3);
for(let i=0;i<count*3;i+=3){
  positions[i] = (Math.random()-.5)*18;
  positions[i+1] = (Math.random()-.5)*11;
  positions[i+2] = (Math.random()-.5)*12;
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));

const material = new THREE.PointsMaterial({
  color:0x00f3ff,
  size:.025,
  transparent:true,
  opacity:.55
});
const stars = new THREE.Points(geometry,material);
group.add(stars);

const grid = new THREE.GridHelper(18,30,0x00f3ff,0x07343c);
grid.rotation.x = Math.PI/2;
grid.position.z = -4;
grid.material.transparent = true;
grid.material.opacity = .12;
scene.add(grid);

let mx=0,my=0;
window.addEventListener("pointermove",e=>{
  mx=(e.clientX/innerWidth-.5)*.6;
  my=(e.clientY/innerHeight-.5)*.4;
});

function animate(){
  requestAnimationFrame(animate);
  stars.rotation.y += .00045;
  stars.rotation.x += .00012;
  group.rotation.y += (mx-group.rotation.y)*.012;
  group.rotation.x += (-my-group.rotation.x)*.012;
  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
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
    } catch (e) {}
  }
}

function closeModalsInternal() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
  document.body.style.overflow = "";
}

function openRegisterModal(eventName){
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
  document.body.style.overflow="hidden";
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
  sponsor
){
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

  const sponsorTextEl = document.getElementById("rulesSponsorText");
  const sponsorBoxEl = document.getElementById("modalSponsorBox");
  if (sponsorTextEl && sponsorBoxEl) {
    if (sponsor) {
      sponsorTextEl.innerHTML = sponsor;
      sponsorBoxEl.style.display = "block";
    } else {
      sponsorBoxEl.style.display = "none";
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

function closeModals(){
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

document.querySelectorAll(".modal-overlay").forEach(overlay=>{
  overlay.addEventListener("click",e=>{
    if(e.target===overlay) closeModals();
  });
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeModals();
});

const counter=document.getElementById("counter");
let n=40;
setInterval(()=>{
  n += Math.random()>.72 ? 1 : 0;
  counter.textContent = String(n).padStart(3,"0")+"+";
},2600);

document.querySelectorAll(".event-card").forEach((card,i)=>{
  card.style.opacity="0";
  card.style.transform="translateY(25px)";
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        setTimeout(()=>{
          card.style.transition="opacity .6s ease, transform .6s ease";
          card.style.opacity="1";
          card.style.transform="translateY(0)";
        },i*90);
        observer.disconnect();
      }
    });
  },{threshold:.12});
  observer.observe(card);
});

/* =========================================================
   S&H 3D QUANTUM BOHR ATOM & SUBATOMIC MATRIX VISUALIZATION
   ========================================================= */
(function initSHAtom() {
  const container = document.getElementById("shAtomWrap");
  const canvas = document.getElementById("shAtomCanvas");
  if (!container || !canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let dpr = window.devicePixelRatio || 1;

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
  }

  window.addEventListener("resize", resize);
  resize();

  // Rotation & Physics
  let rotX = 0.35;
  let rotY = 0.55;
  let rotZ = 0;
  let velX = 0;
  let velY = 0;
  let isDragging = false;
  let startX = 0, startY = 0;

  const terminal = container.closest(".hero-terminal") || container;

  container.addEventListener("pointerdown", e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    container.setPointerCapture?.(e.pointerId);
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

  // Nucleus: Nucleons (Protons and Neutrons)
  const nucleons = [
    { x: 0, y: 0, z: 0, r: 4.8, isProton: true },
    { x: -3.5, y: 2.5, z: 1.5, r: 4.2, isProton: false },
    { x: 3.5, y: -2.0, z: -1.5, r: 4.0, isProton: true },
    { x: -1.5, y: -3.2, z: 2.2, r: 3.8, isProton: false },
    { x: 2.2, y: 3.0, z: -2.0, r: 4.1, isProton: true },
    { x: 1.8, y: -1.5, z: 3.5, r: 3.9, isProton: false },
    { x: -2.8, y: -1.2, z: -3.2, r: 4.0, isProton: true }
  ];

  // 3 Quantum Bohr Orbitals (K, L, M Shells) with different radii and orientations
  const orbits = [
    {
      name: "n=1 K-Shell",
      radiusX: 36,
      radiusY: 36,
      tiltX: 0.35,
      tiltY: 0.75,
      tiltZ: 0.2,
      electrons: [
        { angle: 0, speed: 0.055, trail: [] },
        { angle: Math.PI, speed: 0.055, trail: [] }
      ],
      color: "#00f3ff",
      deBroglieModes: 3
    },
    {
      name: "n=2 L-Shell",
      radiusX: 52,
      radiusY: 52,
      tiltX: -0.65,
      tiltY: -0.4,
      tiltZ: 0.6,
      electrons: [
        { angle: 0.4, speed: 0.04, trail: [] },
        { angle: 0.4 + (2 * Math.PI) / 3, speed: 0.04, trail: [] },
        { angle: 0.4 + (4 * Math.PI) / 3, speed: 0.04, trail: [] }
      ],
      color: "#19ff9c",
      deBroglieModes: 5
    },
    {
      name: "n=3 M-Shell",
      radiusX: 68,
      radiusY: 68,
      tiltX: 0.8,
      tiltY: -0.65,
      tiltZ: -0.45,
      electrons: [
        { angle: 1.0, speed: 0.028, trail: [] },
        { angle: 1.0 + Math.PI, speed: 0.028, trail: [] }
      ],
      color: "#bd00ff",
      deBroglieModes: 7
    }
  ];

  // Quantum Telemetry Tokens
  const quantumTokens = [
    { text: "h = 6.626e-34", angle: 0, dist: 80, speed: 0.008, yOff: -12 },
    { text: "λ = h/p", angle: Math.PI * 0.5, dist: 78, speed: 0.009, yOff: 14 },
    { text: "E = mc²", angle: Math.PI, dist: 82, speed: 0.007, yOff: -8 },
    { text: "ψ(r,θ,φ)", angle: Math.PI * 1.5, dist: 76, speed: 0.0085, yOff: 10 }
  ];

  let time = 0;

  function render() {
    requestAnimationFrame(render);
    time += 0.025;

    if (!isDragging) {
      rotY += 0.008 + velY;
      rotX += Math.sin(time * 0.35) * 0.0016 + velX;
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

    function transformOrbitPt(px, py, pz, tx, ty, tz) {
      return rotate3D({ x: px, y: py, z: pz }, tx, ty, tz);
    }

    // 1. Quantum Probability Fog / Zero-Point Vacuum Fluctuations (Ambient particles)
    const vacCount = 14;
    for (let i = 0; i < vacCount; i++) {
      const vAngle = time * 0.8 + (i / vacCount) * Math.PI * 2;
      const vDist = 28 + Math.sin(time * 1.5 + i * 2) * 18;
      const vPt = project({
        x: Math.cos(vAngle) * vDist,
        y: Math.sin(time * 2 + i) * 14,
        z: Math.sin(vAngle) * vDist
      });
      const vAlpha = 0.15 + 0.15 * Math.sin(time * 3 + i);
      ctx.fillStyle = i % 2 === 0 ? `rgba(0, 243, 255, ${vAlpha})` : `rgba(25, 255, 156, ${vAlpha})`;
      ctx.beginPath();
      ctx.arc(vPt.sx, vPt.sy, 1.2 * vPt.scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw 3D Bohr Electron Orbital Rings with de Broglie Standing Wave Ripples
    orbits.forEach(orb => {
      const segments = 48;
      ctx.beginPath();
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const wave = Math.sin(theta * orb.deBroglieModes + time * 4) * 1.5;
        const rad = orb.radiusX + wave;
        const localX = Math.cos(theta) * rad;
        const localY = Math.sin(theta) * rad;
        const localZ = 0;

        const inclined = transformOrbitPt(localX, localY, localZ, orb.tiltX, orb.tiltY, orb.tiltZ);
        const pt = project(inclined);

        if (s === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      }
      ctx.strokeStyle = orb.color === "#bd00ff" ? "rgba(189, 0, 255, 0.32)" : (orb.color === "#19ff9c" ? "rgba(25, 255, 156, 0.32)" : "rgba(0, 243, 255, 0.35)");
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 3. Central Nucleus Cluster (Protons & Neutrons with Quantum Strong Force Binding)
    const nucleusPulse = 1 + Math.sin(time * 4) * 0.15;
    const centerPt = project({ x: 0, y: 0, z: 0 });

    ctx.save();
    const nucGrad = ctx.createRadialGradient(centerPt.sx, centerPt.sy, 1, centerPt.sx, centerPt.sy, 22 * nucleusPulse);
    nucGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    nucGrad.addColorStop(0.3, "rgba(0, 243, 255, 0.8)");
    nucGrad.addColorStop(0.65, "rgba(189, 0, 255, 0.4)");
    nucGrad.addColorStop(1, "rgba(0, 243, 255, 0)");
    ctx.fillStyle = nucGrad;
    ctx.beginPath();
    ctx.arc(centerPt.sx, centerPt.sy, 22 * nucleusPulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Render individual nucleons sorted by Z-depth
    const projectedNucleons = nucleons.map(nuc => {
      const vibX = nuc.x + Math.sin(time * 6 + nuc.r) * 0.4;
      const vibY = nuc.y + Math.cos(time * 7 + nuc.r) * 0.4;
      const vibZ = nuc.z + Math.sin(time * 5 + nuc.r) * 0.4;
      const pt = project({ x: vibX, y: vibY, z: vibZ });
      return { ...nuc, ...pt };
    }).sort((a, b) => b.sz - a.sz);

    projectedNucleons.forEach(nuc => {
      const radius = nuc.r * nuc.scale;
      const grad = ctx.createRadialGradient(nuc.sx - radius * 0.3, nuc.sy - radius * 0.3, 0.5, nuc.sx, nuc.sy, radius);
      if (nuc.isProton) {
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.4, "#00f3ff");
        grad.addColorStop(1, "#005577");
      } else {
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.4, "#19ff9c");
        grad.addColorStop(1, "#0a5530");
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(nuc.sx, nuc.sy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = nuc.isProton ? "rgba(0, 243, 255, 0.6)" : "rgba(25, 255, 156, 0.6)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // 4. Update and Render Orbiting Electrons & Wave Packets
    orbits.forEach(orb => {
      orb.electrons.forEach(el => {
        el.angle += el.speed;
        const wave = Math.sin(el.angle * orb.deBroglieModes + time * 4) * 1.5;
        const rad = orb.radiusX + wave;
        const localX = Math.cos(el.angle) * rad;
        const localY = Math.sin(el.angle) * rad;
        const inclined = transformOrbitPt(localX, localY, 0, orb.tiltX, orb.tiltY, orb.tiltZ);
        const pPt = project(inclined);

        el.trail.push({ sx: pPt.sx, sy: pPt.sy, sz: pPt.sz, scale: pPt.scale });
        if (el.trail.length > 10) el.trail.shift();

        for (let t = 0; t < el.trail.length - 1; t++) {
          const ptA = el.trail[t];
          const ptB = el.trail[t + 1];
          const alpha = (t / el.trail.length) * 0.65;
          ctx.beginPath();
          ctx.moveTo(ptA.sx, ptA.sy);
          ctx.lineTo(ptB.sx, ptB.sy);
          ctx.strokeStyle = orb.color === "#bd00ff" ? `rgba(189, 0, 255, ${alpha})` : (orb.color === "#19ff9c" ? `rgba(25, 255, 156, ${alpha})` : `rgba(0, 243, 255, ${alpha})`);
          ctx.lineWidth = (t / el.trail.length) * 2.2 * ptA.scale;
          ctx.stroke();
        }

        const eRadius = 3.5 * pPt.scale;
        const eGrad = ctx.createRadialGradient(pPt.sx, pPt.sy, 0.5, pPt.sx, pPt.sy, eRadius * 2);
        eGrad.addColorStop(0, "#ffffff");
        eGrad.addColorStop(0.4, orb.color);
        eGrad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = eGrad;
        ctx.beginPath();
        ctx.arc(pPt.sx, pPt.sy, eRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pPt.sx, pPt.sy, eRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // 5. Render Quantum Telemetry Tokens
    ctx.font = "8px 'Share Tech Mono', monospace";
    quantumTokens.forEach(tok => {
      tok.angle += tok.speed;
      const tX = Math.cos(tok.angle) * tok.dist;
      const tY = tok.yOff + Math.sin(tok.angle * 2) * 6;
      const tZ = Math.sin(tok.angle) * tok.dist;

      const pt = project({ x: tX, y: tY, z: tZ });

      if (pt.sz > -100) {
        ctx.save();
        const tAlpha = Math.max(0.2, (pt.scale - 0.5) * 1.5);
        ctx.fillStyle = `rgba(0, 243, 255, ${tAlpha * 0.85})`;
        ctx.textAlign = "center";
        ctx.fillText(tok.text, pt.sx, pt.sy);

        ctx.strokeStyle = `rgba(0, 243, 255, ${tAlpha * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(pt.sx - 15, pt.sy + 3);
        ctx.lineTo(pt.sx + 15, pt.sy + 3);
        ctx.stroke();
        ctx.restore();
      }
    });

    // 6. Coordinate Reticle Axis Marks
    ctx.strokeStyle = "rgba(0, 243, 255, 0.12)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy);
    ctx.lineTo(cx + 24, cy);
    ctx.moveTo(cx, cy - 24);
    ctx.lineTo(cx, cy + 24);
    ctx.stroke();
  }

  requestAnimationFrame(render);
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

