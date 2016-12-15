angular.module('app.filter').filter('validate',[function(){
	return function(inputValue, param1) {  
        if(inputValue.length > 5){
        	inputValue=inputValue.slice(0,5);
        }
      return inputValue;  
   };
}]);