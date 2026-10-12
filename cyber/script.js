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
  document.getElementById("registerModal").classList.add("open");
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

// ==========================================
// CYBER 3D ZERO-TRUST SHIELD & FIREWALL CORE
// ==========================================
(function initCyberShieldCore() {
  function start() {
    const canvas = document.getElementById("cyberShieldCanvas");
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
    let rotX = 0.25;
    let rotY = 0.2;
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

    // 3D Hexagonal Cyber Shield Vertices (Front & Back bevel for 3D thickness)
    const SHIELD_POINTS = [
      { x: 0, y: -36, z: 0 },
      { x: 28, y: -20, z: 0 },
      { x: 28, y: 10, z: 0 },
      { x: 0, y: 36, z: 0 },
      { x: -28, y: 10, z: 0 },
      { x: -28, y: -20, z: 0 }
    ];

    // Inner Honeycomb Security Grid lines inside the shield
    const HONEYCOMB_EDGES = [
      [{ x: 0, y: -22, z: 0 }, { x: 18, y: -12, z: 0 }],
      [{ x: 18, y: -12, z: 0 }, { x: 18, y: 6, z: 0 }],
      [{ x: 18, y: 6, z: 0 }, { x: 0, y: 22, z: 0 }],
      [{ x: 0, y: 22, z: 0 }, { x: -18, y: 6, z: 0 }],
      [{ x: -18, y: 6, z: 0 }, { x: -18, y: -12, z: 0 }],
      [{ x: -18, y: -12, z: 0 }, { x: 0, y: -22, z: 0 }],
      // Cross struts
      [{ x: 0, y: -36, z: 0 }, { x: 0, y: -22, z: 0 }],
      [{ x: 28, y: -20, z: 0 }, { x: 18, y: -12, z: 0 }],
      [{ x: 28, y: 10, z: 0 }, { x: 18, y: 6, z: 0 }],
      [{ x: 0, y: 36, z: 0 }, { x: 0, y: 22, z: 0 }],
      [{ x: -28, y: 10, z: 0 }, { x: -18, y: 6, z: 0 }],
      [{ x: -28, y: -20, z: 0 }, { x: -18, y: -12, z: 0 }]
    ];

    // Floating Cipher Tokens
    const CIPHER_STRINGS = ["AES", "0x7F", "256", "HASH", "PASS", "LOCK", "AUTH", "0101"];
    const cipherNodes = [];
    for (let i = 0; i < 10; i++) {
      cipherNodes.push({
        text: CIPHER_STRINGS[i % CIPHER_STRINGS.length],
        angle: (i / 10) * Math.PI * 2,
        radius: 54 + (i % 3) * 8,
        speed: 0.008 + (i % 3) * 0.004,
        y: (Math.random() - 0.5) * 35
      });
    }

    let time = 0;

    function render() {
      requestAnimationFrame(render);
      time += 0.02;

      if (!isDragging) {
        rotY += 0.009 + velY;
        rotX += Math.sin(time * 0.5) * 0.002 + velX;
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
          x: cx + rot.x * scale,
          y: cy + rot.y * scale,
          z: rot.z,
          scale: scale
        };
      }

      // 1. Draw 360° Circular Threat Radar Scanner Sweep
      ctx.save();
      const RADAR_RADIUS = 64;
      const radarAngle = time * 2.2;
      const radarPt = rotate3D({ x: Math.cos(radarAngle) * RADAR_RADIUS, y: 0, z: Math.sin(radarAngle) * RADAR_RADIUS }, rotX, rotY, rotZ);
      const radarCenter = project({ x: 0, y: 0, z: 0 });
      const radarTarget = { x: cx + radarPt.x * (fov / (fov + radarPt.z)), y: cy + radarPt.y * (fov / (fov + radarPt.z)) };

      // Radar sweep beam line
      ctx.beginPath();
      ctx.moveTo(radarCenter.x, radarCenter.y);
      ctx.lineTo(radarTarget.x, radarTarget.y);
      ctx.strokeStyle = "rgba(25, 255, 156, 0.75)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Radar detection flash on perimeter
      ctx.beginPath();
      ctx.arc(radarTarget.x, radarTarget.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = "#19ff9c";
      ctx.shadowColor = "#19ff9c";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // 2. Draw Concentric 3D Firewall Perimeter Rings
      ctx.save();
      // Outer Firewall Ring
      const RING1_R = 60;
      const RING_SEG = 36;
      ctx.beginPath();
      for (let i = 0; i <= RING_SEG; i++) {
        const angle = (i / RING_SEG) * Math.PI * 2;
        const rx = Math.cos(angle) * RING1_R;
        const rz = Math.sin(angle) * RING1_R;
        const pt = rotate3D({ x: rx, y: 0, z: rz }, rotX + 0.35, rotY * 0.7 + time * 0.3, rotZ);
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

      // Inner Firewall Defense Ring
      const RING2_R = 48;
      ctx.beginPath();
      for (let i = 0; i <= RING_SEG; i++) {
        const angle = (i / RING_SEG) * Math.PI * 2;
        const ry = Math.cos(angle) * RING2_R;
        const rz = Math.sin(angle) * RING2_R;
        const pt = rotate3D({ x: 0, y: ry, z: rz }, rotX * 0.5 - 0.3, -rotY * 0.6 - time * 0.25, rotZ + 0.2);
        const scale = fov / (fov + pt.z);
        const sx = cx + pt.x * scale;
        const sy = cy + pt.y * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = "rgba(25, 255, 156, 0.28)";
      ctx.setLineDash([3, 7]);
      ctx.stroke();
      ctx.restore();

      // 3. Draw 3D Holographic Cyber Aegis Shield (Dual 3D Faces for Depth)
      const THICK = 4;
      const frontPts = SHIELD_POINTS.map(p => project({ x: p.x, y: p.y, z: p.z - THICK }));
      const backPts = SHIELD_POINTS.map(p => project({ x: p.x, y: p.y, z: p.z + THICK }));

      // Side Bevel Walls
      ctx.save();
      for (let i = 0; i < SHIELD_POINTS.length; i++) {
        const next = (i + 1) % SHIELD_POINTS.length;
        ctx.beginPath();
        ctx.moveTo(frontPts[i].x, frontPts[i].y);
        ctx.lineTo(frontPts[next].x, frontPts[next].y);
        ctx.lineTo(backPts[next].x, backPts[next].y);
        ctx.lineTo(backPts[i].x, backPts[i].y);
        ctx.closePath();
        ctx.fillStyle = "rgba(4, 22, 32, 0.65)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 243, 255, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Front Shield Face
      ctx.beginPath();
      frontPts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 243, 255, 0.08)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 243, 255, 0.85)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Inner Honeycomb Security Grid
      HONEYCOMB_EDGES.forEach(edge => {
        const p1 = project({ x: edge[0].x, y: edge[0].y, z: edge[0].z - THICK });
        const p2 = project({ x: edge[1].x, y: edge[1].y, z: edge[1].z - THICK });
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Shield Perimeter Node Dots (Defense Nodes)
      frontPts.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.2 * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#19ff9c";
        ctx.shadowColor = "#19ff9c";
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      ctx.restore();

      // 4. Central Cryptographic Cyber Lock & Quantum Keyhole Core
      const centerPt = project({ x: 0, y: 0, z: -THICK });
      const lockPulse = 1 + Math.sin(time * 4) * 0.2;

      ctx.save();
      const lockGrad = ctx.createRadialGradient(centerPt.x, centerPt.y, 1, centerPt.x, centerPt.y, 14 * lockPulse);
      lockGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      lockGrad.addColorStop(0.3, "rgba(25, 255, 156, 0.85)");
      lockGrad.addColorStop(0.7, "rgba(0, 243, 255, 0.35)");
      lockGrad.addColorStop(1, "rgba(0, 243, 255, 0)");

      ctx.fillStyle = lockGrad;
      ctx.beginPath();
      ctx.arc(centerPt.x, centerPt.y, 16 * lockPulse, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Keyhole Glyph
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(centerPt.x, centerPt.y - 2, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerPt.x - 2, centerPt.y);
      ctx.lineTo(centerPt.x + 2, centerPt.y);
      ctx.lineTo(centerPt.x + 3, centerPt.y + 6);
      ctx.lineTo(centerPt.x - 3, centerPt.y + 6);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();

      // 5. Orbiting Cryptographic Cipher Text Particles
      ctx.save();
      ctx.font = "8px 'Share Tech Mono', monospace";
      cipherNodes.forEach(node => {
        node.angle += node.speed;
        const nx = Math.cos(node.angle) * node.radius;
        const nz = Math.sin(node.angle) * node.radius;
        const npt = project({ x: nx, y: node.y, z: nz });

        ctx.fillStyle = "rgba(0, 243, 255, 0.65)";
        ctx.fillText(node.text, npt.x, npt.y);
      });
      ctx.restore();

      // 6. Laser Security Diagnostic Scanner
      const scanY = cy + Math.sin(time * 1.5) * (height * 0.35);
      const scanGrad = ctx.createLinearGradient(0, scanY - 5, 0, scanY + 5);
      scanGrad.addColorStop(0, "rgba(25, 255, 156, 0)");
      scanGrad.addColorStop(0.5, "rgba(25, 255, 156, 0.18)");
      scanGrad.addColorStop(1, "rgba(25, 255, 156, 0)");

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

