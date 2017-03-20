'use strict';

angular.module('app.controller').controller('campaignCreativesCtrl', 
    ["$scope", "serviceAPI", '$state','$stateParams', 'urlAPI', "msgService",
        function($scope, serviceAPI, $state, $stateParams, urlAPI, msgService) {
            $scope.orderField = 'id';
            $scope.desc = true;
            $scope.loadList = function() {
                $scope.listloading = true;
                $scope.listnodata = false;
                serviceAPI.loadData(urlAPI.campaign_creative_list,$scope.seachParam).then(function(result) {
                    if (!result.operationImgList) {
                        $scope.listloading = false;
                        $scope.listnodata = true;
                        $scope.errorMsg = msgService.no_data;
                    } else {
                        $scope.list = result.operationImgList;
                        $scope.totalItems = result.totalCount;
                        for (var i = 0; i < $scope.list.length; i++) {
                            if (!$scope.list[i].width || $scope.list[i].width == '' || !$scope.list[i].height || $scope.list[i].height == '') {
                                $scope.list[i].size = ''
                            } else {
                                $scope.list[i].size = $scope.list[i].width + "*" + $scope.list[i].height;
                            }
                            
                        }
                        $scope.listloading = false;
                        $scope.listnodata = false;
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
                }).
                catch(function(result) {});
            }
            $scope.orderBy = function(str) {
                $scope.desc = !$scope.desc;
                $scope.orderField = str;
            };
            $scope.campaignFilter = function(vo) {
                $scope.seachParam.campaignName = vo;
                $scope.loadList();
                var camParam = {
                    operationId: vo
                };
                serviceAPI.loadData(urlAPI.campaign_creative_place,camParam).then(function(result) {
                    $scope.placement = result.placements;
                }).
                catch(function(result) {});
            };
            $scope.placementFilter = function(vo) {
                $scope.seachParam.placementName = vo;
                $scope.loadList();
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
                            if (result.result == 200) {
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
                $state.go("view.campaign.creativeEdit", {id: vo.id});
            };
            $scope.loadList();
            $scope.loadCampaignList();
        }
    ]
)
