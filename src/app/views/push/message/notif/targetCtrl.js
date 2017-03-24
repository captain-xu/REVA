'use strict';

angular.module('app.controller').controller('notifTargetCtrl', [
    "$scope", "serviceAPI", "Upload", 'urlAPI', "toaster",
    function($scope, serviceAPI, Upload, urlAPI, toaster) {
        $scope.status = {
            taegetNum: 0,
            single: 0
        };
        $scope.validateParam = {
            userList: 'This field is required.',
            campWarn: false,
            appWarn: false,
            deviceWarn: false,
            singleWarn: false,
            userWarn: false,
            segmentWarn: false
        };
        $scope.getDetail = function() {
            serviceAPI.loadData(urlAPI.pushSetReceiver, { "pushId": $scope.pushId }).then(function(result) {
                $scope.receiver = result.data.receiver;
                $scope.appNames = result.data.appnames;
                $scope.setAppName($scope.receiver.targetAppName);
                if ($scope.receiver.allUsers == "") {
                    $scope.receiver.allUsers = 100;
                };
                if ($scope.receiver.triggerDays == 0) {
                    $scope.receiver.triggerDays = 1;
                };
                for (var i = $scope.appNames.length - 1; i >= 0; i--) {
                    if ($scope.receiver.targetAppName == $scope.appNames[i].appName) {
                        $scope.getDevices($scope.appNames[i].packageName, 1);
                        $scope.getSegments($scope.appNames[i].packageName, 1);
                        break;
                    }
                }
                $scope.setState();
            }).
            catch(function(result) {});
        };
        $scope.setState = function() {
            if ($scope.receiver.deviceId != '') {
                $scope.status.taegetNum = 1;
                $scope.status.single = 0;
            } else if ($scope.receiver.deviceIds != '') {
                $scope.status.taegetNum = 1;
                $scope.status.single = 1;
            } else if ($scope.receiver.segmentId != 0) {
                $scope.status.taegetNum = 2;
                $scope.status.single = 0;
            } else {
                $scope.status.taegetNum = 0;
                $scope.status.single = 0;
            };
        };

        //选择appName
        $scope.appData = function() {
            for (var i = $scope.appNames.length - 1; i >= 0; i--) {
                if ($scope.receiver.targetAppName == $scope.appNames[i].appName) {
                    $scope.getDevices($scope.appNames[i].packageName, 0);
                    $scope.getSegments($scope.appNames[i].packageName, 0);
                    break;
                }
            }
            var segItem = {
                segmentId: 0,
                segmentName: ''
            };
            $scope.selectSegment(segItem);
        };
        $scope.getSegments = function(param, num) {
            serviceAPI.loadData(urlAPI.pushGetSegment, { "packageName": param }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.segmentList = result.data;
                    if (num) {
                        var allSegment = result.data.map(function(data) {
                            return data.segmentId;
                        }).join(",");
                        if (allSegment.indexOf($scope.receiver.segmentId) < 0) {
                            $scope.receiver.segmentId = 0;
                            $scope.receiver.segmentName = '';
                        }

                    }
                }
            });
        };
        $scope.getDevices = function(param, num) {
            serviceAPI.loadData(urlAPI.pushGetDevice, { "packageName": param }).then(function(result) {
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
            if ($scope.receiver.targetDevices != "") {
                var arr = $scope.receiver.targetDevices.split('&');
                $scope.receiver.targetDevices = "";
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
                                $scope.receiver.targetDevices += deviceModel.channel + '@' + deviceModel.model[z].name + '&';
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
            $scope.receiver.targetDevices = target;
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
        //messageType切换
        $scope.typeData = function(num) {
            $scope.receiver.messageType = num;
        };
        //user 选择
        $scope.userSelect = function(num) {
            $scope.status.taegetNum = num;
        };
        //singleUser 目标用户选择
        $scope.singleList = function(num) {
            $scope.status.single = num;
            $scope.singleWarn = false;
            $scope.userWarn = false;
            $scope.deviceWarn = false;
        };
        $scope.checkNum = function(num, value) {
            if (value == 100) {
                if (isNaN(Number(num)) || Number(num) > 100 || Number(num) < 1) {
                    $scope.receiver.allUsers = value;
                }
                $scope.receiver.allUsers = parseInt($scope.receiver.allUsers);
            } else {
                if (isNaN(Number(num)) || Number(num) < 1) {
                    $scope.receiver.triggerDays = value;
                }
                $scope.receiver.triggerDays = parseInt($scope.receiver.triggerDays);
            }

        };
        //目标用户列表上传
        $scope.uploadFiles = function(file, errFiles) {
            if (file) {
                Upload.upload({
                    url: urlAPI.pushUploadIds,
                    method: 'POST',
                    data: { file: file, type: 0, pushId: $scope.pushId }
                }).then(function(result) {
                    var data = result.data;
                    if (data.status == 1 && data.code == 200) {
                        $scope.receiver.deviceIds = file.name;
                        $scope.setPushId(data.data.pushId);
                        toaster.pop({
                            type: 'success',
                            body: 'Upload Succeeded.',
                            showCloseButton: true,
                            timeout: 2500
                        });
                        $scope.deviceWarn = false;
                        $scope.validation_form.submitted = false;
                    } else {
                        $scope.deviceWarn = true;
                        $scope.validation_form.submitted = true;
                    }
                });
            }
        };
        $scope.setSegment = function() {
            for (var i = 0; i < $scope.segmentList.length; i++) {
                if ($scope.receiver.segmentName == $scope.selectSegment[i].segmentName) {
                    $scope.receiver.segmentName = $scope.selectSegment[i].segmentName;
                    break;
                }
            }
        };
        $scope.setValue = function() {
            if ($scope.receiver.messageType == 0) {
                if ($scope.status.taegetNum == 0) {
                    $scope.receiver.deviceId = "";
                    $scope.receiver.deviceIds = 0;
                    $scope.receiver.useSegment = 0;
                    $scope.receiver.segmentId = 0;
                } else if ($scope.status.taegetNum == 1) {
                    if ($scope.status.single == 0) {
                        $scope.receiver.allUsers = "";
                        $scope.receiver.deviceIds = 0;
                        $scope.receiver.useSegment = 0;
                        $scope.receiver.segmentId = 0;
                    } else {
                        $scope.receiver.allUsers = "";
                        $scope.receiver.deviceId = "";
                        $scope.receiver.useSegment = 0;
                        $scope.receiver.segmentId = 0;
                        $scope.receiver.deviceIds = 1;
                    }
                } else {
                    $scope.receiver.allUsers = "";
                    $scope.receiver.deviceId = "";
                    $scope.receiver.deviceIds = 0;
                    $scope.receiver.useSegment = 1;
                }
            } else {
                $scope.receiver.allUsers = "";
                $scope.receiver.deviceId = "";
                $scope.receiver.deviceIds = 0;
                $scope.receiver.useSegment = 0;
                $scope.receiver.segmentId = 0;
            }
        };
        $scope.saveDraft = function() {
            if ($scope.validation_form.$valid) {
                $scope.setValue();
                $scope.receiver.pushId = $scope.pushId;
                $scope.receiver.pushType = 0;
                $scope.receiver.testDeviceIds = 0;
                if (($scope.receiver.targetDevices instanceof Array)) {
                    $scope.receiver.targetDevices = $scope.receiver.targetDevices.toString();
                };
                $scope.receiver.triggerDays = Number($scope.receiver.triggerDays);
                var url = urlAPI.push_saveReceiver;
                serviceAPI.saveData(url, $scope.receiver).then(function(result) {
                    if (result.status == 1 && result.code == 200) {
                        $scope.goList();
                    }
                });
            } else {
                $scope.validation_form.submitted = true;
            }
        };
        $scope.saveDetail = function() {
            $scope.receiver.pushId = $scope.pushId;
            $scope.receiver.pushType = 0;
            $scope.receiver.testDeviceIds = 0;
            if (($scope.receiver.targetDevices instanceof Array)) {
                $scope.receiver.targetDevices = $scope.receiver.targetDevices.toString();
            };
            $scope.receiver.triggerDays = Number($scope.receiver.triggerDays);
            //$scope.receiver.targetDevices = $scope.receiver.targetDevices.replace(/,/g,'&');
            if ($scope.validation_form.$valid) {
                if ($scope.validate()) {
                    var url = urlAPI.push_saveReceiver;
                    serviceAPI.saveData(url, $scope.receiver).then(function(result) {
                        if (result.status == 1 && result.code == 200) {
                            $scope.setPushId(result.data.pushId);
                            $scope.setAppName($scope.receiver.targetAppName);
                            $scope.nextStep(2, 'view.pushDetail.step2');
                        }
                    });
                }

            } else {
                $scope.validation_form.submitted = true;
            }
        };
        $scope.validate = function() {
            $scope.validation_form.submitted = true;
            $scope.targetDeviceWarn = false;
            $scope.segmentWarn = false;
            $scope.singleWarn = false;
            $scope.userWarn = false;
            if ($scope.receiver.targetDevices == "") {
                $scope.targetDeviceWarn = true;
                return false;
            } else if ($scope.receiver.messageType == 0) {
                if ($scope.status.taegetNum == 2 && $scope.receiver.segmentId == 0) {
                    $scope.segmentWarn = true;
                    return false;
                } else if ($scope.status.taegetNum == 1 && $scope.status.single == 0 && $scope.receiver.deviceId == "") {
                    $scope.singleWarn = true;
                    return false;
                } else if ($scope.status.taegetNum == 1 && $scope.status.single == 1 && $scope.receiver.deviceIds == "") {
                    $scope.userWarn = true;
                    return false;
                }
            };
            $scope.validation_form.submitted = false;
            $scope.setValue();
            return true;
        };
        $scope.getDetail();
    }
]);
