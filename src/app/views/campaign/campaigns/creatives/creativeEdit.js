'use strict';

angular.module('app.controller').controller('campaignCreativeEditCtrl', 
    ["$scope", "$state", "serviceAPI", "urlAPI", '$stateParams',
    function($scope, $state, serviceAPI, urlAPI, $stateParams) {
        $scope.resubmit = false;
        $scope.getDetail = function() {
            var param = {
                id: $stateParams.id
            };
            serviceAPI.loadData(urlAPI.campaign_creative_detail,param).then(function(result) {
                $scope.detailVO = result.operationImg;
                $scope.picFormat = result.picFormat;
                $scope.img_url = result.showUrl;
            }).
            catch(function(result) {});
        };
        $scope.saveData = function() {
            if (!$scope.detailVO.name) {
                $scope.popAlert('error', 'Error', 'The name value is necessary');
                return;
            } else if ($scope.detailVO.name.length > 50) {
                $scope.popAlert('error', 'Error', 'The length of the name should be less than 50');
                return;
            }
            $scope.resubmit = true;
            serviceAPI.saveData(urlAPI.campaign_creative_edit, $scope.detailVO).then(function(result) {
                if (result.result == 200) {
                    history.go(-1);
                } else {
                    $scope.resubmit = false;
                    $scope.popAlert('error', 'Error', result.msg);
                }
            }).catch(function() {})
        };
        $scope.cancel = function(){
            history.go(-1);
        };
        $scope.getDetail();
    }
])
