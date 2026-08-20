/**
 * Floating accessibility widget: toggles larger text and higher contrast,
 * persisted in localStorage across visits.
 * Usage: <script src="assets/accessibility.js"></script>
 *        <script>initAccessibilityWidget();</script>
 */
function initAccessibilityWidget() {
  const STORAGE_KEY = 'chashbonautika-a11y';
  const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  function apply() {
    document.documentElement.classList.toggle('a11y-large-text', !!state.largeText);
    document.documentElement.classList.toggle('a11y-high-contrast', !!state.highContrast);
  }
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  apply();

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed; bottom:20px; inset-inline-start:20px; z-index:200;';
  wrap.innerHTML = `
    <div id="a11yPanel" style="display:none; margin-bottom:10px; flex-direction:column; gap:8px; background:var(--bg-deep-2, #0B1330); border:1px solid var(--border-panel, rgba(255,255,255,0.12)); border-radius:16px; padding:12px; min-width:190px; box-shadow:0 8px 32px rgba(0,0,0,0.5);">
      <button id="a11yTextBtn" type="button" style="display:flex; align-items:center; justify-content:space-between; gap:8px; background:rgba(255,255,255,0.05); border:1px solid var(--border-panel, rgba(255,255,255,0.12)); color:var(--text-primary, #EAF0FA); padding:8px 12px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer;">
        <span>הגדלת טקסט</span><span id="a11yTextState">A+</span>
      </button>
      <button id="a11yContrastBtn" type="button" style="display:flex; align-items:center; justify-content:space-between; gap:8px; background:rgba(255,255,255,0.05); border:1px solid var(--border-panel, rgba(255,255,255,0.12)); color:var(--text-primary, #EAF0FA); padding:8px 12px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer;">
        <span>ניגודיות גבוהה</span><span id="a11yContrastState">◐</span>
      </button>
    </div>
    <button id="a11yToggle" type="button" aria-label="אפשרויות נגישות" style="width:48px; height:48px; border-radius:50%; background:var(--accent-blue, #8AB4FF); border:none; color:#060A1A; font-size:20px; cursor:pointer; box-shadow:0 4px 16px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">♿</button>
  `;
  document.body.appendChild(wrap);

  const panel = wrap.querySelector('#a11yPanel');
  const toggleBtn = wrap.querySelector('#a11yToggle');
  const textBtn = wrap.querySelector('#a11yTextBtn');
  const contrastBtn = wrap.querySelector('#a11yContrastBtn');
  const textState = wrap.querySelector('#a11yTextState');
  const contrastState = wrap.querySelector('#a11yContrastState');

  function syncButtons() {
    textState.textContent = state.largeText ? 'פעיל ✓' : 'A+';
    contrastState.textContent = state.highContrast ? 'פעיל ✓' : '◐';
    textBtn.style.borderColor = state.largeText ? 'var(--accent-blue, #8AB4FF)' : '';
    contrastBtn.style.borderColor = state.highContrast ? 'var(--accent-blue, #8AB4FF)' : '';
  }
  syncButtons();

  toggleBtn.addEventListener('click', function () {
    const isOpen = panel.style.display === 'flex';
    panel.style.display = isOpen ? 'none' : 'flex';
  });
  textBtn.addEventListener('click', function () {
    state.largeText = !state.largeText;
    apply(); save(); syncButtons();
  });
  contrastBtn.addEventListener('click', function () {
    state.highContrast = !state.highContrast;
    apply(); save(); syncButtons();
  });
}
