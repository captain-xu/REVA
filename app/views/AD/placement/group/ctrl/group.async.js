var scope = ["$scope", "ModalAlert", "serviceAPI", '$state', 'urlAPI', 
  function($scope, ModalAlert, serviceAPI, $state, urlAPI) {
    $scope.orderField = 'groupId';
    $scope.desc = true;
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_group_list,$scope.seachParam).then(function(result) {
            $scope.list = result.groupList;
             $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
    };
    $scope.loadAppList = function() {
        serviceAPI.loadData(urlAPI.campaign_appList).then(function(result) {
            $scope.appList = result.appList;
            $scope.appList.unshift({appId:'',name:'All'})
        }).
        catch(function(result) {});
    };
    $scope.searchBlur = function() {
        $scope.loadList();
    };
    $scope.versionData = function(){
        var placeParam = {
            app: $scope.detailVO.app, 
            version: $scope.detailVO.version
        }
        serviceAPI.loadData(urlAPI.campaign_group_place,placeParam).then(function(result) {
            $scope.placeList = result.placeList;
        }).
        catch(function(result) {});
    };
    $scope.appFilter = function(vo) {
        $scope.seachParam.appId = vo.appId;
        $scope.filterParam.appfilter = vo.name;
        $scope.loadList();
    };
    $scope.appData = function(){
        var verParam = {
            name: $scope.detailVO.app
        }
        serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
            $scope.version = result.versionList;
        }).
        catch(function(result) {});
        $scope.detailVO.version = '';
        $scope.detailVO.placements = '';
        $scope.detailVO.placementIds = '';
        $scope.placeList = '';
    };
    $scope.orderBy = function(str) {
        $scope.desc = !$scope.desc;
        $scope.orderField = str;
    };
    $scope.pageNumData = function(event) {
        var num = $(event.target).text();
        $(event.target).addClass('btn-primary').siblings().removeClass('btn-primary');
        $scope.listNum = num;
    };
    $scope.changeState = function(vo) {
        var vo1 = vo;
        if (vo1.groupStatus == 0) {
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
                if (vo.groupStatus == 0) {
                    num = 1;
                };
                var statusParam = {
                    groupId: vo.groupId,
                    groupStatus: num
                }
                serviceAPI.updateData(urlAPI.campaign_group_state,statusParam).then(function(result) {
                    if (result.status == 0 && result.result == 0) {
                        vo.groupStatus = num;
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
                var url = urlAPI.campaign_group_delete;
                var paramId = {
                    groupId: vo.groupId
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
    $scope.editList = function(vo) {
        $state.go("campaign.group.detail",{param: 'edit', id: vo.groupId});
    };
    $scope.addData = function() {
        $state.go("campaign.group.detail",{param: 'new', id: 0});
    };
    $scope.loadList();
    $scope.loadAppList();
}];
return scope;
