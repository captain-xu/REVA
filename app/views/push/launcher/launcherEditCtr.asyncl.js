var scope = ["$scope", "serviceAPI", "Upload", "ModalAlert", 'urlAPI',
    function($scope, serviceAPI, Upload, ModalAlert, urlAPI) {
        $scope.status = {
            taegetNum: 0,
            single: 0
        };
        $scope.validateParam = {
            userList: 'This field is required.',
            campWarn: false,
            singleWarn: false,
            userWarn: false,
            segmentWarn: false
        };
        $scope.getDetail = function() {
            serviceAPI.loadData(urlAPI.pushSetReceiver, { "pushId": $scope.pushId }).then(function(result) {
                $scope.receiver = result.data.receiver;
                if ($scope.receiver.allUsers == "") {
                    $scope.receiver.allUsers = 100;
                };
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
        //messageType切换
        $scope.typeData = function(num) {
            $scope.receiver.messageType = num;
        };
        //user 选择
        $scope.userSelect = function(num) {
            $scope.status.taegetNum = num;
            if (num == 0) {
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
                $scope.receiver.allUsers = value;
                // ModalAlert.popup({ msg: "Please enter a number greater than or equal to 1 less than 100" }, 2500);
            }
            $scope.receiver.allUsers = parseInt($scope.receiver.allUsers);

        };
        $scope.saveDraft = function() {
            if (!$scope.receiver.campaignName || $scope.receiver.campaignName == "") {
                $scope.validateParam.campWarn = true;
                return false;
            } else if ($scope.receiver.targetAppName == "") {
                $scope.validateParam.appWarn = true;
                return false;
            };
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
                    // $scope.goList();
                }
            });
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
            if ($scope.validate()) {
                var url = urlAPI.push_saveReceiver;
                serviceAPI.saveData(url, $scope.receiver).then(function(result) {
                    if (result.status == 1 && result.code == 200) {
                        $scope.setPushId(result.data.pushId);
                        $scope.setAppName($scope.receiver.targetAppName);
                        // $scope.nextStep(2, 'push.edit.creative');
                    }
                });
            };
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
            if (!$scope.receiver.campaignName || $scope.receiver.campaignName == "") {
                $scope.validateParam.campWarn = true;
                return false;
            } else if ($scope.receiver.targetAppName == "") {
                $scope.validateParam.appWarn = true;
                return false;
            } else if ($scope.receiver.targetDevices == "") {
                $scope.validateParam.deviceWarn = true;
                return false;
            } else if ($scope.receiver.messageType == 0) {
                if ($scope.status.taegetNum == 2 && $scope.receiver.segmentId == 0) {
                    $scope.validateParam.segmentWarn = true;
                    return false;
                } else if ($scope.status.taegetNum == 1 && $scope.status.single == 0 && $scope.receiver.deviceId == "") {
                    $scope.validateParam.singleWarn = true;
                    return false;
                } else if ($scope.status.taegetNum == 1 && $scope.status.single == 1 && $scope.receiver.deviceIds == "") {
                    $scope.validateParam.userWarn = true;
                    $scope.validateParam.userList = 'This field is required.';
                    return false;
                }
            }
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
            return true;
        };
        $scope.getDetail();
    }
];
return scope;
