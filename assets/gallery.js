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
