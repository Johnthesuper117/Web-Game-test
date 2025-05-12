let resourceCount = 0;
let resourcePerSecond = 0;
let upgradeCost = 10;

// DOM Elements
const resourceCountEl = document.getElementById('resource-count');
const generateResourceBtn = document.getElementById('generate-resource');
const upgradeButton = document.getElementById('upgrade-button');
const upgradeCostEl = document.getElementById('upgrade-cost');

// Update resource display
function updateResourceDisplay() {
  resourceCountEl.textContent = resourceCount;
}

// Generate resource manually
generateResourceBtn.addEventListener('click', () => {
  resourceCount += 1;
  updateResourceDisplay();
  checkUpgradeAvailability();
});

// Upgrade resource generation
upgradeButton.addEventListener('click', () => {
  if (resourceCount >= upgradeCost) {
    resourceCount -= upgradeCost;
    resourcePerSecond += 1;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    upgradeCostEl.textContent = upgradeCost;
    checkUpgradeAvailability();
  }
});

// Check if upgrade button should be enabled
function checkUpgradeAvailability() {
  upgradeButton.disabled = resourceCount < upgradeCost;
}

// Automatic resource generation
setInterval(() => {
  resourceCount += resourcePerSecond;
  updateResourceDisplay();
  checkUpgradeAvailability();
}, 1000);

// Initialize game
updateResourceDisplay();
checkUpgradeAvailability();
