/* ================================================================
   PROJECTS.JS — Om Balaji Varpe · Projects Page
   ────────────────────────────────────────────────────────────────
   4 fullpage sections (P0–P3):
     P0  Hero          — full-screen, outside sticky card
     P1  Data Alchemy  — sticky card, timeline layout
     P2  Deploy Alchemy — sticky card, timeline layout
     P3  Coming Soon   — full-screen, outside sticky card

   Shared utilities (Three.js, preloader, mouse, cursor) are
   imported from shared.js via window.PortfolioShared.

   To add a new project:
     1. Copy a <section> block (p1 or p2) inside #sticky-card in projects.html
     2. Give it the next id (p3, p4 …)
     3. Add a nav dot in the #scroll-nav list
     4. Increment TOTAL below
     5. Add the matching Y pan value to SEC_CAM_Y
     6. Update inCard's upper bound to match the new last card section
================================================================ */
(function () {
'use strict';

const shared = window.PortfolioShared;


/* ================================================================
   GLOBAL STATE
================================================================ */
const TOTAL = 4;           /* P0, P1, P2, P3 */
let current   = 0;
let animating = false;
const mouse     = { x: 0, y: 0 };
const camTarget = { x: 0, y: 0 };

const screens  = [];
const navDots  = [];
const navLinks = [];

/* Section Y pan — one value per section */
const SEC_CAM_Y = [0, -.5, -1, 0];


/* ================================================================
   FULLPAGE SECTION ENGINE
   Mirrors site.js exactly. Section IDs are p0–p3.
   inCard covers P1–P2 (the sticky-card sections).
================================================================ */
function initSections(setCamSection) {

  for (let i = 0; i < TOTAL; i++) screens.push(document.getElementById('p' + i));
  document.querySelectorAll('.sn-dot').forEach(d => navDots.push(d));
  document.querySelectorAll('#main-nav a').forEach(a => navLinks.push(a));

  const stickyCard = document.getElementById('sticky-card');
  const inCard = n => n >= 1 && n <= 2;

  /* Set initial staggered slide-in transitions */
  screens.forEach(scr => {
    scr.querySelectorAll('.slidein-elm').forEach((el, j) => {
      el.style.transition = `transform .72s cubic-bezier(.4,0,.2,1) ${j * .09}s`;
    });
  });

  /* Show first section with perfectly timed smooth transition */
  screens[0].classList.add('show');

  screens[0].querySelectorAll('.slidein-elm').forEach(el => {
    el.style.transition = 'none';
    el.style.transform  = 'translateY(110%)';
  });

  setTimeout(() => {
    screens[0].querySelectorAll('.slidein-elm').forEach((el, j) => {
      el.style.transition = `transform .72s cubic-bezier(.4,0,.2,1) ${j * .08}s`;
      el.style.transform  = 'translateY(0)';
    });
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

      setTimeout(() => { animating = false; }, 1400);
    }, 520);

    updateNav(idx);
  }


  /* ── leaveScreen ── */
  function leaveScreen(scr, dir) {
    scr.classList.add('is-leaving');
    scr.classList.remove('is-visible');
    scr.querySelectorAll('.slidein-elm').forEach((el, j) => {
      el.style.transition = `transform .46s cubic-bezier(.4,0,.2,1) ${j * .03}s`;
      el.style.transform  = dir > 0 ? 'translateY(-110%)' : 'translateY(110%)';
    });
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


  /* ── updateNav ──
     All nav dots map 1:1 to sections.
     The "Projects" link (index 3 in the header nav) stays active always.
  ── */
  function updateNav(idx) {
    navDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    // navLinks.forEach((a, i) => a.classList.toggle('active', i === 3));
  }


  /* ── Input Handlers ── */
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
   BOOT SEQUENCE
================================================================ */
function boot() {
  shared.initMouse(mouse);
  shared.initCursor();
  shared.initHamburger();
  const three = shared.initThree(mouse, camTarget, SEC_CAM_Y);

  document.querySelectorAll('.bm-video-wrap video').forEach(vid => {
    vid.playbackRate = 0.75;
  });

  shared.runPreloader(() => {
    three.triggerEntrance();
    document.getElementById('hdr').classList.add('show');
    document.getElementById('scroll-nav').classList.add('show');
    initSections(three.setCamSection);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})();
