'use strict';

import {shuffle, rotate} from './utils.js';
import Ball from './ball.js';
import Pillow from './pillow.js';
import Comet from './comet';
import StarsBack from './other/stars_back';
import Timer from "./timer";
import Stopwatch from './stopwatch';

class Space extends Phaser.GameObjects.Container {

    collideWidth;
    collideHeight;

    constructor(scene, x, y, w, h) {
        super(scene, x, y);
        this.collideWidth = w;
        this.collideHeight = h;
    }
}

export class MainScene extends Phaser.Scene {

    BALLS_AMOUNT;
    SCALE_COEF;
    COMET_TWEEN_DURATION;
    TIMER_TWEEN_DURATION;
    character;
    baseLayer
    space;
    ballsList = [];
    pillowAvailable;
    pillowsList = [];
    pillowPoints;
    comet;
    width;
    height;
    pointer;
    timer;
    stopwatch;
    isGameOver;
    startTime;

    debugGraphics;
    debugSpace;

    constructor() {
        super('MainScene');
        this.SCALE_COEF = 0.5;
        this.BALLS_AMOUNT = 1;
        this.COMET_TWEEN_DURATION = 3000;
        this.TIMER_TWEEN_DURATION = 1000;
    }

    preload () {
        this.load.audio('music2',  ['./assets/sound.ogg'] );
        this.load.audio('music1',  ['./assets/fire.ogg'] );
        this.load.audio('music3',  ['./assets/duck.ogg'] );
        this.load.image('mary', './assets/arturC.png');
        this.load.image('space_bg', './assets/space.jpg');
        this.load.image('barbie_bg', './assets/barbie.jpg');
        this.load.atlas('picts', './assets/picts.png', './assets/picts.json');
        this.load.atlas('stars_anim', './assets/stars/stars_anim.webp', './assets/stars/stars_anim.json');
        this.load.bitmapFont('stopwatch', 'assets/font/font1.png', 'assets/font/font1.fnt');
    }

    create (character) {
        this.character = character;

        this.baseLayer = this.add.container(0, 0);
        const barbie_back = this.add.image(0, 0, 'barbie_bg').setOrigin(0, 0);
        this.baseLayer.add(barbie_back);

        const shape = this.make.graphics();
        const mask = shape.fillStyle(0xffffff).beginPath().fillRect(160, 40, 960, 720).createGeometryMask();
        mask.invertAlpha = true;
        barbie_back.setMask(mask);

        //this.baseLayer.add(this.add.image(160, 40, 'space_bg').setOrigin(0, 0));

        //this.starsBack = new StarsBack(this, 160, 40, 960, 720);
        //this.starsBack.create();
        //this.baseLayer.add(this.starsBack);

        this.addMusic();

        this.anims.create({
            key: 'flame',
            frames: this.anims.generateFrameNames('picts', {
                prefix: 'tail', end: 3, zeroPad: 1, start : 1,  suffix:'.png'}), repeat: -1
        });

        this.pointer = this.scene.scene.input.activePointer;
        this.space = this.createSpace(1920, 1440);
        this.baseLayer.add(this.space);
        this.spawnBalls();
        this.pillowPoints = this.getStartPoints();
        this.createCometTween();
        this.timer = new Timer(this, this.width/2, 20, 'bar');
        this.baseLayer.add(this.timer);
        this.stopwatch = new Stopwatch(this, 20, 20, 'stopwatch', 0);
        this.baseLayer.add(this.stopwatch);

        this.events.once('gameOver', this.gameOver, this);
        this.isGameOver = false;
        this.pillowAvailable = true;

        this.startTime = performance.now();

        this.debugGraphics = this.add.graphics();
        this.debugSpace = this.createSpace(1920, 1440);
        this.debugSpace.add(this.debugGraphics);
        this.baseLayer.add(this.debugSpace);
    }

    init () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
    }

    addMusic() {
        if(this.snd_music !== undefined)
            this.snd_music.destroy();

        if(this.character === 'mary')
            this.snd_music = this.sound.add('music1');
        else if(this.character === 'maria')
            this.snd_music = this.sound.add('music3');
        else
            this.snd_music = this.sound.add('music2');

        this.snd_music.play();
    }

    getStartPoints() {
        let radius = 128;
        let points = [];
        for (let xCoord = radius; xCoord < this.space.collideWidth - radius; xCoord += 2 * radius) {
            for (let yCoord = radius; yCoord < this.space.collideHeight - radius; yCoord += 2 * radius) {
                points.push({
                    x: xCoord,
                    y: yCoord
                })
            }
        }
        return points
    }

    createSpace(width = this.width / this.SCALE_COEF, height = this.height / this.SCALE_COEF) {
        let container = new Space(this, 160, 40, width, height);
        container.setScale(this.SCALE_COEF);
        return container;
    }

    spawnBall (key) {
        let points = this.getStartPoints();
        shuffle(points);
        let startPoint = points[0];

        points.every(point => {
            let count = 0;
            this.ballsList.forEach(ball => {
                if (!ball.isCollided({x: point.x, y: point.y, RADIUS : ball.RADIUS})) {
                    count ++;
                }
            });
            if (count === this.ballsList.length) {
                startPoint = point;
                return false;
            }
            return true;
        });

        return new Ball(this, startPoint.x, startPoint.y, key);
    }

    spawnBalls() {
        for (let i = 0 ; i < this.BALLS_AMOUNT; i++) {
            let ball = this.spawnBall(this.character);
            this.space.add(ball);
            this.ballsList.push(ball);
        }
    }

    spawnPillow() {
        let x = (this.pointer.x - this.space.x) / this.SCALE_COEF;
        let y = (this.pointer.y - this.space.y) / this.SCALE_COEF;
        let isCollided = false;
        let isSpawned = false;
        let radius = 128;

        this.pillowPoints.forEach((point, i) => {
            if(Math.abs(point.x - x) <= radius && Math.abs(point.y - y) <= radius) {
                x = point.x;
                y = point.y;
                this.ballsList.forEach(ball => {
                    if(ball.isCollided({x: x, y: y, RADIUS : radius})) {
                        isCollided = true;
                    }
                });

                if(!isCollided) {
                    isSpawned = true;
                    let pillow = new Pillow(this, x, y, 'picts', 'pillow.png');
                    this.space.add(pillow);
                    this.pillowsList.push(pillow);
                    this.pillowPoints.splice(i, 1);
                }
            }
        })

        return isSpawned;
    }

    spawnComet() {
        let radius = 128;
        let xCoords = [];
        for (let x = radius; x < this.space.collideWidth - radius; x += 2 * radius) {
            xCoords.push(x);
        }
        shuffle(xCoords);

        this.comet = new Comet(this, xCoords[0], -1 * radius);
        this.space.add(this.comet);
    }

    createCometTween() {
        this.spawnComet();

        let tween = this.tweens.add({
            targets: this.comet,
            y: this.space.collideHeight + 200,
            duration: this.COMET_TWEEN_DURATION,
            repeat: 0
        });

        tween.once('complete', () => {
            this.comet.destroy();
            this.createCometTween();
        });
    }

    createTimerTween() {
        this.tweens.add({
            targets: this.timer.timerView,
            view: 0,
            duration: this.TIMER_TWEEN_DURATION,
            repeat: 0
        });
    }

    onPillowComplete(x, y) {
        this.pillowPoints.push({
            x: x,
            y: y
        });
    }

    gameOver() {
        // clear object lists
        this.ballsList.splice(0,  this.ballsList.length);
        this.pillowsList.splice(0, this.pillowsList.length);

        // switch scene
        this.scene.stop('MainScene');
        this.scene.start('GameOverScene', this.stopwatch.time);
    }

    getBallsToMove(delta) {
        let toMove = [], collidedObj = null;

        this.ballsList.forEach((ball, i) => {
            ball.isCollide = false;
            let movedBall = Object.create(ball);
            movedBall.move(delta);

            ball.checkIfCollidedHorizontally(movedBall, this.space.collideWidth);
            ball.checkIfCollidedVertically(movedBall, this.space.collideHeight);
            // ball.checkIfCollidedWithOthers(movedBall, i, this.ballsList);
            collidedObj = ball.checkIfCollidedWithPillows(movedBall, collidedObj, this.pillowsList, this.onPillowComplete, this);

            if (ball.isCollide) {
               ball.changeVelocity(collidedObj);
            } else {
                toMove.push(ball);
            }

            // if (ball.isCollided(this.comet)) {
            //     this.isGameOver = true;
            // }
        });

        return toMove;
    }

    moveBalls(delta) {
        this.getBallsToMove(delta).forEach(ball => {
            ball.move(delta);
        });
    }

    addPillowToSpace() {
        if (this.pointer.isDown) {
            if (this.pillowAvailable === true && this.spawnPillow()) {

                this.pillowAvailable = false;
                this.timer.timerView.bar.setScale(1, 1);
                this.timer.timerView.view = 10;
                this.createTimerTween();
                this.time.delayedCall(1000, () => {
                    this.pillowAvailable = true;
                });
            }
        }
    }

    update(time, delta) {
        if(!this.isGameOver) {
            //this.starsBack.update(time, delta);
            this.addPillowToSpace();
            this.stopwatch.time = time - this.startTime;

            this.pillowsList.forEach((pillow, i) => {
                if (this.comet && pillow.isCollided(this.comet)) {
                    let pillow = this.pillowsList[i];
                    this.pillowsList.splice(i, 1);
                    pillow.burnAway(this.onPillowComplete, this);
                    this.space.sendToBack(pillow);
                }
            })

            this.moveBalls(delta);
        }
        else {
            this.events.emit('gameOver');
        }
    }

}