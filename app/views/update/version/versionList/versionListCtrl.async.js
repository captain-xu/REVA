var scope = ["$scope", "serviceAPI",'urlAPI', "$stateParams",
	function($scope, serviceAPI, urlAPI, $stateParams) {
        $scope.appName = $stateParams.param;
        $scope.packageName = $stateParams.package;
        $scope.showModel = false;
		$scope.params = {
			page: 1,
			pagesize: 10,
            appName: $scope.packageName,
            status: [],
            query: '',
            type: 0

		};
        $scope.type = "Type";
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
			serviceAPI.loadData(urlAPI.update_appverlist,$scope.params).then(function(result){
                if (result.code == 0 && result.status == 0) {
                    $scope.list = result.data.result;
                    $scope.totalItems = result.data.totalcount;
                    for (var i = 0; i < $scope.list.length; i++) {
                        if ($scope.list[i].status == 0 ) {
                            $scope.list[i].status = 'Unapproved';
                        } else if ($scope.list[i].status == 1 ) {
                            $scope.list[i].status = 'Checking';
                        } else {
                            $scope.list[i].status = 'Publishing';
                        }
                    }
                }
			})
		};
        $scope.timer = null;
        $scope.setParam = function() {
            $scope.params.status = $scope.status;
			$scope.params.query = $scope.keywords;
            clearTimeout($scope.timer);
            $scope.timer = setTimeout(function() {
                $scope.loadList();
            }, 1000);
        };
        $scope.typeFilter = function(num, str) {
            $scope.params.type = num;
            $scope.type = str;
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
        $scope.showSegment = function(vo) {
            $scope.segment = JSON.parse(vo.segment);
            $scope.showModel = true;
        };
        $scope.segmentBack = function() {
            $scope.segment = "";
            $scope.showModel = false;
        }

        $scope.loadList();
		
	}
];
return scope;