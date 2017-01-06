var scope = ["$scope", "serviceAPI", "ModalAlert", '$state', 'urlAPI',
  function($scope, serviceAPI, ModalAlert, $state, urlAPI) {
    $scope.orderField = 'typeId';
    $scope.desc = true;
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_show_list,$scope.seachParam).then(function(result) {
            $scope.list = result.typeList;
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
        if (vo.typeStatus == 0) {
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
                if (vo.typeStatus == 0) {
                    num = 1;
                };
                var statusParam = {
                    typeId: vo.typeId,
                    typeStatus: num
                }
                serviceAPI.updateData(urlAPI.campaign_show_state,statusParam).then(function(result) {
                    if (result.result == 200) {
                        vo.typeStatus = num;
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
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
                var url = urlAPI.campaign_show_delete;
                var paramId = {
                    typeId: vo.typeId
                }
                serviceAPI.delData(url,paramId).then(function(result){
                    if (result.result == 200) {
                        $scope.loadList();
                    } else {
                        ModalAlert.popup({msg: result.msg}, 2500)
                    }
                })
            }
        });
    };
    $scope.getDetail = function(vo) {
        $state.go("campaign.showtype.detail",{param: 'edit', id: vo.typeId});
    };
    $scope.addTypeData = function() {
        $state.go("campaign.showtype.detail",{param: 'new', id: 0});
    };
    $scope.loadList();
}];
return scope;
