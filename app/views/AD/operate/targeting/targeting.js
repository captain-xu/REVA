angular.module('app.directive').directive('targeting', [function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: __uri('targeting.html'),
        transclude: false,
        scope: {
            targeting: "=attrTargeting",
            state: "=attrState"
        },
        controller: ['$scope', "$injector", function($scope, $injector) {
            require.async('targetingCtrl.async.js', function(ctrl) {
                $injector.invoke(ctrl, this, { '$scope': $scope });
            })
        }]
    }
}])