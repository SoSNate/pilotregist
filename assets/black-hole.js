/**
 * Animated 2D black hole background: warped spacetime grid + glowing ink
 * particles streaming in and spiraling into a singularity. Purely
 * decorative, fixed full-screen behind content, with scroll parallax.
 *
 * Usage:
 *   <div id="bh-system" class="black-hole-container">
 *     <canvas id="spacetime-canvas" class="spacetime-canvas"></canvas>
 *     <div class="black-hole-core"></div>
 *   </div>
 *   <script src="assets/black-hole.js"></script>
 *   <script>initBlackHole({ coreXRatio: 0.85, coreYRatio: 0.25 });</script>
 */
function initBlackHole(options) {
  options = options || {};
  const coreXRatio = options.coreXRatio !== undefined ? options.coreXRatio : 0.85;
  const coreYRatio = options.coreYRatio !== undefined ? options.coreYRatio : 0.25;
  const parallax = options.parallax !== undefined ? options.parallax : true;
  const growPerScrollPx = options.growPerScrollPx !== undefined ? options.growPerScrollPx : 0.05;
  const maxGrowth = options.maxGrowth !== undefined ? options.maxGrowth : 60;
  const driftPerScrollPx = options.driftPerScrollPx !== undefined ? options.driftPerScrollPx : 0.1;

  const canvas = document.getElementById('spacetime-canvas');
  const bhSystem = document.getElementById('bh-system');
  const coreEl = document.querySelector('.black-hole-core');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, baseCx, baseCy, cx, cy, radiusGrowth = 0, driftY = 0;
  let inkParticles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    baseCx = w * coreXRatio;
    baseCy = h * coreYRatio;
    updatePosition();
  }
  function updatePosition() {
    cx = baseCx;
    cy = baseCy + driftY;
  }
  window.addEventListener('resize', resize);
  resize();

  function InkParticle(startX, startY, color, sizeMultiplier) {
    this.x = startX - (Math.random() * 20);
    this.y = startY + (Math.random() * 60 - 30);
    this.oldX = this.x;
    this.oldY = this.y;
    this.vx = Math.random() * 1.0 + 0.8;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.color = color;
    this.size = (Math.random() * 1.5 + 0.5) * sizeMultiplier;
    this.life = 1.0;
    this.decay = Math.random() * 0.0015 + 0.0005;
  }
  InkParticle.prototype.update = function () {
    this.oldX = this.x;
    this.oldY = this.y;
    const dx = cx - this.x;
    const dy = cy - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 25) { this.life = 0; return; }

    let driftX = 0;
    if (this.x < cx - 150) driftX = 0.3;

    const dirX = dx / dist;
    const dirY = dy / dist;
    const pullForce = 9000 / (dist * dist + 700);
    const swirlForce = 13000 / (dist * dist + 900);

    this.vx += dirX * pullForce - dirY * swirlForce + driftX;
    this.vy += dirY * pullForce + dirX * swirlForce;
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  };
  InkParticle.prototype.draw = function (ctx) {
    if (this.life <= 0) return;
    ctx.beginPath();
    ctx.moveTo(this.oldX, this.oldY);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = this.color.replace(')', ', ' + (this.life * 0.85) + ')').replace('rgb', 'rgba');
    ctx.lineWidth = this.size;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  function drawGravityGrid() {
    const bhRadius = 40 + radiusGrowth;
    const gridSize = 70;
    const startX = cx - Math.ceil(cx / gridSize) * gridSize;
    const startY = cy - Math.ceil(cy / gridSize) * gridSize;

    function warpPoint(x, y) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return { x: cx, y: cy };
      const pullForce = 22000 / (dist + 80);
      let newDist = dist - pullForce;
      if (newDist < bhRadius) newDist = bhRadius - 1;
      return { x: cx + (dx / dist) * newDist, y: cy + (dy / dist) * newDist };
    }

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(157, 139, 255, 0.15)';
    const step = 15;

    for (let x = startX - w; x <= w * 2; x += gridSize) {
      ctx.beginPath();
      for (let y = -h; y <= h * 2; y += step) {
        const pt = warpPoint(x, y);
        if (y === -h) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
    for (let y = startY - h; y <= h * 2; y += gridSize) {
      ctx.beginPath();
      for (let x = -w; x <= w * 2; x += step) {
        const pt = warpPoint(x, y);
        if (x === -w) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    drawGravityGrid();
    ctx.globalCompositeOperation = 'lighter';

    const MAX_PARTICLES = 75;
    if (inkParticles.length < MAX_PARTICLES) {
      if (Math.random() > 0.82) inkParticles.push(new InkParticle(-20, h * 0.2, 'rgb(138, 180, 255)', 1.2));
      if (Math.random() > 0.90) inkParticles.push(new InkParticle(-20, h * 0.35, 'rgb(157, 139, 255)', 1.5));
    }

    for (let i = inkParticles.length - 1; i >= 0; i--) {
      inkParticles[i].update();
      inkParticles[i].draw(ctx);
      if (inkParticles[i].life <= 0) inkParticles.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }
  animate();

  function syncCoreEl() {
    if (!coreEl) return;
    const baseSize = 80;
    const size = baseSize + radiusGrowth * 2;
    coreEl.style.left = cx + 'px';
    coreEl.style.top = cy + 'px';
    coreEl.style.width = size + 'px';
    coreEl.style.height = size + 'px';
  }
  syncCoreEl();

  if (parallax) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const scrolled = window.scrollY;
        driftY = scrolled * driftPerScrollPx;
        radiusGrowth = Math.min(scrolled * growPerScrollPx, maxGrowth);
        updatePosition();
        syncCoreEl();
        ticking = false;
      });
    });
  }
}
