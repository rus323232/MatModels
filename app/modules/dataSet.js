var Publisher = require('publisher');

var _dataSet = (function (){
   function DataSet () {
       Publisher.apply(this, arguments);
   }
   DataSet.prototype = Publisher.prototype;

   DataSet.prototype.sendData = function (data) {
       var incomingData = typeof data === 'obj' ? data : {};
       for (i in incomingData) {
           if (typeof incomingData[i] === 'string') {
               throw "Only numer type of data value";
           }
       } 
       this.trigger(data);
   }

   return DataSet;
}());

module.exports = _dataSet;