// class Stopwatch extends Phaser.GameObjects.Text {
//
//     constructor(scene, x, y, text, font = { fontSize:'40px',color:'#000000',fontFamily: 'Tahoma' }) {
//         super(scene, x, y, text, font);
//     }
//
//     set time(t) {
//         this.setText(Math.floor(t) / 1000);
//     }
//
//     get time() {
//         return this.text;
//     }
// }

class Stopwatch extends Phaser.GameObjects.BitmapText {

    constructor(scene, x, y, key, text) {
        super(scene, x, y, key, text, 20);
    }

    set time(t) {
        this.setText(Math.floor(t) / 1000);
    }

    get time() {
        return this.text;
    }
}

export default Stopwatch;