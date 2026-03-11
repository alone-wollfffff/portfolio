/* ================================================================
   SHARED.JS — Om Balaji Varpe Portfolio
   ────────────────────────────────────────────────────────────────
   Shared utilities consumed by both site.js and projects.js.

   Exports via window.PortfolioShared:
     easeOutPower2(t)
     easeOutPower3(t)
     initMouse(mouseObj)      — populates {x,y} on mousemove
     runPreloader(onDone)     — count 0→100, split panels, call onDone
     initThree(mouse,         — Three.js scene (InstancedMesh burst +
               camTarget,       ambient dots). Returns {triggerEntrance,
               SEC_CAM_Y)       setCamSection}
     initCursor()             — smooth custom circular cursor

   ── Performance notes ──────────────────────────────────────────
   THREE.InstancedMesh collapses 600 individual Mesh draw calls
   into a single draw call while keeping identical visual output.
   The dummy Object3D approach encodes per-particle position,
   rotation, and scale into each instance's matrix each frame.
================================================================ */
(function (global) {
'use strict';


/* ================================================================
   EASING HELPERS
================================================================ */
function easeOutPower2(t) { return 1 - Math.pow(1 - Math.min(t, 1), 2); }
function easeOutPower3(t) { return 1 - Math.pow(1 - Math.min(t, 1), 3); }


/* ================================================================
   MOUSE TRACKING
   Populates the caller-owned mouseObj {x, y} in normalised coords.
================================================================ */
function initMouse(mouseObj) {
  window.addEventListener('mousemove', function (e) {
    mouseObj.x = (e.clientX / window.innerWidth  - .5) * 2;
    mouseObj.y = (e.clientY / window.innerHeight - .5) * 2;
  });
}


/* ================================================================
   PRELOADER
   Counts 0→100, blurs number out, slides panels apart, calls onDone.
================================================================ */
function runPreloader(onDone) {
  const numEl = document.getElementById('pl-num');
  let n = 0;

  const iv = setInterval(() => {
    n = Math.min(n + Math.floor(Math.random() * 11) + 4, 100);
    numEl.textContent = n;

    if (n >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        numEl.classList.add('hide');
        setTimeout(() => {
          document.querySelector('.pl-cover.left').classList.add('out-l');
          document.querySelector('.pl-cover.right').classList.add('out-r');

          // Trigger entrance animations as doors begin to open
          onDone();

          setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
          }, 950);
        }, 350);
      }, 280);
    }
  }, 38);
}


/* ================================================================
   THREE.JS BACKGROUND — + MOBILE OPTIMIZATIONS
   ────────────────────────────────────────────────────────────────
   • Burst particles: 600 desktop / 220 mobile (one InstancedMesh draw call)
   • Ambient dots:    900 desktop / 350 mobile (one Points draw call)
   • Camera: flies from Z=80 → Z=28 on entrance, follows mouse (desktop)
     or device orientation (mobile) with section-based Y pan

   Parameters:
     mouseObj   — shared {x,y} populated by initMouse
     camTarget  — shared {x,y} camera interpolation target
     SEC_CAM_Y  — array of per-section Y offsets (page-specific)

   Returns { triggerEntrance, setCamSection }
================================================================ */
/* ================================================================
   TOUCH / MOBILE DETECTION
================================================================ */
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;


function initThree(mouseObj, camTarget, SEC_CAM_Y) {
  const canvas   = document.getElementById('bg');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isTouchDevice, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouchDevice ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

  scene.add(new THREE.AmbientLight(0xffffff, 0.10));
  const dl = new THREE.DirectionalLight(0xffffff, 0.5);
  dl.position.set(5, 8, 6);
  scene.add(dl);

  /* ── Device orientation for mobile camera parallax ──
     Replaces mouse-based parallax on touch devices.         */
  if (isTouchDevice && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(e) {
      if (e.gamma !== null && e.beta !== null) {
        mouseObj.x =  Math.max(-1, Math.min(1, e.gamma / 40)) * 0.7;
        mouseObj.y = -Math.max(-1, Math.min(1, (e.beta - 45) / 40)) * 0.5;
      }
    }, { passive: true });
  }

  /* ── Burst particles — reduced count on mobile for performance ──
     Each particle's size (1.2–1.9) and initial rotation are baked into
     the instance matrix. Position is updated every frame during the
     entrance animation by mutating the same reusable `dummy` Object3D.  */
  const BURST_COUNT = isTouchDevice ? 220 : 600;
  const burstGroup  = new THREE.Group();
  const burstData   = [];

 const burstGeo = new THREE.TetrahedronGeometry(1, 0);
  const burstMat = new THREE.MeshPhongMaterial({
    color: 0x000000,      /* Pure black base */
    emissive: 0x111111,   /* The secret self-glowing dark gray */
    specular: 0x222222,   /* The exact highlight color */
    shininess: 8.74,      /* The exact highlight sharpness */
    flatShading: true, 
    transparent: true, 
    opacity: 0.9          /* Slightly raised opacity for better reflections */
  });

  const instancedMesh = new THREE.InstancedMesh(burstGeo, burstMat, BURST_COUNT);
  instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Reusable dummy — avoids per-frame allocation
  const dummy = new THREE.Object3D();

  for (let i = 0; i < BURST_COUNT; i++) {
    const size = 1.2 + Math.random() * .7;
    const rotX = Math.random() * Math.PI * 2;
    const rotY = Math.random() * Math.PI * 2;
    const rotZ = Math.random() * Math.PI * 2;

    // Set starting matrix (all at origin, scaled to individual size)
    dummy.position.set(0, 0, 0);
    dummy.rotation.set(rotX, rotY, rotZ);
    dummy.scale.setScalar(size);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    // Compute spherical target position
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 8 + Math.random() * 26;
    const tX    = r * Math.sin(phi) * Math.cos(theta);
    const tY    = r * Math.sin(phi) * Math.sin(theta) * .6;
    const tZ    = (Math.random() - .5) * 18 - 4;

    const delay = (i / 700) * 2.0 + 1.2;
    const dur   = 1.6 + Math.random() * 1.0;

    burstData.push({ tX, tY, tZ, delay, dur, rotX, rotY, rotZ, size });
  }
  instancedMesh.instanceMatrix.needsUpdate = true;

  burstGroup.add(instancedMesh);
  scene.add(burstGroup);

  /* ── Ambient particle field (reduced on mobile for performance) ── */
  const PT    = isTouchDevice ? 350 : 900;
  const ptPos = new Float32Array(PT * 3);
  const ptVel = [];
  for (let i = 0; i < PT; i++) {
    ptPos[i * 3]     = (Math.random() - .5) * 70;
    ptPos[i * 3 + 1] = (Math.random() - .5) * 50;
    ptPos[i * 3 + 2] = (Math.random() - .5) * 40 - 8;
    ptVel.push(new THREE.Vector3(
      (Math.random() - .5) * .006,
      (Math.random() - .5) * .004, 0
    ));
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
  scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({
    color: 0x222222, 
    size: .06, 
    transparent: true, 
    opacity: .8,
  })));

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Entrance state ── */
  let entryActive = false;
  let entryStart  = 0;
  const ENTRY_DUR = 2.0;

  camera.position.set(0, 0, 80);

  let targetSecY  = 0;
  let currentSecY = 0;

  function triggerEntrance() {
    entryActive = true;
    entryStart  = performance.now();
  }

  function setCamSection(idx) {
    targetSecY = SEC_CAM_Y[idx] !== undefined ? SEC_CAM_Y[idx] : 0;
  }

  /* ── Render loop ── */
  (function tick() {
    requestAnimationFrame(tick);
    const now = performance.now();

    let camProg      = 1;
    let entryElapsed = 0;

    if (entryActive) {
      entryElapsed = (now - entryStart) / 1000;
      camProg = Math.min(entryElapsed / ENTRY_DUR, 1);
      camera.position.z = 80 + (28 - 80) * easeOutPower2(camProg);

      /* Update each particle's matrix via the shared dummy Object3D */
      for (let i = 0; i < BURST_COUNT; i++) {
        const b  = burstData[i];
        const be = Math.max(0, entryElapsed - b.delay);
        const bp = easeOutPower3(Math.min(be / b.dur, 1));

        dummy.position.set(b.tX * bp, b.tY * bp, b.tZ * bp);
        dummy.rotation.set(b.rotX, b.rotY, b.rotZ);
        dummy.scale.setScalar(b.size);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
    }

    currentSecY += (targetSecY - currentSecY) * .04;
    camTarget.x += (mouseObj.x * 5  - camTarget.x) * .04;
    camTarget.y += (-mouseObj.y * 3 - camTarget.y) * .04;

    if (camProg >= 1) {
      camera.position.x = camTarget.x;
      camera.position.y = camTarget.y + currentSecY;
      camera.position.z = 28;
    } else {
      camera.position.x = camTarget.x * camProg;
      camera.position.y = (camTarget.y + currentSecY) * camProg;
    }
    camera.lookAt(0, 0, 0);

    burstGroup.rotation.y -= .002;

    /* Drift ambient dots */
    const p = ptGeo.attributes.position.array;
    for (let i = 0; i < PT; i++) {
      p[i * 3]     += ptVel[i].x;
      p[i * 3 + 1] += ptVel[i].y;
      if (Math.abs(p[i * 3])     > 35) ptVel[i].x *= -1;
      if (Math.abs(p[i * 3 + 1]) > 25) ptVel[i].y *= -1;
    }
    ptGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  })();

  return { triggerEntrance, setCamSection };
}


/* ================================================================
   CUSTOM CURSOR
   ────────────────────────────────────────────────────────────────
   Smooth round cursor that replaces the OS default.
   Uses a lightweight rAF lerp loop — no layout thrash.
   Hover state (scale-up + blend) applied via data-hover detection.
================================================================ */
function initCursor() {
  /* On touch devices, the OS cursor is hidden via CSS — no JS cursor needed */
  if (isTouchDevice) return;

  const el = document.createElement('div');
  el.id = 'custom-cursor';
  document.body.appendChild(el);

  /* Inner dot for the two-layer look */
  const dot = document.createElement('div');
  dot.id = 'custom-cursor-dot';
  document.body.appendChild(dot);

  let tx = -200, ty = -200; // target (raw mouse)
  let cx = -200, cy = -200; // outer ring current (lagging)
  let dx = -200, dy = -200; // dot current (faster)

  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  /* Hover detection — matches all interactive elements */
  const HOVER_SEL = 'a, button, [data-sec], .cb-btn, .sn-dot, .cta-btn, input, textarea, select, label';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_SEL)) {
      el.classList.add('is-hovering');
      dot.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_SEL)) {
      el.classList.remove('is-hovering');
      dot.classList.remove('is-hovering');
    }
  });

  /* mousedown / mouseup click flash */
  document.addEventListener('mousedown', () => el.classList.add('is-clicking'));
  document.addEventListener('mouseup',   () => el.classList.remove('is-clicking'));

  /* Hide cursor when it leaves the window */
  document.addEventListener('mouseleave', () => { el.style.opacity = '0'; dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { el.style.opacity = ''; dot.style.opacity = ''; });

  /* rAF lerp loop — outer ring lags, dot snaps */
  (function loop() {
    requestAnimationFrame(loop);

    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;

    dx += (tx - dx) * 0.35;
    dy += (ty - dy) * 0.35;

    el.style.transform  = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
  })();
}


/* ================================================================
   HAMBURGER MENU (Mobile)
   Toggles the mobile nav overlay. Works on both pages.
================================================================ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    /* Lock/unlock body scroll while overlay is open */
    document.body.style.overflow = isOpen ? '' : '';
  });

  /* Close nav when a link inside it is clicked */
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  /* Close nav on backdrop tap (outside the nav links area) */
  nav.addEventListener('click', e => {
    if (e.target === nav) {
      btn.classList.remove('open');
      nav.classList.remove('open');
    }
  });
}


/* ── Export ── */
global.PortfolioShared = {
  easeOutPower2,
  easeOutPower3,
  initMouse,
  runPreloader,
  initThree,
  initCursor,
  initHamburger,
};

})(window);
