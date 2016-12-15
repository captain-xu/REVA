var scope = ["$scope", "serviceAPI", 'urlAPI',
    function($scope, serviceAPI, urlAPI) {
        $scope.loadList = function() {
            serviceAPI.getData(urlAPI.xscreen_searchList).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.searchList = result.data;
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
