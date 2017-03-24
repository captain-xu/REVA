'use strict';

angular.module('app.controller').controller('campaignCreativesCtrl', 
    ["$scope", "serviceAPI", '$state','$stateParams', 'urlAPI', "msgService", "SweetAlert",
        function($scope, serviceAPI, $state, $stateParams, urlAPI, msgService, SweetAlert) {
            $scope.orderField = 'id';
            $scope.desc = true;
            $scope.loadList = function() {
                $scope.listloading = true;
                $scope.listnodata = false;
                serviceAPI.loadData(urlAPI.campaign_creative_list,$scope.seachParam).then(function(result) {
                    if (!result.operationImgList || result.operationImgList.length == 0) {
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
                var alertValue;
                if (vo.imgStatus == 0) {
                    alertValue = "Are you sure to turn it ON";
                }else{
                    alertValue = "Are you sure to turn it OFF";
                };
                SweetAlert.swal({
                    title: alertValue,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#2ec02e",
                    confirmButtonText: "Yes, change it!",
                    closeOnConfirm: false
                }, 
                function(isConfirm){ 
                    if (isConfirm) {
                        var num = 0;
                        if (vo.imgStatus == 0) {
                            num = 1;
                        }
                        var statusParam = {
                             id: vo.id, 
                             status: num
                        };
                        serviceAPI.updateData(urlAPI.campaign_creative_state, statusParam).then(function(result) {
                            if (result.result == 200) {
                                vo.imgStatus = num;
                                SweetAlert.close();
                            } else {
                                SweetAlert.warning("Warning", result.msg);
                            }
                        }).catch(function() {});
                    }
                });
            };
            $scope.deleteItem = function(vo) {
                SweetAlert.swal({
                    title: "Are you sure to delete it?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#2ec02e",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                }, 
                function(isConfirm){ 
                    if (isConfirm) {
                        var url = urlAPI.campaign_creative_delete;
                        var paramId = {
                            id: vo.id
                        };
                        serviceAPI.delData(url, paramId).then(function(result) {
                            if (result.result == 200) {
                                $scope.loadList();
                                SweetAlert.success("Success!", '');
                            } else {
                                SweetAlert.warning("Warning", result.msg);
                            }
                        }).catch(function() {})
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
