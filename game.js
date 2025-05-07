// Initialize Babylon.js Engine and Scene
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Create a Camera
const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 5, -10), scene);
camera.attachControl(canvas, true);
camera.speed = 0.5; // Movement speed

// Add a Light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// Create Terrain
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
const material = new BABYLON.StandardMaterial("groundMaterial", scene);
material.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.4);
ground.material = material;

// Create Slopes
function createSlope(x, z, rotation) {
    const slope = BABYLON.MeshBuilder.CreateBox("slope", { width: 10, height: 1, depth: 20 }, scene);
    slope.position.set(x, 1, z);
    slope.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, rotation, Math.PI / 4);
    return slope;
}
createSlope(0, 10, 0);
createSlope(-10, -10, Math.PI / 2);
createSlope(10, -10, -Math.PI / 2);

// Create Weapon System
let equippedWeapon = null;
const weapons = {
    1: { name: "Semi-Automatic", fireRate: 300 },
    2: { name: "Full-Automatic", fireRate: 100 },
    3: { name: "Shotgun", fireRate: 700 },
    4: { name: "Rocket Launcher", fireRate: 1000 },
};

// Handle Weapon Switching
window.addEventListener("keydown", (event) => {
    const weaponIndex = parseInt(event.key);
    if (weapons[weaponIndex]) {
        equippedWeapon = weapons[weaponIndex];
        console.log(`Equipped: ${equippedWeapon.name}`);
    }
});

// Movement Variables
const movement = { forward: false, backward: false, left: false, right: false, jump: false };
let isJumping = false;

// Movement Event Listeners
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            movement.forward = true;
            break;
        case "s":
            movement.backward = true;
            break;
        case "a":
            movement.left = true;
            break;
        case "d":
            movement.right = true;
            break;
        case " ":
            if (!isJumping) {
                movement.jump = true;
                isJumping = true; // Prevent double jumps
            }
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w":
            movement.forward = false;
            break;
        case "s":
            movement.backward = false;
            break;
        case "a":
            movement.left = false;
            break;
        case "d":
            movement.right = false;
            break;
        case " ":
            movement.jump = false;
            break;
    }
});

// Update Movement
scene.onBeforeRenderObservable.add(() => {
    if (movement.forward) camera.position.z += camera.speed;
    if (movement.backward) camera.position.z -= camera.speed;
    if (movement.left) camera.position.x -= camera.speed;
    if (movement.right) camera.position.x += camera.speed;

    // Jump Logic
    if (movement.jump) {
        const jumpHeight = 0.2;
        const gravity = 0.05;
        camera.position.y += jumpHeight;
        setTimeout(() => {
            camera.position.y -= gravity;
            isJumping = false; // Allow jumping again after landing
        }, 200); // Simulate jump duration
    }
});

// Render Loop
engine.runRenderLoop(() => {
    scene.render();
});

// Resize Event
window.addEventListener("resize", () => {
    engine.resize();
});
