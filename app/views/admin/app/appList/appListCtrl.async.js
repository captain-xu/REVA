var scope = ["$scope", "serviceAPI", 'urlAPI',
	function($scope, serviceAPI, urlAPI) {
		$scope.params = {
			page: 1,
			pagesize: 10,
            status:[]
		};
        $scope.status = [];
        $scope.pushStatus = [{
            "id": "Approved",
            "name": "Approved",
            "isSelect": false
        }, {
            "id": "Upapproved",
            "name": "Upapproved",
            "isSelect": false
        }, {
            "id": "Checking",
            "name": "Checking",
            "isSelect": false
        }];


		$scope.loadList = function(){
			serviceAPI.loadData(urlAPI.update_applist,$scope.params).then(function(result){
				$scope.list = result.data.result;
             	$scope.totalItems = result.data.totalpage;
				for (var i = 0; i < $scope.list.length; i++) {
					if ($scope.list[i].status == 0 ) {
						$scope.list[i].status = 'Unapproved';
					} else if ($scope.list[i].status == 1 ) {
						$scope.list[i].status = 'Checking';
					} else {
						$scope.list[i].status = 'Approved';
					}
				}
			})
		};
        $scope.setParam = function() {
			$scope.params.status = $scope.status;
            $scope.loadList();
        };
        $scope.changeStatus = function(str) {
            var arr = [];
            for (var i = 0; i < $scope.pushStatus.length; i++) {
                if (str == $scope.pushStatus[i].id) {
                    $scope.pushStatus[i].isSelect = false;
                };
                if ($scope.pushStatus[i].isSelect) {
                    arr.push($scope.pushStatus[i].id);
                }
            }
            $scope.status = arr;
            $scope.setParam();
        };
		$scope.loadList();
		
	}
];
return scope;