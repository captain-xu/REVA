var scope = ["$scope", 'serviceAPI', 'ModalAlert', 'urlAPI',
    function($scope, serviceAPI, ModalAlert, urlAPI) {
        $scope.resubmit = false;
        $scope.getDetail = function() {
            serviceAPI.loadData(urlAPI.pushConfirm, { "pushId": $scope.pushId }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.detail = result.data;
                    if (!isNaN(Number($scope.detail.allUsers))) {
                        if ($scope.detail.allUsers == 100) {
                            $scope.detail.allUsers = "All Users";
                        } else {
                            $scope.detail.allUsers = $scope.detail.allUsers + "% of All Users";
                        }
                    }
                    $scope.detail.targetDevices = $scope.detail.targetDevices.replace(/&/g, ' , ');
                    $scope.detail.startTime = moment($scope.detail.startTime).format("YYYY-MM-DD HH:mm");
                    $scope.detail.endTime = moment($scope.detail.endTime).format("YYYY-MM-DD HH:mm");
                }
            });
        };

        $scope.getDetail();
        $scope.activeData = function() {
            $scope.resubmit = true;
            var url = urlAPI.pushActive;
            serviceAPI.updateData(url, { 'pushId': $scope.pushId }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.goList();
                } else {
                    $scope.resubmit = false;
                    ModalAlert.popup({ msg: result.msg }, 2500);
                }
            });
        };
    }
];
return scope;
