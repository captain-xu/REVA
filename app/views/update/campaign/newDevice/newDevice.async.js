var scope = ["$scope", "serviceAPI", "ModalAlert", "$stateParams", 'urlAPI',
    function($scope, serviceAPI, ModalAlert, $stateParams, urlAPI) {

    $scope.state = $stateParams.param;
    $scope.appName = $stateParams.name;
    $scope.packageName = $stateParams.package;
    $scope.loadPlace = function(){
        serviceAPI.loadData(urlAPI.campaign_place_list,{packageName: $scope.packageName}).then(function(result) {
            if (result.placeList) {
                $scope.placeList = result.placeList.map(function(placeList) {
                    return {
                        isSelect: false,
                        name: placeList.name
                    };
                });
            }
            $scope.loadDetail();
        });
    };
    $scope.loadDetail = function(){
        if ($scope.state == 'new') {
            $scope.devDetail = {
                "appname":$scope.packageName,
                "type": 'immediately',
                "status": 0,
                "device":"",
                "placement":"",
                "starttime":""
            };
            serviceAPI.getData(urlAPI.update_getDevice).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.deviceList = result.data;
                }
            })
        } else {
            var searchParam = {
                id: $stateParams.id
            };
            serviceAPI.loadData(urlAPI.update_campDevdetail,searchParam).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.devDetail = result.data;
                    $scope.devDetail.starttime = moment($scope.devDetail.starttime).format('YYYY-MM-DD');
                    $scope.setTargetPlace();
                }
            })
        }
    };
    $scope.deviceData = function(dev){
        $scope.devDetail.device = dev.channel;
        var searchParam = {
            device: $scope.devDetail.device,
            appname: $scope.packageName
        };
        serviceAPI.loadData(urlAPI.update_campDevbywhere,searchParam).then(function(result) {
            if (result.status == 0 && result.code == 0) {
                if (result.data) {
                    $scope.devDetail = result.data;
                    $scope.devDetail.appname = $scope.appName;
                    $scope.devDetail.starttime = moment($scope.devDetail.starttime).format('YYYY-MM-DD');
                } else {
                    $scope.devDetail.type = 'immediately';
                    $scope.devDetail.status = 0;
                    $scope.devDetail.placement = '';
                    $scope.devDetail.starttime = '';
                }
                $scope.setTargetPlace();
            }
        })
    };
    $scope.setTargetPlace = function(){
        var placeDefault = $scope.placeList.map(function(placeList) {
                                return {
                                    isSelect: false,
                                    name: placeList.name
                                };
                            });
        if ($scope.devDetail.placement) {
            var targetPlace = $scope.devDetail.placement.split(",");
            var allPlace = placeDefault;
            for (var i = 0; i < targetPlace.length; i++) {
                for (var j = 0; j < allPlace.length; j++) {
                    if (allPlace[j].name == targetPlace[i]) {
                        allPlace[j].isSelect = true;
                    }
                }
            }
            $scope.placeList = allPlace;
        } else {
            $scope.placeList = placeDefault;
        }
    };
    $scope.changePlace = function(vo){
        vo.isSelect = !vo.isSelect;
        var placeList = $scope.devDetail.placement;
        if (placeList) {
            var placeArr = placeList.split(",");
        } else {
            var placeArr = [];
        }
        var placeIndex = placeArr.indexOf(vo.name);
        if (vo.isSelect) {
            placeArr.push(vo.name);
        } else {
            placeArr.splice(placeIndex,1);
        }
        $scope.devDetail.placement = placeArr.toString();
    };
    $scope.changeType = function(str){
        if (str == 'immediately') {
            $scope.devDetail.status = 0;
            $scope.devDetail.starttime = '';
        } else {
            $scope.devDetail.status = 2;
        }
        $scope.devDetail.type = str;
    };
    $scope.devState = function(){
        if ($scope.devDetail.status == 0) {
            $scope.devDetail.status = 1;
        } else {
            $scope.devDetail.status = 0;
        }
    };
    $scope.saveDevice = function(){
        if (!$scope.devDetail.placement) {
            ModalAlert.popup({msg: 'The placement is required'}, 2500);
            return false;
        }
        if ($scope.devDetail.type == 'scheduled') {
            $scope.devDetail.status = 2;
        }
        if ($scope.state == 'new') {
            serviceAPI.saveData(urlAPI.update_campDevadd,$scope.devDetail).then(function(result){
                if (result.code == 0 && result.status == 0) {
                    history.go(-1);
                } else {
                    ModalAlert.popup({ msg: result.msg }, 2500);
                }
            })
        } else {
            $scope.devDetail.id = Number($stateParams.id);
            serviceAPI.updateData(urlAPI.update_campDevupdate,$scope.devDetail).then(function(result){
                if (result.code == 0 && result.status == 0) {
                    history.go(-1);
                }
            })
        }
    };
    $scope.loadPlace();
}];
return scope;
