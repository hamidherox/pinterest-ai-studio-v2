// Render the image configuration section inside your sidebar panel
const imgEngineContainer = document.getElementById('image-engine-settings-container');

if (imgEngineContainer) {
  imgEngineContainer.innerHTML = `
    <div class="setting-group">
      <label for="img-engine-source">Image AI Provider</label>
      <select id="img-engine-source" onchange="toggleEngineUI()">
        <option value="krea" selected>Krea AI (Production Engine)</option>
      </select>
    </div>

    <div class="setting-group" id="krea-model-group">
      <label for="img-sub-model">Krea Model Profile</label>
      <select id="img-sub-model">
        <option value="krea/krea-2/medium" selected>Krea 2: Medium (Fast / Flux Balanced)</option>
        <option value="krea/krea-2/large">Krea 2: Large (High-Detail / Cinematic)</option>
      </select>
    </div>
  `;
}

function toggleEngineUI() {
  // Always visible now since Krea is our exclusive provider
  const kreaGroup = document.getElementById('krea-model-group');
  if (kreaGroup) kreaGroup.style.display = 'block';
}
