'use strict';

angular.module('app.controller').controller('campaignOwnerCtrl', 
    ["$scope", "serviceAPI", '$state', '$stateParams', 'urlAPI', "msgService", "SweetAlert",
    function($scope, serviceAPI, $state, $stateParams, urlAPI, msgService, SweetAlert) {
        $scope.orderField = 'id';
        $scope.desc = true;
        $scope.typeList = [{ 'name': 'App/Brand', 'type': '0' }, { 'name': 'AdNetwork/DSP', 'type': '1' }];
        $scope.loadList = function() {
            $scope.listloading = true;
            $scope.listnodata = false;
            serviceAPI.loadData(urlAPI.campaign_owner_list, $scope.seachParam).then(function(result) {
                if (!result.advertisers || result.advertisers.length == 0) {
                    $scope.listloading = false;
                    $scope.listnodata = true;
                    $scope.errorMsg = msgService.no_data;
                } else {
                    $scope.list = result.advertisers;
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
        $scope.typeFilter = function(vo) {
            $scope.seachParam.type = vo;
            $scope.loadList();
        };
        $scope.orderBy = function(str) {
            $scope.desc = !$scope.desc;
            $scope.orderField = str;
        };
        $scope.changeState = function(vo) {
            var alertValue;
            if (vo.status == 0) {
                alertValue = "Are you sure to turn it ON";
            } else {
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
                    if (vo.status == 0) {
                        num = 1;
                    }
                    var statusParam = {
                        id: vo.id,
                        status: num
                    };
                    serviceAPI.updateData(urlAPI.campaign_owner_state, statusParam).then(function(result) {
                        if (result.result == 200) {
                            vo.status = num;
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
                closeOnConfirm: false}, 
                function(isConfirm){ 
                    if (isConfirm) {
                        var url = urlAPI.campaign_owner_delete;
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
                        }).catch(function() {});
                    }
                }
            );
        };
        $scope.getDetail = function(vo) {
            $state.go("view.campaign.ownerEdit", { param: 'edit', id: vo.id });
        };
        $scope.addData = function() {
            $state.go("view.campaign.ownerEdit", { param: 'new', id: 0 });
        };
        $scope.loadList();
    }
])
