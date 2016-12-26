angular.module('app.controller').controller('layerCtrl', [
    "$scope",
    '$stateParams',
    'PowerService',
    '$location',
    function($scope, $stateParams, PowerService, $location) {
        PowerService.setActiveTitle($stateParams.activeTitle);
        $scope.currentUrl = $location.path();
        $scope.loadMenu();
        $scope.linkTo = function(item) {
            $scope.currentUrl = item.url;
        };

    }
]);
