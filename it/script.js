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
  teamSize,
  resourcePerson
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
// IT 3D CLOUD DATA MATRIX & SERVER STACK
// ==========================================
(function initITCloudStack() {
  function start() {
    const canvas = document.getElementById("cloudStackCanvas");
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
    let rotX = 0.42; // tilted slightly to view 3D disk depth
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

    // 3 Server Platters (Cloud Tiers)
    const tiers = [-34, 0, 34];
    const TIER_RADIUS = 46;
    const TIER_HEIGHT = 7;
    const SEGMENTS = 20;

    // Vertical Data Bus Pillars (at 4 corners)
    const BUS_CORNERS = [
      { x: -30, z: -30 },
      { x: 30, z: -30 },
      { x: 30, z: 30 },
      { x: -30, z: 30 }
    ];

    // High-speed Data Packets streaming along bus pillars
    const packets = [];
    for (let i = 0; i < 10; i++) {
      packets.push({
        pillarIdx: i % 4,
        t: Math.random(),
        speed: 0.014 + Math.random() * 0.025,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: i % 3 === 0 ? "#19ff9c" : "#00f3ff"
      });
    }

    // Floating Binary Stream Particles
    const bits = [];
    for (let i = 0; i < 14; i++) {
      bits.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 80,
        z: (Math.random() - 0.5) * 50,
        char: Math.random() > 0.5 ? "1" : "0",
        speed: 0.4 + Math.random() * 0.6,
        opacity: Math.random() * 0.7
      });
    }

    let time = 0;

    function render() {
      requestAnimationFrame(render);
      time += 0.02;

      if (!isDragging) {
        rotY += 0.008 + velY;
        rotX += Math.sin(time * 0.4) * 0.0015 + velX;
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

      // 1. Draw Vertical Core Laser Beam (Central high-speed fiber bus)
      const topCore = project({ x: 0, y: -48, z: 0 });
      const btmCore = project({ x: 0, y: 48, z: 0 });
      const corePulse = 0.7 + Math.sin(time * 3.5) * 0.3;

      const beamGrad = ctx.createLinearGradient(topCore.x, topCore.y, btmCore.x, btmCore.y);
      beamGrad.addColorStop(0, "rgba(0, 243, 255, 0.1)");
      beamGrad.addColorStop(0.5, `rgba(0, 243, 255, ${0.75 * corePulse})`);
      beamGrad.addColorStop(1, "rgba(0, 243, 255, 0.1)");

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(topCore.x, topCore.y);
      ctx.lineTo(btmCore.x, btmCore.y);
      ctx.strokeStyle = beamGrad;
      ctx.lineWidth = 4 * ((topCore.scale + btmCore.scale) / 2);
      ctx.stroke();

      // White-hot center filament
      ctx.beginPath();
      ctx.moveTo(topCore.x, topCore.y);
      ctx.lineTo(btmCore.x, btmCore.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * corePulse})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 2. Draw 4 Vertical Corner Bus Pillars
      ctx.save();
      BUS_CORNERS.forEach(corner => {
        const topPt = project({ x: corner.x, y: -38, z: corner.z });
        const btmPt = project({ x: corner.x, y: 38, z: corner.z });

        ctx.beginPath();
        ctx.moveTo(topPt.x, topPt.y);
        ctx.lineTo(btmPt.x, btmPt.y);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.22)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
      });
      ctx.restore();

      // 3. Render 3 Cloud Server Platters (Back-to-Front depth sorting)
      const sortedTiers = [...tiers].sort((a, b) => {
        const za = rotate3D({ x: 0, y: a, z: 0 }, rotX, rotY, rotZ).z;
        const zb = rotate3D({ x: 0, y: b, z: 0 }, rotX, rotY, rotZ).z;
        return za - zb;
      });

      sortedTiers.forEach((tierY, idx) => {
        const topY = tierY - TIER_HEIGHT / 2;
        const btmY = tierY + TIER_HEIGHT / 2;

        const topPoints = [];
        const btmPoints = [];

        for (let i = 0; i < SEGMENTS; i++) {
          const angle = (i / SEGMENTS) * Math.PI * 2;
          const px = Math.cos(angle) * TIER_RADIUS;
          const pz = Math.sin(angle) * TIER_RADIUS;

          topPoints.push(project({ x: px, y: topY, z: pz }));
          btmPoints.push(project({ x: px, y: btmY, z: pz }));
        }

        // Draw side panels / cylinder rim
        ctx.save();
        for (let i = 0; i < SEGMENTS; i++) {
          const next = (i + 1) % SEGMENTS;
          const tp1 = topPoints[i], tp2 = topPoints[next];
          const bp1 = btmPoints[i], bp2 = btmPoints[next];

          ctx.beginPath();
          ctx.moveTo(tp1.x, tp1.y);
          ctx.lineTo(tp2.x, tp2.y);
          ctx.lineTo(bp2.x, bp2.y);
          ctx.lineTo(bp1.x, bp1.y);
          ctx.closePath();

          ctx.fillStyle = "rgba(4, 24, 38, 0.45)";
          ctx.fill();
          ctx.strokeStyle = "rgba(0, 243, 255, 0.2)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Draw top face
        ctx.beginPath();
        topPoints.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 243, 255, 0.08)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 243, 255, 0.6)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner concentric circuit ring
        ctx.beginPath();
        for (let i = 0; i < SEGMENTS; i++) {
          const angle = (i / SEGMENTS) * Math.PI * 2;
          const px = Math.cos(angle) * (TIER_RADIUS * 0.52);
          const pz = Math.sin(angle) * (TIER_RADIUS * 0.52);
          const pt = project({ x: px, y: topY, z: pz });
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(0, 243, 255, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Activity Server LEDs around rim
        const ledCount = 8;
        for (let k = 0; k < ledCount; k++) {
          const ledAngle = (k / ledCount) * Math.PI * 2 + time * 0.2;
          const lx = Math.cos(ledAngle) * (TIER_RADIUS - 2);
          const lz = Math.sin(ledAngle) * (TIER_RADIUS - 2);
          const lpt = project({ x: lx, y: topY, z: lz });

          const isFlicker = Math.sin(time * 6 + k * 1.5 + idx) > 0.2;
          ctx.beginPath();
          ctx.arc(lpt.x, lpt.y, 1.8 * lpt.scale, 0, Math.PI * 2);
          ctx.fillStyle = isFlicker ? "#19ff9c" : "#00f3ff";
          ctx.shadowColor = isFlicker ? "#19ff9c" : "#00f3ff";
          ctx.shadowBlur = isFlicker ? 8 : 4;
          ctx.fill();
        }

        ctx.restore();
      });

      // 4. Update and Draw Streaming Data Packets on Vertical Bus
      ctx.save();
      packets.forEach(pkt => {
        pkt.t += pkt.speed * pkt.direction;
        if (pkt.t > 1) {
          pkt.t = 0;
          pkt.pillarIdx = Math.floor(Math.random() * 4);
        } else if (pkt.t < 0) {
          pkt.t = 1;
          pkt.pillarIdx = Math.floor(Math.random() * 4);
        }

        const corner = BUS_CORNERS[pkt.pillarIdx];
        const py = -38 + pkt.t * 76;
        const pt = project({ x: corner.x, y: py, z: corner.z });

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.8 * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Trail
        const trailY = py - (pkt.direction * 6);
        const trailPt = project({ x: corner.x, y: trailY, z: corner.z });
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(trailPt.x, trailPt.y);
        ctx.strokeStyle = pkt.color;
        ctx.lineWidth = 2 * pt.scale;
        ctx.stroke();
      });
      ctx.restore();

      // 5. Draw Orbital Cloud Edge / CDN Telemetry Ring
      ctx.save();
      const RING_R = 64;
      const RING_SEG = 40;
      ctx.beginPath();
      for (let i = 0; i <= RING_SEG; i++) {
        const angle = (i / RING_SEG) * Math.PI * 2;
        const rx = Math.cos(angle) * RING_R;
        const rz = Math.sin(angle) * RING_R;
        const pt = rotate3D({ x: rx, y: 0, z: rz }, rotX + 0.4, rotY * 0.7 + time * 0.35, rotZ);
        const scale = fov / (fov + pt.z);
        const sx = cx + pt.x * scale;
        const sy = cy + pt.y * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = "rgba(0, 243, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.stroke();

      // Orbiting CDN Edge Node Satellites
      for (let s = 0; s < 3; s++) {
        const satAngle = (s / 3) * Math.PI * 2 + time * 0.7;
        const sx = Math.cos(satAngle) * RING_R;
        const sz = Math.sin(satAngle) * RING_R;
        const pt = rotate3D({ x: sx, y: 0, z: sz }, rotX + 0.4, rotY * 0.7 + time * 0.35, rotZ);
        const scale = fov / (fov + pt.z);
        const satX = cx + pt.x * scale;
        const satY = cy + pt.y * scale;

        // Satellite Node
        ctx.beginPath();
        ctx.arc(satX, satY, 3 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 10;
        ctx.fill();

        // Ping Wave Ring
        const pingR = (time * 15 + s * 10) % 18;
        ctx.beginPath();
        ctx.arc(satX, satY, pingR * scale, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 243, 255, ${Math.max(0, 1 - pingR / 18) * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([]);
        ctx.stroke();
      }
      ctx.restore();

      // 6. Upward Floating Binary Matrix Bits
      ctx.save();
      ctx.font = "8px 'Share Tech Mono', monospace";
      bits.forEach(bit => {
        bit.y -= bit.speed;
        if (bit.y < -46) {
          bit.y = 46;
          bit.x = (Math.random() - 0.5) * 50;
          bit.z = (Math.random() - 0.5) * 50;
        }
        const bpt = project({ x: bit.x, y: bit.y, z: bit.z });
        ctx.fillStyle = `rgba(0, 243, 255, ${bit.opacity * bpt.scale})`;
        ctx.fillText(bit.char, bpt.x, bpt.y);
      });
      ctx.restore();

      // 7. Subtle Horizontal Network Scanner Sweep
      const scanY = cy + Math.sin(time * 1.6) * (height * 0.36);
      const scanGrad = ctx.createLinearGradient(0, scanY - 5, 0, scanY + 5);
      scanGrad.addColorStop(0, "rgba(0, 243, 255, 0)");
      scanGrad.addColorStop(0.5, "rgba(0, 243, 255, 0.15)");
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

