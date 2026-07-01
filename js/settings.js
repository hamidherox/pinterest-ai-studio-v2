// Initialize global state object if not already declared
window.S = window.S || { config: {}, rows: [], posts: [] };

/**
 * 💾 Collect and Save Settings to LocalStorage
 */
function saveConfig() {
  // 1. Read directly from the HTML element IDs
  const openAIKeyEl = document.getElementById('cfg-apikey');
  const kreaKeyEl = document.getElementById('cfg-krea-key');
  const placidTokenEl = document.getElementById('cfg-placid-token');
  const placidUuidEl = document.getElementById('cfg-placid-uuid');
  const siteNameEl = document.getElementById('cfg-site-name');
  const promptTplEl = document.getElementById('cfg-prompt-tpl');
  const wpTextEl = document.getElementById('cfg-wp');
  const keywordsTextEl = document.getElementById('cfg-keywords');

  // 2. Map directly into the global execution object S.config
  S.config.apikey = openAIKeyEl ? openAIKeyEl.value.trim() : '';
  S.config.kreaApiKey = kreaKeyEl ? kreaKeyEl.value.trim() : '';
  S.config.placidToken = placidTokenEl ? placidTokenEl.value.trim() : '';
  S.config.placidUuid = placidUuidEl ? placidUuidEl.value.trim() : '';
  S.config.siteName = siteNameEl ? siteNameEl.value.trim() : '';
  S.config.promptTpl = promptTplEl ? promptTplEl.value : '';
  S.config.wpRaw = wpTextEl ? wpTextEl.value : '';
  S.config.keywordsRaw = keywordsTextEl ? keywordsTextEl.value : '';

  // 3. Persist down to the browser disk storage
  localStorage.setItem('pinforge_config_v3', JSON.stringify(S.config));
  console.log("✓ System Configuration State Sync Complete:", S.config);
}

/**
 * 🔄 Load Saved Settings on Startup
 */
function loadConfig() {
  const saved = localStorage.getItem('pinforge_config_v3');
  if (saved) {
    try {
      S.config = JSON.parse(saved);
      
      // Populate HTML fields on start
      if (S.config.apikey && document.getElementById('cfg-apikey')) document.getElementById('cfg-apikey').value = S.config.apikey;
      if (S.config.kreaApiKey && document.getElementById('cfg-krea-key')) document.getElementById('cfg-krea-key').value = S.config.kreaApiKey;
      if (S.config.placidToken && document.getElementById('cfg-placid-token')) document.getElementById('cfg-placid-token').value = S.config.placidToken;
      if (S.config.placidUuid && document.getElementById('cfg-placid-uuid')) document.getElementById('cfg-placid-uuid').value = S.config.placidUuid;
      if (S.config.siteName && document.getElementById('cfg-site-name')) document.getElementById('cfg-site-name').value = S.config.siteName;
      if (S.config.promptTpl && document.getElementById('cfg-prompt-tpl')) document.getElementById('cfg-prompt-tpl').value = S.config.promptTpl;
      if (S.config.wpRaw && document.getElementById('cfg-wp')) document.getElementById('cfg-wp').value = S.config.wpRaw;
      if (S.config.keywordsRaw && document.getElementById('cfg-keywords')) document.getElementById('cfg-keywords').value = S.config.keywordsRaw;
      
      console.log("✓ Restored operational configuration settings parameters from LocalStorage.");
    } catch (e) {
      console.error("Failed to parse local configurations backup:", e);
    }
  }
}

// Automatically auto-load settings when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  if (typeof renderWPSites === 'function') renderWPSites();
});
