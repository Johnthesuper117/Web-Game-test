export class Input {
    constructor(player) {
        this.player = player;
        this.keys = {}; // Stores the state of keys (pressed or not)
        this.pointerLocked = false;

        // Event listeners for keyboard input
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Event listener for mouse input
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Pointer lock setup
        document.body.addEventListener('click', () => this.lockPointer());
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
    }

    onKeyDown(event) {
        this.keys[event.code] = true;
    }

    onKeyUp(event) {
        this.keys[event.code] = false;
    }

    onMouseMove(event) {
        if (this.pointerLocked) {
            const sensitivity = 0.002; // Adjust mouse sensitivity
            this.player.rotation.y -= event.movementX * sensitivity;
            this.player.rotation.x -= event.movementY * sensitivity;

            // Clamp the vertical rotation
            this.player.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.player.rotation.x));
        }
    }

    lockPointer() {
        document.body.requestPointerLock();
    }

    onPointerLockChange() {
        this.pointerLocked = !!document.pointerLockElement;
    }

    handleInput() {
        const deltaTime = 0.016; // Approximate frame time

        // Process movement keys
        if (this.keys['KeyW']) this.player.move({ x: 0, z: -1 }, deltaTime);
        if (this.keys['KeyS']) this.player.move({ x: 0, z: 1 }, deltaTime);
        if (this.keys['KeyA']) this.player.move({ x: -1, z: 0 }, deltaTime);
        if (this.keys['KeyD']) this.player.move({ x: 1, z: 0 }, deltaTime);

        // Jump
        if (this.keys['Space']) this.player.jump();

        // Sprint
        if (this.keys['ShiftLeft']) this.player.speed *= this.player.sprintMultiplier;

        // Crouch or Slide
        if (this.keys['KeyC']) {
            if (this.keys['ShiftLeft']) {
                this.player.speed *= this.player.slideSpeedBoost; // Sliding while sprinting
            } else {
                this.player.speed = this.player.crouchSpeed; // Normal crouching
            }
        }
    }
}