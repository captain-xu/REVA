var scope = ["$scope", "serviceAPI", 'urlAPI', 'ModalAlert',
	function($scope, serviceAPI, urlAPI, ModalAlert) {
        $scope.tolist = {url: "/view/push/list"};
        $scope.toreport = {url: "/view/push/latestWeek/"};
        $scope.pageNum = 1;
        $scope.pageSize = 20;
        $scope.keyword = "";
		$scope.loadList = function(){
            var param = {
                pageSize: $scope.pageSize,
                pageNum: $scope.pageNum,
                keyword: $scope.keyword
            };
			serviceAPI.loadData(urlAPI.push_weeklyHistory, param).then(function(result){
				if (result.code == 200 && result.status == 1) {
                    $scope.reportList = result.data.weeklyList;
					$scope.totalItems = result.data.ListCount;
				}
			});
		};
        $scope.orderBy = function(str) {
            $scope.desc = !$scope.desc;
            $scope.orderField = str;
        };
		$scope.loadList();
	}
];
return scope;