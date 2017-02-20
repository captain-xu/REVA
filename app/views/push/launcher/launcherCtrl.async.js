var scope = ["$scope", "serviceAPI", "ModalAlert", '$location', 'urlAPI',
    function($scope, serviceAPI, ModalAlert, $location, urlAPI) {
        $scope.appName = "";
        $scope.status = [];
        $scope.keywords = "";
        $scope.pushStatus = [{
            "id": "Draft",
            "name": "Draft",
            "isSelect": false
        }, {
            "id": "Active",
            "name": "Active",
            "isSelect": false
        }, {
            "id": "Inactive",
            "name": "Inactive",
            "isSelect": false
        }, {
            "id": "Completed",
            "name": "Completed",
            "isSelect": false
        }, {
            "id": "Error",
            "name": "Error",
            "isSelect": false
        }];
        $scope.seachParam = {
            pageSize: 20,
            pageNum: 1,
            status: $scope.status.toString(),
            keywords: $scope.keywords
        };
        $scope.timer = null;
        $scope.setParam = function() {
            if ($scope.seachParam.status != $scope.status.toString() || $scope.seachParam.keywords != $scope.keywords) {
                $scope.seachParam = {
                    pageSize: 20,
                    pageNum: 1,
                    status: $scope.status.toString(),
                    keywords: $scope.keywords
                };
                clearTimeout($scope.timer);
                $scope.timer = setTimeout(function() {
                    $scope.loadList();
                }, 1500);

            }
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
            serviceAPI.loadData(urlAPI.push_launcherList, $scope.seachParam).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.list = result.data.PushList;
                    $scope.totalItems = result.data.ListCount;
                    $(".list-msg").show();
                }   
            })
        };
        $scope.editDetail = function(vo, type) {
            switch (type) {
                // case "report":
                //     var sentTime = moment(vo.startTime);
                //     var currentTime = moment(new Date());
                //     if (sentTime > currentTime) {
                //         ModalAlert.popup({ msg: 'There is no data about the pending task.' }, 2500);
                //     } else {
                //         $location.path("/view/push/overview/" + vo.pushId);
                //     }

                //     break;
                case "edit":
                    $location.path("/view/push/launcherEdit/" + vo.pushId);
                    break;
                case "duplicate":
                    serviceAPI.loadData(urlAPI.push_duplicate, { "pushId": vo.pushId }).then(function(result) {
                        if (result.status == 1 && result.code == 200) {
                            $location.path("/view/push/launcherEdit/" + result.data.pushId);
                        } else {
                            ModalAlert.error({ msg: result.msg }, 2500);
                        }
                    });
                    break;
                case "del":
                    ModalAlert.alert({
                        value: "Sure to delete this message?",
                        closeBtnValue: "Cancel",
                        okBtnValue: "Confirm",
                        confirm: function() {
                            serviceAPI.loadData(urlAPI.push_delPush, { "pushId": vo.pushId }).then(function(result) {
                                if (result.status == 1 && result.code == 200) {
                                    vo.status = 'delete';
                                    ModalAlert.success({ msg: "Delete Succeeded" }, 2500)
                                } else {
                                    ModalAlert.error({ msg: result.msg }, 2500)
                                }
                            })
                        }
                    });
                    break;
                // case "inactive":
                //     ModalAlert.alert({
                //         value: "If you proceed you will stop the sending activity forcibly, and the operation is irreversible. Are you sure? ",
                //         closeBtnValue: "Cancel",
                //         okBtnValue: "Confirm",
                //         confirm: function() {
                //             serviceAPI.loadData(urlAPI.push_inactive, { "pushId": vo.pushId }).then(function(result) {
                //                 if (result.status == 1 && result.code == 200) {
                //                     vo.status = type.replace(/(\w)/, function(v) {
                //                         return v.toUpperCase()
                //                     });
                //                 }
                //             })
                //         }
                //     });
                //     break
            }
        };
        $scope.loadList();
    }
];
return scope;
