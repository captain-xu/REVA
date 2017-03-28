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
            serviceAPI.loadData(urlAPI.xscreen_channelDetail,$scope.channelId).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.id = result.data.id;
                    $scope.channelName = result.data.name;
                    $scope.channelid = result.data.channelid;
                    $scope.webeye = result.data.webeye;
                    $scope.accuweather = result.data.accuweather;
                }
            })
        };
        $scope.channelData = function(channel) {
            $scope.channelid = channel.id;
            $scope.channelName = channel.channels;
        };
        $scope.saveData = function() {
            if (!$scope.webeye) {
                ModalAlert.popup({ msg: "The Webeye is necessary" }, 2500);
                return false;
            }
            if (!$scope.accuweather) {
                ModalAlert.popup({ msg: "The Accuweather is necessary" }, 2500);
                return false;
            }
            $scope.param = {
                channelid: $scope.channelid,
                webeye: $scope.webeye,
                accuweather: $scope.accuweather
            };
            if ($scope.channelDetail == 'new') {
                var url = urlAPI.xscreen_channelCreate;
            } else {
                var url = urlAPI.xscreen_channelChange;
                $scope.param.id = $scope.id;
            }
            serviceAPI.saveData(url, $scope.param).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $location.path('/view/xscreen/channel');
                }
            })
        };
        $scope.init = function() {
            if ($stateParams.name == 'new') {
                $scope.loadChannel();
            } else {
                $scope.loadDetail();
            }
        };
        $scope.init();
    }
];
return scope;
