/**
 * Ambient James Webb Space Telescope background illustration: a large,
 * softly floating SVG with scroll parallax that fades as the page scrolls.
 * Purely decorative.
 *
 * Usage:
 *   <div id="jwst-parallax">
 *     <div class="jwst-container"> ...svg... </div>
 *   </div>
 *   <script src="assets/jwst.js"></script>
 *   <script>initJwstParallax();</script>
 */
function initJwstParallax() {
  const wrapper = document.getElementById('jwst-parallax');
  if (!wrapper) return;

  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    const moveY = scrolled * -0.25;
    const opacityFactor = Math.max(0, 1 - (scrolled * 0.002));
    wrapper.style.transform = 'translateY(' + moveY + 'px)';
    wrapper.style.opacity = opacityFactor;
  });
}
