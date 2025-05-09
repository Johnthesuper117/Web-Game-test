export class HUD {
    constructor() {
        this.healthBar = document.createElement('div');
        this.gunInfo = document.createElement('div');

        // Style the health bar
        this.healthBar.style.position = 'absolute';
        this.healthBar.style.bottom = '10px';
        this.healthBar.style.left = '10px';
        this.healthBar.style.width = '200px';
        this.healthBar.style.height = '20px';
        this.healthBar.style.backgroundColor = '#ff0000';
        this.healthBar.style.border = '2px solid #000';
        this.healthBar.style.boxSizing = 'border-box';

        // Style the gun info
        this.gunInfo.style.position = 'absolute';
        this.gunInfo.style.bottom = '10px';
        this.gunInfo.style.right = '10px';
        this.gunInfo.style.color = '#fff';
        this.gunInfo.style.fontFamily = 'Arial, sans-serif';
        this.gunInfo.style.fontSize = '16px';

        // Add to the document body
        document.body.appendChild(this.healthBar);
        document.body.appendChild(this.gunInfo);
    }

    update(player) {
        // Update health bar width based on player's health
        this.healthBar.style.width = `${(player.health / 100) * 200}px`;

        // Update gun info (placeholder for now)
        this.gunInfo.innerHTML = `<img src="assets/images/gun.png" alt="Gun" style="height: 50px;">`;
    }

    render() {
        // Rendering is handled by DOM manipulation, so nothing additional is needed here
    }
}