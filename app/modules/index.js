var $ = require('jquery');
var DataSet = require('dataSet');
var handler = {
    init: function (arg) {
        console.dir(arg);
    }
}

$('body').ready(function () {
   dataSet = new DataSet ();

  
   dataSet.on(handler.init);

   $('button').click(function (e) { 
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
       dataSet.sendData(answer);    
   });
});