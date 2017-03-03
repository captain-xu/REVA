angular.module('app.directive').directive('checkSegment', [function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: __uri('checkSegment.html'),
        transclude: false,
        scope: {
            checksegment: "=attrSegment",
            isChild:"@attrChild"
        }
    }
}]).directive('sqlCheck', [function() {
    return {
        restrict: 'AE',
        replace: 'false',
        templateUrl: __uri('checkSqlField.html')
    }
}])
