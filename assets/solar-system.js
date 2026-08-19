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
  const parallax = options.parallax !== undefined ? options.parallax : true;
  const parallaxYFactor = options.parallaxYFactor !== undefined ? options.parallaxYFactor : -0.2;
  const parallaxXFactor = options.parallaxXFactor !== undefined ? options.parallaxXFactor : 0.08;

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

  if (parallax) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const moveY = scrolled * parallaxYFactor;
      const moveX = scrolled * parallaxXFactor;
      wrap.style.transform = 'translate(' + moveX + 'px,' + moveY + 'px) scale(' + scale + ')';
    });
  }

  wrap.style.transform = 'scale(' + scale + ')';
}
