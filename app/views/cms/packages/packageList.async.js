var scope = ["$scope", "serviceAPI", "urlAPI",
	function($scope, serviceAPI, urlAPI) {
        $scope.appplace = "All Apps";
		$scope.params = {
			page: 1,
			pagesize: 20
		};
		$scope.loadList = function() {
			serviceAPI.loadData(urlAPI.cms_packageList, $scope.params).then(function(result) {
				$scope.list = result.data.result;
				$scope.totalItems = result.data.totalcount;
				for (var i = 0; i < $scope.list.length; i++) {
					if ($scope.list[i].status == 0) {
						$scope.list[i].status = "Failed";
					} else if ($scope.list[i].status == 1) {
						$scope.list[i].status = "Patching";
					} else {
						$scope.list[i].status = "Success";
					}
				}
			}).
	        catch(function(result) {});
			serviceAPI.loadData(urlAPI.cms_packageApp).then(function(result) {
				$scope.appList = result.data.map(function(data) {
                    return {
                        "id": data.app,
                        "name": data.app
                    }
                });
			}).
			catch(function(result){});

		};
		$scope.loadList();
	}
];
return scope;