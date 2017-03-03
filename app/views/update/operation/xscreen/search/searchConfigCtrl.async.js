var scope = ["$scope", "serviceAPI", 'urlAPI', "ModalAlert", '$stateParams', '$location',
    function($scope, serviceAPI, urlAPI, ModalAlert, $stateParams, $location) {
        $scope.loadChannel = function() {
            serviceAPI.getData(urlAPI.xscreen_channel).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.channelList = result.data;
                    $scope.channel = $scope.channelList[0];
                    $scope.channelid = $scope.channel.id;
                    $scope.channelName = $scope.channel.name;
                }
            })
        };
        $scope.statu = $stateParams.param;
        $scope.id = $stateParams.id;
        $scope.channelDetail = $stateParams.name;
        $scope.loadDetail = function(){
            $scope.channelId = {
                id: $scope.id
            };
            serviceAPI.loadData(urlAPI.xscreen_searchDetail,$scope.channelId).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.channelName = result.data.name;
                    $scope.channelid = result.data.channel;
                    $scope.engineName = result.data.engine;
                    $scope.engineid = result.data.engineid;
                }
            })
        };
        $scope.loadEngin = function(){
            serviceAPI.getData(urlAPI.xscreen_searchEngin).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.enginList = result.data;
                }
            })
        };
        $scope.channelData = function(channel){
            $scope.channelName = channel.channels;
            $scope.channelid = channel.id;
            $scope.id = channel.id;
        };
        $scope.engineData = function(engin){
            $scope.engineName = engin.engine;
            $scope.engineid = engin.id;
        };
        $scope.saveData = function() {
            if (!$scope.engineid) {
                ModalAlert.popup({ msg: "The Search Engines is necessary" }, 2500);
                return false;
            }
            $scope.param = {
                engineid: $scope.engineid,
                channelid: $scope.channelid
            }
            serviceAPI.saveData(urlAPI.xscreen_searchChange, $scope.param).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    javascript:history.go(-1);
                }
            })
        };
        $scope.init = function() {
            if ($stateParams.name == 'new') {
                $scope.loadChannel();
                $scope.loadEngin();
            } else {
                $scope.loadEngin();
                $scope.loadDetail();
            }
        };
        $scope.init();
    }
];
return scope;
