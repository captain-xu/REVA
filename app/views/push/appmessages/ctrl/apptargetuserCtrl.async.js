var scope = ["$scope", "serviceAPI", "ModalAlert", 'Upload', 'urlAPI',
    function($scope, serviceAPI, ModalAlert, Upload, urlAPI) {
        $scope.appName = { id: "", name: "" };
        $scope.status = {
            taegetNum: 0,
            single: 0
        };
        $scope.validateParam = {
            userList: 'This field is required.',
            testList: 'This field is required.',
            campWarn: false,
            appWarn: false,
            deviceWarn: false,
            singleWarn: false,
            userWarn: false,
            testWarn: false
        };
        $scope.getDetail = function() {
            serviceAPI.loadData(urlAPI.pushSetReceiver, { "pushId": $scope.pushId }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.apps = result.data.appnames.map(function(data) {
                        return {
                            id: data.packageName,
                            name: data.appName
                        }
                    });
                    $scope.detail = result.data.receiver;
                    if ($scope.detail.campaignName) {
                        $scope.campLen = 50 - $scope.detail.campaignName.length;
                    } else {
                        $scope.campLen = 50;
                    }
                    if ($scope.detail.allUsers == "") {
                        $scope.detail.allUsers = 100;
                    };
                    if ($scope.detail.triggerDays == 0) {
                        $scope.detail.triggerDays = 1;
                    };
                    $scope.setState();
                    $scope.appName.name = $scope.detail.targetAppName;
                    if ($scope.appName.name != "") {
                        for (var i = $scope.apps.length - 1; i >= 0; i--) {
                            if ($scope.detail.targetAppName == $scope.apps[i].name) {
                                $scope.appName.id = $scope.apps[i].id;
                                $scope.getDevices(1);
                            }
                        }
                    }
                }
            });
        };
        $scope.setState = function() {
            if ($scope.detail.deviceId != '') {
                $scope.status.taegetNum = 1;
                $scope.status.single = 0;
            } else if ($scope.detail.deviceIds != '') {
                $scope.status.taegetNum = 1;
                $scope.status.single = 1;
            } else if ($scope.detail.testDeviceIds != '') {
                $scope.status.taegetNum = 2;
                $scope.status.single = 0;
            } else {
                $scope.status.taegetNum = 0;
                $scope.status.single = 0;
            };
        };
        /*Page change begin*/
        $scope.campSum = function() {
            $scope.campLen = 50 - $scope.detail.campaignName.length;
        };
        $scope.getDevices = function(num) {
            serviceAPI.loadData(urlAPI.pushGetDevice, { "packageName": $scope.appName.id }).then(function(result) {
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
                if (num) {
                    $scope.selectDevice();
                } else {
                    $scope.setTargetDevice();
                }
            });
        };

        $scope.selectDevice = function() {
            $scope.targetDevices = [];
            if ($scope.detail.targetDevices != "") {
                var arr = $scope.detail.targetDevices.split('&');
                $scope.detail.targetDevices = "";
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
                                $scope.detail.targetDevices += deviceModel.channel + '@' + deviceModel.model[z].name + '&';
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
            $scope.detail.targetDevices = target;
        };
        $scope.delDevices = function(item) {
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
        $scope.checkNum = function(num, value) {
            if (value == 100) {
                if (isNaN(Number(num)) || Number(num) > 100 || Number(num) < 1) {
                    $scope.detail.allUsers = value;
                    // ModalAlert.popup({ msg: "Please enter a number greater than or equal to 1 less than 100" }, 2500);
                }
                $scope.detail.allUsers = parseInt($scope.detail.allUsers);
            } else {
                if (isNaN(Number(num)) || Number(num) < 1) {
                    $scope.detail.triggerDays = value;
                    // ModalAlert.popup({ msg: "Please enter a number or equal to 1" }, 2500);
                }
                $scope.detail.triggerDays = parseInt($scope.detail.triggerDays);
            }

        };
        $scope.uploadFiles = function(file, errFiles) {
            $("input[name='list']").removeClass('warn');
            $("input[name='test']").removeClass('warn');
            if (file) {
                if ($scope.status.taegetNum == 1) {
                    $scope.idType = 0;
                } else if ($scope.status.taegetNum == 2) {
                    $scope.idType = 1;
                }
                Upload.upload({
                    url: urlAPI.pushUploadIds,
                    data: { file: file, type: $scope.idType, pushId: $scope.pushId }
                    // , idType: 1
                }).then(function(result) {
                    var data = result.data;
                    if (data.status == 1 && data.code == 200) {
                        if ($scope.status.taegetNum == 1) {
                            $scope.detail.deviceIds = file.name;
                        } else if ($scope.status.taegetNum == 2) {
                            $scope.detail.testDeviceIds = file.name;
                        };
                        $scope.setPushId(data.data.pushId);
                        $scope.validateParam.userWarn = false;
                        $scope.validateParam.testWarn = false;
                        ModalAlert.success({ msg: "Upload Succeeded" }, 2500);
                    } else {
                        if ($scope.idType == 0) {
                            $scope.validateParam.userWarn = true;
                            $scope.validateParam.userList = data.msg;
                        } else {
                            $scope.validateParam.testWarn = true;
                            $scope.validateParam.testList = data.msg;
                        }
                    }
                });
            }

        };
        $scope.setParam = function() {
            $scope.detail.targetAppName = $scope.appName.name;
            $scope.getDevices();
        };
        /*Page save*/
        $scope.saveDraft = function() {
            if (!$scope.detail.campaignName || $scope.detail.campaignName == "") {
                $scope.validateParam.campWarn = true;
                return false;
            } else if ($scope.detail.targetAppName == "") {
                $scope.validateParam.appWarn = true;
                return false;
            };
            if ($scope.detail.messageType == 0) {
                if ($scope.status.taegetNum == 0) {
                    $scope.detail.deviceId = "";
                    $scope.detail.deviceIds = 0;
                    $scope.detail.testDeviceIds = 0;
                } else if ($scope.status.taegetNum == 1) {
                    if ($scope.status.single == 0) {
                        $scope.detail.allUsers = "";
                        $scope.detail.deviceIds = 0;
                        $scope.detail.testDeviceIds = 0;
                    } else {
                        $scope.detail.allUsers = "";
                        $scope.detail.deviceId = "";
                        $scope.detail.testDeviceIds = 0;
                        $scope.detail.deviceIds = 1;
                    }
                } else {
                    $scope.detail.allUsers = "";
                    $scope.detail.deviceId = "";
                    $scope.detail.deviceIds = 0;
                    $scope.detail.testDeviceIds = 1;
                }
            } else {
                $scope.detail.allUsers = "";
                $scope.detail.deviceId = "";
                $scope.detail.deviceIds = 0;
                $scope.detail.testDeviceIds = 0;
            }
            $scope.detail.pushId = $scope.pushId;
            $scope.detail.pushType = 1;
            if (($scope.detail.targetDevices instanceof Array)) {
                $scope.detail.targetDevices = $scope.detail.targetDevices.toString();
            };
            $scope.detail.triggerDays = Number($scope.detail.triggerDays);
            var url = urlAPI.push_saveReceiver;
            serviceAPI.saveData(url, $scope.detail).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.goList();
                }
            });
        };
        $scope.saveDetail = function() {
            $scope.detail.pushId = $scope.pushId;
            $scope.detail.pushType = 1;
            $scope.detail.targetDevices = $scope.detail.targetDevices.toString();
            if ($scope.detail.triggerDays) {
                $scope.detail.triggerDays = Number($scope.detail.triggerDays);
            };
            if ($scope.validate()) {
                var url = urlAPI.push_saveReceiver;
                serviceAPI.saveData(url, $scope.detail).then(function(result) {
                    if (result.status == 1 && result.code == 200) {
                        $scope.setPushId(result.data.pushId);
                        $scope.setAppName($scope.detail.targetAppName);
                        $scope.nextStep(2, 'push.editApp.appcreative');
                    }
                })
            }
        };
        $scope.removeValidate = function(str) {
            switch (str) {
                case 'campaign':
                    $scope.validateParam.campWarn = false;
                    break;
                case 'app':
                    $scope.validateParam.appWarn = false;
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
            if (!$scope.detail.campaignName || $scope.detail.campaignName == "") {
                $scope.validateParam.campWarn = true;
                return false;
            } else if ($scope.detail.targetAppName == "") {
                $scope.validateParam.appWarn = true;
                return false;
            } else if ($scope.detail.targetDevices == "") {
                $scope.validateParam.deviceWarn = true;
                return false;
            } else if ($scope.detail.messageType == 0) {
                if ($scope.status.taegetNum == 2 && $scope.detail.testDeviceIds == "") {
                    $scope.validateParam.testWarn = true;
                    $scope.validateParam.testList = 'This field is required.';
                    return false;
                } else if ($scope.status.taegetNum == 1 && $scope.status.single == 0 && $scope.detail.deviceId == "") {
                    $scope.validateParam.singleWarn = true;
                    return false;
                } else if ($scope.status.taegetNum == 1 && $scope.status.single == 1 && $scope.detail.deviceIds == "") {
                    $scope.validateParam.userWarn = true;
                    $scope.validateParam.userList = 'This field is required.';
                    return false;
                }
            }
            if ($scope.detail.messageType == 0) {
                if ($scope.status.taegetNum == 0) {
                    $scope.detail.deviceId = "";
                    $scope.detail.deviceIds = 0;
                    $scope.detail.testDeviceIds = 0;
                } else if ($scope.status.taegetNum == 1) {
                    if ($scope.status.single == 0) {
                        $scope.detail.allUsers = "";
                        $scope.detail.deviceIds = 0;
                        $scope.detail.testDeviceIds = 0;
                    } else {
                        $scope.detail.allUsers = "";
                        $scope.detail.deviceId = "";
                        $scope.detail.testDeviceIds = 0;
                        $scope.detail.deviceIds = 1;
                    }
                } else {
                    $scope.detail.allUsers = "";
                    $scope.detail.deviceId = "";
                    $scope.detail.deviceIds = 0;
                    $scope.detail.testDeviceIds = 1;
                }
            } else {
                $scope.detail.allUsers = "";
                $scope.detail.deviceId = "";
                $scope.detail.deviceIds = 0;
                $scope.detail.testDeviceIds = 0;
            }
            return true;
        };

        $scope.getDetail();

    }
];
return scope;
