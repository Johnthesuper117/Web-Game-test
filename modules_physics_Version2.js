export class Physics {
    constructor() {
        this.gravity = 9.8; // Default gravity value
    }

    applyGravity(player, deltaTime) {
        if (!player.onGround) {
            player.velocity.y -= this.gravity * deltaTime;
        }

        player.position.y += player.velocity.y * deltaTime;

        // Check if the player is on the ground
        if (player.position.y <= 0) {
            player.position.y = 0;
            player.onGround = true;
            player.velocity.y = 0;

            // Reset wall jump count
            player.wallJumpCount = 0;
        }
    }

    checkWallRun(player, environmentObjects) {
        // Logic to detect if the player is next to a wall and is sprinting mid-air
        const nearWall = environmentObjects.some(obj => {
            const isWall = obj.height > obj.width; // Roughly assume tall objects are walls
            const isNearby =
                Math.abs(player.position.x - obj.x) < 1 &&
                Math.abs(player.position.z - obj.z) < 1;
            return isWall && isNearby;
        });

        if (nearWall && player.velocity.y < 0) {
            // Allow player to "stick" to the wall and reduce falling speed
            player.velocity.y = -this.gravity / 2;
        }
    }
}