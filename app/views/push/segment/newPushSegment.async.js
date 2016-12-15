var scope = ["$scope", "serviceAPI", 'urlAPI',
	function($scope, serviceAPI, urlAPI) {
        $scope.getDetail = function() {
            serviceAPI.loadData(urlAPI.pushSetReceiver, { "pushId": '' }).then(function(result) {
                $scope.appNames = result.data.appnames;
            }).
            catch(function(result) {});
        };
        $scope.getDetail();
	}
];
return scope;