export default class StarsBack extends Phaser.GameObjects.Container {

    constructor(scene, x, y, w, h) {
        super(scene, x, y);

        scene.anims.create({
            key: 'stars',
            frames: scene.anims.generateFrameNames('stars_anim', {
                prefix: '001-', start : 62, end: 0, zeroPad: 3, suffix:'.png'}), repeat: -1, frameRate: 12
        });

        this.stars = new StarsBack2(scene, 0, 0, w, h);
        this.add(this.stars);
        this.addMask(scene, this.stars, x, y, w, h);
        this.stars.setAlpha(0);

        this.stars_anim = new StarsBack3(scene, -155, 0);
        this.addMask(scene, this.stars_anim, x, y, w, h);
        this.add(this.stars_anim);
        this.stars_anim.setVisible(false);

    }

    addMask(scene, item, x, y, w, h) {
        const shape = scene.make.graphics();
        shape.fillStyle(0xffffff);
        shape.beginPath();
        shape.fillRect(x, y, w, h);
        const mask = shape.createGeometryMask();
        item.setMask(mask);
    }

    create() {
        this.stars.create();
        this.play();
    }

    play() {
        this.scene.tweens.add({targets : this.stars, alpha : {value : 1, duration : 1000}, repeat : 0})
            .once('complete', () => {
                this.playStars();
        });
    }

    playStars() {
        this.scene.time.delayedCall(3000, () => {
            this.stars_anim.setAlpha(0).setVisible(true);
            this.stars_anim.play();
            this.scene.tweens.add({targets : this.stars_anim, alpha : {value : 1, duration : 1000}, repeat : 0})
                .once('complete', () => {
                    this.scene.time.delayedCall(3100, () => {
                        this.scene.tweens.add({targets : this.stars_anim, alpha : {value : 0, duration : 1200}, repeat : 0})
                            .once('complete', () => {
                                this.stars_anim.setAlpha(0).setVisible(false);
                                this.scene.time.delayedCall(2000, () => {
                                    this.playStars();
                                });
                            });
                        });
                 });
             });
    }

    update(time, delta) {
        this.stars.update(time, delta);
    }
}

class StarsBack3 extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y)
        this.scene = scene;
        this.sprite = scene.add.sprite(0, 0, 'stars_anim', '001-062.png').setOrigin(0, 0).setScale(1.82);
        this.add(this.sprite);
    }

    play() {
        this.sprite.setFrame('001-062.png');
        this.sprite.play('stars');
    }
}

class StarsBack2 extends Phaser.GameObjects.Container {
    constructor(scene, x, y, w, h) {
        super(scene, x, y)
        //scene.add.existing(this);
        this.scene = scene;

        this.starsConfig = {
            width : w,
            height : h
        }
    }

    create() {

        this.points = [];
        this.stars = this.scene.add.group();
        this.maxDepth = 32;

        for (var i = 0; i < 512; i++) {
            this.points.push({
                x: Phaser.Math.Between(-25, 25),
                y: Phaser.Math.Between(-25, 25),
                z: Phaser.Math.Between(1, this.maxDepth)
            });
        }
    }

    update(time, delta) {
        this.stars.clear(true, true);
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];

            point.z -= 0.0125 * delta; //0.2;

            if (point.z <= 0) {
                point.x = Phaser.Math.Between(-25, 25);
                point.y = Phaser.Math.Between(-25, 25);
                point.z = this.maxDepth;
            }

            var px = point.x * (128 / point.z) + (this.starsConfig.width * 0.5);
            var py = point.y * (128 / point.z) + (this.starsConfig.height * 0.5);

            var circle = new Phaser.Geom.Circle(
                px,
                py,
                (1 - point.z / 32) * 2
            );

            var graphics = this.scene.add.graphics({ fillStyle: { color: 0xffffff } });
            graphics.setAlpha((1 - point.z / 32));
            graphics.fillCircleShape(circle);
            this.stars.add(graphics);

            this.add(graphics);

        }
    }
}