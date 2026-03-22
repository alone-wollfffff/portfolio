import * as THREE from 'three';

function easeOutPower2(t) { return 1 - Math.pow(1 - Math.min(t, 1), 2); }
function easeOutPower3(t) { return 1 - Math.pow(1 - Math.min(t, 1), 3); }

function initMouse(mouseObj) {
  window.addEventListener('mousemove', function (e) {
    mouseObj.x = (e.clientX / window.innerWidth  - .5) * 2;
    mouseObj.y = (e.clientY / window.innerHeight - .5) * 2;
  });
}

function initViewport() {
  const root = document.documentElement;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  function syncViewport() {
    root.style.setProperty('--app-height', `${window.innerHeight}px`);
    root.style.setProperty('--app-width', `${window.innerWidth}px`);
    root.classList.toggle('is-compact-height', window.innerHeight < 760);
  }

  root.classList.toggle('is-touch-device', coarsePointer || navigator.maxTouchPoints > 0);
  syncViewport();

  window.addEventListener('resize', syncViewport, { passive: true });
  window.addEventListener('orientationchange', syncViewport);
}

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

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  
  if (isTouchDevice && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(e) {
      if (e.gamma !== null && e.beta !== null) {
        mouseObj.x =  Math.max(-1, Math.min(1, e.gamma / 40)) * 0.7;
        mouseObj.y = -Math.max(-1, Math.min(1, (e.beta - 45) / 40)) * 0.5;
      }
    }, { passive: true });
  }

  
  const BURST_COUNT = prefersReducedMotion
    ? (isTouchDevice ? 140 : 320)
    : (isTouchDevice ? 220 : 600);
  const burstGroup  = new THREE.Group();
  const burstData   = [];

 const burstGeo = new THREE.TetrahedronGeometry(1, 0);
  const burstMat = new THREE.MeshPhongMaterial({
    color: 0x050505,      
    emissive: 0x121216,   
    specular: 0x777788,   
    shininess: 38,        
    flatShading: true, 
    transparent: true, 
    opacity: 0.85          
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

  
  const PT    = prefersReducedMotion
    ? (isTouchDevice ? 180 : 420)
    : (isTouchDevice ? 350 : 900);
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
    color: 0x555566, 
    size: .06, 
    transparent: true, 
    opacity: .8,
  })));

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  
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

  
  (function tick() {
    requestAnimationFrame(tick);
    if (document.hidden) return;

    const now = performance.now();

    let camProg      = 1;
    let entryElapsed = 0;

    if (entryActive) {
      entryElapsed = (now - entryStart) / 1000;
      camProg = Math.min(entryElapsed / ENTRY_DUR, 1);
      camera.position.z = 80 + (28 - 80) * easeOutPower2(camProg);

      
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

function initCursor() {
  if (document.getElementById('custom-cursor')) return;

  const el = document.createElement('div');
  el.id = 'custom-cursor';
  document.body.appendChild(el);

  const dot = document.createElement('div');
  dot.id = 'custom-cursor-dot';
  document.body.appendChild(dot);

  let tx = -200;
  let ty = -200;
  let cx = -200;
  let cy = -200;
  let dx = -200;
  let dy = -200;
  let usingMouse = false;

  el.style.opacity = '0';
  dot.style.opacity = '0';

  function enableCursor() {
    if (usingMouse) return;
    usingMouse = true;
    document.documentElement.classList.add('has-custom-cursor');
    el.style.opacity = '';
    dot.style.opacity = '';
  }

  function disableCursor() {
    if (!usingMouse) return;
    usingMouse = false;
    document.documentElement.classList.remove('has-custom-cursor');
    el.style.opacity = '0';
    dot.style.opacity = '0';
  }

  window.addEventListener('mousemove', (event) => {
    enableCursor();
    tx = event.clientX;
    ty = event.clientY;
  });

  window.addEventListener('touchstart', () => {
    disableCursor();
  }, { passive: true });

  const hoverSelectors = 'a, button, [data-sec], .cb-btn, .cb-view-card, .sn-dot, .cta-btn, input, textarea, select, label';

  document.addEventListener('mouseover', (event) => {
    if (event.target.closest(hoverSelectors)) {
      el.classList.add('is-hovering');
      dot.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (event) => {
    if (event.target.closest(hoverSelectors)) {
      el.classList.remove('is-hovering');
      dot.classList.remove('is-hovering');
    }
  });

  document.addEventListener('mousedown', () => el.classList.add('is-clicking'));
  document.addEventListener('mouseup', () => el.classList.remove('is-clicking'));

  document.addEventListener('mouseleave', () => {
    el.style.opacity = '0';
    dot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    el.style.opacity = '';
    dot.style.opacity = '';
  });

  (function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;

    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    dx += (tx - dx) * 0.35;
    dy += (ty - dy) * 0.35;

    el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
  })();
}

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  function setOpen(isOpen) {
    btn.classList.toggle('open', isOpen);
    nav.classList.toggle('open', isOpen);
    document.documentElement.classList.toggle('nav-open', isOpen);
  }

  btn.addEventListener('click', () => {
    setOpen(!btn.classList.contains('open'));
  });

  
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      setOpen(false);
    });
  });

  
  nav.addEventListener('click', e => {
    if (e.target === nav) {
      setOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && btn.classList.contains('open')) {
      setOpen(false);
    }
  }, { passive: true });
}

export {
  easeOutPower2,
  easeOutPower3,
  initViewport,
  initMouse,
  runPreloader,
  initThree,
  initCursor,
  initHamburger,
};
