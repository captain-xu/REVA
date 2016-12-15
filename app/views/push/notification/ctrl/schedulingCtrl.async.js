var scope = ["$scope", "serviceAPI", "ModalAlert", 'urlAPI',
    function($scope, serviceAPI,  ModalAlert, urlAPI) {
        $scope.receiver = {
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
        $scope.getTimeRange = function() {
            serviceAPI.loadData(urlAPI.pushGetConfig, {}).then(function(result) {
                $scope.endTimeUnitRange = result.data;
                $scope.maxValue = result.data.expiration;
                if ($scope.endTime == 0) {
                    $scope.endTime = result.data.expiration;
                }
            });
        };
        $scope.getDetail = function() {
            serviceAPI.loadData(urlAPI.pushSetSchedule, { "pushId": $scope.pushId }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    if (result.data) {
                        $scope.receiver = result.data;
                        var time = "";
                        if ($scope.receiver.sendNow == 0) {
                            time = moment($scope.receiver.startTime);
                            $scope.startTime = time.format('YYYY-MM-DD');
                            $scope.startHour = time.format('HH');
                            $scope.startMinute = time.format('mm');
                        };
                        if ($scope.receiver.endDefault == 0) {
                            var divisor = 0;
                            if ($scope.receiver.endTimeUnit == "Days") {
                                divisor = 1000 * 60 * 60 * 24;
                            } else if ($scope.receiver.endTimeUnit == "Hour") {
                                divisor = 1000 * 60 * 60;
                            } else {
                                divisor = 1000 * 60;
                            };
                            $scope.endTime = Math.abs(($scope.receiver.endTime - $scope.receiver.startTime)) / divisor;
                            $scope.endTime = $scope.endTime.toFixed(0);
                        } else {
                            $scope.receiver.endTimeUnit = "Days"
                        };
                    }
                }
            });
        };
        $scope.setDelivery = function(){
            $scope.receiver.sendNow = 0;
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
                // ModalAlert.popup({ msg: "Reattempt delivery of notification until after specified duration.The maximum expiration time is 4 weeks." }, 2500);
            };
            $scope.endTime = parseInt($scope.endTime);
        };
        $scope.changeMaxValue = function(str) {
            if (str == "day") {
                $scope.receiver.endTimeUnit = 'Days'
                $scope.maxValue = $scope.endTimeUnitRange.expiration;
            } else if (str == "hour") {
                $scope.receiver.endTimeUnit = 'Hour'
                $scope.maxValue = Number($scope.endTimeUnitRange.expiration) * 24;
            } else if (str == "minute") {
                $scope.receiver.endTimeUnit = 'Minute'
                $scope.maxValue = Number($scope.endTimeUnitRange.expiration) * 24 * 60;
            };
            if ($scope.endTime > $scope.maxValue) {
                $scope.endTime = $scope.maxValue;
            };
        };
        $scope.saveDetail = function(num) {
            $scope.receiver.pushId = $scope.pushId;
            if ($scope.validate()) {
                var url = urlAPI.pushSaveSchedule;
                serviceAPI.saveData(url, $scope.receiver).then(function(result) {
                    if (result.status == 1 && result.code == 200) {
                        if (num == 0) {
                            $scope.goList();
                        } else {
                            $scope.nextStep(4, 'push.edit.confirm');
                        }
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                });
            }
        };
        $scope.validate = function() {
            if ($scope.receiver.sendNow == 1) {
                $scope.receiver.startTime = new Date().getTime();
            } else {
                if ($scope.startTime == "") {
                    ModalAlert.popup({ msg: "Please select start time" }, 2500);
                    return false;
                } else {
                    var startTime = $scope.startTime + " " + $scope.startHour + ":" + $scope.startMinute;
                    $scope.receiver.startTime = new Date(startTime);
                    if ($scope.receiver.startTime < new Date()) {
                        ModalAlert.popup({ msg: "Message must be scheduled in the future." }, 2500);
                        return false;
                    };
                    $scope.receiver.startTime = $scope.receiver.startTime.getTime();
                }
            };
            var timeZone = moment($scope.receiver.startTime).utc()._d;
            $scope.receiver.timeInterval = -timeZone.getTimezoneOffset();
            if ($scope.receiver.endDefault == 1) {
                $scope.receiver.endTime = 0;
            } else {
                if ($scope.endTime == 0 || $scope.endTime == "") {
                    ModalAlert.popup({ msg: "Please select end time" }, 2500);
                    return false;
                } else {
                    var millisecond = 0;
                    if ($scope.receiver.endTimeUnit == 'Days') {
                        millisecond = $scope.endTime * 24 * 60 * 60 * 1000;
                    } else if ($scope.receiver.endTimeUnit == 'Hour') {
                        millisecond = $scope.endTime * 60 * 60 * 1000;
                    } else {
                        millisecond = $scope.endTime * 60 * 1000;
                    };
                    $scope.receiver.endTime = $scope.receiver.startTime + millisecond;
                }
            }
            return true;
        };
        $scope.getDetail();
        $scope.getTimeRange();
    }
];
return scope;
