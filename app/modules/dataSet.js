var Publisher = require('publisher');

var _dataSet = (function (){
   function DataSet () {
       Publisher.apply(this, arguments);
   }
   DataSet.prototype = Publisher.prototype;

   DataSet.prototype.sendData = function (data) {
       var incomingData = typeof data === 'object' ? data : {},
           i;
       for (i in incomingData) {
            incomingData[i] = parseInt(incomingData[i]);
            
            if (isNaN(incomingData[i])) {
                alert('Только целочисленные значения');
                return;
            }

          console.log(typeof incomingData[i]);
       } 
       this.trigger(incomingData);
   }

   return DataSet;
}());

module.exports = _dataSet;