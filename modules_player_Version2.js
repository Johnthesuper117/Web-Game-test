export class Player {
    constructor() {
        this.position = { x: 0, y: 0, z: 0 }; // Player's position in 3D space
        this.velocity = { x: 0, y: 0, z: 0 }; // Player's velocity
        this.onGround = false; // Is the player on the ground?
        this.health = 100; // Player's health

        // Movement settings
        this.speed = 5;
        this.jumpHeight = 10;
        this.gravity = 9.8;
        this.sprintMultiplier = 1.5;
        this.crouchSpeed = 2.5;

        // Wall jumping
        this.wallJumpCount = 0;
        this.wallJumpLimit = 3;
    }

    move(direction, deltaTime) {
        // direction: { x, y, z } unit vector for movement
        this.position.x += direction.x * this.speed * deltaTime;
        this.position.z += direction.z * this.speed * deltaTime;
    }

    jump() {
        if (this.onGround) {
            this.velocity.y = this.jumpHeight;
            this.onGround = false;
        }
    }

    applyGravity(deltaTime) {
        if (!this.onGround) {
            this.velocity.y -= this.gravity * deltaTime;
        }
    }

    update(deltaTime) {
        // Update position based on velocity
        this.position.y += this.velocity.y * deltaTime;

        // Check if the player is on the ground
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.onGround = true;
            this.velocity.y = 0;

            // Reset wall jump count
            this.wallJumpCount = 0;
        }
    }
}