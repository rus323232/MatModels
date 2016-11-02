var $ = require('jquery');
var Publisher = require('publisher');
var calculate = require('calculate');

var dataSet = new Publisher();

$('body').ready(function () {

   dataSet.on('sendData', calculate.init);

/*   $('input').keyup(function (e) {
       var notValidChar = /[$A-Za-z[!#$%&*"+,\/:-@\[-`{-~№]+/g;
       this.value = this.value.replace(notValidChar, '');
   });*/
   

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