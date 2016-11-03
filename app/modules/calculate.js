
var _calculate = {
    init: function (obj) {
        this._incomingData = obj;
        for (i in this._incomingData) {
            this._incomingData[i] = parseInt(this._incomingData[i]);
            if (isNaN(this._incomingData[i])) {
                alert('Только целочисленные значения');
                return;
            }
       } 
            var mean = 6;

            var L = Math.exp(-mean);
            var p = 1.0;
            var k = 0;

            do {
            k++;
            p *= Math.random(1, 24);
            console.log(k, p, L);
            } while (p > L);

            console.log(k-1);
    },
};


module.exports = _calculate;