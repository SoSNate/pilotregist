# אתר תדמית מאוחד לחשבונאוטיקה Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current collection of disjointed dark/neon landing pages with one coherent multi-page brand site (home/vision, teacher, parent, guides) sharing a new "engineered spacecraft" visual system (gravity-well grid, glassmorphism, ambient parallax solar system).

**Architecture:** Static multi-page HTML site (no build step, no framework — matches existing repo conventions). One shared CSS/JS foundation (`assets/site.css`, `assets/starfield.js`, `assets/solar-system.js`) is built first and visually verified in isolation, then each page is built on top of it and manually verified in-browser via the `run` skill before moving to the next. Existing Apps Script lead-capture endpoint is reused unchanged; only the client-side payload shape changes per page.

**Tech Stack:** Plain HTML5, Tailwind CSS (CDN, matches existing pages), vanilla JS (Canvas 2D for the gravity-grid effect, CSS animations for the solar system), Google Fonts (Space Grotesk + Heebo), existing Google Apps Script Web App for form submission.

**Spec:** `docs/superpowers/specs/2026-08-19-unified-brand-site-design.md`

## Global Constraints

- RTL Hebrew (`dir="rtl"`, `lang="he"`) on every page.
- Visual system: dark deep-space base (`#030508`–`#0A0E16`), accent blue `#8AB4FF`, accent purple/indigo `#9D8BFF`, optional turquoise/orange-flame accent per page. No neon/glow "app" aesthetic — engineered/technical feel.
- Fonts: `Space Grotesk` (headings/numbers), `Heebo` (Hebrew body text).
- All animation must be slow/subtle (low opacity, low speed) — must not distract from content or block readability.
- Every page is a standalone `.html` file (true multi-page site, no SPA routing).
- The ambient solar-system background shifts position/angle/scale between pages to feel like one continuous journey (not a hard reset).
- Pricing content is a placeholder ("מחירון בקרוב" / structured placeholder card) until the user supplies real numbers — do not invent prices.
- Lead-capture form payload keeps the existing field names the current Apps Script (`script.gs`) already reads: `name`, `phone`, `email`, `studentsCount`, plus a new `role` field (`teacher` / `parent` / `institution`) so leads are distinguishable in the sheet — this matches the pattern already used in current `index.html`'s `handleFormSubmit`.
- Google Apps Script Web App URL (existing, do not change): `https://script.google.com/macros/s/AKfycbzrRFJIYBSiXXGhR_jwbTfeTlGVRhH1YMuV8IwPWmSz36Wtv9CI4ydPnD8_VWQB9L8s/exec`
- Live system entry URLs (existing, do not change): teacher → `https://aritmetica.nt-school.app/teacher`, parent → `https://aritmetica.nt-school.app`.
- Media assets already exist in repo root and keep their current filenames (Hebrew filenames with spaces, e.g. `דשבורד 1 .gif`) — do not rename them, reference them as-is.

---

## File Structure

```
assets/
  site.css              — shared design tokens, glass panel styles, typography, gravity-grid canvas container styles
  gravity-grid.js        — reusable canvas gravity-well grid renderer (perspective grid + warping mass + orbiting bodies)
  solar-system.js         — reusable ambient background solar system (CSS-driven orbits + scroll parallax), parameterized per-page position/scale/angle
  gallery.js              — reusable auto-advancing media carousel + mobile-friendly lightbox
  lead-form.js            — shared form validation + Apps Script submission logic (role-aware)
index.html                 — Home / Vision page (rebuilt)
teacher.html                — Teacher offering + pricing page (new)
parent.html                  — Parent offering + pricing page (new)
guide-teacher.html            — Short simplified teacher onboarding guide (new)
guide-parent.html              — Short simplified parent onboarding guide (new)
```

Existing `tutors.html`, `guides/`, `שיווק הולד/` are left untouched by this plan (out of scope — superseded content, not deleted here per user instruction only to build the new site).

---

## Task 1: Shared design tokens and glass panel CSS

**Files:**
- Create: `assets/site.css`
- Test: manual visual check via a scratch HTML file (deleted at end of task)

**Interfaces:**
- Produces: CSS custom properties `--bg-deep`, `--bg-panel`, `--accent-blue`, `--accent-indigo`, `--accent-turquoise`, `--accent-flame`, `--text-primary`, `--text-muted`; utility classes `.glass-panel`, `.glass-btn`, `.glass-btn-primary`, `.text-gradient`, `.label-tag`; font-face imports for Space Grotesk + Heebo via Google Fonts `<link>` (documented in file header comment since CSS can't add `<link>` tags — actual pages add the `<link>` in `<head>`).

- [ ] **Step 1: Create `assets/site.css` with tokens and base styles**

```css
/*
  Shared design tokens for the חשבונאוטיקה brand site.
  Pages must include in <head>, BEFORE this file:
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
*/

:root {
  --bg-deep: #030508;
  --bg-deep-2: #0A0E16;
  --bg-panel: rgba(255, 255, 255, 0.05);
  --border-panel: rgba(255, 255, 255, 0.12);
  --accent-blue: #8AB4FF;
  --accent-indigo: #9D8BFF;
  --accent-turquoise: #5EEAD4;
  --accent-flame: #FF6B4A;
  --text-primary: #EAF0FA;
  --text-muted: rgba(234, 240, 250, 0.7);
}

* { box-sizing: border-box; }

body {
  background-color: var(--bg-deep);
  color: var(--text-primary);
  font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
  margin: 0;
}

.font-space { font-family: 'Space Grotesk', 'Heebo', sans-serif; }

.glass-panel {
  background: var(--bg-panel);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-panel);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  transition: all 0.3s ease;
}

.glass-panel:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}

.glass-btn {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--text-primary);
  padding: 12px 26px;
  border-radius: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
  cursor: pointer;
  text-decoration: none;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.11);
  border-color: rgba(138, 180, 255, 0.45);
  box-shadow: 0 0 20px rgba(138, 180, 255, 0.2);
  transform: translateY(-1px);
}

.glass-btn-primary {
  background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-indigo) 100%);
  color: var(--bg-deep);
  border: none;
  box-shadow: 0 0 20px rgba(138, 180, 255, 0.3);
}

.glass-btn-primary:hover {
  box-shadow: 0 0 30px rgba(138, 180, 255, 0.5);
  transform: translateY(-1px);
}

.text-gradient {
  background: linear-gradient(135deg, #FFFFFF 0%, var(--accent-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.label-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.03em;
}
```

- [ ] **Step 2: Verify visually with a throwaway test file**

Create `assets/_tmp-test.html`:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="site.css">
</head><body style="padding:40px;">
<div class="glass-panel" style="padding:24px; max-width:400px;">
  <span class="label-tag" style="background:rgba(138,180,255,0.15); color:var(--accent-blue);">✨ בדיקה</span>
  <h1 class="font-space text-gradient" style="font-size:32px;">כותרת בדיקה</h1>
  <p style="color:var(--text-muted);">טקסט גוף בעברית עם Heebo</p>
  <a href="#" class="glass-btn glass-btn-primary">כפתור ראשי</a>
  <a href="#" class="glass-btn">כפתור משני</a>
</div>
</body></html>
```

Open `assets/_tmp-test.html` directly in a browser (double-click or `file://` path). Confirm: dark background, glass panel with blur/border visible, Hebrew RTL text renders correctly in Heebo, heading uses Space Grotesk with blue gradient, both buttons render with correct styling and hover states.

- [ ] **Step 3: Delete the throwaway test file**

```bash
rm "assets/_tmp-test.html"
```

- [ ] **Step 4: Commit**

```bash
git add assets/site.css
git commit -m "Add shared design tokens and glass panel styles for brand site"
```

---

## Task 2: Gravity-well grid canvas renderer

**Files:**
- Create: `assets/gravity-grid.js`
- Test: manual visual check via scratch HTML file

**Interfaces:**
- Consumes: a `<canvas>` element and a config object.
- Produces: global function `initGravityGrid(canvasEl, options)` where `options = { massX: 0-1, massY: 0-1, massRadiusRatio: number, lineColor: string, lineOpacity: number, orbitColors: string[] }` (all optional, sensible defaults). Returns nothing; starts its own `requestAnimationFrame` loop and attaches a `resize` listener scoped to that canvas's parent element.

- [ ] **Step 1: Create `assets/gravity-grid.js`**

```javascript
/**
 * Renders a perspective floor-grid that warps around a glowing "mass" in
 * the corner, with small bodies slowly orbiting it. Purely decorative
 * background effect — must stay subtle (low opacity, slow motion).
 *
 * Usage:
 *   <canvas id="gridCanvas"></canvas>
 *   <script src="assets/gravity-grid.js"></script>
 *   <script>initGravityGrid(document.getElementById('gridCanvas'));</script>
 */
function initGravityGrid(canvasEl, options) {
  options = options || {};
  const massXRatio = options.massX !== undefined ? options.massX : 0.74;
  const massYRatio = options.massY !== undefined ? options.massY : 0.62;
  const massRadiusRatio = options.massRadiusRatio !== undefined ? options.massRadiusRatio : 0.11;
  const lineColor = options.lineColor || '138,180,255';
  const lineOpacity = options.lineOpacity !== undefined ? options.lineOpacity : 0.35;
  const orbitColors = options.orbitColors || ['#8AB4FF', '#5EEAD4', '#FBBF24'];

  const ctx = canvasEl.getContext('2d');
  let w = 900, h = 480, t = 0;

  function resize() {
    const wrap = canvasEl.parentElement;
    w = wrap.clientWidth || 900;
    h = wrap.clientHeight || 480;
    const dpr = window.devicePixelRatio || 1;
    canvasEl.width = Math.max(w, 300) * dpr;
    canvasEl.height = Math.max(h, 300) * dpr;
    canvasEl.style.width = w + 'px';
    canvasEl.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function massPos() {
    return { x: w * massXRatio, y: h * massYRatio, r: Math.min(w, h) * massRadiusRatio };
  }

  function warpedY(px, py, mass) {
    const dx = px - mass.x, dy = py - mass.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 1;
    const strength = (mass.r * 1400) / (dist * dist);
    const dirY = dy / dist;
    return py - dirY * Math.min(strength, mass.r * 3);
  }

  function draw() {
    ctx.fillStyle = '#05070B';
    ctx.fillRect(0, 0, w, h);

    const mass = massPos();
    const rows = 20, cols = 24;
    const vanishY = h * 0.05;
    const baseY = h * 1.1;
    const vanishX = w * 0.5;

    ctx.strokeStyle = `rgba(${lineColor},${lineOpacity})`;
    ctx.lineWidth = 1.2;

    for (let r = 0; r <= rows; r++) {
      const depth = r / rows;
      const y0 = vanishY + (baseY - vanishY) * Math.pow(depth, 2.1);
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const cx = c / cols;
        const spread = 0.12 + depth * 1.5;
        const px = vanishX + (cx - 0.5) * w * spread;
        const py = warpedY(px, y0, mass);
        if (c === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    for (let c = 0; c <= cols; c++) {
      const cx = c / cols;
      ctx.beginPath();
      for (let r = 0; r <= rows; r++) {
        const depth = r / rows;
        const y0 = vanishY + (baseY - vanishY) * Math.pow(depth, 2.1);
        const spread = 0.12 + depth * 1.5;
        const px = vanishX + (cx - 0.5) * w * spread;
        const py = warpedY(px, y0, mass);
        if (r === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    const grad = ctx.createRadialGradient(mass.x, mass.y, mass.r * 0.1, mass.x, mass.y, mass.r * 1.7);
    grad.addColorStop(0, 'rgba(255,190,120,0.55)');
    grad.addColorStop(0.55, 'rgba(255,150,80,0.18)');
    grad.addColorStop(1, 'rgba(255,150,80,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(mass.x, mass.y, mass.r * 1.7, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#05070B';
    ctx.beginPath(); ctx.arc(mass.x, mass.y, mass.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,180,110,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(mass.x, mass.y, mass.r, 0, Math.PI * 2); ctx.stroke();

    const orbits = [
      { rx: mass.r * 3.2, ry: mass.r * 1.0, speed: 0.12, size: 4, color: orbitColors[0], phase: 0 },
      { rx: mass.r * 4.4, ry: mass.r * 1.4, speed: 0.08, size: 5.5, color: orbitColors[1], phase: 2.1 },
      { rx: mass.r * 5.8, ry: mass.r * 1.8, speed: 0.05, size: 3, color: orbitColors[2], phase: 4.3 }
    ];
    orbits.forEach(function (o) {
      const a = t * o.speed + o.phase;
      const ox = mass.x + Math.cos(a) * o.rx;
      const oy = mass.y + Math.sin(a) * o.ry * 0.5;
      const behind = Math.sin(a) < 0;
      ctx.globalAlpha = behind ? 0.25 : 1;
      ctx.fillStyle = o.color;
      ctx.beginPath(); ctx.arc(ox, oy, o.size, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 70; i++) {
      const sx = (i * 97) % w;
      const sy = (i * 53) % (h * 0.55);
      ctx.globalAlpha = 0.12 + (i % 5) * 0.06;
      ctx.fillRect(sx, sy, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;

    t += 0.016;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
```

Note: orbit `speed` values here are intentionally lower than the brainstorm mockup (0.12/0.08/0.05 vs 0.35/0.22/0.14) per the global constraint that motion must be slow/subtle in the final site.

- [ ] **Step 2: Verify visually with a throwaway test file**

Create `assets/_tmp-test2.html`:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="margin:0;">
<div style="width:100%; height:480px; position:relative;">
  <canvas id="gridCanvas" style="position:absolute; inset:0;"></canvas>
</div>
<script src="gravity-grid.js"></script>
<script>initGravityGrid(document.getElementById('gridCanvas'));</script>
</body></html>
```

Open in browser. Confirm: perspective grid visible and bending around a glowing mass in the lower-right area, three small colored dots slowly orbiting it, background stars, no console errors, resizing the browser window keeps the canvas correctly sized.

- [ ] **Step 3: Delete the throwaway test file**

```bash
rm "assets/_tmp-test2.html"
```

- [ ] **Step 4: Commit**

```bash
git add assets/gravity-grid.js
git commit -m "Add reusable gravity-well grid canvas background effect"
```

---

## Task 3: Ambient solar-system background with cross-page positioning and scroll parallax

**Files:**
- Create: `assets/solar-system.js`
- Test: manual visual check via scratch HTML file

**Interfaces:**
- Consumes: none (creates and injects its own DOM structure).
- Produces: global function `initSolarSystem(options)` where `options = { top: '35%', left: '15%', scale: 1, rotateOffset: 0 }` (all optional). Injects a `<div id="solar-system">` as the first child of `<body>` with the star + 3 orbiting glass planets, and wires up a scroll listener for parallax. Each page calls this once with page-specific `top`/`left`/`scale`/`rotateOffset` so the system visually shifts between pages.

- [ ] **Step 1: Create `assets/solar-system.js`**

```javascript
/**
 * Injects an ambient background solar system (glowing star + orbiting
 * glass "planets") with scroll parallax. Call once per page with
 * page-specific position/scale so the system appears to shift as the
 * user moves through the funnel, rather than resetting on navigation.
 *
 * Usage: <script src="assets/solar-system.js"></script>
 *        <script>initSolarSystem({ top: '30%', left: '20%', scale: 1 });</script>
 */
function initSolarSystem(options) {
  options = options || {};
  const top = options.top || '35%';
  const left = options.left || '15%';
  const scale = options.scale !== undefined ? options.scale : 1;
  const rotateOffset = options.rotateOffset !== undefined ? options.rotateOffset : 0;

  const wrap = document.createElement('div');
  wrap.id = 'solar-system';
  wrap.style.cssText = [
    'position:fixed', 'top:' + top, 'left:' + left,
    'width:120vw', 'height:120vw', 'min-width:1000px', 'min-height:1000px',
    'z-index:-2', 'pointer-events:none', 'display:flex',
    'align-items:center', 'justify-content:center',
    'transition:transform 0.1s ease-out', 'will-change:transform'
  ].join(';');

  wrap.innerHTML = `
    <div style="width:90px;height:90px;background:radial-gradient(circle, #FFFFFF 10%, #D4E3FF 40%, rgba(138,180,255,0.1) 80%);
      border-radius:50%;
      box-shadow:0 0 100px 40px rgba(138,180,255,0.25), 0 0 250px 80px rgba(157,139,255,0.15), 0 0 30px 5px #fff inset;
      position:absolute; z-index:10;"></div>
    <div style="position:absolute; width:30%; height:30%; border:1px dashed rgba(138,180,255,0.2); border-radius:50%; animation: solarspin1 40s linear infinite;">
      <div style="position:absolute; top:0; left:50%; transform:translate(-50%,-50%); width:16px; height:16px; border-radius:50%;
        background:linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1));
        box-shadow:0 0 20px rgba(255,255,255,0.3), inset 0 2px 5px rgba(255,255,255,0.5);"></div>
    </div>
    <div style="position:absolute; width:55%; height:55%; border:1px dashed rgba(138,180,255,0.2); border-radius:50%; animation: solarspin2 80s linear infinite reverse;">
      <div style="position:absolute; bottom:25%; right:0; transform:translate(50%,50%); width:32px; height:32px; border-radius:50%;
        background:linear-gradient(135deg, rgba(157,139,255,0.8), rgba(157,139,255,0.1));
        box-shadow:0 0 20px rgba(255,255,255,0.2);"></div>
    </div>
    <div style="position:absolute; width:80%; height:80%; border:1px dashed rgba(138,180,255,0.2); border-radius:50%; animation: solarspin3 120s linear infinite;">
      <div style="position:absolute; top:33%; left:0; transform:translate(-50%,-50%); width:48px; height:48px; border-radius:50%;
        background:linear-gradient(135deg, rgba(138,180,255,0.8), rgba(138,180,255,0.1));
        box-shadow:0 0 20px rgba(255,255,255,0.2);"></div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes solarspin1 { from { transform: rotate(${rotateOffset}deg); } to { transform: rotate(${rotateOffset + 360}deg); } }
    @keyframes solarspin2 { from { transform: rotate(${-rotateOffset}deg); } to { transform: rotate(${-rotateOffset - 360}deg); } }
    @keyframes solarspin3 { from { transform: rotate(${rotateOffset}deg); } to { transform: rotate(${rotateOffset + 360}deg); } }
  `;
  document.head.appendChild(style);
  document.body.insertBefore(wrap, document.body.firstChild);

  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    const moveY = scrolled * -0.2;
    const moveX = scrolled * 0.08;
    wrap.style.transform = 'translate(' + moveX + 'px,' + moveY + 'px) scale(' + scale + ')';
  });

  wrap.style.transform = 'scale(' + scale + ')';
}
```

- [ ] **Step 2: Verify visually with a throwaway test file**

Create `assets/_tmp-test3.html`:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="margin:0; background:#030508; color:white; height:200vh;">
<h1 style="padding:40px;">גלול למטה כדי לבדוק פרלקס</h1>
<script src="solar-system.js"></script>
<script>initSolarSystem({ top: '30%', left: '20%', scale: 1 });</script>
</body></html>
```

Open in browser. Confirm: glowing star with 3 orbiting glass planets visible behind the text, planets slowly rotating around the star, scrolling the page shifts the whole system slightly (parallax), no console errors.

- [ ] **Step 3: Delete the throwaway test file**

```bash
rm "assets/_tmp-test3.html"
```

- [ ] **Step 4: Commit**

```bash
git add assets/solar-system.js
git commit -m "Add reusable ambient solar-system background with parallax"
```

---

## Task 4: Auto-advancing media gallery with mobile lightbox

**Files:**
- Create: `assets/gallery.js`
- Test: manual visual check via scratch HTML file with real repo media files

**Interfaces:**
- Consumes: an array of `{ src, label }` objects and a container element ID.
- Produces: global function `initGallery(containerId, items, options)` where `options = { autoAdvanceMs: 4000 }`. Renders a horizontally-scrollable auto-advancing strip inside the container, and wires up click-to-open a full-screen lightbox (with prev/next, keyboard nav, and mobile-safe sizing using `object-fit: contain` within `100dvh`-aware bounds).

- [ ] **Step 1: Create `assets/gallery.js`**

```javascript
/**
 * Auto-advancing media gallery + full-screen lightbox.
 * - Strip auto-scrolls through items on an interval; pauses on hover/touch.
 * - Lightbox uses object-fit:contain within a viewport-safe box so images
 *   and GIFs never get cropped or require scrolling on mobile.
 *
 * Usage:
 *   <div id="galleryStrip"></div>
 *   <script src="assets/gallery.js"></script>
 *   <script>initGallery('galleryStrip', [{src:'a.gif', label:'...'}, ...]);</script>
 */
function initGallery(containerId, items, options) {
  options = options || {};
  const autoAdvanceMs = options.autoAdvanceMs !== undefined ? options.autoAdvanceMs : 4000;
  const container = document.getElementById(containerId);
  if (!container || !items || !items.length) return;

  container.innerHTML = `
    <div class="gallery-strip" style="display:flex; gap:14px; overflow-x:auto; scroll-behavior:smooth; padding:4px 2px 14px;">
      ${items.map(function (item, i) {
        return `<div class="gallery-thumb" data-idx="${i}" style="flex:0 0 auto; width:220px; aspect-ratio:16/10; border-radius:16px; overflow:hidden; cursor:pointer; border:1px solid var(--border-panel, rgba(255,255,255,0.12));">
          <img src="${item.src}" alt="${item.label}" style="width:100%; height:100%; object-fit:cover;">
        </div>`;
      }).join('')}
    </div>
    <div id="galleryLightbox" style="display:none; position:fixed; inset:0; z-index:999; background:rgba(3,5,8,0.96);
      align-items:center; justify-content:center; flex-direction:column; padding:16px; box-sizing:border-box;">
      <button id="galleryClose" style="position:absolute; top:16px; inset-inline-end:16px; background:none; border:none; color:white; font-size:32px; cursor:pointer;">&times;</button>
      <div style="width:100%; max-width:640px; height:min(78vh, 78dvh); display:flex; align-items:center; justify-content:center;">
        <img id="galleryImg" src="" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:12px;">
      </div>
      <div style="display:flex; align-items:center; gap:20px; margin-top:14px;">
        <button id="galleryPrev" style="width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:white;cursor:pointer;">&larr;</button>
        <p id="galleryCaption" style="font-size:13px; color:var(--accent-blue, #8AB4FF); text-align:center; max-width:70vw;"></p>
        <button id="galleryNext" style="width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:white;cursor:pointer;">&rarr;</button>
      </div>
    </div>
  `;

  const strip = container.querySelector('.gallery-strip');
  const lightbox = container.querySelector('#galleryLightbox');
  const imgEl = container.querySelector('#galleryImg');
  const captionEl = container.querySelector('#galleryCaption');
  let currentIdx = 0;
  let autoTimer = null;

  function showLightbox(idx) {
    currentIdx = (idx + items.length) % items.length;
    imgEl.src = items[currentIdx].src;
    captionEl.textContent = items[currentIdx].label;
    lightbox.style.display = 'flex';
  }
  function hideLightbox() { lightbox.style.display = 'none'; }

  container.querySelectorAll('.gallery-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      showLightbox(parseInt(thumb.getAttribute('data-idx'), 10));
    });
  });
  container.querySelector('#galleryClose').addEventListener('click', hideLightbox);
  container.querySelector('#galleryPrev').addEventListener('click', function () { showLightbox(currentIdx - 1); });
  container.querySelector('#galleryNext').addEventListener('click', function () { showLightbox(currentIdx + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) hideLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowLeft') showLightbox(currentIdx - 1);
    if (e.key === 'ArrowRight') showLightbox(currentIdx + 1);
  });

  function autoAdvance() {
    const maxScroll = strip.scrollWidth - strip.clientWidth;
    if (maxScroll <= 0) return;
    let next = strip.scrollLeft + 236;
    if (next >= maxScroll) next = 0;
    strip.scrollTo({ left: next, behavior: 'smooth' });
  }
  function startAuto() { autoTimer = setInterval(autoAdvance, autoAdvanceMs); }
  function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
  startAuto();
  strip.addEventListener('mouseenter', stopAuto);
  strip.addEventListener('mouseleave', startAuto);
  strip.addEventListener('touchstart', stopAuto, { passive: true });
}
```

- [ ] **Step 2: Verify visually with a throwaway test file using real repo media**

Create `assets/_tmp-test4.html` (note: relative paths go up one level to reach the media files in repo root):

```html
<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="UTF-8">
<link rel="stylesheet" href="site.css"></head>
<body style="padding:24px;">
<div id="galleryStrip"></div>
<script src="gallery.js"></script>
<script>
initGallery('galleryStrip', [
  { src: '../דשבורד 1 .gif', label: 'דשבורד מורה: מעקב התמדה ורמות' },
  { src: '../דשבורד 2.gif', label: 'דשבורד מורה: מפת שגיאות לתלמיד' },
  { src: '../כפל 1 .gif', label: 'אלוף הכפל: תרגול כפל ויזואלי' },
  { src: '../111.jpeg', label: 'FractionLab - מעבדת שברים אינטראקטיבית' }
], { autoAdvanceMs: 3000 });
</script>
</body></html>
```

Open in browser. Confirm: thumbnail strip renders with real GIFs (animating on their own) and images, strip auto-scrolls every 3s, hovering pauses auto-scroll, clicking a thumbnail opens a full-screen lightbox with the image contained (not cropped) and readable at typical mobile width (use browser dev tools device toolbar to check at 375px width — image must fit without horizontal scroll), prev/next buttons and arrow keys navigate, Escape and background-click close it.

- [ ] **Step 3: Delete the throwaway test file**

```bash
rm "assets/_tmp-test4.html"
```

- [ ] **Step 4: Commit**

```bash
git add assets/gallery.js
git commit -m "Add auto-advancing media gallery with mobile-friendly lightbox"
```

---

## Task 5: Shared lead-form submission logic

**Files:**
- Create: `assets/lead-form.js`
- Test: manual check via scratch HTML file (network call verified against real Apps Script endpoint per existing pattern in `index.html`)

**Interfaces:**
- Consumes: a `<form>` element with inputs matching `id="f-name"`, `id="f-phone"`, `id="f-email"`, optional `id="f-count"`, plus an `id="*-error-message"` div for validation errors — mirrors the existing pattern in current `index.html`'s parent/teacher forms.
- Produces: global function `submitLeadForm(formEl, role, onSuccess)` where `role` is `'teacher' | 'parent' | 'institution'` and `onSuccess` is a callback invoked after the network call resolves (or the 5s timeout fires, matching existing `index.html` behavior).

- [ ] **Step 1: Create `assets/lead-form.js`**

```javascript
/**
 * Shared lead-capture form submission logic, reused across teacher/parent/
 * institution forms. Posts to the existing Apps Script Web App (no-cors,
 * so response body is unreadable — success is inferred by not throwing,
 * matching the pattern already used in the current index.html).
 */
const LEAD_FORM_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrRFJIYBSiXXGhR_jwbTfeTlGVRhH1YMuV8IwPWmSz36Wtv9CI4ydPnD8_VWQB9L8s/exec";

function submitLeadForm(formEl, role, onSuccess) {
  const prefix = formEl.dataset.prefix || 'f';
  const errorDiv = document.getElementById(prefix + '-error-message');
  if (errorDiv) errorDiv.classList.add('hidden');

  const name = document.getElementById(prefix + '-name').value.trim();
  const phone = document.getElementById(prefix + '-phone').value.trim();
  const email = document.getElementById(prefix + '-email').value.trim();
  const countField = document.getElementById(prefix + '-count');
  const studentsCount = countField ? countField.value : '';

  const digits = phone.replace(/\D/g, '');
  if (!digits || digits.length < 9 || digits.length > 10 || digits[0] !== '0') {
    if (errorDiv) {
      errorDiv.textContent = 'חובה להזין מספר טלפון תקין ליצירת קשר (לדוגמה: 050-0000000).';
      errorDiv.classList.remove('hidden');
    }
    return false;
  }
  if (!email) {
    if (errorDiv) {
      errorDiv.textContent = 'חובה להזין כתובת דוא"ל ליצירת קשר.';
      errorDiv.classList.remove('hidden');
    }
    return false;
  }

  const submitPromise = fetch(LEAD_FORM_APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, phone: phone, email: email, studentsCount: studentsCount, role: role })
  });
  const timeoutPromise = new Promise(function (resolve) { setTimeout(resolve, 5000); });

  Promise.race([submitPromise, timeoutPromise]).then(function () {
    if (onSuccess) onSuccess();
  });
  submitPromise.catch(function () {});
  return true;
}
```

- [ ] **Step 2: Verify with a throwaway test file**

Create `assets/_tmp-test5.html`:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="padding:24px; font-family:sans-serif;">
<form id="testForm" data-prefix="f">
  <div id="f-error-message" class="hidden" style="color:red;"></div>
  <input id="f-name" value="בדיקה" />
  <input id="f-phone" value="0501234567" />
  <input id="f-email" value="test@example.com" />
  <button type="button" onclick="submitLeadForm(document.getElementById('testForm'), 'teacher', () => alert('success callback fired'))">שלח</button>
</form>
<script src="lead-form.js"></script>
</body></html>
```

Open in browser, open Network tab, click "שלח". Confirm: a POST request fires to the Apps Script URL with the correct JSON body (`role: "teacher"` included), and the success alert fires after the request resolves or after ~5s at most. Then test the validation path by clearing the phone field and re-clicking — confirm the error message appears and no network request fires.

- [ ] **Step 3: Delete the throwaway test file**

```bash
rm "assets/_tmp-test5.html"
```

- [ ] **Step 4: Commit**

```bash
git add assets/lead-form.js
git commit -m "Add shared lead-capture form submission logic with role tagging"
```

---

## Task 6: Home / Vision page (`index.html`)

**Files:**
- Modify: `index.html` (full rewrite)
- Test: manual browser check via the `run` skill

**Interfaces:**
- Consumes: `assets/site.css`, `assets/solar-system.js` (`initSolarSystem({ top: '30%', left: '18%', scale: 1, rotateOffset: 0 })`), `assets/gravity-grid.js` (used only if a secondary section wants the grid effect — optional for this page per spec, solar system is the primary motif here), `assets/gallery.js` (`initGallery('gallerySection', albumData)`).
- Produces: links to `teacher.html`, `parent.html`, and an in-page institution contact modal/section (no separate page).

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>חשבונאוטיקה | למידה במסלול אחר לגמרי</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/site.css">
</head>
<body class="antialiased">

  <!-- Navbar -->
  <nav class="fixed top-0 w-full z-50 p-4">
    <div class="max-w-6xl mx-auto glass-panel !rounded-full px-6 py-3 flex justify-between items-center">
      <div class="font-space font-bold text-lg">
        <span style="color:var(--accent-blue);">חשבונ</span>אוטיקה
      </div>
      <a href="#tracks" class="glass-btn !py-2 !px-5 !text-sm">בחרו מסלול</a>
    </div>
  </nav>

  <!-- Hero -->
  <main class="relative z-10 max-w-5xl mx-auto px-5 pt-40 pb-20">
    <section class="text-center space-y-7">
      <div class="label-tag glass-panel" style="display:inline-flex; color:var(--accent-blue); padding:8px 16px;">
        <span>✨</span><span>פיילוט פעיל · חינמי לגמרי</span>
      </div>
      <h1 class="font-space text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
        למידה במסלול <br>
        <span class="text-gradient">אחר לגמרי.</span>
      </h1>
      <p class="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style="color:var(--text-muted);">
        חשבונאוטיקה היא סביבת חקר ותרגול חשבון: משחקים ויזואליים שהתלמיד לומד דרכם באמת, ודשבורד בקרה שהופך כל תרגול לתמונת מצב ברורה עבור המורה או ההורה.
      </p>
      <div class="flex justify-center gap-3 flex-wrap pt-2">
        <a href="teacher.html" class="glass-btn glass-btn-primary">אני מורה 👩‍🏫</a>
        <a href="parent.html" class="glass-btn">אני הורה 👨‍👩‍👧</a>
      </div>
    </section>

    <!-- Vision -->
    <section class="mt-24 glass-panel p-6 sm:p-10 space-y-4 text-right">
      <h2 class="font-space text-2xl sm:text-3xl font-bold">מה זו חשבונאוטיקה?</h2>
      <p class="leading-relaxed" style="color:var(--text-muted);">
        המערכת נבנתה כדי לתת לתלמיד סביבת תרגול שהוא <span style="color:var(--accent-blue); font-weight:700;">רואה ונוגע</span> בה — לא דף עבודה, אלא חקירה. כל צעד שהתלמיד עושה במשחק הופך לנתון גרפי וברור עבור המורה או ההורה שלו.
      </p>
      <p class="leading-relaxed" style="color:var(--text-muted);">
        נבנתה עם מורים פרטיים והורים ובשבילם: תמונת מצב מדויקת על היכולות, תרגול רציף בין השיעורים, ונגישה ישירות מהדפדפן — בלי התקנה.
      </p>
    </section>

    <!-- Gallery -->
    <section class="mt-24 space-y-6">
      <div class="text-center space-y-2">
        <h2 class="font-space text-2xl sm:text-3xl font-bold">רואים את זה בעיניים</h2>
        <p style="color:var(--text-muted);">מסכים אמיתיים מהדשבורד ומהמשחקים</p>
      </div>
      <div id="gallerySection"></div>
    </section>

    <!-- Tracks -->
    <section id="tracks" class="mt-24 scroll-mt-24 space-y-6">
      <div class="text-center space-y-2">
        <h2 class="font-space text-2xl sm:text-3xl font-bold">בחרו את המסלול שלכם</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <a href="teacher.html" class="glass-panel p-8 block group" style="text-decoration:none; color:inherit;">
          <div class="text-3xl mb-3">👩‍🏫</div>
          <h3 class="font-space text-xl font-bold mb-2">למורים</h3>
          <p style="color:var(--text-muted);" class="text-sm leading-relaxed">אבחון מדויק, שיגור משימות ממוקדות, ומעקב כיתתי ואישי בזמן אמת.</p>
        </a>
        <a href="parent.html" class="glass-panel p-8 block group" style="text-decoration:none; color:inherit;">
          <div class="text-3xl mb-3">👨‍👩‍👧</div>
          <h3 class="font-space text-xl font-bold mb-2">להורים</h3>
          <p style="color:var(--text-muted);" class="text-sm leading-relaxed">תמונת מצב אמיתית על יכולות הילד, ותרגול משותף שהוא בכיף ולא ויכוח.</p>
        </a>
      </div>
      <div class="glass-panel p-8" id="institution-panel">
        <div class="text-3xl mb-3">🏫</div>
        <h3 class="font-space text-xl font-bold mb-2">מוסדות ובתי ספר</h3>
        <p style="color:var(--text-muted);" class="text-sm leading-relaxed mb-4">מנהלים צוות מורים או מוסד חינוכי? השאירו פרטים ונחזור אליכם עם הצעה מותאמת.</p>
        <button id="institution-open-btn" class="glass-btn">השאירו פרטים</button>
      </div>
    </section>
  </main>

  <!-- Institution contact modal -->
  <div id="institution-modal" class="hidden fixed inset-0 z-[999] items-center justify-center p-4" style="background:rgba(3,5,8,0.9);">
    <div class="glass-panel p-6 sm:p-8 max-w-md w-full text-right relative">
      <button id="institution-close-btn" style="position:absolute; top:16px; inset-inline-start:16px; background:none; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
      <h3 class="font-space text-xl font-bold mb-4">פנייה ממוסד/בית ספר</h3>
      <form id="institutionForm" data-prefix="inst" class="space-y-3">
        <div id="inst-error-message" class="hidden p-3 rounded-xl text-xs font-semibold" style="background:rgba(255,107,74,0.12); color:var(--accent-flame);"></div>
        <input id="inst-name" placeholder="שם מלא ותפקיד" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
        <input id="inst-phone" type="tel" placeholder="050-0000000" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
        <input id="inst-email" type="email" placeholder="אימייל" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
        <button type="submit" class="glass-btn glass-btn-primary w-full justify-center">שליחה</button>
      </form>
      <div id="institution-success" class="hidden text-center py-4">
        <p style="color:var(--accent-turquoise);">קיבלנו את הפנייה, נחזור אליכם בקרוב!</p>
      </div>
    </div>
  </div>

  <footer class="py-8 px-5 text-center text-xs relative z-10" style="color:var(--text-muted); border-top:1px solid var(--border-panel);">
    © 2026 חשבונאוטיקה. כל הזכויות שמורות.
  </footer>

  <script src="assets/solar-system.js"></script>
  <script src="assets/gallery.js"></script>
  <script src="assets/lead-form.js"></script>
  <script>
    initSolarSystem({ top: '28%', left: '18%', scale: 1, rotateOffset: 0 });

    const albumData = [
      { src: 'דשבורד 1 .gif', label: 'ממשק מורה: מעקב פעילות שבועי, כוכבים וזמן תרגול' },
      { src: 'דשבורד 2.gif', label: 'ממשק מורה: ניתוח שגיאות ואבחון קשיים לתלמיד' },
      { src: 'דשבורד 3.gif', label: 'ממשק מורה: בניית רצף תרגול אישי לכל תלמיד' },
      { src: 'כפל 1 .gif', label: 'גיימפליי: תרגול כפל ויזואלי המשלב הבנה ומשחק מאתגר' },
      { src: 'כפל 2.gif', label: 'גיימפליי: משחק לוח הכפל לחיזוק ושליפה מהירה' },
      { src: 'משוואות .gif', label: 'גיימפליי: פתרון משוואות בדרך חווייתית' },
      { src: 'צורות .gif', label: 'גיימפליי: מהנדסי צורות - הבנת שטח והיקף' },
      { src: '111.jpeg', label: 'FractionLab - מעבדת שברים אינטראקטיבית' },
      { src: '112.jpeg', label: 'Balance - מאזניים אלגבריים ואיזון משוואות' },
      { src: '113.jpeg', label: 'Tank - שברים עשרוניים ואחוזים באמצעות מילוי מכלים' },
      { src: '114.jpeg', label: 'Equations - ייצוג חזותי ופתרון משוואות' },
      { src: '115.jpeg', label: 'MultiplicationChamp - ראייה מרחבית ולוח הכפל' },
      { src: '116.jpeg', label: 'JuniorGrid - גאומטריה, שטחים וכפל מבוסס רשת' },
      { src: '117.jpeg', label: 'Magic Patterns - זיהוי חוקיות וסדרות מספריות' }
    ];
    initGallery('gallerySection', albumData, { autoAdvanceMs: 4000 });

    const instOpenBtn = document.getElementById('institution-open-btn');
    const instModal = document.getElementById('institution-modal');
    const instCloseBtn = document.getElementById('institution-close-btn');
    instOpenBtn.addEventListener('click', function () {
      instModal.classList.remove('hidden');
      instModal.style.display = 'flex';
    });
    instCloseBtn.addEventListener('click', function () {
      instModal.classList.add('hidden');
      instModal.style.display = 'none';
    });
    document.getElementById('institutionForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const ok = submitLeadForm(this, 'institution', function () {
        document.getElementById('institutionForm').classList.add('hidden');
        document.getElementById('institution-success').classList.remove('hidden');
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser via the `run` skill**

Use the `run` skill (or open `index.html` directly via `file://` since this is a static site with no dev server) and confirm:
- Solar system visible behind hero, planets slowly orbiting, subtle parallax on scroll
- Hero headline "למידה במסלול אחר לגמרי" renders correctly in RTL
- Vision section glass panel readable
- Gallery section shows real thumbnails auto-scrolling, lightbox opens correctly on click and is mobile-safe (check at 375px width in dev tools)
- "אני מורה" / "אני הורה" buttons link to `teacher.html` / `parent.html` (these files don't exist yet — expect a 404, that's fine, confirms link wiring)
- Institution card opens the modal, form validates phone/email, and — with dev tools Network tab open — submitting fires a POST to the Apps Script URL with `role: "institution"`

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rebuild home/vision page with new spacecraft visual system"
```

---

## Task 7: Teacher offering page (`teacher.html`)

**Files:**
- Create: `teacher.html`
- Test: manual browser check

**Interfaces:**
- Consumes: `assets/site.css`, `assets/gravity-grid.js` (`initGravityGrid` on a hero canvas, `massX: 0.8, massY: 0.5` — different position than home page's solar system per the "shifts between pages" constraint), `assets/lead-form.js`.
- Produces: two CTAs — "השאירו פרטים" (submits via `submitLeadForm(form, 'teacher', ...)`, then redirects to `guide-teacher.html`) and "כניסה למערכת" (direct link to `guide-teacher.html`, no form required).

- [ ] **Step 1: Write `teacher.html`**

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>חשבונאוטיקה למורים | אבחון, שיגור משימות ומעקב כיתתי</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/site.css">
</head>
<body class="antialiased">

  <nav class="fixed top-0 w-full z-50 p-4">
    <div class="max-w-6xl mx-auto glass-panel !rounded-full px-6 py-3 flex justify-between items-center">
      <a href="index.html" class="font-space font-bold text-lg" style="text-decoration:none; color:inherit;">
        <span style="color:var(--accent-blue);">חשבונ</span>אוטיקה
      </a>
      <a href="index.html" class="glass-btn !py-2 !px-5 !text-sm">← בחירת מסלול</a>
    </div>
  </nav>

  <main class="relative z-10 max-w-4xl mx-auto px-5 pt-40 pb-20">
    <div style="position:relative; height:280px; border-radius:24px; overflow:hidden; margin-bottom:48px;">
      <canvas id="teacherGrid" style="position:absolute; inset:0;"></canvas>
      <div style="position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:center; padding:32px;">
        <div class="label-tag glass-panel" style="display:inline-flex; color:var(--accent-blue); padding:8px 16px; width:fit-content; margin-bottom:16px;">
          <span>👩‍🏫</span><span>מסלול מורים</span>
        </div>
        <h1 class="font-space text-3xl sm:text-4xl font-bold">כלי תרגול ומעקב שממשיך לעבוד<br>גם כשהתלמיד לא מולכם</h1>
      </div>
    </div>

    <section class="glass-panel p-6 sm:p-10 space-y-4 text-right mb-10">
      <p class="leading-relaxed"><span style="color:var(--accent-blue); font-weight:700;">🎯 שיגור משימות ממוקדות</span> — קובעים שלב ספציפי לכיתה שלמה או לתלמיד בודד שצריך עזרה.</p>
      <p class="leading-relaxed"><span style="color:var(--accent-blue); font-weight:700;">🧭 אבחון אמיתי, לא ניחוש</span> — רואים בדיוק איזה מושג חסר לתלמיד.</p>
      <p class="leading-relaxed"><span style="color:var(--accent-blue); font-weight:700;">🔗 שני קישורים לכל תלמיד</span> — קישור משחק לתלמיד, וקישור מעקב נפרד להורה.</p>
      <p class="leading-relaxed"><span style="color:var(--accent-blue); font-weight:700;">📊 פרופיל כיתתי ואישי</span> — תמונת מצב על כל הכיתה במבט אחד, ולצידה דף ממוקד לכל תלמיד.</p>
    </section>

    <section class="glass-panel p-6 sm:p-10 mb-10 text-center">
      <h2 class="font-space text-xl font-bold mb-2">מחירון</h2>
      <p style="color:var(--text-muted);">מחירון בקרוב — כרגע הפיילוט פתוח וחינמי לגמרי, ללא התחייבות.</p>
    </section>

    <section class="max-w-xl mx-auto w-full">
      <div id="form-card" class="glass-panel p-6 sm:p-8 space-y-4">
        <form id="teacherForm" data-prefix="f" class="space-y-4">
          <div id="f-error-message" class="hidden p-3 rounded-xl text-xs font-semibold" style="background:rgba(255,107,74,0.12); color:var(--accent-flame);"></div>
          <input id="f-name" placeholder="שם מלא" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
          <input id="f-phone" type="tel" placeholder="050-0000000" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
          <input id="f-email" type="email" placeholder="אימייל" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
          <select id="f-count" class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
            <option value="1-3 תלמידים">1-3 תלמידים</option>
            <option value="4-8 תלמידים">4-8 תלמידים</option>
            <option value="9-15 תלמידים">9-15 תלמידים</option>
            <option value="15+ תלמידים">מעל 15 תלמידים</option>
          </select>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="submit" data-mode="info" class="glass-btn justify-center">השאירו פרטים</button>
            <button type="submit" data-mode="enter" class="glass-btn glass-btn-primary justify-center">כניסה למערכת 🚀</button>
          </div>
        </form>
      </div>
      <div id="success-card" class="hidden glass-panel p-6 sm:p-8 text-center space-y-3">
        <p style="color:var(--accent-turquoise); font-weight:700;">קיבלנו את הפרטים!</p>
        <p style="color:var(--text-muted);" class="text-sm">נחזור אליכם בקרוב. אפשר גם להמשיך למדריך ההפעלה כבר עכשיו.</p>
        <a href="guide-teacher.html" class="glass-btn glass-btn-primary">למדריך ← </a>
      </div>
    </section>
  </main>

  <script src="assets/gravity-grid.js"></script>
  <script src="assets/lead-form.js"></script>
  <script>
    initGravityGrid(document.getElementById('teacherGrid'), {
      massX: 0.82, massY: 0.4, massRadiusRatio: 0.09,
      orbitColors: ['#8AB4FF', '#5EEAD4', '#FBBF24']
    });

    document.getElementById('teacherForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const mode = e.submitter ? e.submitter.dataset.mode : 'info';
      const ok = submitLeadForm(this, 'teacher', function () {
        if (mode === 'enter') {
          window.location.href = 'guide-teacher.html';
        } else {
          document.getElementById('form-card').classList.add('hidden');
          document.getElementById('success-card').classList.remove('hidden');
        }
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `teacher.html` directly. Confirm: gravity-grid canvas renders in the hero band (mass positioned upper-right this time, different from home page's solar system position, satisfying the "shifts between pages" constraint), pricing placeholder text shows (not a fabricated number), form validates phone/email, "כניסה למערכת" mode navigates to `guide-teacher.html` (expect 404 for now — confirms wiring), "השאירו פרטים" mode shows the success card with a working link to the guide.

- [ ] **Step 3: Commit**

```bash
git add teacher.html
git commit -m "Add teacher offering page with pricing placeholder and lead form"
```

---

## Task 8: Parent offering page (`parent.html`)

**Files:**
- Create: `parent.html`
- Test: manual browser check

**Interfaces:**
- Same pattern as Task 7, `role: 'parent'`, redirects to `guide-parent.html`.

- [ ] **Step 1: Write `parent.html`**

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>חשבונאוטיקה להורים | תמונת מצב אמיתית ותרגול משותף</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/site.css">
</head>
<body class="antialiased">

  <nav class="fixed top-0 w-full z-50 p-4">
    <div class="max-w-6xl mx-auto glass-panel !rounded-full px-6 py-3 flex justify-between items-center">
      <a href="index.html" class="font-space font-bold text-lg" style="text-decoration:none; color:inherit;">
        <span style="color:var(--accent-indigo);">חשבונ</span>אוטיקה
      </a>
      <a href="index.html" class="glass-btn !py-2 !px-5 !text-sm">← בחירת מסלול</a>
    </div>
  </nav>

  <main class="relative z-10 max-w-4xl mx-auto px-5 pt-40 pb-20">
    <div style="position:relative; height:280px; border-radius:24px; overflow:hidden; margin-bottom:48px;">
      <canvas id="parentGrid" style="position:absolute; inset:0;"></canvas>
      <div style="position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:center; padding:32px;">
        <div class="label-tag glass-panel" style="display:inline-flex; color:var(--accent-indigo); padding:8px 16px; width:fit-content; margin-bottom:16px;">
          <span>👨‍👩‍👧</span><span>מסלול הורים</span>
        </div>
        <h1 class="font-space text-3xl sm:text-4xl font-bold">תמונת מצב אמיתית,<br>ותרגול משותף שהוא בכיף</h1>
      </div>
    </div>

    <section class="glass-panel p-6 sm:p-10 space-y-4 text-right mb-10">
      <p class="leading-relaxed"><span style="color:var(--accent-indigo); font-weight:700;">🧠 תמונת מצב אמיתית</span> — במקום לנחש אם "הוא מבין חשבון", רואים בדוח אישי אילו נושאים חזקים ואיפה יש פער.</p>
      <p class="leading-relaxed"><span style="color:var(--accent-indigo); font-weight:700;">🎮 משחקי חקר במקום דפי עבודה</span> — התלמיד נוגע במספרים ולומד דרך חידות, לא דרך שינון.</p>
      <p class="leading-relaxed"><span style="color:var(--accent-indigo); font-weight:700;">📈 מעקב בזמן אמת</span> — גרפים ברורים שמראים כמה דקות הילד תרגל השבוע.</p>
      <p class="leading-relaxed"><span style="color:var(--accent-indigo); font-weight:700;">🔑 בלי סיסמאות ובלי הרשמה לילד</span> — נכנסים מהדפדפן ומתחילים תוך דקה.</p>
    </section>

    <section class="glass-panel p-6 sm:p-10 mb-10 text-center">
      <h2 class="font-space text-xl font-bold mb-2">מחירון</h2>
      <p style="color:var(--text-muted);">מחירון בקרוב — כרגע הפיילוט פתוח וחינמי לגמרי, ללא התחייבות.</p>
    </section>

    <section class="max-w-xl mx-auto w-full">
      <div id="form-card" class="glass-panel p-6 sm:p-8 space-y-4">
        <form id="parentForm" data-prefix="f" class="space-y-4">
          <div id="f-error-message" class="hidden p-3 rounded-xl text-xs font-semibold" style="background:rgba(255,107,74,0.12); color:var(--accent-flame);"></div>
          <input id="f-name" placeholder="שם ההורה" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
          <input id="f-phone" type="tel" placeholder="050-0000000" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
          <input id="f-email" type="email" placeholder="אימייל" required class="w-full px-4 py-3 rounded-xl text-sm" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-panel); color:white;">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="submit" data-mode="info" class="glass-btn justify-center">השאירו פרטים</button>
            <button type="submit" data-mode="enter" class="glass-btn glass-btn-primary justify-center">כניסה למערכת 🚀</button>
          </div>
        </form>
      </div>
      <div id="success-card" class="hidden glass-panel p-6 sm:p-8 text-center space-y-3">
        <p style="color:var(--accent-turquoise); font-weight:700;">קיבלנו את הפרטים!</p>
        <p style="color:var(--text-muted);" class="text-sm">נחזור אליכם בקרוב. אפשר גם להמשיך למדריך ההפעלה כבר עכשיו.</p>
        <a href="guide-parent.html" class="glass-btn glass-btn-primary">למדריך ← </a>
      </div>
    </section>
  </main>

  <script src="assets/gravity-grid.js"></script>
  <script src="assets/lead-form.js"></script>
  <script>
    initGravityGrid(document.getElementById('parentGrid'), {
      massX: 0.2, massY: 0.4, massRadiusRatio: 0.09,
      lineColor: '157,139,255',
      orbitColors: ['#9D8BFF', '#5EEAD4', '#FBBF24']
    });

    document.getElementById('parentForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const mode = e.submitter ? e.submitter.dataset.mode : 'info';
      const ok = submitLeadForm(this, 'parent', function () {
        if (mode === 'enter') {
          window.location.href = 'guide-parent.html';
        } else {
          document.getElementById('form-card').classList.add('hidden');
          document.getElementById('success-card').classList.remove('hidden');
        }
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `parent.html` directly. Confirm: gravity-grid mass positioned upper-left this time (mirrored from teacher.html, using indigo line color) — visually distinct per-page placement satisfying the "shifts between pages" constraint. Same functional checks as Task 7 (form validation, success card, guide link).

- [ ] **Step 3: Commit**

```bash
git add parent.html
git commit -m "Add parent offering page with pricing placeholder and lead form"
```

---

## Task 9: Teacher and parent onboarding guides

**Files:**
- Create: `guide-teacher.html`
- Create: `guide-parent.html`
- Test: manual browser check

**Interfaces:**
- Consumes: `assets/site.css`, `assets/solar-system.js` (different `top`/`left`/`scale` than `index.html`, continuing the cross-page shift).
- Produces: final CTA linking to the live system (`https://aritmetica.nt-school.app/teacher` and `https://aritmetica.nt-school.app` respectively).

- [ ] **Step 1: Write `guide-teacher.html`**

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>מדריך התחלה למורים | חשבונאוטיקה</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/site.css">
</head>
<body class="antialiased">

  <nav class="fixed top-0 w-full z-50 p-4">
    <div class="max-w-6xl mx-auto glass-panel !rounded-full px-6 py-3 flex justify-between items-center">
      <a href="index.html" class="font-space font-bold text-lg" style="text-decoration:none; color:inherit;">
        <span style="color:var(--accent-blue);">חשבונ</span>אוטיקה
      </a>
    </div>
  </nav>

  <main class="relative z-10 max-w-2xl mx-auto px-5 pt-40 pb-20">
    <div class="text-center space-y-2 mb-10">
      <h1 class="font-space text-3xl font-bold">כמעט שם — 3 צעדים ואתם בפנים</h1>
    </div>

    <div class="glass-panel p-6 sm:p-8 space-y-8 text-right">
      <div class="flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0" style="background:rgba(138,180,255,0.12); border:1px solid rgba(138,180,255,0.3); color:var(--accent-blue);">1</div>
        <div>
          <h3 class="font-bold mb-1">נכנסים לדשבורד ומקימים כיתה</h3>
          <p class="text-sm" style="color:var(--text-muted);">ישר מהדפדפן, בנייד או במחשב, ללא התקנה.</p>
        </div>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0" style="background:rgba(138,180,255,0.12); border:1px solid rgba(138,180,255,0.3); color:var(--accent-blue);">2</div>
        <div>
          <h3 class="font-bold mb-1">מוסיפים תלמיד</h3>
          <p class="text-sm" style="color:var(--text-muted);">נוצרים אוטומטית שני קישורים: קישור משחק לתלמיד וקישור מעקב נפרד להורה שלו.</p>
        </div>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0" style="background:rgba(138,180,255,0.12); border:1px solid rgba(138,180,255,0.3); color:var(--accent-blue);">3</div>
        <div>
          <h3 class="font-bold mb-1">שולחים את הקישורים</h3>
          <p class="text-sm" style="color:var(--text-muted);">קישור המשחק לתלמיד, קישור המעקב להורה — אפשר גם בוואטסאפ.</p>
        </div>
      </div>

      <div class="pt-4 flex justify-center" style="border-top:1px solid var(--border-panel);">
        <a href="https://aritmetica.nt-school.app/teacher" target="_blank" class="glass-btn glass-btn-primary">כניסה לדשבורד המורה 🚀</a>
      </div>
    </div>
  </main>

  <script src="assets/solar-system.js"></script>
  <script>
    initSolarSystem({ top: '55%', left: '75%', scale: 0.8, rotateOffset: 90 });
  </script>
</body>
</html>
```

- [ ] **Step 2: Write `guide-parent.html`**

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>מדריך התחלה להורים | חשבונאוטיקה</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/site.css">
</head>
<body class="antialiased">

  <nav class="fixed top-0 w-full z-50 p-4">
    <div class="max-w-6xl mx-auto glass-panel !rounded-full px-6 py-3 flex justify-between items-center">
      <a href="index.html" class="font-space font-bold text-lg" style="text-decoration:none; color:inherit;">
        <span style="color:var(--accent-indigo);">חשבונ</span>אוטיקה
      </a>
    </div>
  </nav>

  <main class="relative z-10 max-w-2xl mx-auto px-5 pt-40 pb-20">
    <div class="text-center space-y-2 mb-10">
      <h1 class="font-space text-3xl font-bold">כמעט שם — 3 צעדים ואתם בפנים</h1>
    </div>

    <div class="glass-panel p-6 sm:p-8 space-y-8 text-right">
      <div class="flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0" style="background:rgba(157,139,255,0.12); border:1px solid rgba(157,139,255,0.3); color:var(--accent-indigo);">1</div>
        <div>
          <h3 class="font-bold mb-1">מקבלים קישור אישי מהמורה</h3>
          <p class="text-sm" style="color:var(--text-muted);">לוחצים על הקישור וישר נכנסים לדוח הלמידה המעודכן — בלי סיסמה ובלי הרשמה.</p>
        </div>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0" style="background:rgba(157,139,255,0.12); border:1px solid rgba(157,139,255,0.3); color:var(--accent-indigo);">2</div>
        <div>
          <h3 class="font-bold mb-1">קובעים יעד תרגול שבועי</h3>
          <p class="text-sm" style="color:var(--text-muted);">בלשונית "התמדה" מסכמים כמה דקות ביום, ואפשר לצרף פרס משותף שידרבן.</p>
        </div>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0" style="background:rgba(157,139,255,0.12); border:1px solid rgba(157,139,255,0.3); color:var(--accent-indigo);">3</div>
        <div>
          <h3 class="font-bold mb-1">מאשרים התראות ומוסיפים למסך הבית</h3>
          <p class="text-sm" style="color:var(--text-muted);">כך תקבלו עדכון מיידי לנייד, והמערכת תיפתח כמו אפליקציה בלחיצה אחת.</p>
        </div>
      </div>

      <div class="pt-4 flex justify-center" style="border-top:1px solid var(--border-panel);">
        <a href="https://aritmetica.nt-school.app" target="_blank" class="glass-btn glass-btn-primary">כניסה לחשבונאוטיקה 🚀</a>
      </div>
    </div>
  </main>

  <script src="assets/solar-system.js"></script>
  <script>
    initSolarSystem({ top: '55%', left: '15%', scale: 0.8, rotateOffset: -90 });
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify both in browser**

Open `guide-teacher.html` and `guide-parent.html` directly. Confirm: solar system visible at a different position/scale than on `index.html` (position moved to bottom-right/bottom-left respectively, scale reduced to 0.8), numbered steps render correctly RTL, final CTA button opens the correct live-system URL (`/teacher` vs bare domain) in a new tab.

- [ ] **Step 4: Commit**

```bash
git add guide-teacher.html guide-parent.html
git commit -m "Add teacher and parent onboarding guide pages"
```

---

## Task 10: End-to-end flow verification

**Files:** none created — verification only.

- [ ] **Step 1: Walk the full teacher funnel in a browser**

Starting at `index.html`: click "אני מורה" → land on `teacher.html` → verify pricing placeholder and content render → fill and submit the form with `data-mode="enter"` → confirm redirect to `guide-teacher.html` → click final CTA → confirm it opens `https://aritmetica.nt-school.app/teacher`.

- [ ] **Step 2: Walk the full parent funnel in a browser**

Same as Step 1 but via "אני הורה" → `parent.html` → `guide-parent.html` → confirm final CTA opens `https://aritmetica.nt-school.app` (no `/teacher` suffix).

- [ ] **Step 3: Walk the institution funnel**

From `index.html`, click the institution card's "השאירו פרטים" → modal opens → submit with valid data → confirm success message shows in-modal (no navigation away, matches spec's "ליד בלבד, ללא כניסה עצמאית").

- [ ] **Step 4: Check responsive/mobile behavior**

Using browser dev tools device toolbar at 375px width, revisit `index.html`, `teacher.html`, `parent.html`: confirm text doesn't overflow, gallery lightbox images stay fully visible without scrolling, glass panels don't overflow the viewport width, nav bar remains usable.

- [ ] **Step 5: Note open items for the user**

Confirm the following are still pending user input and were correctly left as placeholders (not fabricated): real pricing figures on `teacher.html`/`parent.html`, and the final decision on whether to keep reusing the existing Apps Script endpoint long-term (this plan reuses it as specified in Global Constraints, since no blocker was found — flag this choice explicitly when reporting completion).

---

## Self-Review Notes

- **Spec coverage:** Home/vision page (Task 6), teacher page (Task 7), parent page (Task 8), guides (Task 9), gravity grid (Task 2), solar system + cross-page shift (Task 3, wired per-page in Tasks 6 & 9), glassmorphism (Task 1, used throughout), media gallery (Task 4, used in Task 6), institutions contact-only path (Task 6 modal), pricing placeholder (Tasks 7 & 8), data-collection decision (Global Constraints — explicitly reuses existing Apps Script since spec allowed deciding after seeing the design and no blocker was found; flagged for user confirmation in Task 10 Step 5).
- **Placeholder scan:** no TBD/TODO left; pricing text is an intentional, spec-required placeholder, not a plan gap.
- **Type/interface consistency:** `initGravityGrid(canvasEl, options)`, `initSolarSystem(options)`, `initGallery(containerId, items, options)`, `submitLeadForm(formEl, role, onSuccess)` — names and signatures match between their defining task (1–5) and every call site in Tasks 6–9.
