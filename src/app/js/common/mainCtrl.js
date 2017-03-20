'use strict';

angular.module('lewaos')
    .controller('MainCtrl', [
        '$scope', 'serviceAPI', '$location', 'toaster','$state',
        function($scope, serviceAPI, $location, toaster,$state) {
            // $scope.pageTitle="Dashboard";
            // $scope.breadcrumb=[];
            $scope.getLoginUser = function() {
                serviceAPI.loadData("/auth/main/getLoginUser").then(function(result) {
                    $scope.userInfo = result.data;
                    $scope.img_url = result.data.iconUrl;
                    if ($location.path().indexOf("/user/login") >= 0) {
                        $location.path('/view/device/dashboard');
                    };
                    toaster.pop({
                        type: 'success',
                        title: 'Welcome to REVA',
                        body: 'An operating platform based on Android OS.',
                        showCloseButton: true,
                        timeout: "3000"

                    });
                }).catch(function() {
                    if ($location.path() != '/user/login') {
                        $location.path('/user/login');
                    }
                });
            };
            $scope.logout = function() {
                serviceAPI.loadData("/auth/main/logout").then(function(result) {
                    $scope.userInfo = {};
                    $location.path('/user/login');
                });
            };
            $scope.getLoginUser();
          
        }
    ]).controller('translateCtrl', ['$scope', '$translate', function($scope, $translate) {
        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
            $scope.language = langKey;
        };
    }]);
