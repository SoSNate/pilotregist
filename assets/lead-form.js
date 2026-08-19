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
