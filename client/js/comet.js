import PhysicObject from "./physicObject";

export default class Comet extends PhysicObject {
    stone;
    tail;

    constructor(scene, x, y) {
        super(scene, x, y);
        this.stone = scene.add.sprite(0, 0, 'picts', 'cometa.png').setOrigin(0.5, 0.5);
        this.tail = scene.add.sprite(0, 0, 'picts', 'tail1.png').setOrigin(0.5, 0.5);
        this.tail.play('flame');
        this.add(this.tail);
        this.add(this.stone);
    }
}