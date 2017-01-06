angular.module('app.directive').directive('segments', [function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: __uri('segments.html'),
        transclude: false,
        scope: {
            segments: "=attrSegments"
        },
        controller: ['$scope', "$injector", function($scope, $injector) {
            require.async('segmentsCtrl.async.js', function(ctrl) {
                $injector.invoke(ctrl, this, { '$scope': $scope });
            })
        }],
        link: function(scope, element, attrs) {
            scope.areas = [];
            scope.devices = [];
            scope.androidVersion = [];
        }
    }
}]).directive('sqlFields', [function() {
    return {
        restrict: 'AE',
        replace: 'false',
        templateUrl: __uri('sqlFields.html')
    }
}])
