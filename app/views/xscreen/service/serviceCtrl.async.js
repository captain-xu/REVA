var scope = ["$scope", "serviceAPI", 'urlAPI',
    function($scope, serviceAPI, urlAPI) {
        $scope.loadList = function() {
            serviceAPI.getData(urlAPI.xscreen_lifeList).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.serviceList = result.data;
                }
            })
        };
        $scope.init = function() {
            $scope.loadList();
        };
        $scope.init();
    }
];
return scope;
