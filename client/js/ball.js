import { random } from './_rnd.js';
import PhysicObject from "./physicObject";
import {rotate} from './utils';

var id = 0;

class Ball extends PhysicObject {

    velocity;
    isCollide;
    switchMode;

    constructor(scene, x, y, key) {
        super(scene, x, y);
        this.add(scene.add.image(0, 0, key).setOrigin(0.5, 0.5));

        this.velocity = {
            x : 0.6,
            y : 0.6
        };

        this.isCollide = false;
        this.switchMode = 0;

        this._id = id++;
    }

    move(delta) {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
        this.rotation += 0.05;
    }

    checkIfCollidedHorizontally(movedBall, spaceWidth) {
        if ((movedBall.x - movedBall.RADIUS < 0) || (movedBall.x + movedBall.RADIUS > spaceWidth)) {
            this.isCollide = true;
            this.switchMode = 1;
        }
    }

    checkIfCollidedVertically(movedBall, spaceHeight) {
        if ((movedBall.y - movedBall.RADIUS < 0) || (movedBall.y + movedBall.RADIUS > spaceHeight)) {
            this.switchMode = 2;
            this.isCollide = true;
        }
    }

    checkIfCollidedWithOthers(movedBall, i, balls) {
        for (let k = 0; k < balls.length; k++) {//TODO: this is a strange thing!
            if (k !== i && balls[k].isCollided(movedBall)) {
                this.isCollide = true;
                this.switchMode = 3;
            }
        }
    }

    checkIfCollidedWithPillows(movedBall, collidedObj, pillows, cb, ctx) {
        for (let k = 0; k < pillows.length; k++) {//TODO: this is a strange thing!
            if (pillows[k].isCollided(movedBall)) {
                this.isCollide = true;
                this.switchMode = 3;

                collidedObj = {x: pillows[k].x, y: pillows[k].y}

                let pillow = pillows[k];
                pillows.splice(k, 1);
                pillow.flyAway(cb, ctx);
                pillow.parentContainer.sendToBack(pillow);
            }
        }
        return collidedObj;
    }

    changeVelocity(collidedObj) {
        switch (this.switchMode) {
            case 1 :
                this.velocity.x *= -1;
                return;
            case 2:
                this.velocity.y *= -1;
                return;
            case 3:
                let dx = collidedObj.x - this.x;
                let dy = collidedObj.y - this.y;
                let vx = this.velocity.x;
                let vy = this.velocity.y;

                let [newX, newY] = rotate(dx, dy, vx, vy);

                this.velocity.x = newX;
                this.velocity.y = newY;
                return;
        }
    }

    // getRandomVelocity(min = this.MIN_V, max = this.MAX_V) {
    //     let phi = 2*Math.PI*/*Math.random()*/random.nextFloat();
    //     let speed = /*Math.random()*/random.nextFloat() * (max - min) + min;
    //     let vX = speed * Math.cos(phi);
    //     let vY = speed * Math.sin(phi);
    //     return [vX, vY];
    // }

}

export default Ball;