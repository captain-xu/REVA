angular.module('app.controller').controller('layerCtrl', [
    "$scope",
    '$stateParams',
    'PowerService',
    '$location',
    function($scope, $stateParams, PowerService, $location) {
        PowerService.setActiveTitle($stateParams.activeTitle);
        $scope.currentUrl = $location.path();
        if ($stateParams.activeTitle == "da") {
            $scope.loadMenu(function() {
                $scope.setTableauTitle();
            });
        } else {
            $scope.loadMenu();
        };
        $scope.linkTo = function(item) {
             $scope.currentUrl = item.url;
        };
        $scope.setTableauTitle = function() {

            if ($scope.sidebarMenu && $scope.sidebarMenu.length > 0) {
                for (var i = 0; i < $scope.sidebarMenu.length; i++) {
                    var menu = $scope.sidebarMenu[i];
                    if (menu.children) {
                        var isBreak = false;
                        for (var y = 0; y < menu.children.length; y++) {
                            if ($scope.currentUrl == menu.children[y].url) {
                                $scope.header_name = menu.children[y].name;
                                isBreak = true;
                                break;
                            }
                        }
                        if (isBreak) {
                            break;
                        }
                    } else if ($scope.currentUrl == menu.url) {
                        $scope.header_name = menu.name;
                        break;
                    }
                };
            }
        };
    }
]);
