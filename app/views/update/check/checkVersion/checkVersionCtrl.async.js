var scope = ["$scope", "serviceAPI", "ModalAlert", "$stateParams", 'urlAPI','$state',
    function($scope, serviceAPI, ModalAlert, $stateParams, urlAPI,$state) {
        $scope.statu = $stateParams.param;
        $scope.action = 'approved';
        $scope.approvedtext = '';
        $scope.loadDetail = function(id) {
            var searchParam = {
                id: id
            }
            serviceAPI.loadData(urlAPI.update_appdetail, searchParam).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.detail = result.data;
                    $scope.detail.frontsql=JSON.parse($scope.detail.frontsql);
                    if ($scope.detail.incrementalpack.length >= 3) {
                    };
                }
            })
        };
        $scope.submitDetail = function(id) {
            if ($scope.action == 'approved') {
                $scope.approvedtext = '';
            } else {
                if ($scope.approvedtext == '') {
                    ModalAlert.popup({ msg: 'The rejected reason is required'}, 2500);
                    return false;
                }
            };
            var param = {
                id: $stateParams.id,
                approvedtext: $scope.approvedtext,
                action: $scope.action
            }
            serviceAPI.saveData(urlAPI.update_checkVersion, param).then(function(result) {
                if(result.status == 0 && result.code == 0){
                    history.go(-1);
                }else{
                    ModalAlert.popup({msg: result.msg },2500)
                }
            });
        };
        $scope.loadDetail($stateParams.id);
    }
];
return scope;
