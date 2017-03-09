angular.module('app.directive').directive('segment', [function() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: __uri('segment.html'),
        transclude: false,
        scope: {
            segment: "=attrSegment",
            isChild: "@attrChild",
            areas: "=attrAreas",
            devices: "=attrDevices",
            versions: "=attrVersions"
        },
        controller: ['$scope', "$injector", function($scope, $injector) {
            require.async('segmentField.async.js', function(ctrl) {
                $injector.invoke(ctrl, this, { '$scope': $scope });
            })
        }]
    }
}]).directive('segmentField', [function() {
    return {
        restrict: 'AE',
        replace: 'false',
        templateUrl: __uri('segmentField.html')
    }
}])
