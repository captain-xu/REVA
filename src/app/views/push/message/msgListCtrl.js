'use strict';

angular.module('app.controller').controller('msgListCtrl', [
    "$scope", "serviceAPI", 'urlAPI', "$state", "toaster", "SweetAlert",
    function($scope, serviceAPI, urlAPI, $state, toaster, SweetAlert) {
        $scope.status = [];
        $scope.seachParam = {
            pageSize: 20,
            pageNum: 1,
            appName: "",
            pushType: 2,
            status: $scope.status.toString(),
            keywords: ""
        };
        $scope.timer = null;
        $scope.setParam = function(str) {
            if (str == "status") {
                $scope.seachParam.status = $scope.status.toString();
            };
            if ($scope.seachParam.appName == "All Apps") {
                $scope.seachParam.appName = "";
            };
            if ($scope.seachParam.pushType == "In-App") {
                $scope.seachParam.pushType = 1;
            } else if ($scope.seachParam.pushType == "Push") {
                $scope.seachParam.pushType = 0;
            } else {
                $scope.seachParam.pushType = 2;
            };
            $scope.seachParam.pageSize = 20;
            $scope.seachParam.pageNum = 1;
            $scope.loadList();
        };
        $scope.orderBy = function(str) {
            $scope.desc = !$scope.desc;
            $scope.orderField = str;
        };
        $scope.changeStatus = function(str) {
            var arr = [];
            for (var i = 0; i < $scope.pushStatus.length; i++) {
                if (str == $scope.pushStatus[i].id) {
                    $scope.pushStatus[i].isSelect = false;
                };
                if ($scope.pushStatus[i].isSelect) {
                    arr.push($scope.pushStatus[i].id);
                }
            }
            $scope.status = arr;
            $scope.setParam();
        };
        $scope.loadList = function() {
            $scope.list = [];
            serviceAPI.loadData(urlAPI.push_msgList, $scope.seachParam).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    if (result.data.ListCount == 0 && $scope.seachParam.appName == "" && $scope.seachParam.pushType == 2 && $scope.seachParam.status == "" && $scope.seachParam.keywords == "") {
                        // $location.path('/view/push/empty');
                    } else {
                        $scope.list = result.data.PushList;
                        $scope.totalItems = result.data.ListCount;
                        $(".list-msg").show();
                    }
                }
            })
        };
        $scope.loadApp = function() {
            serviceAPI.loadData(urlAPI.pushAllApp).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.apps = result.data.appnames;
                    $scope.apps.unshift({ appName: "All Apps", packageName: "com.lb.news" });
                }
            })
        };
        $scope.editDetail = function(vo, type) {
            var param = "";
            switch (type) {
                case "report":
                    var sentTime = moment(vo.startTime);
                    var currentTime = moment(new Date());
                    if (sentTime > currentTime) {
                        toaster.pop({
                            type: 'success',
                            body: 'There is no data about the pending task.',
                            showCloseButton: true,
                            timeout: 2500
                        });
                    } else {
                        $location.path("/view/push/overview/" + vo.pushId);
                    }

                    break;
                case "edit":
                    param = "edit"
                        // case "common":
                    if (vo.type == "Push") {
                        $state.go("view.pushDetail.step1", { id: vo.pushId });
                    } else {
                        $location.path("/view/notifications/" + vo.pushId + "/apptargetuser");
                    }
                    break;
                case "duplicate":
                    param = "edit"
                    serviceAPI.loadData(urlAPI.push_duplicate, { "pushId": vo.pushId }).then(function(result) {
                        if (result.status == 1 && result.code == 200) {
                            if (vo.type == "Push") {
                                $state.go("view.pushNotif.step1", { id: result.data.pushId });
                            } else {
                                $location.path("/view/push/editApp/" + result.data.pushId + "/apptargetuser");
                            }
                        } else {
                            toaster.warning({ body: result.msg });
                        }
                    });
                    break;
                case "del":
                    SweetAlert.swal({
                        title: "Are you sure?",
                        text: "Sure to delete this message?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Confirm",
                        closeOnConfirm: true
                    }, function(isConfirm) {
                        if (isConfirm) {
                            serviceAPI.loadData(urlAPI.push_delPush, { "pushId": vo.pushId }).then(function(result) {
                                if (result.status == 1 && result.code == 200) {
                                    vo.status = 'delete';
                                    toaster.success({ body: "Delete Succeeded" });
                                } else {
                                    toaster.warning({ body: result.msg });
                                }
                            })
                        }
                    });
                    break;
                case "inactive":
                    SweetAlert.swal({
                        title: "Are you sure?",
                        text: "If you proceed you will stop the sending activity forcibly, and the operation is irreversible.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Confirm",
                        closeOnConfirm: true
                    }, function(isConfirm) {
                        if (isConfirm) {
                            serviceAPI.loadData(urlAPI.push_inactive, { "pushId": vo.pushId }).then(function(result) {
                                if (result.status == 1 && result.code == 200) {
                                    vo.status = type.replace(/(\w)/, function(v) {
                                        return v.toUpperCase()
                                    });
                                }
                            })
                        }
                    });

            }
        };
        $scope.init = function() {
            $scope.loadApp();
            $scope.loadList();
        };
        $scope.init();
    }
]);
