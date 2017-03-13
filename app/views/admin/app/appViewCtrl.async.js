var scope = ["$scope", "urlAPI", "ModalAlert", "serviceAPI", "adminAPI", 
	function($scope, urlAPI, ModalAlert, serviceAPI, adminAPI) {

		$scope.pageBar = {
			pageSize : adminAPI.pageBar.pageSize,
			pageIndex: adminAPI.pageBar.pageIndex
		};

		$scope.initTableView = function() {
			serviceAPI.loadData(urlAPI.admin_app_view, $scope.pageBar).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$scope.appList = result.data.appList;
					$scope.appAuthorList = result.data.appAuthorList;
					$scope.getAppAttrCharge($scope.appList);

					$scope.pageBar.totalRows = result.data.totalRows;
					adminAPI.loginUser = result.data.loginUser;
				}
			});

		};

		$scope.getAppAttrCharge = function() {
			for (var i = 0; i < $scope.appList.length; i++) {
				var iapp = $scope.appList[i];
				iapp.author = $scope.appAuthorList[iapp.id];
			}
		};

		$scope.selectPageSize = function(pageSize) {
			$scope.pageBar.pageSize = pageSize;
			$scope.pageBar.pageIndex = adminAPI.pageBar.pageIndex;
		};

		$scope.selectPageIndex = function() {
			$scope.pageBar.pageSize = adminAPI.pageBar.pageSize;
			$scope.initTableView();
		};

		$scope.appUpdate = function(item) {
			item.action = adminAPI.str.update;
			adminAPI.setApp(item);
		};

		$scope.appCreate = function() {
			var app = {};
			app.action = adminAPI.str.create;
			app.appName = "";
			app.packageName = "";
			adminAPI.setApp(app);
		};

		$scope.appDelete = function(item) {
			var alertMsg = "Are you sure to delete the App?";

			ModalAlert.alert({
				value: alertMsg,
				closeBtnValue: "No",
				okBtnValue: "Yes",
				confirm: function() {
					var param = {
						appId: item.id,
						appName: item.appName,
						isDeleted: adminAPI.num.int_1
					}

					serviceAPI.delData(urlAPI.admin_app_delete, param).then(function(result) {
						if (result.status == 0 && result.code == 0) {
							$scope.initTableView();
						} else {
							ModalAlert.popup({
								msg: result.msg
							}, 2500);
						}
					});
				}
			});
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
						appId: item.id,
						isDisabled: num
					}

					serviceAPI.updateData(urlAPI.admin_app_disable, statusParam).then(function(result) {
						if (result.status == 0 && result.code == 0) {
							item.isDisabled = num;
						} else {
							ModalAlert.popup({
								msg: result.msg
							}, 2500);
						}
					})
				}
			});
		};



		//初始化控件
		$scope.initTableView();
	}
];

return scope;