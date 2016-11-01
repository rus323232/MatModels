var Publisher = require('publisher');

var _dataSet = (function (){
   function DataSet () {
       Publisher.apply(this, arguments);
   }
   DataSet.prototype = Publisher.prototype;

   DataSet.prototype.sendData = function (data, type) {
       var incomingData = typeof data === 'object' ? data : {};

       this.trigger(incomingData, type);
   }

   return DataSet;
}());

module.exports = _dataSet;