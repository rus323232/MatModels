var $         = require('jquery'),
    dataSet   = require('publisher'),
    calculate = require('calculate'),
    viewer    = require('viewer');

dataSet.on('QTIndicators', function (a) {
     viewer.createQTIndicatorsTable(a);
} ); 
dataSet.on('optimalStrategy', function (a) {
     viewer.answerOut(a);
})  
dataSet.on('sendData', function (arg) {
    calculate.init(arg);
});

$('body').ready(function () {
   $('button').on('click keyPress', function (e) { 
       var usersInput = $('input'),
           max        = usersInput.length,
           data       = {},
           usersInputName,
           usersInputValue,
           i;
          
       for (i = 0; i < max; i++) {
          usersInputName = usersInput.eq(i).attr('name');
          usersInputValue = usersInput.eq(i).val();
          data[usersInputName] = usersInputValue;
       }
       dataSet.trigger('sendData', data);
       $('.result').addClass('visible');    
   });
});
