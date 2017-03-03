var scope = ["$scope", "$stateParams", "$state", "$location","serviceAPI","urlAPI",
    function($scope, $stateParams, $state, $location,serviceAPI,urlAPI) {
        $scope.appName = $stateParams.param;
        $scope.packageName = $stateParams.package;
        $scope.tabClick = function(str){
        	$scope.tab = str;
        };
        $scope.refresh = function(){
	        serviceAPI.getData(urlAPI.update_permission).then(function(result){
                if (result.data[0] && result.data[0] != []) {
                    $scope.permission = result.data[0];
                    var tabArr = Object.keys($scope.permission).toString();
                    if (tabArr.indexOf('review') > -1 || tabArr.indexOf('update') > -1) {
                        $scope.tabFirst = 'version';
                    } else if (tabArr.indexOf('operation') > -1) {
                        $scope.tabFirst = 'operation';
                    } else if (tabArr.indexOf('extends') > -1) {
                        $scope.tabFirst = 'extends';
                    } else {
                        $scope.tabFirst = null;
                    }
                    $scope.tabActive = $location.path();
                    if ($scope.tabActive.indexOf('version') > -1) {
                            $state.go('update.list.version');
                            $scope.tab = 'version';
                    } else if ($scope.tabActive.indexOf('extends') > -1) {
                            $state.go('update.list.extends');
                            $scope.tab = 'extends';
                    } else if ($scope.tabActive.indexOf('placement') > -1) {
                            $state.go('update.list.campaign.placement');
                            $scope.tab = 'campaign';
                    } else if ($scope.tabActive.indexOf('device') > -1) {
                            $state.go('update.list.campaign.device');
                            $scope.tab = 'campaign';
                    } else if ($scope.tabActive.indexOf('operation') > -1) {
                            $scope.tab = 'operation';
                    } else {
                            $state.go('update.list' + '.' + $scope.tabFirst);
                            $scope.tab = $scope.tabFirst;
                    }
                }
	        })
            serviceAPI.loadData(urlAPI.update_data,{package: $scope.packageName}).then(function(result){
                $scope.updateData = result.data;
                $scope.arpu = result.data.arpu.toFixed(2);
                $scope.ecpm = result.data.ecpm.toFixed(2);
                $scope.difference_newuser = Math.abs(result.data.difference_newuser);
                $scope.difference_activeuser = Math.abs(result.data.difference_activeuser);
                $scope.difference_arpu = Math.abs(result.data.difference_arpu.toFixed(2));
                $scope.difference_ecpm = Math.abs(result.data.difference_ecpm.toFixed(2));
                $scope.per_arpu = result.data.per_arpu.toFixed(2);
                $scope.per_ecpm = result.data.per_ecpm.toFixed(2);
                if (result.data.difference_newuser >= 0) {
                    $scope.newTrand = 'up';
                } else {
                    $scope.newTrand = 'down';
                }
                if (result.data.difference_activeuser >= 0) {
                    $scope.activeTrand = 'up';
                } else {
                    $scope.activeTrand = 'down';
                }
                if (result.data.difference_arpu >= 0) {
                    $scope.arpuTrand = 'up';
                } else {
                    $scope.arpuTrand = 'down';
                }
                if (result.data.difference_ecpm >= 0) {
                    $scope.ecpmTrand = 'up';
                } else {
                    $scope.ecpmTrand = 'down';
                }
            })
        };
        $scope.refresh();
	}
];
return scope;