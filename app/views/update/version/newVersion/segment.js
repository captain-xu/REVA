angular.module('app.directive').directive('segment', [function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: __uri('segment.html'),
        transclude: false,
        scope: {
            segment: "=attrSegment",
            isChild: "@attrChild"
        },
        controller: ['$scope', "$injector", function($scope, $injector) {
            require.async('segmentCtrl.async.js', function(ctrl) {
                $injector.invoke(ctrl, this, { '$scope': $scope });
            })
        }],
        link: function(scope, element, attrs) {
            scope.areas = [];
            scope.devices = [];
            scope.androidVersion = [];
        }
    }
}]).directive('sqlField', [function() {
    return {
        restrict: 'AE',
        replace: 'false',
        templateUrl: __uri('sqlField.html')
    }
}])
