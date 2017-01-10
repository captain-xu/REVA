var scope = ["$scope", "serviceAPI", "ModalAlert", "$stateParams", 'urlAPI','$state',
    function($scope, serviceAPI, ModalAlert, $stateParams, urlAPI,$state) {
        $scope.appName = $stateParams.app;
        $scope.statu = $stateParams.param;
        $scope.action = 'approved';
        $scope.approvedtext = '';
        $scope.loadDetail = function(id) {
            var searchParam = {
                id: id
            }
            serviceAPI.loadData(urlAPI.update_hotfixdetail, searchParam).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.detail = result.data;
                    $scope.detail.segment = $scope.getSegment(JSON.parse($scope.detail.segment));
                }
            })
        };
        $scope.getSegment = function(vo) {
            for (var i = 0; i < vo.params.length; i++) {
                var item = vo.params[i];
                if (item.value.indexOf(',') > -1) {
                    var value = item.value.split(",");
                }
                switch (item.key) {
                    case "Device": 
                        item.value1 = value[0];
                        item.value2 = value[1] == '*' ? 'All Devices' : value[1];
                        item.value3 = value[2] == '*' ? 'All OS Versions' : value[2];
                    break;
                    case "Android Version": 
                        if (item.condition == 'is above') {
                            item.value1 = item.value;
                        } else {
                            item.value1 = value[0];
                            item.value2 = value[1];
                        }
                    break;
                    case "Location": 
                        item.value1 = value[0];
                        item.value2 = value[1] == '*' ? 'All States' : value[1];
                    break;
                    case "Create Time": 
                        if (item.condition == 'more than') {
                            item.value1 = item.value;
                        } else {
                            item.value1 = value[0];
                            item.value2 = value[1];
                        }
                    break;
                    case "Client ID": 
                        item.value1 = item.value;
                    break;
                }
            }
            return vo;
            
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
            serviceAPI.saveData(urlAPI.update_checkHotfix, param).then(function(result) {
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
