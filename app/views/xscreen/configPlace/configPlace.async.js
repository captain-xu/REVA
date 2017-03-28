var scope = ["$scope", "serviceAPI", "ModalAlert", 'urlAPI', 'Upload','$stateParams',
    function($scope, serviceAPI, ModalAlert, urlAPI, Upload, $stateParams) {
        $scope.loadList = function(){
            $scope.channelId = {
                id: $stateParams.id,
                cardid: $stateParams.cardid
            };
            $scope.channelName = $stateParams.name;
            serviceAPI.loadData(urlAPI.xscreen_placeDetail, $scope.channelId).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.lifeList = result.data;
                    if ($scope.lifeList.length == 0) {
                        $scope.lifeList.push({"channelid":$scope.channelId.id, "placementid":"", "cardid": $stateParams.cardid});
                    }
                    $scope.lifeLength = $scope.lifeList.length;
                }
            })
        };
        $scope.deleteData = function(life,index) {
            $scope.deleteId = {
                id: life.id,
                cardid: $stateParams.cardid
            };
            if (!$scope.deleteId.id) {
                $scope.lifeList.splice(index,1);
            } else {
                serviceAPI.delData(urlAPI.xscreen_placeDelete, $scope.deleteId).then(function(result) {
                    if (result.status == 0 && result.code == 0) {
                        ModalAlert.popup({ msg: "Delete Succeeded" },2500);
                        $scope.loadList();
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                })
            }
            $scope.lifeLength = $scope.lifeList.length
        };
        $scope.addData = function() {
            $scope.lifeLength = $scope.lifeList.length + 1;
            $scope.lifeList.push({"channelid":$scope.channelId.id, "placementid":"", "cardid": $stateParams.cardid});
        };
        $scope.saveData = function() {
            for (var i = 0; i < $scope.lifeList.length; i++) {
                var item = $scope.lifeList[i];
                if (!item.placementid) {
                    ModalAlert.popup({ msg: "The placementId is necessary" },2500);
                    return false;
                }
            }
            serviceAPI.saveData(urlAPI.xscreen_placeCreate, $scope.lifeList).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    history.go(-1);
                }
            })
        };
        $scope.loadList();
    }
];
return scope;
