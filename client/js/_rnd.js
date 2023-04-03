class RandomRG {
    constructor(seed) {
        this.setInstance();

        this._seed = seed % 2147483647;
        if (this._seed <= 0) this._seed += 2147483646;
    }

    setInstance() {
        if(random) throw new Error('RandomRG is already created');
        random = this;
    }

    next() {
        return this._seed = this._seed * 16807 % 2147483647;
    }

    nextFloat = function () {
        return (this.next() - 1) / 2147483646;
    }

    nextInt(high) {
        if (high <= 1) return 0;
        return Math.floor(this.nextFloat() * (high));
    }

    shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var num = this.nextInt(i + 1);
            var d = array[num];
            array[num] = array[i];
            array[i] = d;
        }
        return array;
    }

}

var random;

export default RandomRG;
export { random };