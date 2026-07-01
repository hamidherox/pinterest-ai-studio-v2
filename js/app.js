// Initialize the global operational state object S
// Ensure window.S is available across all modular script files
window.S = window.S || { rows: [], posts: [], lang: 'German', config: {} };

/**
 * Main Application Startup Lifecycle
 */
document.addEventListener('DOMContentLoaded', () => {
  // Try to restore saved settings parameters immediately on start
  if (typeof loadConfig === 'function') loadConfig();
  if (typeof renderWPSites === 'function') renderWPSites();

  // Initialize Excel/CSV drag-and-drop dropzone gateway loop blocks
  const dz = document.getElementById('dropzone');
  const fi = document.getElementById('file-input');
  
  if (dz && fi) {
    dz.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); });
    dz.addEventListener('dragenter', e => { e.preventDefault(); e.stopPropagation(); });
    dz.addEventListener('drop', e => { 
      e.preventDefault(); 
      e.stopPropagation();
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); 
    });
    fi.addEventListener('change', () => { 
      if (fi.files[0]) handleFile(fi.files[0]); 
    });
  }

  // Set initial operational dashboard metrics count values to zero
  updateHeaderStats();
});

/**
 * Update Header Statistics Display
 */
function updateHeaderStats() {
  const rowsEl = document.getElementById('stat-rows');
  const pubEl = document.getElementById('stat-published');
  const imgEl = document.getElementById('stat-images');
  
  if (rowsEl) rowsEl.textContent = S.rows.length || '0';
  if (pubEl) pubEl.textContent = S.posts.length || '0';
  if (imgEl) imgEl.textContent = S.posts.filter(p => p.imageUrl).length || '0';
}

/**
 * 📢 Global UI Notification Toast Banner Engine
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) {
    console.log(`[Toast Fallback Log]: ${message}`);
    return;
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  // Slide out and remove visibility class after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Destructive Workspace State Reset
 */
function clearAll() {
  if (confirm("Are you sure you want to clear your loaded workspace rows and logs?")) {
    S.rows = [];
    S.posts = [];
    
    updateHeaderStats();
    
    // Flush terminal output boards
    const logBox = document.getElementById('log-box');
    if (logBox) logBox.innerHTML = '<div class="log-line info">Workspace cleared. Core initialized.</div>';
    
    // Clear preview table matrices
    const tbody = document.getElementById('preview-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:32px;">No data processed yet.</td></tr>';
    
    // Clear Excel file input value
    const fi = document.getElementById('file-input');
    if (fi) fi.value = '';
    
    showToast("Workspace flushed successfully.");
  }
}

/**
 * Langauge Pillow Selection Hot-Swapper
 */
function setLanguage(lang, element) {
  S.lang = lang;
  
  // Update UI Pills State Context
  const pills = document.querySelectorAll('.lang-pill');
  pills.forEach(pill => pill.classList.remove('active'));
  
  if (element) {
    element.classList.add('active');
  }
}
