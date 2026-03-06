/**
 * intro.js — Terminal → Galaxy → OM Assembly → Shatter → Portfolio Reveal
 */
(function () {

/* ══════════════════════════════════════════════
   TERMINAL
══════════════════════════════════════════════ */
const LINES = [
  "> om@ai-core:~$ sys_boot --ai-core",
  "> om@ai-core:~$ sys_boot --mode=quantum",
  "[*] INITIALIZING NEURAL ENVIRONMENT...OK",
  "[*] ALLOCATING MEMORY BLOCKS...OK",
  "[*] IMPORTING DATASETS [████████████████████] 100%",
  "[*] EXECUTE SCANNER PROTOCOL ...OK",
  "[*] LOAD VISUAL RENDERING ENGINE...OK",
  ">>> ROOT ACCESS GRANTED.....",
];
let tL = 0, tC = 0;
const tCont = document.getElementById('term-content');

function typeT() {
  if (tL < LINES.length) {
    if (tC === 0) {
      const p = document.createElement('div');
      p.className = 'term-line';
      if (tL === LINES.length - 1) p.classList.add('success');
      p.id = 'tl' + tL;
      tCont.appendChild(p);
    }
    const el = document.getElementById('tl' + tL);
    if (tC < LINES[tL].length) {
      el.textContent += LINES[tL][tC++];
      setTimeout(typeT, Math.random() * 16 + 7);
    } else {
      tL++; tC = 0;
      setTimeout(typeT, 160);
    }
  } else {
    setTimeout(() => {
      const tp = document.getElementById('terminal-phase');
      tp.style.opacity = '0';
      setTimeout(() => { tp.style.display = 'none'; startGalaxy(); }, 600);
    }, 500);
  }
}

/* ══════════════════════════════════════════════
   CANVAS + SIZING
══════════════════════════════════════════════ */
const canvas = document.getElementById('gc');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let W, H;

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

let appState = 'galaxy';

function LR()   { return Math.min(W, H) * .285; }
function LCX()  { return W / 2; }
function LCY()  { return H / 2; }
function OM_CY(){ return H / 2; }

/* ══════════════════════════════════════════════
   STAR FIELD
══════════════════════════════════════════════ */
const SCOLS = ['#ffffff','#d4eaff','#a8c8ff','#c8b4ff','#e0f8ff','#80c8ff'];
const stars = [];

class Star {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : -5;
    this.r  = Math.random() * .9 + .12;
    this.c  = SCOLS[Math.floor(Math.random() * SCOLS.length)];
    this.bA = Math.random() * .7 + .1;
    this.a  = this.bA;
    this.sp = Math.random() * .022 + .003;
    this.ph = Math.random() * Math.PI * 2;
  }
  update() { this.ph += this.sp; this.a = this.bA * (.45 + .55 * Math.sin(this.ph)); }
  draw() {
    ctx.globalAlpha = this.a; ctx.fillStyle = this.c;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
}
for (let i = 0; i < 900; i++) stars.push(new Star());

function drawNebula() {
  let g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.min(W,H)*.4);
  g.addColorStop(0,  'rgba(70,15,120,.06)');
  g.addColorStop(.6, 'rgba(30,5,70,.03)');
  g.addColorStop(1,  'transparent');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  let g2 = ctx.createRadialGradient(W*.35, H*.55, 0, W*.35, H*.55, Math.min(W,H)*.28);
  g2.addColorStop(0, 'rgba(0,50,150,.05)');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

/* ══════════════════════════════════════════════
   PARTICLES — sharp star-dust
══════════════════════════════════════════════ */
const PCOLS = [
  '#e8f4ff','#b8d8ff','#90b8f0','#ccc8ff',
  '#a898e8','#ffffff','#c8e0ff','#98c0f8','#d8e8ff','#b0c8f8'
];
let particles = [];
let scanY = 0, scanProg = 0, scanStart = 0;
const SCAN_DUR = 2400;

class Particle {
  constructor(tx, ty) {
    const e = Math.floor(Math.random() * 4);
    if      (e === 0) { this.x = Math.random() * W; this.y = -8; }
    else if (e === 1) { this.x = W + 8; this.y = Math.random() * H; }
    else if (e === 2) { this.x = Math.random() * W; this.y = H + 8; }
    else              { this.x = -8; this.y = Math.random() * H; }
    this.tx = tx; this.ty = ty;
    this.vx = (Math.random() - .5) * .7;
    this.vy = (Math.random() - .5) * .7;
    this.r  = Math.random() * .75 + .15;
    this.c  = PCOLS[Math.floor(Math.random() * PCOLS.length)];
    this.scanned  = false;
    this.alpha    = 0;
    this.ph       = Math.random() * Math.PI * 2;
    this.assembled = false;
    this.svx = 0; this.svy = 0; this.sGravity = 0;
  }
  update() {
    this.ph += .05;
    if (!this.scanned && this.y < scanY) this.scanned = true;

    if (this.scanned && appState === 'scanning') {
      this.alpha = Math.min(this.alpha + .025, .6);
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;

    } else if (appState === 'assembling' || appState === 'complete') {
      this.alpha = Math.min(this.alpha + .055, 1);
      const dx = this.tx - this.x, dy = this.ty - this.y;
      if (Math.sqrt(dx*dx + dy*dy) < .8) {
        this.assembled = true;
        if (appState === 'complete') {
          this.x += Math.sin(this.ph) * .3;
          this.y += Math.cos(this.ph * .8) * .3;
        }
      } else {
        this.vx = dx * .1; this.vy = dy * .1;
        this.x += this.vx; this.y += this.vy;
      }

    } else if (appState === 'shattering') {
      this.x   += this.svx; this.y += this.svy;
      this.svy += this.sGravity;
      this.svx *= 0.98;
      this.alpha = Math.max(0, this.alpha - 0.018);
    }
  }
  draw() {
    if (this.alpha <= 0) return;
    const tw = .75 + .25 * Math.sin(this.ph);
    ctx.globalAlpha = this.alpha * tw;
    ctx.fillStyle = this.c;
    if (this.assembled && appState === 'complete') {
      ctx.shadowColor = this.c; ctx.shadowBlur = 2;
    }
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  }
}

function buildParticles() {
  const off = document.createElement('canvas');
  const oc  = off.getContext('2d');
  off.width = W; off.height = H;
  const fz = Math.min(W * .19, 200);
  oc.fillStyle = '#fff';
  oc.font = `900 ${fz}px Orbitron, sans-serif`;
  oc.textAlign = 'center'; oc.textBaseline = 'middle';
  oc.fillText('OM', LCX(), OM_CY());
  const d = oc.getImageData(0, 0, W, H).data;
  particles = [];
  const step = 2;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (d[(y * W + x) * 4 + 3] > 128) {
        particles.push(new Particle(
          x + (Math.random() - .5) * 2,
          y + (Math.random() - .5) * 2
        ));
      }
    }
  }
}

/* ══════════════════════════════════════════════
   SEGMENTED LOADER
══════════════════════════════════════════════ */
const SEG_N = 20, SEG_GAP = 6;
const SEG_ARC = (360 / SEG_N) - SEG_GAP;
let segLit    = new Array(SEG_N).fill(false);
let segBright = new Array(SEG_N).fill(0);
let loaderActive = false;
let loaderDone   = false;   // ✅ guard: shatter only after ALL segments lit
let shatterFlash = 0;
const statusEl = document.getElementById('status-lbl');

function startLoader() {
  loaderActive = true;
  statusEl.classList.add('show');
  statusEl.textContent = 'LOADING…';
  let s = 0;

  const iv = setInterval(() => {
    if (s < SEG_N) {
      segLit[s] = true; segBright[s] = 2.5;
      const pct = Math.round((++s / SEG_N) * 100);
      statusEl.textContent = `LOADING  ${String(s).padStart(2,'0')} / ${SEG_N}  [ ${pct}% ]`;
    } else {
      clearInterval(iv);
      loaderDone = true;   // ✅ mark complete before any shatter logic
      statusEl.textContent = 'SYSTEM READY ✦';
      statusEl.style.color = '#00ffcc';
      statusEl.style.textShadow = '0 0 14px rgba(0,255,204,.7)';
      document.getElementById('info-block').classList.add('show');
      appState = 'complete';

      setTimeout(() => {
        if (!loaderDone) return;  // safety: never shatter early
        appState = 'shattering';
        shatterFlash = 1.0;

        const ib = document.getElementById('info-block');
        ib.style.transition = 'opacity 0.6s ease';
        ib.style.opacity = '0';

        const cx = LCX(), cy = LCY();
        particles.forEach(p => {
          const dx = p.x - cx, dy = p.y - cy;
          const angle = Math.atan2(dy, dx);
          const speed = (2.5 + Math.random() * 6) * (1 + Math.random());
          p.svx = Math.cos(angle) * speed + (Math.random() - .5) * 3;
          p.svy = Math.sin(angle) * speed + (Math.random() - .5) * 3;
          p.sGravity = Math.random() * .12 + .04;
          p.alpha = 1;
        });

        // Fade out intro then reveal portfolio
        setTimeout(() => {
          document.getElementById('intro-wrapper').classList.add('fade-out');
          setTimeout(() => {
            document.getElementById('intro-wrapper').style.display = 'none';
            const mainEl = document.getElementById('main-content');
            if (mainEl) mainEl.classList.add('visible');
            if (typeof initMain === 'function') initMain();
          }, 2000);
        }, 1600);

      }, 2200);
    }
  }, 210);
}

function drawLoader() {
  const cx = LCX(), cy = LCY(), r = LR();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(157,78,221,.06)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(157,78,221,.08)'; ctx.lineWidth = .6; ctx.stroke();

  for (let i = 0; i < SEG_N; i++) {
    const sd = -90 + i * (360 / SEG_N) + SEG_GAP / 2;
    const ed = sd + SEG_ARC;
    const sr = (sd * Math.PI) / 180, er = (ed * Math.PI) / 180;
    ctx.beginPath(); ctx.arc(cx, cy, r, sr, er);
    if (segLit[i]) {
      if (segBright[i] > 1) segBright[i] -= .022;
      const pop = segBright[i] > 1.4;
      ctx.strokeStyle = pop
        ? `rgba(255,255,255,${Math.min(segBright[i] - .3, .98)})`
        : `rgba(199,125,255,${Math.min(segBright[i], .95)})`;
      ctx.lineWidth   = pop ? 7 : 4.5;
      ctx.shadowColor = pop ? '#ffffff' : '#c77dff';
      ctx.shadowBlur  = pop ? 40 : 18;
    } else {
      ctx.strokeStyle = 'rgba(157,78,221,.10)'; ctx.lineWidth = 2.2; ctx.shadowBlur = 0;
    }
    ctx.lineCap = 'round'; ctx.stroke(); ctx.shadowBlur = 0;
  }
}

/* ══════════════════════════════════════════════
   MAIN LOOP
══════════════════════════════════════════════ */
function loop(now) {
  const trailAlpha = appState === 'shattering' ? 0.15 : 0.93;
  ctx.fillStyle = `rgba(0,0,5,${trailAlpha})`;
  ctx.fillRect(0, 0, W, H);
  drawNebula();
  stars.forEach(s => { s.update(); s.draw(); });

  if (appState === 'scanning') {
    scanProg = Math.min((now - scanStart) / SCAN_DUR, 1);
    scanY = scanProg * H;
    document.getElementById('scanner-line').style.top = scanY + 'px';
    const tr = ctx.createLinearGradient(0, Math.max(0, scanY - 70), 0, scanY);
    tr.addColorStop(0, 'transparent');
    tr.addColorStop(1, 'rgba(0,212,255,.04)');
    ctx.fillStyle = tr; ctx.fillRect(0, Math.max(0, scanY - 70), W, 70);
  }

  particles.forEach(p => { p.update(); p.draw(); });

  if (appState === 'shattering' && shatterFlash > 0) {
    shatterFlash = Math.max(0, shatterFlash - .035);
    const cx = LCX(), cy = LCY(), r = LR();
    ctx.beginPath();
    ctx.arc(cx, cy, r * (1 + (1 - shatterFlash) * .4), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${shatterFlash * .9})`;
    ctx.lineWidth = shatterFlash * 18;
    ctx.shadowColor = '#ffffff'; ctx.shadowBlur = shatterFlash * 60;
    ctx.stroke(); ctx.shadowBlur = 0;
  }

  if (loaderActive && appState !== 'shattering') drawLoader();
  requestAnimationFrame(loop);
}

/* ══════════════════════════════════════════════
   GALAXY ENTRY
══════════════════════════════════════════════ */
function startGalaxy() {
  document.getElementById('canvas-phase').style.opacity = '1';

  // ✅ Wait for Orbitron font before sampling OM pixels — this was the shatter bug
  document.fonts.load('900 100px Orbitron').then(() => {
    buildParticles();
  }).catch(() => {
    // Fallback: try anyway after small delay
    setTimeout(buildParticles, 400);
  });

  function positionInfo() {
    const ib = document.getElementById('info-block');
    ib.style.top    = (LCY() + LR() + 20) + 'px';
    ib.style.bottom = 'auto';
  }
  positionInfo();
  window.addEventListener('resize', positionInfo);

  setTimeout(() => {
    ['h-tl','h-tr','h-bl','h-br'].forEach(id => document.getElementById(id).classList.add('show'));
    ['b-tl','b-tr','b-bl','b-br'].forEach(id => document.getElementById(id).classList.add('show'));
  }, 700);

  setTimeout(() => document.getElementById('gr-wrap').classList.add('show'), 900);

  setTimeout(() => {
    appState = 'scanning';
    scanStart = performance.now();
    document.getElementById('scanner-line').style.opacity = '1';
  }, 1300);

  const ASSEMBLE = 1300 + SCAN_DUR + 180;
  setTimeout(() => {
    document.getElementById('scanner-line').style.opacity = '0';
    appState = 'assembling';
  }, ASSEMBLE);

  setTimeout(() => startLoader(), ASSEMBLE + 2700);

  requestAnimationFrame(loop);
}

/* ── Kick off ── */
setTimeout(typeT, 500);

})();
