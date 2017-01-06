var scope = ["$scope", "ModalAlert", "serviceAPI", '$state','$stateParams', 'urlAPI', 
 function($scope, ModalAlert, serviceAPI, $state, $stateParams, urlAPI) {
    $scope.orderField = 'id';
    $scope.desc = true;
    $scope.typeList = [{'name':'All','type':''},{'name':'App/Brand','type':'0'},{'name':'AdNetwork/DSP','type':'1'}];
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_owner_list,$scope.seachParam).then(function(result) {
            $scope.list = result.advertisers;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
    };
    $scope.searchBlur = function() {
        $scope.loadList();
    };
    $scope.typeFilter = function(vo) {
        $scope.seachParam.type = vo.type;
        $scope.filterParam.typefilter = vo.name;
        $scope.loadList();
    };
    $scope.orderBy = function(str) {
        $scope.desc = !$scope.desc;
        $scope.orderField = str;
    };
    $scope.changeState = function(vo) {
        if (vo.status == 0) {
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
                if (vo.status == 0) {
                    num = 1;
                }
                var statusParam = {
                    id: vo.id,
                    status: num
                }
                serviceAPI.updateData(urlAPI.campaign_owner_state,statusParam).then(function(result) {
                    if (result.result == 200) {
                        vo.status = num;
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
                var url = urlAPI.campaign_owner_delete;
                var paramId = {
                    id: vo.id
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
        $state.go("campaign.owner.detail",{param: 'edit', id: vo.id});
    };
    $scope.addData = function() {
        $state.go("campaign.owner.detail",{param: 'new', id: 0});
    };
    $scope.loadList();
}];
return scope;
