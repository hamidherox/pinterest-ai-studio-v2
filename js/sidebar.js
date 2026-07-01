/**
 * Tab Navigation Panel Switcher
 */
function showPanel(panelName, element) {
  // 1. Deactivate all tab panels
  const panels = document.querySelectorAll('.panel');
  panels.forEach(p => p.classList.remove('active'));

  // 2. Activate target panel
  const targetPanel = document.getElementById(`panel-${panelName}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // 3. Cycle active CSS highlight classes across navigation buttons
  const navItems = document.querySelectorAll('.sidebar .nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  if (element) {
    element.classList.add('active');
  }
}

// Global script safety stubs so legacy functions in other files won't throw exceptions
function toggleEngineModelDropdown() { return true; }
function toggleEngineUI() { return true; }
