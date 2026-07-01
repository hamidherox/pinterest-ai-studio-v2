const S = { rows: [], posts: [], lang: 'German', config: {} };

document.addEventListener('DOMContentLoaded', () => {
  loadConfig();

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
/**
 * Destructive Workspace State Reset
 */
function clearAll() {
  if (confirm("Are you sure you want to clear your loaded workspace rows and logs?")) {
    S.rows = [];
    S.posts = [];
    
    // Reset structural metrics counters
    const rowsEl = document.getElementById('stat-rows');
    const pubEl = document.getElementById('stat-published');
    const imgEl = document.getElementById('stat-images');
    
    if (rowsEl) rowsEl.textContent = '0';
    if (pubEl) pubEl.textContent = '0';
    if (imgEl) imgEl.textContent = '0';
    
    // Flush terminal output boards
    const logBox = document.getElementById('log-box');
    if (logBox) logBox.innerHTML = '<div class="log-line info">Workspace cleared. Core initialized.</div>';
    
    // Clear preview table matrices
    const tbody = document.getElementById('preview-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:32px;">No data processed yet.</td></tr>';
    
    showToast("Workspace flushed successfully.");
  }
}
