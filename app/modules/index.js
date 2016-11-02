var $ = require('jquery');
var Publisher = require('publisher');
var calculate = require('calculate');

$('body').ready(function () {
   dataSet = new Publisher();

   dataSet.on('sendData', calculate.init);

   $('button').on('click keyPress', function (e) { 
       var usersInput = $('input'),
           usersInputName,
           usersInputValue,  
           max = usersInput.length,
           answer = {};
       for (var i = 0; i < max; i++) {
          usersInputName = usersInput.eq(i).attr('name');
          usersInputValue = usersInput.eq(i).val();
          answer[usersInputName] = usersInputValue;
       }
       dataSet.trigger('sendData', answer);    
   });
});