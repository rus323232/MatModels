
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
        console.log(this._incomingData);
        alert('теперь надо посчитать это говно');
    },
};


module.exports = _calculate;