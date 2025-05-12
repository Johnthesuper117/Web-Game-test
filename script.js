let rocks = 0;
let crystals = 0;
let resourcePerClick = 1;
let resourcePerSecond = 0;
let clickUpgradeCost = 10;
let secondUpgradeCost = 10;

// Crystal Types and Rarities
const crystalTypes = ['Fire', 'Water', 'Earth', 'Air'];
const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'];

const rarityProbabilities = {
  'Common': 40,
  'Uncommon': 25,
  'Rare': 15,
  'Epic': 10,
  'Legendary': 7,
  'Mythical': 3
};

// Inventory to track crystal counts
const crystalInventory = {};

// Initialize inventory
crystalTypes.forEach(type => {
  crystalInventory[type] = {};
  rarities.forEach(rarity => {
    crystalInventory[type][rarity] = 0;
  });
});

function getRandomRarity() {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const [rarity, probability] of Object.entries(rarityProbabilities)) {
    cumulative += probability;
    if (random <= cumulative) {
      return rarity;
    }
  }
  return 'Common';
}

function getRandomCrystal() {
  const crystalType = crystalTypes[Math.floor(Math.random() * crystalTypes.length)];
  const rarity = getRandomRarity();
  return { type: crystalType, rarity: rarity };
}

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
const crystalInventoryEl = document.getElementById('crystal-inventory');

// Update resource display
function updateResourceDisplay() {
  rocksCountEl.textContent = rocks;
  crystalsCountEl.textContent = crystals;
  updateCrystalInventoryDisplay();
}

// Update crystal inventory display
function updateCrystalInventoryDisplay() {
  crystalInventoryEl.innerHTML = '';
  for (const [type, rarities] of Object.entries(crystalInventory)) {
    for (const [rarity, count] of Object.entries(rarities)) {
      if (count > 0) {
        const crystalInfo = document.createElement('p');
        crystalInfo.textContent = `${rarity} ${type}: ${count}`;
        crystalInventoryEl.appendChild(crystalInfo);
      }
    }
  }
}

// Generate resource manually
generateResourceBtn.addEventListener('click', () => {
  const random = Math.random();
  if (random < 0.9) {
    rocks += resourcePerClick;
  } else {
    const newCrystal = getRandomCrystal();
    crystals += resourcePerClick;
    crystalInventory[newCrystal.type][newCrystal.rarity] += 1;
    console.log(`You found a ${newCrystal.rarity} ${newCrystal.type}!`);
  }
  updateResourceDisplay();
  checkUpgradeAvailability();
});

// Convert 10 rocks to 1 crystal
convertRocksBtn.addEventListener('click', () => {
  if (rocks >= 10) {
    rocks -= 10;
    const newCrystal = getRandomCrystal();
    crystals += 1;
    crystalInventory[newCrystal.type][newCrystal.rarity] += 1;
    console.log(`You converted rocks into a ${newCrystal.rarity} ${newCrystal.type}!`);
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
      const newCrystal = getRandomCrystal();
      crystals += 1;
      crystalInventory[newCrystal.type][newCrystal.rarity] += 1;
      console.log(`You found a ${newCrystal.rarity} ${newCrystal.type}!`);
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
