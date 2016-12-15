angular.module('app.directive').directive('pullRefresh', [function() {
    return {
        restrict: 'AE',
        link: function(scope, ele, attr) {
            ele.on('scroll', function() {
                var scrollTop = ele[0].scrollTop;
                //滚动条的高度
                var scrollHeight = ele[0].scrollHeight;
                //窗口的高度
                var offsetHeight = ele[0].offsetHeight;
                //内容可视区域的高度
                if (scrollTop + offsetHeight >= scrollHeight) {
                    scope.$apply(attr.pullRefresh);
                }
            })
        }
    }
}])
