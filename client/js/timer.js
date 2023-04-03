class Timer extends Phaser.GameObjects.Container {
    timerView;

    constructor(scene, x, y) {
        super(scene, x, y);
        this.timerView = new TimerBar(scene, 0, 0);
        this.add(this.timerView);
    }
}

class TimerText extends Phaser.GameObjects.Text {
    get view() {
        return Number(this.text);
    }

    set view(value) {
        this.setText(Math.floor(value));
    }

    constructor(scene, x, y, text, font = { fontSize:'40px',color:'#000000',fontFamily: 'Tahoma' }) {
        super(scene, x, y, text, font);
    }
}

class TimerBar extends Phaser.GameObjects.Container{

    bar;
    value;

    get view() {
        return this.value;
    }

    set view(value) {
        this.value = value;
        this.bar.setScale(0.1 * value, 1);
    }

    constructor(scene, x, y) {
        super(scene, x, y);
        this.value = 10;

        let g = scene.make.graphics().fillStyle(0x00ffff).fillRect(0, 0, 400, 40);
        g.generateTexture('hudbar', 400, 30);
        g.destroy();

        this.bar = scene.add.image(0, 0, 'hudbar').setOrigin(0.5, 0.5).setScale(0, 1);
        this.add(this.bar);
    }
}

export default Timer;