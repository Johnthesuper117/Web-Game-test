export class Guns {
    constructor(player) {
        this.player = player;
        this.guns = {}; // Stores all gun configurations
        this.activeGun = null;
        this.bullets = []; // Array to manage bullets fired

        // Load gun configurations from config.json
        fetch('./config.json')
            .then(response => response.json())
            .then(data => {
                this.guns = data.guns;
                this.activeGun = this.guns.gun1; // Default to the first gun
            });

        // Event listener for gun switching
        window.addEventListener('keydown', (e) => this.switchGun(e));

        // Event listener for firing
        window.addEventListener('mousedown', () => this.fire());
    }

    switchGun(event) {
        const gunKey = event.code.replace('Digit', ''); // Convert "Digit1" to "1"
        if (this.guns[`gun${gunKey}`]) {
            this.activeGun = this.guns[`gun${gunKey}`];
        }
    }

    fire() {
        if (!this.activeGun) return;

        const now = Date.now();
        if (!this.lastFireTime) this.lastFireTime = 0;

        // Check rate of fire
        if (now - this.lastFireTime < this.activeGun.rateOfFire * 1000) return;

        this.lastFireTime = now;

        // Fire bullets based on gun configuration
        for (let i = 0; i < this.activeGun.bulletsPerShot; i++) {
            const bullet = {
                x: this.player.position.x,
                y: this.player.position.y,
                z: this.player.position.z,
                speed: this.activeGun.bulletSpeed,
                damage: this.activeGun.bulletDamage,
                direction: this.getBulletDirection(),
            };

            if (this.activeGun.bulletType === 'shotgun') {
                bullet.direction.x += (Math.random() - 0.5) * this.activeGun.bulletSpread;
                bullet.direction.z += (Math.random() - 0.5) * this.activeGun.bulletSpread;
            }

            this.bullets.push(bullet);
        }
    }

    getBulletDirection() {
        // Calculate the forward direction of the player
        const angle = this.player.rotation.y;
        return {
            x: Math.sin(angle),
            y: 0, // Bullets stay horizontal
            z: Math.cos(angle),
        };
    }

    update(deltaTime) {
        // Update bullet positions
        this.bullets.forEach(bullet => {
            bullet.x += bullet.direction.x * bullet.speed * deltaTime;
            bullet.z += bullet.direction.z * bullet.speed * deltaTime;
        });

        // Remove bullets that go out of bounds
        this.bullets = this.bullets.filter(bullet => bullet.x > -50 && bullet.x < 50 && bullet.z > -50 && bullet.z < 50);
    }

    render(context) {
        // Render bullets
        this.bullets.forEach(bullet => {
            context.fillStyle = 'yellow';
            context.beginPath();
            context.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
            context.fill();
        });
    }
}