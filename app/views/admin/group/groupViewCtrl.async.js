var scope = ["$scope", "urlAPI", "ModalAlert", "serviceAPI", "adminAPI", 
	function($scope, urlAPI, ModalAlert, serviceAPI, adminAPI) {

		$scope.pageBar = {
			pageSize : adminAPI.pageBar.pageSize,
			pageIndex: adminAPI.pageBar.pageIndex
		};
		
		$scope.initTableView = function() {
			serviceAPI.loadData(urlAPI.admin_group_view, $scope.pageBar).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$scope.groupList = result.data.groupList;
					$scope.pageBar.totalRows = result.data.totalRows;
				}
			});
		};

		$scope.selectPageSize = function(pageSize) {
			$scope.pageBar.pageSize = pageSize;
			$scope.pageBar.pageIndex = adminAPI.pageBar.pageIndex;
			$scope.initTableView();
		};

		$scope.selectPageIndex = function() {
			$scope.pageBar.pageSize = adminAPI.pageBar.pageSize;
			$scope.initTableView();
		};

		$scope.isDisabled = function(item) {
			
			if (item.isDisabled == 0) {
				var alertMessage = "Are you sure to turn it OFF?";
			} else {
				var alertMessage = "Are you sure to turn it ON?";
			};

			ModalAlert.alert({
				value: alertMessage,
				closeBtnValue: "No",
				okBtnValue: "Yes",
				confirm: function() {
					var num = adminAPI.num.int_0;
					if (item.isDisabled == 0) {
						num = adminAPI.num.int_1;
					}

					var statusParam = {
						groupId: item.id,
						isDisabled: num
					}

					serviceAPI.updateData(urlAPI.admin_group_disable, statusParam).then(function(result) {
						if (result.status == 0 && result.code == 0) {
							item.isDisabled = num;
						} else {
							ModalAlert.popup({
								msg: result.msg
							}, 2500);
						}
					}).catch(function() {})
				}
			});
		};

		$scope.groupUpdate = function(item) {
			item.action = adminAPI.str.update;
			adminAPI.setGroup(item);
		};
		
		$scope.groupDelete = function(item) {
			var alertMsg = "Are you sure to delete the group?";

			ModalAlert.alert({
				value: alertMsg,
				closeBtnValue: "No",
				okBtnValue: "Yes",
				confirm: function() {
					var param = {
						groupId: item.id,
						isDeleted: 1
					}

					serviceAPI.delData(urlAPI.admin_group_delete, param).then(function(result) {
						if (result.status == 0 && result.code == 0) {
							$scope.initTableView();
						} else {
							ModalAlert.popup({
								msg: result.msg
							}, 2500);
						}
					}).catch(function() {})
				}

			});
		};

		
		//初始化控件
		$scope.initTableView();

	}
];
return scope;
