var scope = ["$scope", "ModalAlert", "serviceAPI", '$state','$stateParams', 'urlAPI', 
 function($scope, ModalAlert, serviceAPI, $state, $stateParams, urlAPI) {
    $scope.orderField = 'id';
    $scope.desc = true;
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_creative_list,$scope.seachParam).then(function(result) {
            $scope.list = result.operationImgList;
            $scope.totalItems = result.totalCount;
            for (var i = 0; i < $scope.list.length; i++) {
                if (!$scope.list[i].width || $scope.list[i].width == '' || !$scope.list[i].height || $scope.list[i].height == '') {
                    $scope.list[i].size = ''
                } else {
                    $scope.list[i].size = $scope.list[i].width + "*" + $scope.list[i].height;
                }
                
            }
        }).
        catch(function(result) {});
    };
    $scope.searchBlur = function() {
        $scope.loadList();
    };
    $scope.loadCampaignList = function() {
        serviceAPI.loadData(urlAPI.campaign_creative_camp).then(function(result) {
            $scope.campaign = result.operList;
            $scope.campaign.unshift({id:'',name:'All'});
        }).
        catch(function(result) {});
    }
    $scope.orderBy = function(str) {
        $scope.desc = !$scope.desc;
        $scope.orderField = str;
    };
    $scope.campaignFilter = function(vo) {
        $scope.seachParam.campaignName = vo.name;
        $scope.filterParam.campfilter = vo.name;
        serviceAPI.loadData(urlAPI.campaign_creative_list,$scope.seachParam).then(function(result) {
            $scope.list = result.operationImgList;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
        var camParam = {
            operationId: vo.id
        }
        serviceAPI.loadData(urlAPI.campaign_creative_place,camParam).then(function(result) {
            $scope.placement = result.placements;
            $scope.placement.unshift({id:'',placement:'All'});
        }).
        catch(function(result) {});
    };
    $scope.placementFilter = function(vo) {
        $scope.seachParam.campaignName = $scope.seachParam.campaignName;
        $scope.seachParam.placementName = vo.placement;
        $scope.filterParam.placefilter = vo.placement;
        serviceAPI.loadData(urlAPI.campaign_creative_list,$scope.seachParam).then(function(result) {
            $scope.list = result.operationImgList;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
    };
    
    $scope.changeState = function(vo) {
        if (vo.imgStatus == 0) {
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
                if (vo.imgStatus == 0) {
                    num = 1;
                };
                var statusParam = {
                     id: vo.id, 
                     status: num
                }
                serviceAPI.updateData(urlAPI.campaign_creative_state, statusParam).then(function(result) {
                    if (result.status == 0 && result.result == 0) {
                        vo.imgStatus = num;
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
                var url = urlAPI.campaign_creative_delete;
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
    $scope.getDetail = function(vo) {
        $state.go("campaign.creative.detail", {id: vo.id});
    };
    $scope.loadList();
    $scope.loadCampaignList();
}];
return scope;
