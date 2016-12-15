var scope = ["$scope", "serviceAPI", '$location', "ModalAlert", 'urlAPI',
    function($scope, serviceAPI, $location, ModalAlert, urlAPI) {
        $scope.resubmit = false;
        $scope.getDetail = function() {
            serviceAPI.loadData(urlAPI.pushConfirm, { "pushId": $scope.pushId }).then(function(result) {
                $scope.receiver = result.data;
                $scope.body = $scope.receiver.body;
                if (!isNaN(Number($scope.receiver.allUsers))) {
                    if ($scope.receiver.allUsers == 100) {
                        $scope.receiver.allUsers = "All Users";
                    } else {
                        $scope.receiver.allUsers = $scope.receiver.allUsers + "% of All Users"
                    }
                };
                $scope.receiver.targetDevices = $scope.receiver.targetDevices.replace(/&/g, ' , ');
                $scope.receiver.startTime = moment($scope.receiver.startTime).format('YYYY-MM-DD HH:mm');
                $scope.receiver.endTime = moment($scope.receiver.endTime).format('YYYY-MM-DD HH:mm');
                $scope.setOrder();
            });
        };
        $scope.setOrder = function() {
            for (var i = 0; i < $scope.body.length; i++) {
                if (i == 0) {
                    $scope.body[i].order = 'A';
                } else if (i == 1) {
                    $scope.body[i].order = 'B';
                } else {
                    $scope.body[i].order = 'C';
                };
            };
        };
        $scope.activeData = function() {
            $scope.resubmit = true;
            var url = urlAPI.pushActive;
            serviceAPI.updateData(url, { "pushId": $scope.pushId }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.goList();
                } else {
                    $scope.resubmit = false;
                    ModalAlert.popup({ msg: result.msg }, 2500)
                }
            });
        };
        $scope.getDetail();

    }
];
return scope;
