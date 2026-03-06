/**
 * main.js — All post-intro site interactions
 * Called by intro.js via initMain() once loading screen dismisses
 *
 * FIXES applied:
 * - duplicateCertTracks(): clones cert items so JS-doubled content enables
 *   the CSS translateX(0→-50%) seamless loop without gaps.
 * - Particle network: capped connection distance at 80px on mobile,
 *   and skips line drawing on very small screens for smoother frame rate.
 * - Mobile cursor: properly hidden with body cursor:auto fallback.
 */

/* ── Cert track duplication ──────────────────────────────────────────
   This MUST run before initMain so the tracks are ready when animated.
   Each .cert-track has its children cloned and appended. CSS animates
   translateX(0 → -50%) which, with doubled content, creates a seamless
   infinite scroll — no gaps, no jumps.
   Clones get aria-hidden="true" so screen readers skip duplicates.
────────────────────────────────────────────────────────────────────── */
(function duplicateCertTracks() {
  document.querySelectorAll('.cert-track').forEach(function(track) {
    var originals = Array.from(track.children);
    originals.forEach(function(item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      // Remove IDs from clones to avoid duplicate IDs in DOM
      clone.querySelectorAll('[id]').forEach(function(el) { el.removeAttribute('id'); });
      track.appendChild(clone);
    });
  });
})();


function initMain() {

  /* ── Custom cursor (desktop only) ── */
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (!isTouchDevice) {
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a,button,.journey-card,.cert-img-card,.skill-tag,.stat-card,.edu-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '18px'; cursor.style.height = '18px';
        ring.style.width    = '58px'; ring.style.height   = '58px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '12px'; cursor.style.height = '12px';
        ring.style.width    = '40px'; ring.style.height   = '40px';
      });
    });
  } else {
    /* Mobile: hide custom cursor elements and restore native cursor */
    const c = document.getElementById('cursor');
    const r = document.getElementById('cursorRing');
    if (c) c.style.display = 'none';
    if (r) r.style.display = 'none';
    document.body.style.cursor = 'auto';
    /* Restore pointer cursor on interactive elements for touch */
    document.querySelectorAll('a,button,.journey-card,.cert-img-card,.contact-link').forEach(el => {
      el.style.cursor = 'pointer';
    });
  }

  /* ── Background particle network ── */
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* FIX: reduced connection distance on mobile for better frame rate */
  const isMobile    = window.innerWidth < 600;
  const isTablet    = window.innerWidth < 900;
  const ptCount     = isMobile ? 45 : (isTablet ? 75 : 110);
  const connectDist = isMobile ? 0  : (isTablet ? 70 : 90); // 0 = skip lines on mobile

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.4 + .4;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.a  = Math.random() * .5 + .1;
      this.c  = `hsl(${260 + Math.random() * 55},80%,${50 + Math.random() * 30}%)`;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle   = this.c;
      ctx.globalAlpha = this.a;
      ctx.fill();
    }
  }

  for (let i = 0; i < ptCount; i++) pts.push(new P());

  (function anim() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    pts.forEach(p => { p.update(); p.draw(); });

    /* FIX: skip O(n²) line drawing on mobile entirely */
    if (connectDist > 0) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          const cd = connectDist * connectDist;
          if (d2 < cd) {
            /* Use d² comparison to avoid sqrt for performance */
            const d = Math.sqrt(d2);
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(168,85,247,${.08 * (1 - d / connectDist)})`;
            ctx.globalAlpha = 1;
            ctx.lineWidth   = .5;
            ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(anim);
  })();

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        /* Animate skill bars when their container scrolls into view */
        e.target.querySelectorAll('.sb-fill[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(r => io.observe(r));

  /* ── Journey items reveal ── */
  const jio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: .15 });
  document.querySelectorAll('.journey-item').forEach(item => jio.observe(item));

  /* ── Journey cursor moves with scroll ── */
  const jCursor = document.querySelector('.journey-cursor');
  const jBody   = document.querySelector('.journey-body');
  if (jCursor && jBody) {
    window.addEventListener('scroll', () => {
      const rect = jBody.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const pct = Math.max(0, Math.min(1, (window.innerHeight / 2 - rect.top) / rect.height));
        jCursor.style.top = `calc(${pct * 100}% - 18px)`;
      }
    }, { passive: true });
  }

  /* ── Typewriter ── */
  const roles  = ['Data Scientist', 'AI/ML Engineer', 'Prompt Engineer', 'Data Analyst'];
  let ri = 0, ci = 0, del = false;
  const roleEl = document.getElementById('typed-role');

  function type() {
    const cur = roles[ri];
    if (!del) {
      roleEl.textContent = cur.slice(0, ci + 1); ci++;
      if (ci === cur.length) {
        setTimeout(() => { del = true; }, 1800);
        setTimeout(type, 100);
        return;
      }
    } else {
      roleEl.textContent = cur.slice(0, ci - 1); ci--;
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, del ? 50 : 95);
  }
  type();

} /* end initMain */

/* ── Mobile menu ── */
document.getElementById('menuOpen').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('menuClose').addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Smooth scroll for all anchor nav links ─────────────────────────
   Intercepts every <a href="#section"> click (both desktop nav and
   mobile menu), cancels the default jump, and uses a custom eased
   JS scroll so it always animates smoothly regardless of browser
   scroll-behavior support or fixed-nav offset quirks.
   Duration: 900ms with an ease-in-out-cubic easing curve.
──────────────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_H = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '70'
  );
  const DURATION = 900; // ms

  /* Ease-in-out cubic — feels natural, not mechanical */
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY) {
    const startY = window.scrollY;
    const diff   = targetY - startY;
    if (Math.abs(diff) < 2) return; // already there

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const ease     = easeInOutCubic(progress);

      window.scrollTo(0, startY + diff * ease);

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Attach to every internal anchor link */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      /* Close mobile menu first (if open) */
      closeMobileMenu();

      /* Calculate target position accounting for fixed nav */
      const rect    = target.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - NAV_H;

      smoothScrollTo(Math.max(0, targetY));
    });
  });
})();
