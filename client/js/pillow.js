import PhysicObject from "./physicObject";

class Pillow extends PhysicObject {

    pillow;
    scene;

    constructor(scene, x, y, source, key) {
        super(scene, x, y);
        this.pillow = scene.add.sprite(0, 0, source, key).setOrigin(0.5, 0.5);
        this.add(this.pillow);
        this.scene = scene;
    }

    createTween(cb, ctx) {

        let tween = this.scene.tweens.add({
            targets : this.pillow,
            alpha : {value : 0.01, duration : 1000},
            scale : {value : 0.01, duration : 1000},
            rotation : {value : 0.5, duration : 1000},
            repeat : 0});

        tween.once('complete', () => {
            cb.call(ctx, this.x, this.y);
            this.destroy();
        });
    }

    flyAway(cb, ctx) {
        this.pillow.setFrame('pillow_bye.png');
        this.createTween(cb, ctx);
    }

    burnAway(cb, ctx) {
        this.pillow.setFrame('pillow_black.png');
        this.createTween(cb, ctx);
    }
}

export default Pillow;