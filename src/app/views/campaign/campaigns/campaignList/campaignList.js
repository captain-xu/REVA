'use strict';

angular.module('app.controller').controller('campaignListCtrl', 
    ["$scope", "serviceAPI", '$state', '$stateParams', 'urlAPI', "msgService",
        function($scope, serviceAPI, $state, $stateParams, urlAPI, msgService) {
            $scope.seachParam.orderBy = 'id';
            $scope.seachParam.order = 0;
            $scope.loadList = function() {
                $scope.listloading = true;
                $scope.listnodata = false;
                if ($scope.seachParam.adNetWork == 2) {
                    $scope.loadAsList();
                } else if ($scope.seachParam.adNetWork == 1) {
                    $scope.loadOpList(urlAPI.campaign_operate_netlist);
                } else {
                    $scope.loadOpList(urlAPI.campaign_operate_list);
                }
            };
            //获取List详情页
            $scope.loadOpList = function(url) {
                serviceAPI.loadData(url, $scope.seachParam).then(function(result) {
                    if (!result.operList) {
                        $scope.listloading = false;
                        $scope.listnodata = true;
                        $scope.errorMsg = msgService.no_data;
                    } else {
                        $scope.list = result.operList;
                        $scope.totalItems = result.totalCount;
                        $scope.listloading = false;
                        $scope.listnodata = false;
                    }
                }).
                catch(function(result) {});
            };
            $scope.loadAsList = function() {
                if ($scope.seachParam.operationId) {
                    var url = urlAPI.campaign_operate_singleAslist;
                } else {
                    var url = urlAPI.campaign_operate_allAslist;
                }
                serviceAPI.loadData(url, $scope.seachParam).then(function(result) {
                    if (!result.offerList) {
                        $scope.listloading = false;
                        $scope.listnodata = true;
                        $scope.errorMsg = msgService.no_data;
                    } else {
                        $scope.aslist = result.offerList;
                        $scope.totalItems = result.totalCount;
                        $scope.listloading = false;
                        $scope.listnodata = false;
                    }
                }).
                catch(function(result) {});
            };
            $scope.searchBlur = function() {
                $scope.loadList();
            };
            //获取下拉列表数据
            $scope.loadAppList = function() {
                serviceAPI.loadData(urlAPI.campaign_appList).then(function(result) {
                    $scope.appList = result.appList;
                }).
                catch(function(result) {});
            };
            //app下拉筛选
            $scope.appFilter = function(vo) {
                $scope.seachParam.appId = vo;
                $scope.loadList();
            };
            //切换operation net 数据
            $scope.detailList = function(num, id) {
                    $scope.seachParam.orderBy = "id";
                    $scope.seachParam.order = 0;
                    if ($scope.seachParam.adNetWork != num) {
                        $scope.seachParam.currentPage = 1;
                        $scope.seachParam.adNetWork = num;
                        if (id) {
                            $scope.seachParam.operationId = id;
                        } else {
                            delete $scope.seachParam.operationId;
                        }
                        if (num == 2) {
                            $scope.loadAsList();
                        } else if (num == 1) {
                            $scope.loadOpList(urlAPI.campaign_operate_netlist);
                        } else {
                            $scope.loadOpList(urlAPI.campaign_operate_list);
                        }
                    }
                }
                //列表排序
            $scope.orderBy = function(str) {
                $scope.seachParam.order = $scope.seachParam.order === 0 ? 1 : 0;
                $scope.seachParam.orderBy = str;
                $scope.loadList();
            };
            /*修改operation状态*/
            $scope.changeState = function(vo) {
                if (vo.status == 0) {
                    var alertValue = "Are you sure to turn it ON";
                } else {
                    var alertValue = "Are you sure to turn it OFF";
                };
                ModalAlert.alert({
                    value: alertValue,
                    closeBtnValue: "No",
                    okBtnValue: "Yes",
                    confirm: function() {
                        var num = 0;
                        if (vo.status == 0) {
                            num = 1;
                        };
                        var statusParam = {
                            id: vo.id,
                            status: num
                        }
                        serviceAPI.updateData(urlAPI.campaign_operate_state, statusParam).then(function(result) {
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
                        var url = urlAPI.campaign_operate_delete;
                        var paramId = {
                            operationId: vo.id
                        }
                        serviceAPI.delData(url, paramId).then(function(result) {
                            if (result.result == 200) {
                                $scope.loadList();
                            } else {
                                ModalAlert.popup({ msg: result.msg }, 2500)
                            }
                        })
                    }
                });
            };
            //operation获取详情数据
            $scope.editOp = function(vo) {
                $state.go("view.campaign.operation", { param: 'edit', id: vo.id });

            };
            //新增operation
            $scope.addOp = function() {
                $state.go("view.campaign.operation", { param: 'new', id: 0 });
            };
            //net获取详情数据
            $scope.editNet = function(net) {
                $state.go("view.campaign.network", { param: 'edit', id: net.id });
            };
            //新增Net
            $scope.addNet = function() {
                $state.go("view.campaign.network", { param: 'new', id: 0 });
            };
            $scope.loadList();
            $scope.loadAppList();
        }
    ]
);
