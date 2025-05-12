const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Update game logic here
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
