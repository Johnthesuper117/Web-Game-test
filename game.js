// Modify the onBeforeRenderObservable to optimize movement and gravity handling
scene.onBeforeRenderObservable.add(() => {
    const forward = camera.getDirection(BABYLON.Axis.Z);
    const right = camera.getDirection(BABYLON.Axis.X);

    // Ensure movement is restricted to X and Z axes
    forward.y = 0; 
    right.y = 0;

    // Normalize vectors to avoid diagonal speed boost
    forward.normalize();
    right.normalize();

    // Forward/Backward Movement
    if (movement.forward) camera.moveWithCollisions(forward.scale(camera.speed));
    if (movement.backward) camera.moveWithCollisions(forward.scale(-camera.speed));

    // Left/Right Movement
    if (movement.left) camera.moveWithCollisions(right.scale(-camera.speed));
    if (movement.right) camera.moveWithCollisions(right.scale(camera.speed));

    // Improved Gravity Logic
    if (camera.position.y > 1) {
        camera.position.y += scene.gravity.y;
    } else {
        camera.position.y = 1; // Prevent falling through the ground
        isJumping = false; // Allow jumping again
    }
});
