var scope = ["$scope", "ModalAlert", "urlAPI", "serviceAPI", "adminAPI", 
	function($scope, ModalAlert, urlAPI, serviceAPI, adminAPI) {

		$scope.pageBar = {
			pageSize : adminAPI.pageBar.pageSize,
			pageIndex: adminAPI.pageBar.pageIndex
		};
		
		$scope.initTableView = function() {
			serviceAPI.loadData(urlAPI.admin_role_view, $scope.pageBar).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$scope.roleList = result.data.roleList;
					$scope.pageBar.totalRows = result.data.totalRows;
					adminAPI.loginUser = result.data.loginUser;
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
				var alertMsg = "Are you sure to turn it OFF?";
			} else {
				var alertMsg = "Are you sure to turn it ON?";
			};

			ModalAlert.alert({
				value: alertMsg,
				closeBtnValue: "No",
				okBtnValue: "Yes",
				confirm: function() {
					var num = adminAPI.num.int_0;
					if (item.isDisabled == 0) {
						num = adminAPI.num.int_1;
					}

					var param = {
						roleId: item.id,
						groupId: item.groupId,
						isDisabled: num
					}

					serviceAPI.updateData(urlAPI.admin_role_disable, param).then(function(result) {
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

		$scope.roleUpdate = function(item) {
			item.action = adminAPI.str.update;
			adminAPI.setRole(item);
		};

		$scope.roleCreate = function() {
			var role = {};
			role.action = adminAPI.str.create;
			role.groupId = adminAPI.loginUser.groupId;
			role.name = "";
			adminAPI.setRole(role);
		};

		$scope.roleDelete = function(item) {

			var alertMsg = "Are you sure to delete the role?";

			ModalAlert.alert({
				value: alertMsg,
				closeBtnValue: "No",
				okBtnValue: "Yes",
				confirm: function() {

					var param = {
						roleId: item.id,
						groupId: item.groupId,
						isDeleted: 1
					}

					serviceAPI.delData(urlAPI.admin_role_delete, param).then(function(result) {
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
