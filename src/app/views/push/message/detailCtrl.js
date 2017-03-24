'use strict';
angular.module('app.controller').controller('msgDetailCtrl', ["$scope", "serviceAPI", '$stateParams', 'urlAPI', '$state',
    function($scope, serviceAPI, $stateParams, urlAPI, $state) {
        $scope.currentStep = 1;
        $scope.targetApp = "";
        $scope.getStep = function() {
            serviceAPI.loadData(urlAPI.push_step, { "pushId": $stateParams.id }).then(function(result) {
                $scope.step = result.data;
            });
        };
        $scope.nextStep = function(num, url) {
            $scope.currentStep = num;
            if ($scope.step < num) {
                $scope.step = num;
            };
            $state.go(url);
        };
        $scope.goStep = function(num) {
            if ($scope.step < num && $scope.step < 3) {
                return;
            };
            $scope.currentStep = num;
            $state.go($scope.targetUrl + num);
        };
        $scope.goList = function() {
            $state.go("view.pushMsgList");
        };
        $scope.setAppName = function(name) {
            $scope.targetApp = name;
        };
        $scope.setPushId = function(id) {
            $scope.pushId = id;
        };
        $scope.init = function() {
            $scope.targetUrl = $stateParams.target;
            if ($stateParams.step > $scope.currentStep) {
                if ($state.current.name.indexOf(".pushDetail.") >= 0) {
                    $state.go('view.pushDetail.step1');
                } else {
                    $state.go('push.edit.targetuser');
                }
            };
            if ($stateParams.id != "new") {
                $scope.pushId = $stateParams.id;
                // $scope.pushId="05a048e415c7937de7a9365540ae1867";
                $scope.getStep();
            } else {
                $scope.pushId = '';
                $scope.step = 1;
            }
        };
        $scope.init();
    }
]);
