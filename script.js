let rocks = 0;
let crystals = 0;
let resourcePerSecond = 0;
let upgradeCost = 10;

// DOM Elements
const rocksCountEl = document.getElementById('rocks-count');
const crystalsCountEl = document.getElementById('crystals-count');
const generateResourceBtn = document.getElementById('generate-resource');
const upgradeButton = document.getElementById('upgrade-button');
const upgradeCostEl = document.getElementById('upgrade-cost');

// Update resource display
function updateResourceDisplay() {
  rocksCountEl.textContent = rocks;
  crystalsCountEl.textContent = crystals;
}

// Generate resource manually
generateResourceBtn.addEventListener('click', () => {
  const random = Math.random();
  if (random < 0.7) {
    // 70% chance: Generate a rock
    rocks += 1;
  } else {
    // 30% chance: Generate a crystal
    crystals += 1;
  }
  updateResourceDisplay();
  checkUpgradeAvailability();
});

// Upgrade resource generation
upgradeButton.addEventListener('click', () => {
  if (crystals >= upgradeCost) {
    crystals -= upgradeCost;
    resourcePerSecond += 1;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    upgradeCostEl.textContent = upgradeCost;
    checkUpgradeAvailability();
  }
});

// Check if upgrade button should be enabled
function checkUpgradeAvailability() {
  upgradeButton.disabled = crystals < upgradeCost;
}

// Automatic resource generation
setInterval(() => {
  for (let i = 0; i < resourcePerSecond; i++) {
    const random = Math.random();
    if (random < 0.7) {
      // 70% chance: Generate a rock
      rocks += 1;
    } else {
      // 30% chance: Generate a crystal
      crystals += 1;
    }
  }
  updateResourceDisplay();
  checkUpgradeAvailability();
}, 1000);

// Initialize game
updateResourceDisplay();
checkUpgradeAvailability();
