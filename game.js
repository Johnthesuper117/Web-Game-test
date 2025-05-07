// Initialize Babylon.js Engine and Scene
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Add a Spherical Sky
const skySphere = BABYLON.MeshBuilder.CreateSphere("skySphere", { diameter: 1000.0 }, scene);
const skySphereMaterial = new BABYLON.StandardMaterial("skySphereMaterial", scene);
skySphereMaterial.backFaceCulling = false; // Render the inside of the sphere
skySphereMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0); // No diffuse color
skySphereMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // No specular color
skySphereMaterial.emissiveTexture = new BABYLON.Texture("img/sky.png", scene); // Use sky.png as the texture
skySphere.material = skySphereMaterial;


// Create a Camera
const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 5, -10), scene);
camera.attachControl(canvas, true);
camera.speed = 0.1; // Movement speed


// Add a Light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// Create Ground
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
const material = new BABYLON.StandardMaterial("groundMaterial", scene);
material.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.4); // Set ground color
ground.material = material;
ground.checkCollisions = true; // Enable collision for the ground

// Create Slopes
function createSlope(x, z, rotation) {
    const slope = BABYLON.MeshBuilder.CreateBox("slope", { 
        width: 20, 
        height: 2, 
        depth: 40 
    }, scene);
    slope.position.set(x, 1, z);
    slope.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, rotation, Math.PI / 4);
    const slopeMaterial = new BABYLON.StandardMaterial("slopeMaterial", scene);
    slopeMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4); // Set slope color
    slope.material = slopeMaterial;
    slope.checkCollisions = true; // Enable collision for the slope
    return slope;
}

// Add Slopes
createSlope(0, 10, 0);         // Slope 1
createSlope(-20, -20, Math.PI / 2); // Slope 2
createSlope(20, -20, -Math.PI / 2); // Slope 3

createSlope(-20, -20, Math.PI / 2); // Slope 1
createSlope(20, -20, -Math.PI / 2); // Slope 2

// Physics and Gravity Setup
scene.gravity = new BABYLON.Vector3(0, -0.01, 0); // Gravity effect
camera.applyGravity = true;

// Enable Collisions
scene.collisionsEnabled = true;
camera.checkCollisions = true;

// Movement Variables
const movement = { forward: false, backward: false, left: false, right: false };
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
            if (!isJumping && camera.position.y <= 1.1) {
                isJumping = true; // Start jump
                camera.position.y += 1; // Add jump height
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
            isJumping = false; // Reset jumping state when space key is released
            break;
    }
});

// Update Movement
scene.onBeforeRenderObservable.add(() => {
    const forward = camera.getDirection(BABYLON.Axis.Z);
    const right = camera.getDirection(BABYLON.Axis.X);

    // Ensure movement is restricted to X and Z axes
    forward.y = 0; // Remove Y component for forward/backward movement
    right.y = 0;   // Remove Y component for strafing (left/right)

    // Normalize vectors to avoid diagonal speed boost
    forward.normalize();
    right.normalize();

    // Forward/Backward Left/Right Movement
    if (movement.forward) camera.moveWithCollisions(forward.scale(camera.speed));
    if (movement.backward) camera.moveWithCollisions(forward.scale(-camera.speed));
    if (movement.left) camera.moveWithCollisions(right.scale(-camera.speed));
    if (movement.right) camera.moveWithCollisions(right.scale(camera.speed));
    if (movement.left) camera.position.addInPlace(right.scale(-camera.speed));
    if (movement.right) camera.position.addInPlace(right.scale(camera.speed));

    // Apply Gravity
    if (camera.position.y > 1) {
        camera.position.y += scene.gravity.y;
    } else {
        camera.position.y = 1; // Prevent falling through the ground
        isJumping = false; // Allow jumping again
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
