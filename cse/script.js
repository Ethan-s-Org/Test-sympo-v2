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
  resourcePerson
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

  const sponsorTextEl = document.getElementById("rulesSponsorText");
  const sponsorBoxEl = document.getElementById("modalSponsorBox");
  if (sponsorTextEl && sponsorBoxEl) {
    if (resourcePerson) {
      sponsorTextEl.innerHTML = resourcePerson;
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

// ==========================================
// CSE 4D HYPERCUBE & ALGORITHMIC CORE
// ==========================================
(function initCSETesseract() {
  function start() {
    const canvas = document.getElementById("tesseractCanvas");
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

    // 16 4D Vertices of the Tesseract (±1, ±1, ±1, ±1)
    const vertices4D = [];
    for (let x = -1; x <= 1; x += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let z = -1; z <= 1; z += 2) {
          for (let w = -1; w <= 1; w += 2) {
            vertices4D.push({ x, y, z, w, flash: 0 });
          }
        }
      }
    }

    // 32 4D Hypercube Edges (Hamming distance == 1)
    const edges4D = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        const v1 = vertices4D[i];
        const v2 = vertices4D[j];
        let diff = 0;
        if (v1.x !== v2.x) diff++;
        if (v1.y !== v2.y) diff++;
        if (v1.z !== v2.z) diff++;
        if (v1.w !== v2.w) diff++;
        if (diff === 1) {
          edges4D.push({ from: i, to: j });
        }
      }
    }

    // Algorithmic Execution Pulses
    const pulses = [];
    for (let i = 0; i < 10; i++) {
      pulses.push({
        edgeIdx: Math.floor(Math.random() * edges4D.length),
        t: Math.random(),
        speed: 0.015 + Math.random() * 0.02,
        forward: Math.random() > 0.5
      });
    }

    // Floating Algorithmic Code Tokens
    const CODE_TOKENS = ["O(1)", "O(log n)", "async", "fn()", "const", "git", "0x00", "return", "class"];
    const tokenParticles = [];
    for (let i = 0; i < 9; i++) {
      tokenParticles.push({
        text: CODE_TOKENS[i % CODE_TOKENS.length],
        angle: (i / 9) * Math.PI * 2,
        radius: 56 + (i % 3) * 8,
        speed: 0.007 + (i % 3) * 0.003,
        y: (Math.random() - 0.5) * 32
      });
    }

    // 3D & 4D Rotation state
    let rotX = 0.25;
    let rotY = 0.2;
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

      // 4D Rotation Angles
      const angleXW = time * 0.9;
      const angleYZ = time * 0.6;
      const angleXZ = time * 0.3;

      const cosW = Math.cos(angleXW), sinW = Math.sin(angleXW);
      const cosYZ = Math.cos(angleYZ), sinYZ = Math.sin(angleYZ);
      const cosXZ = Math.cos(angleXZ), sinXZ = Math.sin(angleXZ);

      // Project 4D vertices into 3D space, then project 3D into 2D screen
      const projected3D = vertices4D.map(v => {
        // Rotate in XW plane
        const x1 = v.x * cosW - v.w * sinW;
        const w1 = v.x * sinW + v.w * cosW;

        // Rotate in YZ plane
        const y1 = v.y * cosYZ - v.z * sinYZ;
        const z1 = v.y * sinYZ + v.z * cosYZ;

        // Rotate in XZ plane
        const x2 = x1 * cosXZ - z1 * sinXZ;
        const z2 = x1 * sinXZ + z1 * cosXZ;

        // 4D to 3D perspective projection
        const d4 = 2.4;
        const wScale = 1 / (d4 - w1);
        const p3 = {
          x: x2 * wScale * 44,
          y: y1 * wScale * 44,
          z: z2 * wScale * 44
        };

        // 3D rotation & 2D projection
        const rot = rotate3D(p3, rotX, rotY, rotZ);
        const scale = fov / (fov + rot.z);

        if (v.flash > 0) v.flash = Math.max(0, v.flash - 0.04);

        return {
          sx: cx + rot.x * scale,
          sy: cy + rot.y * scale,
          sz: rot.z,
          scale: scale,
          wDepth: w1,
          flash: v.flash
        };
      });

      // 1. Draw Central Quantum Compiler Nucleus
      const corePulse = 1 + Math.sin(time * 3.5) * 0.22;
      const coreGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, 18 * corePulse);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.3, "rgba(0, 243, 255, 0.85)");
      coreGrad.addColorStop(0.7, "rgba(0, 119, 255, 0.35)");
      coreGrad.addColorStop(1, "rgba(0, 243, 255, 0)");

      ctx.save();
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 20 * corePulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Draw Concentric 3D Algorithmic HUD Rings
      ctx.save();
      const RING_R = 64;
      const RING_SEG = 36;
      ctx.beginPath();
      for (let i = 0; i <= RING_SEG; i++) {
        const angle = (i / RING_SEG) * Math.PI * 2;
        const rx = Math.cos(angle) * RING_R;
        const rz = Math.sin(angle) * RING_R;
        const pt = rotate3D({ x: rx, y: 0, z: rz }, rotX + 0.35, rotY * 0.7 + time * 0.3, rotZ);
        const scale = fov / (fov + pt.z);
        const sx = cx + pt.x * scale;
        const sy = cy + pt.y * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = "rgba(0, 243, 255, 0.28)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 6]);
      ctx.stroke();

      // Orbiting Compiler Satellites
      for (let k = 0; k < 3; k++) {
        const satAngle = (k / 3) * Math.PI * 2 + time * 0.8;
        const sx = Math.cos(satAngle) * RING_R;
        const sz = Math.sin(satAngle) * RING_R;
        const pt = rotate3D({ x: sx, y: 0, z: sz }, rotX + 0.35, rotY * 0.7 + time * 0.3, rotZ);
        const scale = fov / (fov + pt.z);
        ctx.beginPath();
        ctx.arc(cx + pt.x * scale, cy + pt.y * scale, 2.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#00f3ff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();

      // 3. Draw 32 4D Tesseract Edges
      ctx.save();
      edges4D.forEach(edge => {
        const p1 = projected3D[edge.from];
        const p2 = projected3D[edge.to];
        const avgZ = (p1.sz + p2.sz) / 2;
        const avgW = (p1.wDepth + p2.wDepth) / 2;

        // Opacity modulates based on 4D hypercube depth
        const depthAlpha = Math.max(0.12, Math.min(0.85, (avgZ + 55) / 110 + (avgW + 1) * 0.2));

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = `rgba(0, 243, 255, ${depthAlpha * 0.75})`;
        ctx.lineWidth = Math.max(0.8, 1.4 * ((p1.scale + p2.scale) / 2));
        ctx.stroke();
      });
      ctx.restore();

      // 4. Update and Draw Algorithmic Execution Pulses
      ctx.save();
      pulses.forEach(sig => {
        const edge = edges4D[sig.edgeIdx];
        if (!edge) return;
        sig.t += sig.speed;

        if (sig.t >= 1) {
          sig.t = 0;
          const targetNodeIdx = sig.forward ? edge.to : edge.from;
          vertices4D[targetNodeIdx].flash = 1.0;

          // Branch to an adjacent edge
          const connected = edges4D.reduce((acc, e, idx) => {
            if (e.from === targetNodeIdx || e.to === targetNodeIdx) acc.push(idx);
            return acc;
          }, []);

          if (connected.length > 0) {
            sig.edgeIdx = connected[Math.floor(Math.random() * connected.length)];
            const newEdge = edges4D[sig.edgeIdx];
            sig.forward = newEdge.from === targetNodeIdx;
          } else {
            sig.edgeIdx = Math.floor(Math.random() * edges4D.length);
          }
        }

        const p1 = projected3D[sig.forward ? edge.from : edge.to];
        const p2 = projected3D[sig.forward ? edge.to : edge.from];
        const curX = p1.sx + (p2.sx - p1.sx) * sig.t;
        const curY = p1.sy + (p2.sy - p1.sy) * sig.t;
        const curScale = p1.scale + (p2.scale - p1.scale) * sig.t;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.8 * curScale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 12;
        ctx.fill();
      });
      ctx.restore();

      // 5. Draw 16 Tesseract Vertices (Compilation Nodes)
      ctx.save();
      projected3D.forEach(node => {
        if (node.flash > 0) {
          ctx.beginPath();
          ctx.arc(node.sx, node.sy, (3 + 8 * node.flash) * node.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 243, 255, ${0.45 * node.flash})`;
          ctx.shadowColor = "#00f3ff";
          ctx.shadowBlur = 14 * node.flash;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.sx, node.sy, 2.5 * node.scale * (1 + node.flash * 0.7), 0, Math.PI * 2);
        ctx.fillStyle = node.flash > 0.3 ? "#ffffff" : "#00f3ff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 8 + node.flash * 8;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.sx, node.sy, 1.2 * node.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });
      ctx.restore();

      // 6. Orbiting Algorithmic Code Tokens
      ctx.save();
      ctx.font = "8px 'Share Tech Mono', monospace";
      tokenParticles.forEach(token => {
        token.angle += token.speed;
        const tx = Math.cos(token.angle) * token.radius;
        const tz = Math.sin(token.angle) * token.radius;
        const pt = rotate3D({ x: tx, y: token.y, z: tz }, rotX, rotY, rotZ);
        const scale = fov / (fov + pt.z);
        const px = cx + pt.x * scale;
        const py = cy + pt.y * scale;

        ctx.fillStyle = "rgba(0, 243, 255, 0.65)";
        ctx.fillText(token.text, px, py);
      });
      ctx.restore();

      // 7. Subtle Laser Logic Scanner Bar
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

