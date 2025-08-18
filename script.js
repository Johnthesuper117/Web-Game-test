// Game variables
let smithingTimer = 10;
let timerActive = false;
let timerValue = smithingTimer;
let swords = 0;
let coins = 0;
let countdownInterval = null;

// DOM references
const smithBtn = document.getElementById('smith-btn');
const timerDisplay = document.getElementById('timer-display');
const swordsDisplay = document.getElementById('swords-display');
const coinsDisplay = document.getElementById('coins-display');
const sellBtn = document.getElementById('sell-btn');

// Render functions
function updateDisplays() {
    swordsDisplay.textContent = `Swords: ${swords}`;
    coinsDisplay.textContent = `Coins: ${coins}`;
}

// Smithing logic
smithBtn.addEventListener('click', () => {
    if (!timerActive) {
        // Start smithing timer
        timerActive = true;
        timerValue = smithingTimer;
        timerDisplay.textContent = `Smithing: ${timerValue}s`;
        countdownInterval = setInterval(() => {
            timerValue--;
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
        timerValue--;
        timerDisplay.textContent = `Smithing: ${timerValue}s`;
    }
});

// Selling logic
sellBtn.addEventListener('click', () => {
    if (swords >= 1) {
        swords--;
        const earned = Math.floor(Math.random() * 6) + 5; // random 5-10
        coins += earned;
        updateDisplays();
    }
});

// Initial display
updateDisplays();
