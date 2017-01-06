angular.module('app.directive').directive('checkSegments', [function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: __uri('checkSegments.html'),
        transclude: false,
        scope: {
            checksegments: "=attrSegments"
        }
    }
}]).directive('sqlChecks', [function() {
    return {
        restrict: 'AE',
        replace: 'false',
        templateUrl: __uri('checkSqlFields.html')
    }
}])
