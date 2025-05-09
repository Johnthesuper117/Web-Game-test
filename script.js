console.log("Initializing game...");

import { Player } from "./modules/player.js";
import { HUD } from "./modules/hud.js";
import { Environment } from "./modules/environment.js";
import { Physics } from "./modules/physics.js";
import { Input } from "./modules/input.js";
import { Guns } from "./modules/guns.js";

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

console.log("Canvas initialized:", canvas);

const player = new Player();
const hud = new HUD();
const environment = new Environment();
const physics = new Physics();
const input = new Input(player);
const guns = new Guns(player);

// Initialize environment (e.g., skybox and objects)
environment.createSkybox('./assets/img/sky.png');
environment.createObject({
    x: 100,
    y: 100,
    z: 0,
    width: 50,
    height: 50,
    depth: 50,
    color: "#ff0000"
});

console.log("Environment initialized:", environment);

// Game loop
function gameLoop() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update game logic
    physics.applyGravity(player);
    input.handleInput();
    environment.update();
    hud.update(player);

    // Render the environment
    environment.render(context);
    player.render(context);
    hud.render(context);

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
