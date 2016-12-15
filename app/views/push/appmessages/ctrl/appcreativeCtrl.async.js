var scope = ["$scope", "serviceAPI", '$location', "ModalAlert", 'urlAPI', "$anchorScroll",
    function($scope, serviceAPI, $location, ModalAlert, urlAPI, $anchorScroll) {
        $scope.isShow = true;
        $scope.getDefault = function(id, num) {
            return {
                "messageId": '',
                "title": $scope.targetApp,
                "titleLen": 50 - $scope.targetApp.length,
                "content": "",
                "msgLen": 240,
                "options": 0,
                "customdata": [],
                "sound": 1,
                "vibrate": 1,
                "delayidle": 0,
                "target": num,
                "inTitle": "",
                "inContent": "",
                "inmsgLen": 3000,
                "network": 0,
                "inMessageType": "NO UI",
                "inMessageId": '',
                "sendNotification": 1,
                "order": id
            }
        };
        $scope.getValidate = function() {
            return $scope.validateParam = {
                msgWarn: false,
                customWarn: false,
                inmsgWarn: false
            }
        };
        $scope.detail = $scope.getDefault('A', 100);
        $scope.notification = [$scope.detail];
        $scope.getDetail = function() {
            $scope.getValidate();
            serviceAPI.loadData(urlAPI.pushSetInMsg, { "pushId": $scope.pushId }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    if (result.data.InAppList) {
                        $scope.notification = result.data.InAppList;
                        for (var i = 0; i < $scope.notification.length; i++) {
                            if ($scope.notification[i].customdata) {
                                $scope.notification[i].customdata = eval('(' + $scope.notification[i].customdata + ')');
                            } else {
                                $scope.notification[i].customdata = [];
                            }
                            if (!$scope.notification[i].title) {
                                $scope.notification[i].title = $scope.targetApp;
                            }
                            $scope.notification[i].titleLen = 50 - $scope.notification[i].title.length;
                            if ($scope.notification[i].content) {
                                $scope.notification[i].msgLen = 240 - $scope.notification[i].content.length;
                            } else {
                                $scope.notification[i].msgLen = 240;
                            }
                            if ($scope.notification[i].inContent) {
                                $scope.notification[i].inmsgLen = 3000 - $scope.notification[i].inContent.length;
                            } else {
                                $scope.notification[i].inmsgLen = 3000;
                            }
                        };
                        $scope.setOrder();
                        if ($scope.notification.length >= 3) {
                            $scope.isShow = false;
                        }
                    }
                }
            })
        };
        $scope.getDetail();
        $scope.setOrder = function() {
            var total = 100;
            for (var i = 0; i < $scope.notification.length; i++) {
                total = Number(total) - Number($scope.notification[i].target);
                if (i == 0) {
                    $scope.notification[i].order = 'A';
                } else if (i == 1) {
                    $scope.notification[i].order = 'B';
                } else {
                    $scope.notification[i].order = 'C';
                };
            };
            $scope.notification[0].target = Number($scope.notification[0].target) + Number(total);
            $scope.detail = $scope.notification[0];
        };
        $scope.addMeaasge = function() {
            var detail = $scope.getDefault('B', 20);
            if ($scope.notification.length == 1) {
                $scope.notification[0].target = 80;
                detail.order = "B";
            } else {
                if ($scope.notification[0].target < 20) {
                    $scope.notification[1].target = $scope.notification[1].target - 20;
                } else {
                    $scope.notification[0].target = $scope.notification[0].target - 20;
                };
                detail.order = "C";
                $scope.isShow = false;
            };
            $scope.notification.push(detail);
            $scope.changeDetail(detail);
        };

        $scope.changeDetail = function(item) {
            $scope.getValidate();
            $scope.detail = item;
        };
        $scope.changeState = function(param) {
            if ($scope.detail[param] == 1) {
                $scope.detail[param] = 0;
                if (param = 'options') {
                    $scope.detail.customdata = [];
                }
            } else if ($scope.detail[param] == 0) {
                $scope.detail[param] = 1;
            }
        };
        $scope.msgTitle = function() {
            if ($scope.detail.title == "") {
                $scope.detail.title = $scope.targetApp;
                $scope.detail.titleLen = $scope.targetApp.length;
            }
        };
        // 计算百分比
        $scope.setPercentage = function(str) {
            var total = 0;
            for (var i = 0; i < $scope.notification.length; i++) {
                if (Number($scope.notification[i].target) < 1) {
                    $scope.notification[i].target = 1;
                };
                total = Number(total) + Number($scope.notification[i].target);
            };

            if (str == "A") {
                $scope.countNum(1, 2, 0, total);
            } else if (str == "B") {
                $scope.countNum(2, 0, 1, total);
            } else if (str == "C") {
                $scope.countNum(0, 1, 2, total);
            }
        };
        $scope.countNum = function(num1, num2, num3, total) {
            var addNum = 100 - Number(total);
            var targetUser = 0;
            if ($scope.notification[num1]) {
                targetUser = $scope.notification[num1].target;
                total = Number(targetUser) + Number(addNum);
                if (Number(total) > 0) {
                    $scope.notification[num1].target = total;
                } else if (Number(total) < 1) {
                    $scope.notification[num1].target = 1;
                    total = 1 - Number(total);
                    if ($scope.notification[num2]) {
                        targetUser = $scope.notification[num2].target;
                        total = Number(targetUser) - Number(total);
                        if (Number(total) > 0) {
                            $scope.notification[num2].target = total;
                        } else {
                            $scope.notification[num2].target = 1;
                            total = 1 - Number(total);
                            $scope.notification[num3].target = Number($scope.notification[num3].target) - Number(total);
                        }
                    } else {
                        $scope.notification[num3].target = Number($scope.notification[num3].target) - Number(total);
                    }
                }
            } else if ($scope.notification[num2]) {
                targetUser = $scope.notification[num2].target;
                total = Number(targetUser) + Number(addNum);
                if (Number(total) > 0) {
                    $scope.notification[num2].target = total;
                } else if (Number(total) < 1) {
                    $scope.notification[num2].target = 1;
                    total = 1 - Number(total);
                    $scope.notification[num3].target = Number($scope.notification[num3].target) - Number(total);
                }
            } else {
                $scope.notification[num3].target = 100;
            }
        };
        $scope.addCustomData = function() {
            if ($scope.detail.customdata) {
                $scope.detail.customdata.push({ "key": "", "value": "" });
            } else {
                $scope.detail.customdata = [];
                $scope.detail.customdata.push({ "key": "", "value": "" });
            }
        };
        $scope.delCustom = function(index) {
            var length = $scope.detail.customdata.length;
            var arr = $scope.detail.customdata;
            if (index == 0) {
                $scope.detail.customdata = arr.slice(index + 1, length);
            } else {
                $scope.detail.customdata = arr.slice(0, index).concat(arr.slice(index + 1, length));
            }
            $scope.validateParam.customWarn = false;
            /*$scope.setOrder();*/
        };
        $scope.delDetail = function(index) {
            ModalAlert.alert({
                value: "Are you sure to delete Meaasge " + $scope.notification[index].order,
                closeBtnValue: "No",
                okBtnValue: "Yes",
                confirm: function() {
                    if ($scope.notification[index].inMessageId == 0) {
                        var length = $scope.notification.length;
                        var arr = $scope.notification;
                        if (index == 0) {
                            $scope.notification = arr.slice(index + 1, length);
                        } else {
                            $scope.notification = arr.slice(0, index).concat(arr.slice(index + 1, length));
                        };
                        $scope.setOrder();
                    } else {
                        serviceAPI.delData(urlAPI.pushDelInMsg, { "inMessageId": $scope.notification[index].inMessageId }).then(function(result) {
                            if (result.status == 1 && result.code == 200) {
                                var length = $scope.notification.length;
                                var arr = $scope.notification;
                                if (index == 0) {
                                    $scope.notification = arr.slice(index + 1, length);
                                } else {
                                    $scope.notification = arr.slice(0, index).concat(arr.slice(index + 1, length));
                                };
                                $scope.setOrder();
                            } else {
                                ModalAlert.popup({ msg: result.msg }, 2500);
                            };
                        })
                    }
                }
            });
        };
        $scope.titleSum = function() {
            $scope.detail.titleLen = 50 - $scope.detail.title.length;
        };
        $scope.msgSum = function() {
            $scope.detail.msgLen = 240 - $scope.detail.content.length;
        };
        $scope.inmsgSum = function() {
            $scope.detail.inmsgLen = 3000 - $scope.detail.inContent.length;
        };
        //保存
        $scope.flag = 1;
        $scope.saveData = function(num) {
            var vo = {
                "pushId": $scope.pushId,
                "InAppList": $scope.notification
            };
            var url = urlAPI.pushSaveInMsg;
            if (num == 0) {
                if ($scope.flag) {
                    $scope.flag = 0;
                    serviceAPI.saveData(url,vo).then(function(result) {
                        if (result.status == 1 && result.code == 200) {
                            $scope.goList();
                        } else {
                            ModalAlert.popup({ msg: result.msg }, 2500);
                        }
                    })
                }
            } else {
                for (var i = 0; i < $scope.notification.length; i++) {
                    var item = $scope.notification[i];
                    if (item.sendNotification && item.content == "") {
                        $scope.changeDetail(item);
                        $location.hash('content');
                        $scope.validateParam.msgWarn = true;
                        return false;
                    }
                    for (var y = 0; y < $scope.notification[i].customdata.length; y++) {
                        var customdata = $scope.notification[i].customdata[y];
                        if ((customdata.key == '' && customdata.value !== '') || (customdata.key !== '' && customdata.value == '')) {
                            $scope.changeDetail(item);
                            $location.hash('option');
                            $scope.validateParam.customWarn = true;
                            return false;
                        }
                    }
                    // $scope.notification[i].customdata = JSON.stringify($scope.notification[i].customdata);
                    if (num && item.inContent == "") {
                        $scope.changeDetail(item);
                        $location.hash('inapp');
                        $scope.validateParam.inmsg = "This filed is required.";
                        $scope.validateParam.inmsgWarn = true;
                        return false;
                    }
                    $anchorScroll();
                };
                if ($scope.flag) {
                    $scope.flag = 0;
                    serviceAPI.saveData(url,vo).then(function(result) {
                        if (result.status == 1 && result.code == 200) {
                            $scope.nextStep(3, 'push.editApp.appscheduling');
                        } else {
                            ModalAlert.popup({ msg: result.msg }, 2500);
                        }
                    })
                }
            }

        };
    }
];
return scope;
