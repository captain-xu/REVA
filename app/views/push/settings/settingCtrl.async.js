var scope = ["$scope", 'ModalAlert', '$http','urlAPI',
    function($scope, ModalAlert, $http,urlAPI) {
        $scope.time = "Days";
        $scope.setTime = function(time, param) {
            $scope[param] = time;
        };
        $scope.getSettings = function() {
            $http({
                method: "post",
                url:urlAPI.pushGetConfig,
                data: {}
            }).success(function(result) {
                var timeFrom = result.data.timeFrom.split(':');
                var timeTo = result.data.timeTo.split(':');
                $scope.start_h = timeFrom[0];
                $scope.start_m = timeFrom[1];
                $scope.end_h = timeTo[0];
                $scope.end_m = timeTo[1];
                $scope.default = result.data.expiration;
            }).error(function(result) {
                ModalAlert.popup({ msg: result.msg }, 2500)
            });
        };
        $scope.checkNum = function() {
            if (isNaN(Number($scope.default)) || !$scope.default) {
                $scope.default = 1;
                // ModalAlert.popup({ msg: "Please enter a number greater than or equal to 1." }, 2500);
            }
            if ($scope.time == "Days") {
                if ($scope.default > 28) {
                    $scope.default = 28;
                    // ModalAlert.popup({ msg: "Default Expires should less then 28 days." }, 2500);
                };
            } else if ($scope.time == "Weeks") {
                if ($scope.default > 4) {
                    $scope.default = 4;
                    // ModalAlert.popup({ msg: "Default Expires should less then 4 weeks." }, 2500);
                };
            }
            $scope.default = parseInt($scope.default);
        };
        $scope.savaSetting = function() {
            if ($scope.time == "Days") {
                $scope.expiration = $scope.default;
            } else {
                $scope.expiration = $scope.default * 7;
            }
            $http({
                method: "post",
                url: urlAPI.push_setConfig,
                data: {
                    "from": $scope.start_h + ":" + $scope.start_m,
                    "to": $scope.end_h + ":" + $scope.end_m,
                    "expiration": Number($scope.expiration)
                }
            }).success(function(result) {
                ModalAlert.popup({ msg: result.msg }, 2500);
            }).error(function(result) {
                ModalAlert.popup({ msg: result.msg }, 2500);
            });
        };
        $scope.getSettings();
    }
];
return scope;
