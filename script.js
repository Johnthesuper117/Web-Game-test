// Game variables
let smithingTimer = 10;
let timerActive = false;
let timerValue = smithingTimer;
let swords = 0;
let coins = 0;
let countdownInterval = null;

// Upgrade variables
const materials = [
    { name: "Copper", price: 25, multiplier: 2 },
    { name: "Iron", price: 75, multiplier: 4 },
    { name: "Silver", price: 225, multiplier: 8 },
    { name: "Steel", price: 675, multiplier: 16 }
];
let materialLevel = 0; // index in materials array

const forgeMaxLevel = 10;
let forgeLevel = 1; // starts at I

// DOM references
const smithBtn = document.getElementById('smith-btn');
const timerDisplay = document.getElementById('timer-display');
const swordsDisplay = document.getElementById('swords-display');
const coinsDisplay = document.getElementById('coins-display');
const sellBtn = document.getElementById('sell-btn');

// --- Upgrades DOM ---
const materialBtn = document.getElementById('material-btn');
const materialInfo = document.getElementById('material-info');
const forgeBtn = document.getElementById('forge-btn');
const forgeInfo = document.getElementById('forge-info');

// Render functions
function updateDisplays() {
    swordsDisplay.textContent = `Swords: ${swords}`;
    coinsDisplay.textContent = `Coins: ${coins}`;
    updateUpgradeDisplays();
}

// Upgrades render
function updateUpgradeDisplays() {
    // Material info & button
    materialInfo.textContent = `Material: ${materials[materialLevel].name}`;
    if (materialLevel < materials.length - 1) {
        materialBtn.textContent = `Upgrade Material to ${materials[materialLevel + 1].name} (${materials[materialLevel + 1].price} coins)`;
        materialBtn.disabled = coins < materials[materialLevel + 1].price;
    } else {
        materialBtn.textContent = "Material: Max";
        materialBtn.disabled = true;
    }

    // Forge info & button
    forgeInfo.textContent = `Forge: Tier ${romanNumeral(forgeLevel)}`;
    if (forgeLevel < forgeMaxLevel) {
        forgeBtn.textContent = `Upgrade Forge to Tier ${romanNumeral(forgeLevel + 1)} (${forgeUpgradePrice()} coins)`;
        forgeBtn.disabled = coins < forgeUpgradePrice();
    } else {
        forgeBtn.textContent = "Forge: Max";
        forgeBtn.disabled = true;
    }
}

// Helper for roman numerals
function romanNumeral(num) {
    const numerals = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
    return numerals[num - 1];
}

// Forge upgrade price function (scaling: 50 * tier)
function forgeUpgradePrice() {
    return 50 * forgeLevel;
}

// Smithing logic
smithBtn.addEventListener('click', () => {
    if (!timerActive) {
        // Start smithing timer
        timerActive = true;
        timerValue = smithingTimer - (forgeLevel - 1) * 0.5;
        if (timerValue < 1) timerValue = 1; // minimum 1 second
        timerValue = Math.round(timerValue * 10) / 10; // 1 decimal
        timerDisplay.textContent = `Smithing: ${timerValue}s`;
        countdownInterval = setInterval(() => {
            timerValue -= 1;
            if (timerValue > 0) {
                timerDisplay.textContent = `Smithing: ${timerValue}s`;
            } else {
                clearInterval(countdownInterval);
                swords += 1;
                updateDisplays();
                timerDisplay.textContent = "";
                timerActive = false;
            }
        }, 1000);
    } else if (timerActive && timerValue > 1) {
        // Clicking during countdown reduces time by 1s
        timerValue -= 1;
        if (timerValue < 1) timerValue = 1;
        timerDisplay.textContent = `Smithing: ${timerValue}s`;
    }
});

// Selling logic
sellBtn.addEventListener('click', () => {
    if (swords >= 1) {
        swords--;
        const baseEarned = Math.floor(Math.random() * 6) + 5; // random 5-10
        const earned = baseEarned * materials[materialLevel].multiplier;
        coins += earned;
        updateDisplays();
    }
});

// Material upgrade logic
materialBtn.addEventListener('click', () => {
    if (materialLevel < materials.length - 1 && coins >= materials[materialLevel + 1].price) {
        coins -= materials[materialLevel + 1].price;
        materialLevel++;
        updateDisplays();
    }
});

// Forge upgrade logic
forgeBtn.addEventListener('click', () => {
    if (forgeLevel < forgeMaxLevel && coins >= forgeUpgradePrice()) {
        coins -= forgeUpgradePrice();
        forgeLevel++;
        updateDisplays();
    }
});

// Initial display
updateDisplays();
