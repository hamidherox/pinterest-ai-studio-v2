document.addEventListener("DOMContentLoaded", function() {
  const imgEngineContainer = document.getElementById('image-engine-settings-container');

  if (imgEngineContainer) {
    imgEngineContainer.innerHTML = `
      <div class="setting-group">
        <label for="img-engine-source">Image AI Provider</label>
        <select id="img-engine-source">
          <option value="krea" selected>Krea AI (Exclusive Engine)</option>
        </select>
      </div>

      <div class="setting-group" id="krea-model-group">
        <label for="img-sub-model">Krea Model Profile</label>
        <select id="img-sub-model">
          <option value="krea/krea-2/medium" selected>Krea 2: Medium (Flux Balanced)</option>
          <option value="krea/krea-2/large">Krea 2: Large (High-Detail)</option>
        </select>
      </div>
    `;
  }
});

// Leave an empty stub function so if any old code calls it, your UI won't crash
function toggleEngineUI() {
  return true;
}
