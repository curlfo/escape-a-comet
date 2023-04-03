class PhysicObject extends Phaser.GameObjects.Container {
    RADIUS;

    constructor(scene, x, y) {
        super(scene, x, y);
        this.RADIUS = 128;
    }

    isCollided(other) {
        let deltaX = Math.abs(this.x - other.x);
        let deltaY = Math.abs(this.y - other.y);
        let distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        return distance <= (this.RADIUS + other.RADIUS);
    }
}

export default PhysicObject;