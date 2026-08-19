/**
 * Single-frame auto-rotating media showcase + full-screen lightbox.
 * - One centered frame cycles through items automatically with a fade
 *   transition; pauses on hover/touch. No horizontal scrolling — the whole
 *   showcase fits on screen at any viewport width.
 * - Lightbox uses object-fit:contain within a viewport-safe box so images
 *   and GIFs never get cropped or require scrolling on mobile.
 *
 * Usage:
 *   <div id="galleryShowcase"></div>
 *   <script src="assets/gallery.js"></script>
 *   <script>initGallery('galleryShowcase', [{src:'a.gif', label:'...'}, ...]);</script>
 */
function initGallery(containerId, items, options) {
  options = options || {};
  const autoAdvanceMs = options.autoAdvanceMs !== undefined ? options.autoAdvanceMs : 4000;
  const container = document.getElementById(containerId);
  if (!container || !items || !items.length) return;

  container.innerHTML = `
    <div class="gallery-frame" style="position:relative; max-width:420px; margin:0 auto;">
      <div class="gallery-frame-box" style="position:relative; width:100%; aspect-ratio:16/22.5; border-radius:24px; overflow:hidden; cursor:pointer; background:#000; border:1px solid var(--border-panel, rgba(255,255,255,0.12));">
        ${items.map(function (item, i) {
          return `<img data-idx="${i}" src="${item.src}" alt="${item.label}"
            style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain; opacity:${i === 0 ? 1 : 0}; transition:opacity 0.6s ease;">`;
        }).join('')}
        <button class="gallery-frame-nav gallery-frame-prev" aria-label="הקודם" style="position:absolute; top:50%; inset-inline-start:14px; transform:translateY(-50%); width:40px; height:40px; border-radius:50%; background:rgba(6,10,26,0.55); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,0.18); color:white; cursor:pointer; z-index:3; display:flex; align-items:center; justify-content:center; font-size:16px;">&rarr;</button>
        <button class="gallery-frame-nav gallery-frame-next" aria-label="הבא" style="position:absolute; top:50%; inset-inline-end:14px; transform:translateY(-50%); width:40px; height:40px; border-radius:50%; background:rgba(6,10,26,0.55); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,0.18); color:white; cursor:pointer; z-index:3; display:flex; align-items:center; justify-content:center; font-size:16px;">&larr;</button>
      </div>
      <p class="gallery-frame-caption" style="margin-top:12px; font-size:14px; text-align:center; color:var(--accent-blue, #8AB4FF); min-height:1.4em;"></p>
      <div class="gallery-dots" style="display:flex; justify-content:center; flex-wrap:wrap; gap:6px; margin-top:8px;">
        ${items.map(function (item, i) {
          return `<button data-idx="${i}" style="width:${i === 0 ? '18px' : '7px'}; height:7px; border-radius:999px; border:none; padding:0;
            background:${i === 0 ? 'var(--accent-blue, #8AB4FF)' : 'rgba(255,255,255,0.25)'}; cursor:pointer; transition:all 0.3s ease;"></button>`;
        }).join('')}
      </div>
    </div>
    <div id="galleryLightbox" style="display:none; position:fixed; inset:0; z-index:999; background:rgba(6,10,26,0.96);
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

  const frameBox = container.querySelector('.gallery-frame-box');
  const frameCaption = container.querySelector('.gallery-frame-caption');
  const frameImgs = Array.prototype.slice.call(container.querySelectorAll('.gallery-frame-box img'));
  const dots = Array.prototype.slice.call(container.querySelectorAll('.gallery-dots button'));
  const lightbox = container.querySelector('#galleryLightbox');
  const imgEl = container.querySelector('#galleryImg');
  const captionEl = container.querySelector('#galleryCaption');
  let currentIdx = 0;
  let autoTimer = null;

  function showFrame(idx) {
    currentIdx = (idx + items.length) % items.length;
    frameImgs.forEach(function (img, i) {
      img.style.opacity = i === currentIdx ? '1' : '0';
    });
    dots.forEach(function (dot, i) {
      dot.style.width = i === currentIdx ? '18px' : '7px';
      dot.style.background = i === currentIdx ? 'var(--accent-blue, #8AB4FF)' : 'rgba(255,255,255,0.25)';
    });
    frameCaption.textContent = items[currentIdx].label;
  }
  showFrame(0);

  function showLightbox(idx) {
    currentIdx = (idx + items.length) % items.length;
    imgEl.src = items[currentIdx].src;
    captionEl.textContent = items[currentIdx].label;
    lightbox.style.display = 'flex';
    showFrame(currentIdx);
  }
  function hideLightbox() { lightbox.style.display = 'none'; }

  frameBox.addEventListener('click', function () { showLightbox(currentIdx); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () { showFrame(parseInt(dot.getAttribute('data-idx'), 10)); });
  });
  container.querySelector('.gallery-frame-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    showFrame(currentIdx - 1);
  });
  container.querySelector('.gallery-frame-next').addEventListener('click', function (e) {
    e.stopPropagation();
    showFrame(currentIdx + 1);
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

  function autoAdvance() { showFrame(currentIdx + 1); }
  function startAuto() { autoTimer = setInterval(autoAdvance, autoAdvanceMs); }
  function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
  startAuto();
  frameBox.addEventListener('mouseenter', stopAuto);
  frameBox.addEventListener('mouseleave', startAuto);
  frameBox.addEventListener('touchstart', stopAuto, { passive: true });
}
