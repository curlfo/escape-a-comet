export class MenuScene extends Phaser.Scene {
    width;
    height;
    character;

    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('start', './assets/btn_start.png');
        this.load.image('mary', './assets/imageC.png');
        this.load.image('maria', './assets/imageC.png');
        this.load.image('artur', './assets/arturC.png');
        this.load.bitmapFont('fontMessage', 'assets/font/font1.png', 'assets/font/font1.fnt');
    }

    create() {
        //please turn on the sound
        this.add.bitmapText(this.width / 2, this.height / 8, 'fontMessage', 'please turn on the sound').setOrigin(0.5, 0.5).setScale(3);

        this.character = 'mary';
        let startButton = this.createButton(this.width / 2, 2 * this.height / 3, 'start');
        let maryButton = this.createButton(this.width / 4, this.height / 3, 'mary');
        let arturButton = this.createButton(2 * this.width / 4, this.height / 3, 'artur');
        let mariaButton = this.createButton(3 * this.width / 4, this.height / 3, 'maria');

        mariaButton.alpha = 0.3;
        arturButton.alpha = 0.3;

        startButton.setInteractive().on('pointerup', this.onStartAction.bind(this));
        maryButton.setInteractive().on('pointerdown', () => {
            this.character = 'mary';
            maryButton.alpha = 1;
            arturButton.alpha = 0.3;
            mariaButton.alpha = 0.3;
        });
        arturButton.setInteractive().on('pointerdown', () => {
            this.character = 'artur';
            arturButton.alpha = 1;
            maryButton.alpha = 0.3;
            mariaButton.alpha = 0.3;
        });

        mariaButton.setInteractive().on('pointerdown', () => {
            this.character = 'maria';
            mariaButton.alpha = 1;
            maryButton.alpha = 0.3;
            arturButton.alpha = 0.3;
        });
    }

    createButton (x, y, key) {
        let button = this.add.image(x, y, key);
        button.setOrigin(0.5, 0.5);
        return button;
    }

    init () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
    }

    onStartAction() {
        this.scene.stop('MenuScene');
        this.scene.start('MainScene', this.character);
    }
}