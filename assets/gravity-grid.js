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
