let rocks = 0;
let crystals = 0;
let resourcePerClick = 1;
let resourcePerSecond = 0;
let clickUpgradeCost = 10;
let secondUpgradeCost = 10;

// DOM Elements
const rocksCountEl = document.getElementById('rocks-count');
const crystalsCountEl = document.getElementById('crystals-count');
const generateResourceBtn = document.getElementById('generate-resource');
const clickUpgradeBtn = document.getElementById('more-per-click');
const secondUpgradeBtn = document.getElementById('more-per-second');
const clickUpgradeCostEl = document.getElementById('click-upgrade-cost');
const secondUpgradeCostEl = document.getElementById('second-upgrade-cost');
const clickUpgradeLevelEl = document.getElementById('click-upgrade-level');
const secondUpgradeLevelEl = document.getElementById('second-upgrade-level');
const convertRocksBtn = document.getElementById('convert-rocks');

// Update resource display
function updateResourceDisplay() {
  rocksCountEl.textContent = rocks;
  crystalsCountEl.textContent = crystals;
}

// Generate resource manually
generateResourceBtn.addEventListener('click', () => {
  const random = Math.random();
  if (random < 0.9) {
    rocks += resourcePerClick;
  } else {
    crystals += resourcePerClick;
  }
  updateResourceDisplay();
  checkUpgradeAvailability();
});

// Convert 10 rocks to 1 crystal
convertRocksBtn.addEventListener('click', () => {
  if (rocks >= 10) {
    rocks -= 10;
    crystals += 1;
    updateResourceDisplay();
    checkUpgradeAvailability();
  }
});

// Upgrade "More Per Click"
clickUpgradeBtn.addEventListener('click', () => {
  if (crystals >= clickUpgradeCost) {
    crystals -= clickUpgradeCost;
    resourcePerClick += 1;
    clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5);
    clickUpgradeCostEl.textContent = clickUpgradeCost;
    clickUpgradeLevelEl.textContent = resourcePerClick;
    checkUpgradeAvailability();
  }
});

// Upgrade "More Per Second"
secondUpgradeBtn.addEventListener('click', () => {
  if (crystals >= secondUpgradeCost) {
    crystals -= secondUpgradeCost;
    resourcePerSecond += 1;
    secondUpgradeCost = Math.floor(secondUpgradeCost * 1.5);
    secondUpgradeCostEl.textContent = secondUpgradeCost;
    secondUpgradeLevelEl.textContent = resourcePerSecond;
    checkUpgradeAvailability();
  }
});

// Automatic resource generation
setInterval(() => {
  for (let i = 0; i < resourcePerSecond; i++) {
    const random = Math.random();
    if (random < 0.7) {
      rocks += 1;
    } else {
      crystals += 1;
    }
  }
  updateResourceDisplay();
  checkUpgradeAvailability();
}, 1000);

// Check if upgrade buttons should be enabled
function checkUpgradeAvailability() {
  clickUpgradeBtn.disabled = crystals < clickUpgradeCost;
  secondUpgradeBtn.disabled = crystals < secondUpgradeCost;
  convertRocksBtn.disabled = rocks < 10;
}

// Initialize game
updateResourceDisplay();
checkUpgradeAvailability();
