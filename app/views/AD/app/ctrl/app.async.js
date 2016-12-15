var scope = ["$scope", "ModalAlert", "serviceAPI", '$state','$stateParams', 'urlAPI', 
 function($scope, ModalAlert, serviceAPI, $state, $stateParams, urlAPI) {
    $scope.orderField = 'appId';
    $scope.desc = true;
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_app_list,$scope.seachParam).then(function(result) {
            $scope.list = result.appList;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
    };
    $scope.searchBlur = function() {
        $scope.loadList();
    };
    $scope.orderBy = function(str) {
        $scope.desc = !$scope.desc;
        $scope.orderField = str;
    };
    $scope.changeState = function(vo) {
        if (vo.appStatus == 0) {
           var  alertValue = "Are you sure to turn it ON";
        }else{
            var  alertValue = "Are you sure to turn it OFF";
        };
        ModalAlert.alert({
            value: alertValue,
            closeBtnValue: "No",
            okBtnValue: "Yes",
            confirm: function() {
                var num = 0;
                if (vo.appStatus == 0) {
                    num = 1;
                }
                var statusParam = {
                    appId: vo.appId,
                    appStatus: num
                }
                serviceAPI.updateData(urlAPI.campaign_app_state,statusParam).then(function(result) {
                    if (result.status == 0 && result.result == 0) {
                        vo.appStatus = num;
                    } else {
                        ModalAlert.popup({
                            msg: result.msg
                        }, 2500);
                    }
                }).catch(function() {})
            }
        });
    };
    $scope.deleteItem = function(vo) {
        ModalAlert.alert({
            value: "Are you sure to delete it?",
            closeBtnValue: "No",
            okBtnValue: "Yes",
            confirm: function() {
                var url = urlAPI.campaign_app_delete;
                var paramId = {
                    appId: vo.appId
                }
                serviceAPI.delData(url,paramId).then(function(result){
                    if (result.status == 0 && result.result == 0) {
                        $scope.loadList();
                    } else {
                        ModalAlert.popup({msg: result.msg}, 2500)
                    }
                })
            }
        });
    };
    $scope.getDetail = function(vo) {
        $state.go("campaign.app.detail",{param: 'edit', id: vo.appId});
    };
    $scope.addData = function() {
        $state.go("campaign.app.detail",{param: 'new', id: 0});
    };
    $scope.loadList();
}];
return scope;
