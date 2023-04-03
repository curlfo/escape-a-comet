export class GameOverScene extends Phaser.Scene {
    width;
    height;
    restartButton;

    constructor() {
        super('GameOverScene');
    }

    preload() {
        this.load.image('gameOver', './assets/gameOver.png');
        this.load.image('restart', './assets/restart.png');
        this.load.bitmapFont('font', 'assets/font/font1.png', 'assets/font/font1.fnt');
    }

    create(score) {
        let gameOver = this.add.image(this.width / 2, this.height / 2, 'gameOver');
        gameOver.setScale(0.2);
        let tween = this.tweens.add({
            targets: gameOver,
            scale: 1,
            duration: 1000,
            repeat: 0
        });
        tween.once('complete', () => {
            this.restartButton = this.createButton(this.width / 2, 5 * this.height / 6, 'restart');
            this.restartButton.setInteractive().on('pointerdown', this.restartScene.bind(this));
            this.add.bitmapText(this.width / 2, this.height / 7, 'font', `your time : ${score} s`).setOrigin(0.5, 0.5).setScale(3);
        });
    }

    init () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
    }

    createButton (x, y, key) {
        let button = this.add.image(x, y, key);
        button.setOrigin(0.5, 0.5).setScale(0.3);
        return button;
    }

    restartScene() {
        this.scene.stop('GameOverScene');
        this.scene.start('MenuScene');
    }

}