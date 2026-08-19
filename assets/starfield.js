/**
 * Twinkling starfield canvas, fixed full-screen behind all content.
 * Usage: <canvas id="starfield"></canvas>
 *        <script src="assets/starfield.js"></script>
 *        <script>initStarfield();</script>
 */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.7 + 0.15,
        speed: Math.random() * 0.012 + 0.004
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function (star) {
      star.alpha += star.speed;
      if (star.alpha > 0.85 || star.alpha < 0.1) star.speed = -star.speed;
      ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, star.alpha) + ')';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
}
