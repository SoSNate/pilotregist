/**
 * Ambient 3D-style Saturn background: a warm-toned ringed planet with a
 * spinning ring and orbiting moon, plus a starfield canvas. Fixed behind
 * content, with gentle scroll parallax (drift, rotate, scale).
 *
 * Usage:
 *   <canvas id="stars-canvas"></canvas>
 *   <div id="saturn-system" class="saturn-system">
 *     <div class="ring-wrapper ring-back"><div class="saturn-ring-spin"></div></div>
 *     <div class="saturn-globe"></div>
 *     <div class="ring-wrapper ring-front"><div class="saturn-ring-spin"></div></div>
 *     <div class="moon-orbit"><div class="moon"></div></div>
 *   </div>
 *   <script src="assets/saturn.js"></script>
 *   <script>initSaturnStars(); initSaturnParallax({ baseRotate: -15, baseScale: 0.65 });</script>
 */
function initSaturnStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }
  function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 7000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.1,
        speed: Math.random() * 0.01 + 0.005,
        color: Math.random() > 0.8 ? '243, 210, 152' : '255, 255, 255'
      });
    }
  }
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function (star) {
      star.alpha += star.speed;
      if (star.alpha > 0.9 || star.alpha < 0.1) star.speed = -star.speed;
      ctx.fillStyle = 'rgba(' + star.color + ', ' + Math.max(0, star.alpha) + ')';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawStars();
}

function initSaturnParallax(options) {
  options = options || {};
  const baseRotate = options.baseRotate !== undefined ? options.baseRotate : -15;
  const baseScale = options.baseScale !== undefined ? options.baseScale : 0.65;
  const baseOpacity = options.baseOpacity !== undefined ? options.baseOpacity : 0.85;
  const parallax = options.parallax !== undefined ? options.parallax : true;
  const saturnSystem = document.getElementById('saturn-system');
  if (!saturnSystem || !parallax) return;

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const scrolled = window.scrollY;
      const moveY = scrolled * 0.12;
      const rotateZ = baseRotate + (scrolled * -0.015);
      const growth = Math.min(scrolled * 0.00035, baseScale * 0.35);
      const scale = baseScale + growth;
      const fade = Math.max(baseOpacity - scrolled * 0.0006, baseOpacity * 0.35);
      saturnSystem.style.transform = 'translate(-50%, calc(-50% + ' + moveY + 'px)) rotate(' + rotateZ + 'deg) scale(' + scale + ')';
      saturnSystem.style.opacity = fade;
      ticking = false;
    });
  });
}
