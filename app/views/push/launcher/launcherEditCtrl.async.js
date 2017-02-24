var scope = ["$scope", "serviceAPI", "Upload", "ModalAlert", 'urlAPI', '$stateParams',
    function($scope, serviceAPI, Upload, ModalAlert, urlAPI, $stateParams) {
        $scope.status = {
            targetNum: 0,
            single: 0
        };
        $scope.validateParam = {
            userList: 'This field is required.',
            campWarn: false,
            msgWarn: false,
            singleWarn: false,
            userWarn: false,
            segmentWarn: false
        };
        $scope.getDetail = function() {
            if (!$stateParams.pushId) {
                $scope.receiver = {
                    allUsers: 100,
                    campaignName: "",
                    message: "",
                    devices: "",
                    singleToken: "",
                    uploadToken: 0
                };
                return;
            }
            serviceAPI.loadData(urlAPI.push_launcherDetail, { "pushId": $stateParams.pushId }).then(function(result) {
                $scope.receiver = result.data.launcherPush;
                if ($scope.receiver.allUsers == "") {
                    $scope.receiver.allUsers = 100;
                }
                $scope.setState();
                $scope.getDevices();
            }).
            catch(function(result) {});
        };
        $scope.setState = function() {
            if ($scope.receiver.singleToken) {
                $scope.status.targetNum = 1;
                $scope.status.single = 0;
            } else if ($scope.receiver.uploadToken) {
                $scope.status.targetNum = 1;
                $scope.status.single = 1;
            } else if ($scope.receiver.devices) {
                $scope.status.targetNum = 2;
                $scope.status.single = 0;
            } else {
                $scope.status.targetNum = 0;
                $scope.status.single = 0;
            };
        };
        //user 选择
        $scope.userSelect = function(num) {
            $scope.status.targetNum = num;
            if (num == 0) {
                if (!$scope.receiver.allUsers) {
                    $scope.receiver.allUsers = 100;
                }
                $scope.validateParam.singleWarn = false;
                $scope.validateParam.userWarn = false;
                $scope.validateParam.segmentWarn = false;
            } else if (num == 1) {
                $scope.validateParam.segmentWarn = false;
            } else {
                $scope.validateParam.singleWarn = false;
                $scope.validateParam.userWarn = false;
            }
        };
        //singleUser 目标用户选择
        $scope.singleList = function(num) {
            $scope.status.single = num;
            if (num == 0) {
                $scope.validateParam.userWarn = false;
            } else {
                $scope.validateParam.singleWarn = false;
            }
        };
        $scope.checkNum = function(num) {
            if (isNaN(Number(num)) || Number(num) > 100 || Number(num) < 1) {
                $scope.receiver.allUsers = 100;
            }
            $scope.receiver.allUsers = parseInt($scope.receiver.allUsers);

        };
        //目标用户列表上传
        $scope.uploadFiles = function(file, errFiles) {
            if (file) {
                Upload.upload({
                    url: urlAPI.push_launcherTokens,
                    data: { file: file, pushId: $stateParams.pushId }
                }).then(function(result) {
                    var data = result.data;
                    if (data.status == 1 && data.code == 200) {
                        $scope.tokens = file.name;
                        $scope.receiver.pushId = data.pushId;
                        $scope.receiver.uploadToken = 1;
                        $scope.validateParam.userWarn = false;
                        ModalAlert.success({ msg: "Upload Succeeded" }, 2500);
                    } else {
                        $scope.validateParam.userWarn = true;
                        $scope.validateParam.userList = data.msg;
                    }
                });
            }
        };
        $scope.getDevices = function() {
            serviceAPI.loadData(urlAPI.push_launcherDevices).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.devices = result.data.devices.map(function(data) {
                        return {
                            isSelect: false,
                            channel: data.channel,
                            model: data.model.map(function(device) {
                                return {
                                    isSelect: false,
                                    name: device
                                }
                            })
                        }
                    });
                }
                $scope.selectDevice();
            });
        };
        $scope.selectDevice = function() {
            $scope.targetDevices = [];
            if ($scope.receiver.devices) {
                var arr = $scope.receiver.devices.split('&');
                $scope.receiver.devices = "";
                for (var i = 0; i < arr.length; i++) {
                    var device = arr[i];
                    $scope.targetDevices.push({ isChannel: false, value: device });
                    for (var y = 0; y < $scope.devices.length; y++) {
                        var deviceModel = $scope.devices[y];
                        var deviceSelect = false;
                        for (var z = 0; z < deviceModel.model.length; z++) {
                            if (deviceModel.model[z].isSelect) {
                                continue;
                            };
                            if (deviceModel.model[z].name == device) {
                                deviceSelect = true;
                                deviceModel.model[z].isSelect = true;
                                $scope.receiver.devices += deviceModel.channel + '@' + deviceModel.model[z].name + '&';
                                break;
                            }
                        }
                        if (deviceSelect) {
                            break;
                        }
                    }
                }
            }
        };
        $scope.checkedDevice = function(vo, parent) {
            if (vo.isSelect) {
                if (vo.model) {
                    angular.forEach(vo.model, function(value, key) {
                        value.isSelect = false;
                    });
                } else {
                    parent.isSelect = false
                }
            } else {
                if (vo.model) {
                    angular.forEach(vo.model, function(value, key) {
                        value.isSelect = true;
                    });
                }
            };
            vo.isSelect = !vo.isSelect;
            $scope.setTargetDevice();
        };
        $scope.setTargetDevice = function() {
            var arr = [];
            var target = "";
            for (var i = 0; i < $scope.devices.length; i++) {
                var device = $scope.devices[i];
                if (device.isSelect) {
                    arr.push({
                        isChannel: true,
                        value: device.channel
                    });
                    angular.forEach(device.model, function(value, key) {
                        if (target == "") {
                            target += device.channel + '@' + value.name;
                        } else {
                            target += "&" + device.channel + '@' + value.name;
                        }
                    });
                } else {
                    angular.forEach(device.model, function(value, key) {
                        if (value.isSelect) {
                            arr.push({ isChannel: false, value: value.name });
                            if (target == "") {
                                target += device.channel + '@' + value.name;
                            } else {
                                target += "&" + device.channel + '@' + value.name;
                            }
                        }
                    });
                }
            };
            $scope.targetDevices = arr;
            $scope.receiver.devices = target;
        };
        $scope.deleteDevice = function(item) {
            for (var i = 0; i < $scope.devices.length; i++) {
                var device = $scope.devices[i];
                if (item.isChannel) {
                    if (item.value == device.channel) {
                        device.isSelect = false;
                        angular.forEach(device.model, function(data, key) {
                            data.isSelect = false;
                        });
                        break;
                    }
                } else {
                    var isBreak = false;
                    for (var y = 0; y < device.model.length; y++) {
                        if (device.model[y].name == item.value) {
                            device.model[y].isSelect = false;
                            isBreak = true;
                            break;
                        }
                    };
                    if (isBreak) {
                        break;
                    }
                }
            };
            $scope.setTargetDevice();
        };
        $scope.saveDraft = function() {
            if (!$scope.receiver.campaignName || $scope.receiver.campaignName == "") {
                $scope.validateParam.campWarn = true;
                return false;
            }
            if ($scope.status.targetNum == 0) {
                $scope.receiver.singleToken = "";
                $scope.receiver.uploadToken = 0;
                $scope.receiver.devices = "";
            } else if ($scope.status.targetNum == 1) {
                if ($scope.status.single == 0) {
                    $scope.receiver.allUsers = "";
                    $scope.receiver.uploadToken = 0;
                    $scope.receiver.devices = "";
                } else {
                    $scope.receiver.allUsers = "";
                    $scope.receiver.singleToken = "";
                    $scope.receiver.uploadToken = 1;
                    $scope.receiver.devices = "";
                }
            } else {
                $scope.receiver.allUsers = "";
                $scope.receiver.singleToken = "";
                $scope.receiver.uploadToken = 0;
            }
            if (!$scope.receiver.pushId) {
                $scope.receiver.pushId = $stateParams.pushId;
            }
            if (($scope.receiver.devices instanceof Array)) {
                $scope.receiver.devices = $scope.receiver.devices.toString();
            };
            $scope.receiver.activate = 0;
            var url = urlAPI.push_launcherEdit;
            serviceAPI.saveData(url, $scope.receiver).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    // $scope.goList();
                    history.go(-1);
                } else {
                    ModalAlert.error({ msg: result.msg }, 2500);
                }
            });
        };
        $scope.saveDetail = function() {
            if (!$scope.receiver.pushId) {
                $scope.receiver.pushId = $stateParams.pushId;
            }
            if (($scope.receiver.devices instanceof Array)) {
                $scope.receiver.devices = $scope.receiver.devices.toString();
            };
            if ($scope.validate()) {
                var url = urlAPI.push_launcherEdit;
                $scope.receiver.activate = 1;
                serviceAPI.saveData(url, $scope.receiver).then(function(result) {
                    if (result.status == 1 && result.code == 200) {
                        // $scope.nextStep(2, 'push.edit.creative');
                        history.go(-1);
                    } else {
                        ModalAlert.error({ msg: result.msg }, 2500);
                    }
                });
            };
        };
        $scope.removeValidate = function(str) {
            switch (str) {
                case 'campaign':
                    $scope.validateParam.campWarn = false;
                    break;
                case 'message':
                    $scope.validateParam.msgWarn = false;
                    break;
                case 'device':
                    $scope.validateParam.deviceWarn = false;
                    break;
                case 'single':
                    $scope.validateParam.singleWarn = false;
                    break;
            }
        };
        $scope.validate = function() {
            if (!$scope.receiver.campaignName || $scope.receiver.campaignName == "") {
                $scope.validateParam.campWarn = true;
                return false;
            } else if (!$scope.receiver.message || $scope.receiver.message == "") {
                $scope.validateParam.msgWarn = true;
                return false;
            } else if ($scope.status.targetNum == 2 && $scope.receiver.devices == "") {
                $scope.validateParam.segmentWarn = true;
                return false;
            } else if ($scope.status.targetNum == 1 && $scope.status.single == 0 && $scope.receiver.singleToken == "") {
                $scope.validateParam.singleWarn = true;
                return false;
            } else if ($scope.status.targetNum == 1 && $scope.status.single == 1 && $scope.receiver.uploadToken == 0) {
                $scope.validateParam.userWarn = true;
                $scope.validateParam.userList = 'This field is required.';
                return false;
            }
            if ($scope.status.targetNum == 0) {
                $scope.receiver.singleToken = "";
                $scope.receiver.uploadToken = 0;
                $scope.receiver.devices = "";
            } else if ($scope.status.targetNum == 1) {
                if ($scope.status.single == 0) {
                    $scope.receiver.allUsers = "";
                    $scope.receiver.uploadToken = 0;
                    $scope.receiver.devices = "";
                } else {
                    $scope.receiver.allUsers = "";
                    $scope.receiver.singleToken = "";
                    $scope.receiver.uploadToken = 1;
                    $scope.receiver.devices = "";
                }
            } else {
                $scope.receiver.allUsers = "";
                $scope.receiver.singleToken = "";
                $scope.receiver.uploadToken = 0;
            }
            return true;
        };
        $scope.getDetail();
    }
];
return scope;
