var scope = ["$scope", "serviceAPI",'urlAPI', "$stateParams","ModalAlert",
	function($scope, serviceAPI, urlAPI, $stateParams,ModalAlert) {
        $scope.appName = $stateParams.param;
        $scope.packageName = $stateParams.package;
		$scope.params = {
			page: 1,
			pagesize: 10,
            appname: $scope.packageName,
            query: ''

		};
		$scope.loadList = function(){
			serviceAPI.loadData(urlAPI.update_extlist,$scope.params).then(function(result){
					$scope.list = result.data.result;
  		         	$scope.totalItems = result.data.totalpage;
				})
		};
		$scope.deleteItem = function(vo){
            ModalAlert.alert({
                value: "sure to delete?",
                closeBtnValue: "No",
                okBtnValue: "Yes",
                confirm: function() {
                	var id = {
                		id: vo.id
                	}
					serviceAPI.delData(urlAPI.update_delextend,id).then(function(result){
						if (result.code == 0 && result.status == 0) {
							$scope.loadList();
						}
					})
                }
            });
		};
        $scope.timer = null;
        $scope.setParam = function() {
			$scope.params.query = $scope.keywords;
            clearTimeout($scope.timer);
            $scope.timer = setTimeout(function() {
                $scope.loadList();
            }, 1000);
        };
        $scope.loadList();
		
	}
];
return scope;