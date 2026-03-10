/* ================================================================
   SITE.JS — Om Balaji Varpe Portfolio
   ────────────────────────────────────────────────────────────────
   Boot: DOMContentLoaded → boot()
     shared.initThree()     — Three.js canvas (InstancedMesh, shared.js)
     shared.initMouse()     — mouse position tracking (shared.js)
     shared.runPreloader()  — counts 0→100, splits panels (shared.js)
       onDone → triggerEntrance, header/nav fade in, initSections
     shared.initCursor()    — custom cursor (shared.js)

   Page-specific logic kept here:
     CERT_DATA, GLOBAL_STATE, initSections(), buildCertBrowser()
================================================================ */
(function () {
'use strict';

const shared = window.PortfolioShared;


/* ================================================================
   CERT DATA
================================================================ */
const CERTS = [
  { name: 'Google AI Essentials', cat: 'ai', issuer: 'Google · Coursera', year: '2024', img: 'src/cert/Google AI Essentials.jpg', url: 'https://coursera.org/verify/specialization/C37RSIB1GM5R' },
  { name: 'AI Tools Workshop', cat: 'ai', issuer: 'be10X', year: '2025', img: 'src/cert/Be10x_WorkShop.jpg', url: 'https://certx.in/certificate/0270772f-3809-4400-b29b-1e1c61cd0997493876' },
  { name: 'Introduction to AI', cat: 'ai', issuer: 'Google · Coursera', year: '2024', img: 'src/cert/Google-Introduction to AI.jpg', url: 'https://coursera.org/verify/1E5HBIEAZGIW' },
  { name: 'Maximize Productivity With AI', cat: 'ai', issuer: 'Google · Coursera', year: '2024', img: 'src/cert/Google-Maximize Productivity With AI Tools.jpg', url: 'https://coursera.org/verify/S5KACMZGGWQZ' },
  { name: 'Discover Art of Prompting', cat: 'ai', issuer: 'Google · Coursera', year: '2024', img: 'src/cert/Google-Discover the Art of Prompting.jpg', url: 'https://coursera.org/verify/N3VST0K3DUVF' },
  { name: 'Use AI Responsibly', cat: 'ai', issuer: 'Google · Coursera', year: '2026', img: 'src/cert/Google-Use AI Responsibly.jpg', url: 'https://coursera.org/verify/8WJ0VVSFTEJH' },
  { name: 'Stay Ahead of AI Curve', cat: 'ai', issuer: 'Google · Coursera', year: '2026', img: 'src/cert/Google-Stay Ahead of the AI Curve.jpg', url: 'https://coursera.org/verify/43EYSAGH4N02' },

  { name: 'Machine Learning Training', cat: 'data', issuer: 'Acmegrade · IIT Bombay', year: 'Jan–Feb 2024', img: 'src/cert/AcmeGrade-ML_Training.jpg', url: 'https://drive.google.com/file/d/1bvhlAukNFCT-2Pw_8_1gSFYkj8JWpMv9/view?usp=sharing' },
  { name: 'Machine Learning Internship', cat: 'data', issuer: 'Acmegrade', year: 'Jan–Mar 2024', img: 'src/cert/AcmeGrade-ML_Internship.jpg', url: 'https://drive.google.com/file/d/1v83YeIgJ9Lvd3L1oMHdN1mMJJAh7Km76/view?usp=sharing' },
  { name: 'Python Project for Data Science', cat: 'data', issuer: 'IBM · Coursera', year: '2026', img: 'src/cert/IBM-Python Project for Data Science.jpg', url: 'https://coursera.org/verify/8W4VSBH62963' },

  { name: 'React Fundamentals', cat: 'dev', issuer: 'Meta · Coursera', year: '2026', img: 'src/cert/react-fundamentals.jpg', url: 'https://coursera.org/share/1c8b9c3e5d9e7f0b2a1e5c8d9f4a2b3c' },
  { name: 'SQL for Data Science', cat: 'dev', issuer: 'UC Davis · Coursera', year: '2026', img: 'src/cert/UCDavis-SQL for Data Science.jpg', url: 'https://coursera.org/verify/7TZJ3NFZIL98' },
  { name: 'SQL Problem Solving', cat: 'dev', issuer: 'UC Davis · Coursera', year: '2026', img: 'src/cert/UCDavis-SQL Problem Solving.jpg', url: 'https://coursera.org/verify/CQP2KZ3GHGBV' }
];

/* ================================================================
   GLOBAL STATE
================================================================ */
const TOTAL = 7;
let current   = 0;
let animating = false;
const mouse     = { x: 0, y: 0 };
const camTarget = { x: 0, y: 0 };

const screens  = [];
const navDots  = [];
const navLinks = [];

/* Section Y pan targets — one value per section */
const SEC_CAM_Y = [0, -.5, -1, -1.5, -2, -2.5, 0];


/* ================================================================
   FULLPAGE SECTION ENGINE
   Handles section transitions, nav updates, and camera panning.
================================================================ */
function initSections(setCamSection) {

  for (let i = 0; i < TOTAL; i++) screens.push(document.getElementById('s' + i));
  document.querySelectorAll('.sn-dot').forEach(d => navDots.push(d));
  document.querySelectorAll('#main-nav a').forEach(a => navLinks.push(a));

  const stickyCard = document.getElementById('sticky-card');
  const inCard     = n => n >= 1 && n <= 5;

  /* Set initial staggered transitions for slidein elements */
  screens.forEach(scr => {
    scr.querySelectorAll('.slidein-elm').forEach((el, j) => {
      el.style.transition = `transform .72s cubic-bezier(.4,0,.2,1) ${j * .09}s`;
    });
  });

  /* Show first section with perfectly timed smooth transition */
  screens[0].classList.add('show');

  // Wait 300ms so the preloader doors are exactly halfway open when the hero content glides in
  setTimeout(() => {
    screens[0].classList.add('is-visible');
  }, 300);

  updateNav(0);


  /* ── goTo(idx) ── */
  function goTo(idx) {
    if (idx < 0 || idx >= TOTAL || idx === current || animating) return;

    animating = true;
    const prev = current, dir = idx > current ? 1 : -1;
    current = idx;

    setCamSection(idx);

    if (inCard(idx) && !inCard(prev)) stickyCard.classList.add('show');

    leaveScreen(screens[prev], dir);

    setTimeout(() => {
      screens[prev].classList.remove('show', 'is-visible', 'is-leaving');
      resetScreen(screens[prev], dir);

      if (!inCard(idx) && inCard(prev)) stickyCard.classList.remove('show');

      showScreen(idx, dir);

      /* Release gate after longest possible entry animation (~1.36s) */
      setTimeout(() => { animating = false; }, 1400);
    }, 520);

    updateNav(idx);
    onSectionEnter(idx);
  }


  /* ── leaveScreen ── */
  function leaveScreen(scr, dir) {
    scr.classList.add('is-leaving');
    scr.classList.remove('is-visible');
    scr.querySelectorAll('.slidein-elm').forEach((el, j) => {
      el.style.transition = `transform .46s cubic-bezier(.4,0,.2,1) ${j * .03}s`;
      el.style.transform  = dir > 0 ? 'translateY(-110%)' : 'translateY(110%)';
    });
    if (scr.id === 's2') {
      scr.querySelectorAll('.sbf').forEach(b => {
        b.style.transition = 'none'; b.style.width = '0';
      });
    }
  

  // --- ADD THIS NEW BLOCK ---
   if (scr.id === 's5') {
      document.getElementById('col1-wrap').classList.add('cb-folded');
      document.getElementById('col2-wrap').classList.add('cb-folded');
      document.querySelector('.cb-view-col').classList.add('cb-folded');
    }
  }



  /* ── resetScreen ── */
  function resetScreen(scr, dir) {
    scr.querySelectorAll('.slidein-elm').forEach(el => {
      el.style.transition = 'none';
      el.style.transform  = dir > 0 ? 'translateY(110%)' : 'translateY(-110%)';
    });
  }


  /* ── showScreen ── */
  function showScreen(idx, dir) {
    const scr = screens[idx];
    const legacyElms = scr.querySelectorAll('.slidein-elm');
    legacyElms.forEach(el => {
      el.style.transition = 'none';
      el.style.transform  = dir === -1 ? 'translateY(-110%)' : 'translateY(110%)';
    });
    scr.classList.add('show');
    scr.classList.remove('is-leaving');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      legacyElms.forEach((el, j) => {
        el.style.transition = `transform .72s cubic-bezier(.4,0,.2,1) ${j * .08}s`;
        el.style.transform  = 'translateY(0)';
      });
      scr.classList.add('is-visible');
    }));
  }


  /* ── updateNav ── */
  function updateNav(idx) {
    navDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    const secToNav = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 4, 6: 5 };
    navLinks.forEach((a, i) => a.classList.toggle('active', i === secToNav[idx]));
  }


  /* ── onSectionEnter ── */
  function onSectionEnter(idx) {
    if (idx === 2) {
      /* Animate skill bars to their target width after a short delay */
      setTimeout(() => {
        document.querySelectorAll('.sbf').forEach(b => {
          b.style.transition = 'width 1.4s cubic-bezier(.4,0,.2,1)';
          b.style.width = b.dataset.w + '%';
        });
      }, 600);
    }
    if (idx === 5) {
      // 1. Instantly hide them the second we start moving to this section
      document.getElementById('col1-wrap').classList.add('cb-folded');
      document.getElementById('col2-wrap').classList.add('cb-folded');
      document.querySelector('.cb-view-col').classList.add('cb-folded');

      // 2. Build the DOM if it hasn't been built yet
      buildCertBrowser();

      // 3. Wait until the section is fully visible (520ms) to start unfolding
      setTimeout(() => {
        document.getElementById('col1-wrap').classList.remove('cb-folded');
        setTimeout(() => document.getElementById('col2-wrap').classList.remove('cb-folded'), 150);
        setTimeout(() => document.querySelector('.cb-view-col').classList.remove('cb-folded'), 300);
      }, 650); 
    }
  }

  /* ── Input Handlers ──
     scrollConsumed prevents inertia bleed-through on trackpads.
     Both scrollConsumed and animating must be false to navigate.
  ── */
  let scrollConsumed  = false;
  let scrollIdleTimer = null;
  const IDLE_MS = 800;

 window.addEventListener('wheel', (e) => {
    e.preventDefault();
    clearTimeout(scrollIdleTimer);
    if (!animating && !scrollConsumed) {
      scrollConsumed = true;
      goTo(current + (e.deltaY > 0 ? 1 : -1));
    }
    scrollIdleTimer = setTimeout(() => { scrollConsumed = false; }, IDLE_MS);
  }, { passive: false });

  /* Keyboard */
  window.addEventListener('keydown', (e) => {
    if (animating) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(current + 1);
    if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) goTo(current - 1);
  });

  /* ── Touch swipe for section navigation ── */
  let touchStartY = 0;
  let touchStartX = 0;
  let touchConsumed = false;
  window.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    touchConsumed = false;
  }, { passive: true });
  window.addEventListener('touchend', e => {
    if (touchConsumed || animating) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    const dx = touchStartX - e.changedTouches[0].clientX;
    /* Only navigate on vertical swipe, must exceed 55px and dominate horizontal */
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 55) {
      touchConsumed = true;
      goTo(current + (dy > 0 ? 1 : -1));
    }
  }, { passive: true });

  /* data-sec click navigation */
  document.querySelectorAll('[data-sec]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A') e.preventDefault();
      const idx = parseInt(el.dataset.sec, 10);
      if (!isNaN(idx)) {
        goTo(idx);
      }
    });
  });

}  /* end initSections */


/* ================================================================
   CERT WHEEL PICKER (S8)
   Three-column cascade: categories → cert list → preview image.
================================================================ */
let certBrowserBuilt = false;

function buildCertBrowser() {
  if (certBrowserBuilt) return;
  certBrowserBuilt = true;

  const catContainer  = document.getElementById('cb-categories');
  const listContainer = document.getElementById('cb-cert-list');
  const vLink = document.getElementById('cb-view-link');
  const vImg  = document.getElementById('cb-view-img');

  const col1Wrap = document.getElementById('col1-wrap');
  const col2Wrap = document.getElementById('col2-wrap');
  const col3Wrap = document.querySelector('.cb-view-col');

  col1Wrap.classList.add('cb-folded');
  col2Wrap.classList.add('cb-folded');
  col3Wrap.classList.add('cb-folded');

  // 1. The Stack Math Engine
  function makeStackController(container, callback) {
    let activeIndex = 0;

    function updateStack() {
      const children = Array.from(container.children);
      children.forEach((child, i) => {
        const offset = i - activeIndex;
        const absOffset = Math.abs(offset);

        const yPos    = offset * 70; 
        const scale   = Math.max(1.08 - (absOffset * 0.15), 0.6);
        const zPos    = -absOffset * 60; 
        const opacity = Math.max(1 - (absOffset * 0.35), 0);
        const blur    = absOffset * 1.5;
        const zIndex  = 100 - absOffset;

        child.style.transform = `translateY(${yPos}px) translateZ(${zPos}px) scale(${scale})`;
        child.style.opacity   = opacity;
        child.style.filter    = `blur(${blur}px)`;
        child.style.zIndex    = zIndex;
        child.style.pointerEvents = absOffset > 2 ? 'none' : 'auto';
      });
    }

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.cb-btn');
      if (btn) {
        activeIndex = Array.from(container.children).indexOf(btn);
        updateStack();
        callback(btn);
      }
    });

    return {
      reset: () => { activeIndex = 0; updateStack(); },
      update: updateStack
    };
  }

  // 2. Initial Setup
  let activeCatBtn  = null;
  let activeListBtn = null;

  const categories = [
    { id: 'ai',   label: 'AI & Prompting' },
    { id: 'data', label: 'Data Science' },
    { id: 'dev',  label: 'SQL & Dev Tools' }
  ];

  categories.forEach(cat => {
    const btn = document.createElement('div');
    btn.className   = 'cb-btn cb-cat-btn';
    btn.dataset.id  = cat.id;
    btn.textContent = cat.label;
    catContainer.appendChild(btn);
  });

  // 3. Define the controllers
  const catController = makeStackController(catContainer, selectCategory);
  const listController = makeStackController(listContainer, selectCert);

  // 4. Click Handlers
  function selectCategory(btn) {
    if (activeCatBtn === btn) return;

    if (activeCatBtn) activeCatBtn.classList.remove('active');
    btn.classList.add('active');
    activeCatBtn = btn;

    col2Wrap.classList.add('cb-folded');
    col3Wrap.classList.add('cb-folded');

    setTimeout(() => {
      listContainer.innerHTML = '';
      const filtered = CERTS.filter(c => c.cat === btn.dataset.id);

      filtered.forEach(cert => {
        const lBtn = document.createElement('div');
        lBtn.className = 'cb-btn cb-list-btn';
        lBtn.innerHTML = `<h5>${cert.name}</h5><span>${cert.issuer} &bull; ${cert.year}</span>`;
        lBtn.certData = cert;
        listContainer.appendChild(lBtn);
      });

      col2Wrap.classList.remove('cb-folded');

      if (listContainer.children.length > 0) {
        activeListBtn = null;
        listController.reset(); 
        selectCert(listContainer.children[0]);
      }
    }, 350);
  }

  function selectCert(btn) {
    if (activeListBtn === btn) return;

    if (activeListBtn) activeListBtn.classList.remove('active');
    btn.classList.add('active');
    activeListBtn = btn;

    col3Wrap.classList.add('cb-folded');

    setTimeout(() => {
       vImg.src = btn.certData.img;
       // Grabs the new URL you added. If you forgot to add one, it safely falls back to the image!
       vLink.href = btn.certData.url || btn.certData.img; 
       col3Wrap.classList.remove('cb-folded');
    }, 600);
  }

  // 5. Silent Boot Setup (No animations)
  if (catContainer.children.length > 0) {
    activeCatBtn = catContainer.children[0];
    activeCatBtn.classList.add('active');

    // Populate the middle list instantly
    const filtered = CERTS.filter(c => c.cat === activeCatBtn.dataset.id);
    filtered.forEach(cert => {
      const lBtn = document.createElement('div');
      lBtn.className = 'cb-btn cb-list-btn';
      lBtn.innerHTML = `<h5>${cert.name}</h5><span>${cert.issuer} &bull; ${cert.year}</span>`;
      lBtn.certData = cert;
      listContainer.appendChild(lBtn);
    });

    // Populate the image instantly
    if (listContainer.children.length > 0) {
      activeListBtn = listContainer.children[0];
      activeListBtn.classList.add('active');
      vImg.src = activeListBtn.certData.img;
      vLink.href = activeListBtn.certData.img;
    }

    // Lock them into position
    catController.reset();
    listController.reset();
  }
}


/* ================================================================
   TYPEWRITER EFFECT (HERO ROLE)
================================================================ */
function initTypewriter() {
  const el = document.querySelector('.hero-role');
  if (!el) return;

  // The titles you want to loop through!
  const roles = [
    "AI / ML Engineer",
    "Data Scientist",
    "Prompt Engineer",
    "Web Developer"
  ];
  
  let roleIndex = 0;
  let charIndex = roles[0].length; // Start with the first word fully typed out
  let isDeleting = true; // Start by deleting the hardcoded HTML text

  function type() {
    const currentText = roles[roleIndex];
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    // Keep the "// " static, dynamically type the role, and add the cursor
    el.innerHTML = `// ${currentText.substring(0, charIndex)}<span class="tw-cursor">|</span>`;

    // Speed settings
    let typeSpeed = isDeleting ? 40 : 90; // 40ms deleting, 90ms typing

    if (!isDeleting && charIndex === currentText.length) {
      // Finished typing a word — pause before deleting
      typeSpeed = 2500; 
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting a word — switch to next word and pause before typing
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; 
    }

    setTimeout(type, typeSpeed);
  }

  // Wait 2.5 seconds for the initial page load/slide-in animation to finish before starting the effect
  setTimeout(type, 2500); 
}


/* ================================================================
   BOOT SEQUENCE
================================================================ */
function boot() {
  shared.initMouse(mouse);
  shared.initCursor();
  shared.initHamburger();
  const three = shared.initThree(mouse, camTarget, SEC_CAM_Y);

  shared.runPreloader(() => {
    three.triggerEntrance();
    document.getElementById('hdr').classList.add('show');
    document.getElementById('scroll-nav').classList.add('show');
    initSections(three.setCamSection);
    // Start the typewriter here!
    initTypewriter();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}



})();
