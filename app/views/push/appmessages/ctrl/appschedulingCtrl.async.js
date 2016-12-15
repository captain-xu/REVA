var scope = ["$scope", 'serviceAPI', 'ModalAlert', 'urlAPI',
    function($scope, serviceAPI, ModalAlert, urlAPI) {
        $scope.detail = {
            "sendNow": 1,
            "endDefault": 1,
            "endTimeUnit": 'Days',
            "startTime": "",
            "endTime": ""
        };

        $scope.startTime = "";
        $scope.startHour = "00";
        $scope.startMinute = "00";
        $scope.endTime = 0;
        $scope.getConfig = function() {
            serviceAPI.loadData(urlAPI.pushGetConfig, {}).then(function(result) {
                $scope.config = result.data;
                $scope.maxValue = $scope.config.expiration;
                if ($scope.endTime == 0) {
                    $scope.endTime = $scope.config.expiration;
                }

            })
        };
        $scope.getDetail = function() {
            serviceAPI.loadData(urlAPI.pushSetSchedule, { "pushId": $scope.pushId }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    if (result.data) {
                        $scope.detail = result.data;
                        var time = "";
                        if ($scope.detail.sendNow == 0) {
                            time = moment($scope.detail.startTime);
                            $scope.startTime = time.format('YYYY-MM-DD');
                            $scope.startHour = time.format('HH');
                            $scope.startMinute = time.format('mm');
                        };
                        if ($scope.detail.endDefault == 0) {
                            var divisor = 0;
                            if ($scope.detail.endTimeUnit == "Days") {
                                divisor = 1000 * 60 * 60 * 24;
                            } else if ($scope.detail.endTimeUnit == "Hour") {
                                divisor = 1000 * 60 * 60;
                            } else {
                                divisor = 1000 * 60;
                            };
                            $scope.endTime = Math.abs(($scope.detail.endTime - $scope.detail.startTime)) / divisor;
                            $scope.endTime = $scope.endTime.toFixed(0);
                        } else {
                            $scope.detail.endTimeUnit = "Days"
                        };
                    }
                }
            });
        };
        $scope.setDelivery = function(){
            $scope.detail.sendNow = 0;
            var nowTime = moment(+new Date());
            $scope.startTime = nowTime.format('YYYY-MM-DD');
            $scope.startHour = nowTime.format('HH');
            $scope.startMinute = nowTime.format('mm');
        };
        $scope.setTime = function(num, str) {
            if (str == 'h') {
                $scope.startHour = num;
            } else {
                $scope.startMinute = num;
            }
        };
        $scope.checkNum = function() {
            if (isNaN(parseInt($scope.endTime))) {
                $scope.endTime = $scope.maxValue;
                // ModalAlert.popup({ msg: "Please enter a number greater than or equal to 1" }, 2500);
            } else if ($scope.endTime > $scope.maxValue) {
                $scope.endTime = $scope.maxValue;
                // ModalAlert.popup({ msg: "Reattempt delivery of notification until after specified duration.The maximum expiration time is " + $scope.config.expiration + " Days" }, 2500);
            };
            $scope.endTime = parseInt($scope.endTime);
        };
        $scope.changeMaxValue = function(str) {
            if (str == "day") {
                $scope.detail.endTimeUnit = 'Days'
                $scope.maxValue = $scope.config.expiration;
            } else if (str == "hour") {
                $scope.detail.endTimeUnit = 'Hour'
                $scope.maxValue = Number($scope.config.expiration) * 24;
            } else if (str == "minute") {
                $scope.detail.endTimeUnit = 'Minute'
                $scope.maxValue = Number($scope.config.expiration) * 24 * 60;
            };
            if ($scope.endTime > $scope.maxValue) {
                $scope.endTime = $scope.maxValue;
            };
        };
        /*Page save*/
        $scope.saveDetail = function(num) {
            $scope.detail.pushId = $scope.pushId;
            var val = $scope.validate();
            if (val) {
                var url = urlAPI.pushSaveSchedule;
                serviceAPI.saveData(url, $scope.detail).then(function(result) {
                    if (result.status == 1 && result.code == 200) {
                        if (num == 0) {
                            $scope.goList();
                        } else {
                            $scope.nextStep(4, 'push.editApp.appconfirm');
                        }
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                })
            }
        };
        $scope.validate = function() {
            if ($scope.detail.sendNow == 1) {
                $scope.detail.startTime = new Date().getTime();
            } else {
                if ($scope.startTime == "") {
                    ModalAlert.popup({ msg: "Please select start time" }, 2500);
                    return false;
                } else {
                    var startTime = $scope.startTime + " " + $scope.startHour + ":" + $scope.startMinute;
                    $scope.detail.startTime = new Date(startTime);
                    if ($scope.detail.startTime < new Date()) {
                        ModalAlert.popup({ msg: "Message must be scheduled in the future." }, 2500);
                        return false;
                    };
                    $scope.detail.startTime = $scope.detail.startTime.getTime();
                }
            };
            var timeZone = moment($scope.detail.startTime).utc()._d;
            $scope.detail.timeInterval = -timeZone.getTimezoneOffset();
            if ($scope.detail.endDefault == 1) {
                $scope.detail.endTime = 0;
                return true;
            } else {
                if ($scope.endTime == 0 || $scope.endTime == "") {
                    ModalAlert.popup({ msg: "Please select end time" }, 2500);
                    return false;
                } else {
                    var millisecond = 0;
                    if ($scope.detail.endTimeUnit == 'Days') {
                        millisecond = $scope.endTime * 24 * 60 * 60 * 1000;
                    } else if ($scope.detail.endTimeUnit == 'Hour') {
                        millisecond = $scope.endTime * 60 * 60 * 1000;
                    } else {
                        millisecond = $scope.endTime * 60 * 1000;
                    };
                    $scope.detail.endTime = $scope.detail.startTime + millisecond;
                    return true;
                }
            }

        };
        $scope.getDetail();
        $scope.getConfig();
    }
];
return scope;
