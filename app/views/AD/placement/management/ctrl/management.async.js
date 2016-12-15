var scope = ["$scope", "ModalAlert", "serviceAPI",  '$state', 'urlAPI',
 function($scope, ModalAlert, serviceAPI, $state, urlAPI) {
    $scope.orderField = 'id';
    $scope.desc = true;
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_manage_list,$scope.seachParam).then(function(result) {
            $scope.list = result.placeList;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
    };
    $scope.loadAppList = function() {
        serviceAPI.loadData(urlAPI.campaign_appList).then(function(result) {
            $scope.appList = result.appList;
            $scope.typeList = result.typeList;
            $scope.appList.unshift({appId:'',name:'All'});
            $scope.typeList.unshift({typeId:'',name:'All'});
        }).
        catch(function(result) {});
    }
    $scope.searchBlur = function() {
        $scope.loadList();
    };
    $scope.appFilter = function(vo) {
        $scope.seachParam.appId = vo.appId;
        $scope.filterParam.appfilter = vo.name;
        $scope.loadList();
    }
    $scope.typeFilter = function(vo) {
        $scope.seachParam.typeId = vo.typeId;
        $scope.filterParam.typefilter = vo.name;
        $scope.loadList();
    };
    $scope.orderBy = function(str) {
        $scope.desc = !$scope.desc;
        $scope.orderField = str;
    };
    $scope.changeState = function(vo) {
        if (vo.placeStatus == 0) {
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
                if (vo.placeStatus == 0) {
                    num = 1;
                };
                var statusParam = {
                    id: vo.id,
                    placeStatus: num
                }
                serviceAPI.updateData(urlAPI.campaign_manage_state,statusParam).then(function(result) {
                    if (result.status == 0 && result.result == 0) {
                        vo.placeStatus = num;
                    } else {
                        ModalAlert.popup({
                            msg: result.msg
                        }, 2500);
                    }
                }).catch(function() {})
            }
        });
    };
    $scope.editList = function(vo) {
        $state.go("campaign.list.detail",{param: 'edit', id: vo.id});
    };
    $scope.addData = function() {
        $state.go("campaign.list.detail",{param: 'new', id: 0});
    };
    $scope.deleteItem = function(vo) {
        ModalAlert.alert({
            value: "Are you sure to delete it?",
            closeBtnValue: "No",
            okBtnValue: "Yes",
            confirm: function() {
                var url = urlAPI.campaign_manage_delete;
                var paramId = {
                    id: vo.id
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
    $scope.loadList();
    $scope.loadAppList();
}];
return scope;
