// Initialize the global operational state object S
window.S = window.S || { rows: [], posts: [], lang: 'German', config: {} };

/**
 * 📝 WordPress Domain Parser Safety Gateway
 */
function renderWPSites() {
  const previewContainer = document.getElementById('wp-sites-preview');
  if (!previewContainer) return;

  const wpRaw = document.getElementById('cfg-wp') ? document.getElementById('cfg-wp').value : '';
  if (!wpRaw.trim()) {
    previewContainer.innerHTML = '';
    return;
  }

  try {
    const lines = wpRaw.split('\n');
    let html = '<div style="margin-top:10px; font-size:12px; color:var(--muted);">Active Nodes:</div><ul style="padding-left:16px; margin:4px 0;">';
    
    lines.forEach(line => {
      if (line.includes('##')) {
        const parts = line.split('##');
        if (parts[0] && parts[1]) {
          html += `<li><strong>${parts[0].trim()}</strong> ➔ <span style="color:var(--success);">${parts[1].trim()}</span></li>`;
        }
      }
    });
    
    html += '</ul>';
    previewContainer.innerHTML = html;
  } catch (err) {
    console.warn("WordPress preview rendering calculation paused: ", err.message);
  }
}

/**
 * Main Application Startup Lifecycle
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof loadConfig === 'function') loadConfig();
  renderWPSites(); // Safely initialize it immediately on layout build

  const dz = document.getElementById('dropzone');
  const fi = document.getElementById('file-input');
  
  if (dz && fi) {
    dz.addEventListener('dragover', e => { e.preventDefault(); });
    dz.addEventListener('drop', e => { 
      e.preventDefault(); 
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); 
    });
    fi.addEventListener('change', () => { 
      if (fi.files[0]) handleFile(fi.files[0]); 
    });
  }
});

function updateHeaderStats() {
  const rowsEl = document.getElementById('stat-rows');
  const pubEl = document.getElementById('stat-published');
  const imgEl = document.getElementById('stat-images');
  
  if (rowsEl) rowsEl.textContent = S.rows.length || '0';
  if (pubEl) pubEl.textContent = S.posts.length || '0';
  if (imgEl) imgEl.textContent = S.posts.filter(p => p.imageUrl).length || '0';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function clearAll() {
  if (confirm("Are you sure you want to clear your loaded workspace rows and logs?")) {
    S.rows = [];
    S.posts = [];
    updateHeaderStats();
    const logBox = document.getElementById('log-box');
    if (logBox) logBox.innerHTML = '<div class="log-line info">Workspace cleared. Core initialized.</div>';
    const tbody = document.getElementById('preview-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:32px;">No data processed yet.</td></tr>';
    showToast("Workspace flushed successfully.");
  }
}

function setLanguage(lang, element) {
  S.lang = lang;
  const pills = document.querySelectorAll('.lang-pill');
  pills.forEach(pill => pill.classList.remove('active'));
  if (element) element.classList.add('active');
}
