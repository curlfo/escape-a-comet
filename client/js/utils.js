import { random } from './_rnd.js'

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(/*Math.random()*/random.nextFloat() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function rotate(dx, dy, vx, vy) {

    let cosA = (dx * vx + dy * vy) / (Math.sqrt((dx * dx) + (dy * dy)) * Math.sqrt((vx * vx) + (vy * vy)));
    if(Math.abs(cosA) > 1)
        cosA = Math.sign(cosA);

    let angleA = Math.acos(cosA);
    let newAngle = 2 * (Math.PI/2 - angleA);

    let ortX = dx * Math.cos(Math.PI/2) - dy * Math.sin(Math.PI/2);
    let ortY = dx * Math.sin(Math.PI/2) + dy * Math.cos(Math.PI/2);

    let cosB = (ortX * vx + ortY * vy) / (Math.sqrt((ortX * ortX) + (ortY * ortY)) * Math.sqrt((vx * vx) + (vy * vy)));
    let reverse = cosB < 0;

    let newX;
    let newY;
    if(reverse) {
        newX = vx * Math.cos(newAngle) + vy * Math.sin(newAngle);
        newY = - vx * Math.sin(newAngle) + vy * Math.cos(newAngle);
    }
    else {
        newX = vx * Math.cos(newAngle) - vy * Math.sin(newAngle);
        newY = vx * Math.sin(newAngle) + vy * Math.cos(newAngle);
    }
    return [newX, newY];
}


export {shuffle, rotate};