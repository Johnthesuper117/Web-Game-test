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
try {
    skySphereMaterial.emissiveTexture = new BABYLON.Texture("img/sky.png", scene); // Use sky.png as the texture
} catch (e) {
    console.warn("Sky texture missing. Using fallback color.");
    skySphereMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 1); // Fallback color
}
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
    type = "box", 
    size = { width: 1, height: 1, depth: 1 }, 
    position = { x: 0, y: 0, z: 0 }, 
    rotation = { x: 0, y: 0, z: 0 }, 
    color = { r: 1, g: 1, b: 1 }, 
    materialOptions = {}, 
    scene 
}) {
    let object;
    if (type === "box") {
        object = BABYLON.MeshBuilder.CreateBox("object", { 
            width: size.width, 
            height: size.height, 
            depth: size.depth 
        }, scene);
    } else if (type === "sphere") {
        object = BABYLON.MeshBuilder.CreateSphere("object", { diameter: size.width }, scene);
    } else if (type === "cylinder") {
        object = BABYLON.MeshBuilder.CreateCylinder("object", { 
            height: size.height, 
            diameter: size.width 
        }, scene);
    } else {
        throw new Error("Unsupported object type");
    }

    object.position.set(position.x, position.y, position.z);
    object.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(rotation.x, rotation.y, rotation.z);

    const material = new BABYLON.StandardMaterial("objectMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
    Object.assign(material, materialOptions);
    object.material = material;

    object.checkCollisions = true;

    return object;
}

// Add Objects
createGeometricObject({
    type: "box",
    size: { width: 20, height: 2, depth: 40 },
    position: { x: -40, y: 1, z: -40 },
    rotation: { x: 0, y: Math.PI / 2, z: Math.PI / 4 },
    color: { r: 0.8, g: 0.4, b: 0.4 },
    scene: scene
});

createGeometricObject({
    type: "box",
    size: { width: 20, height: 2, depth: 40 },
    position: { x: 40, y: 1, z: -40 },
    rotation: { x: 0, y: -Math.PI / 2, z: Math.PI / 4 },
    color: { r: 0.8, g: 0.4, b: 0.4 },
    scene: scene
});

// Physics and Gravity Setup
scene.gravity = new BABYLON.Vector3(0, -0.1, 0);
camera.applyGravity = true;

// Enable Collisions
scene.collisionsEnabled = true;
camera.checkCollisions = true;

// Movement Variables
const movement = { forward: false, backward: false, left: false, right: false };
let isJumping = false;

// Movement Event Listeners
window.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
        case "w": movement.forward = true; break;
        case "s": movement.backward = true; break;
        case "a": movement.left = true; break;
        case "d": movement.right = true; break;
        case " ":
            if (!isJumping && Math.abs(camera.position.y - 1) < 0.1) {
                isJumping = true;
                camera.position.y += 1;
            }
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key.toLowerCase()) {
        case "w": movement.forward = false; break;
        case "s": movement.backward = false; break;
        case "a": movement.left = false; break;
        case "d": movement.right = false; break;
        case " ": isJumping = false; break;
    }
});

// Optimized Movement Logic
scene.onBeforeRenderObservable.add(() => {
    const forward = camera.getDirection(BABYLON.Axis.Z);
    const right = camera.getDirection(BABYLON.Axis.X);

    forward.y = 0;
    right.y = 0;

    forward.normalize();
    right.normalize();

    const movementVector = new BABYLON.Vector3();

    if (movement.forward) movementVector.addInPlace(forward);
    if (movement.backward) movementVector.subtractInPlace(forward);
    if (movement.left) movementVector.subtractInPlace(right);
    if (movement.right) movementVector.addInPlace(right);

    movementVector.normalize(); // Prevent diagonal speed boost
    camera.moveWithCollisions(movementVector.scale(camera.speed));

    if (camera.position.y > 1) {
        camera.moveWithCollisions(new BABYLON.Vector3(0, scene.gravity.y, 0));
    } else {
        camera.position.y = 1;
        isJumping = false;
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
