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
camera.speed = 0.2; // Movement speed


// Add a Light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// Create Ground
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
const material = new BABYLON.StandardMaterial("groundMaterial", scene);
material.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.4); // Set ground color
ground.material = material;
ground.checkCollisions = true; // Enable collision for the ground

// Function to Create a Geometric Object
function createGeometricObject({ 
    type = "box", // Type of object: box, sphere, cylinder, etc.
    size = { width: 1, height: 1, depth: 1 }, // Dimensions
    position = { x: 0, y: 0, z: 0 }, // Position
    rotation = { x: 0, y: 0, z: 0 }, // Rotation in radians
    color = { r: 1, g: 1, b: 1 }, // Color (RGB values from 0 to 1)
    materialOptions = {}, // Additional material options if needed
    scene // Reference to the Babylon.js scene
}) {
    // Create the geometric object based on the specified type
    let object;
    if (type === "box") {
        object = BABYLON.MeshBuilder.CreateBox("object", { 
            width: size.width, 
            height: size.height, 
            depth: size.depth 
        }, scene);
    } else if (type === "sphere") {
        object = BABYLON.MeshBuilder.CreateSphere("object", { 
            diameter: size.width 
        }, scene);
    } else if (type === "cylinder") {
        object = BABYLON.MeshBuilder.CreateCylinder("object", { 
            height: size.height, 
            diameter: size.width 
        }, scene);
    } else {
        throw new Error("Unsupported object type");
    }

    // Set position
    object.position.set(position.x, position.y, position.z);

    // Set rotation
    object.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
        rotation.x, 
        rotation.y, 
        rotation.z
    );

    // Create and assign material
    const material = new BABYLON.StandardMaterial("objectMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);

    // Apply additional material options
    Object.assign(material, materialOptions);
    object.material = material;

    // Enable collisions
    object.checkCollisions = true;

    return object;
}

// Example: Replace Slopes with Geometric Objects
/*createGeometricObject({
    type: "box",
    size: { width: 20, height: 2, depth: 40 },
    position: { x: -20, y: 1, z: -20 },
    rotation: { x: 0, y: Math.PI / 2, z: Math.PI / 4 },
    color: { r: 0.8, g: 0.4, b: 0.4 },
    scene: scene
});*/

/*createGeometricObject({
    type: "box",
    size: { width: 20, height: 2, depth: 40 },
    position: { x: 20, y: 1, z: -20 },
    rotation: { x: 0, y: -Math.PI / 2, z: Math.PI / 4 },
    color: { r: 0.8, g: 0.4, b: 0.4 },
    scene: scene
});*/

// Physics and Gravity Setup
scene.gravity = new BABYLON.Vector3(0, -0.1, 0); // Gravity effect
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

// Optimize Movement and Gravity Handling in onBeforeRenderObservable
scene.onBeforeRenderObservable.add(() => {
    const forward = camera.getDirection(BABYLON.Axis.Z);
    const right = camera.getDirection(BABYLON.Axis.X);

    // Restrict movement to X and Z axes only
    forward.y = 0;
    right.y = 0;

    // Normalize vectors to avoid diagonal speed boost
    forward.normalize();
    right.normalize();

    // Forward and Backward Movement
    if (movement.forward) {
        camera.moveWithCollisions(forward.scale(camera.speed));
    }
    if (movement.backward) {
        camera.moveWithCollisions(forward.scale(-camera.speed));
    }

    // Left and Right Movement
    if (movement.left) {
        camera.moveWithCollisions(right.scale(-camera.speed));
    }
    if (movement.right) {
        camera.moveWithCollisions(right.scale(camera.speed));
    }

    // Improved Gravity Logic
    if (camera.position.y > 1) { // If above ground
        camera.position.y += scene.gravity.y; // Apply gravity
    } else {
        camera.position.y = 1; // Reset to ground level
        isJumping = false;     // Allow jumping again
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
