var scope = ["$scope", "ModalAlert", "$state", "serviceAPI", "urlAPI", '$stateParams',
 function($scope, ModalAlert, $state, serviceAPI, urlAPI, $stateParams) {
    $scope.resubmit = false;
    $scope.getDetail = function() {
        $('.msg').text('');
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
    $scope.validateForm = function(url) {
        if ($scope.detailVO.name != "") {
            $scope.resubmit = true;
            serviceAPI.saveData(url,$scope.detailVO).then(function(result) {
                if (result.status == 0) {
                    history.go(-1);
                } else {
                    $scope.resubmit = false;
                    ModalAlert.popup({msg:result.msg}, 2500);
                }
            }).catch(function() {})
        } else {
            ModalAlert.popup({ msg: "the name value is necessary" }, 2500);
        }
    };
    $scope.saveData = function() {
        var url = urlAPI.campaign_creative_edit;
        if ($scope.detailVO.name.length > 50) {
            ModalAlert.popup({msg:"The length of the name should be less than 50"}, 2500);
            return;
        };
        $scope.validateForm(url);
    };
    $scope.cancel = function(){
        history.go(-1);
    };
    $scope.getDetail();
}];
return scope;
