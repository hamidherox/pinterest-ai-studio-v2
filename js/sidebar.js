function showPanel(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  if (el) {
    el.classList.add('active');
  } else {
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.getAttribute('onclick') && n.getAttribute('onclick').includes(id)) {
        n.classList.add('active');
      }
    });
  }
}

function setLanguage(lang, btn) {
  S.lang = lang;
  document.querySelectorAll('#lang-pills .lang-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  if (typeof log === 'function') {
    log(`Content generation language switched to: ${lang}`, 'info');
  }
}

function toggleEngineModelDropdown() {
  const engine = document.getElementById('img-engine-source').value;
  const sub = document.getElementById('img-sub-model');
  if (!sub) return;
  sub.innerHTML = '';
  
  if (engine === 'pollinations') {
    sub.innerHTML = `
      <option value="flux-realism">Flux Realism (Ultra Photographic)</option>
      <option value="flux">Flux.1 Fast</option>
      <option value="turbo">Turbo Speed Engine</option>
    `;
  } else if (engine === 'krea') {
    sub.innerHTML = `
      <option value="image/krea/krea-2/medium">Krea 2 (Standard Balanced)</option>
      <option value="image/krea/krea-2/turbo">Krea 2 Turbo (Ultra Fast)</option>
      <option value="image/flux/flux-1-schnell">Flux Krea Schnell</option>
    `;
  } else {
    sub.innerHTML = `
      <option value="black-forest-labs/FLUX.1-schnell">FLUX.1-schnell (High-Quality)</option>
      <option value="stabilityai/stable-diffusion-xl-base-1.0">Stable Diffusion XL 1.0</option>
    `;
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show';
  setTimeout(() => t.className = '', 3000);
}