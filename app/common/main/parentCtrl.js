require('PowerService');
angular.module('app.controller').controller('parentCtr', [
    "$scope",
    '$location',
    'ModalAlert',
    'PowerService',
    function($scope, $location, ModalAlert, PowerService) {
        $scope.pathname = "";
        $scope.activeTitle = PowerService.getActiveTitle();
        $scope.img_url = "";
        $scope.initView = function() {
            $scope.getLoginUser();
            // $scope.loadMenu();
            $scope.loadTitle();
        };
        $scope.logout = function() {
            PowerService.logout();
            location.href = "/";
        };
        $scope.getLoginUser = function() {
            PowerService.getInfo("/auth/main/getLoginUser").then(function(result) {
                $scope.userInfo = result.data;
                $scope.img_url = result.data.iconUrl;
            });
        };
        $scope.titleClick = function(title) {
            $location.path(title.url);
        };
        $scope.loadTitle = function() {
            PowerService.getInfo("/auth/main/getTitle").then(function(result) {
                $scope.headerItems = result.data;
                $(".lewaos-header-hidden").show();
                if ($scope.currentUrl == "/" || $scope.currentUrl == "") {
                    $location.path($scope.headerItems[0].url);
                };
            });
        }
        $scope.loadMenu = function(cb) {
            $scope.activeTitle = PowerService.getActiveTitle();
            PowerService.getInfoParam("/auth/main/getMenu", { "menuType": $scope.activeTitle }).then(function(result) {
                $("#lewaos-sidebar").show();
                $scope.sidebarMenu = result.data;
                if (typeof cb == "function") {
                    cb();
                }
            });
        };
        $scope.menuClick = function(event) {
            setTimeout(function() {
                if ($(event.target).hasClass('collapsed')) {
                    $(event.target).find('.glyphicon').removeClass('glyphicon-chevron-down');
                } else {
                    $('.item .glyphicon').removeClass('glyphicon-chevron-down');
                    $(event.target).find('.glyphicon').addClass('glyphicon-chevron-down');
                }
            }, 100)
        };
        $scope.initView();

    }
]);
