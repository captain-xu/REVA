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
                    $scope.detail.segment = $scope.getSegment(JSON.parse($scope.detail.segment));
                    if ($scope.detail.incrementalpack.length >= 3) {
                    };
                }
            })
        };
        $scope.getSegment = function(vo) {
            for (var i = 0; i < vo.items.length; i++) {
                var item = vo.items[i];
                if (item.items && item.items.length > 0) {
                    item = $scope.getSegment(item);
                } else {
                    switch (item.key) {
                        case "Device": 
                            item.value1 = item.channel;
                            item.value2 = item.model === '*' ? 'All Devices' : item.model;
                            item.value3 = item.osVersion === '*' ? 'All OS Versions' : item.osVersion;
                        break;
                        case "Android Version": 
                            if (item.condition == 'bigger') {
                                item.value1 = item.version1;
                            } else {
                                item.value1 = item.version1;
                                item.value2 = item.version2;
                            }
                        break;
                        case "Location": 
                            item.value1 = item.country;
                            item.value2 = item.state === '*' ? 'All States' : item.state;
                        break;
                        case "Create Time": 
                            if (item.condition == 'bigger') {
                                 item.value1 = item.days1;
                            } else {
                                item.value1 = item.days1;
                                item.value2 = item.days2;
                            }
                        break;
                        case "Client ID":
                            item.value1 = item.clientIds;
                        break;
                    }
                    delete item.channel;
                    delete item.model;
                    delete item.osVersion;
                    delete item.version1;
                    delete item.version2;
                    delete item.country;
                    delete item.state;
                    delete item.days1;
                    delete item.days2;
                    delete item.clientIds;
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
