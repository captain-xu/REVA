angular.module('app.directive').directive('selfStopPropagation', function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            $(ele).click(function(e) {
                e.stopPropagation();
            })
        }
    };
}).directive('repeatFinish',function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
               $('.banner').unslider({nav: true, arrows: false});
            }
        }
    }
}).directive('changeUrl', function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            scope.changeView();
        }
    };
}).directive('setFocus',[ function(){
    return {
     scope:false,
     link:function(scope, element){                     
         scope.$watch("isFocus",function(newValue,oldValue, scope) {
             if(newValue && scope.isCome){
                 element[0].focus(); //获取焦点
             }
        }, true);
     }
    };//end return
}]);//end setFocus;