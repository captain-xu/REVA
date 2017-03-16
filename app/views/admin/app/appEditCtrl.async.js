var scope = ["$scope", "$location", "urlAPI", "ModalAlert", "serviceAPI", "adminAPI", 
	function($scope, $location, urlAPI, ModalAlert, serviceAPI, adminAPI) {

		$scope.app = {};
		$scope.adminOptExtendList = {};

		$scope.paramData = {
			action: "",
			appInfo: {
				name: "",
				packageName: ""
			},
			opOptionList: {},
			opOptionExtendsList: {}
		};

		$scope.initEditView = function() {
			$scope.app = adminAPI.getApp();

			if (adminAPI.isNullOrEmpty($scope.app) || adminAPI.isNullOrEmpty($scope.app.action)) {
				adminAPI.comfirmPopup("paramter is invalid!");
				return;
			}

			$scope.paramData.action = $scope.app.action;
			if ($scope.app.action == adminAPI.str.update) {
				$scope.paramData.appId = $scope.app.id;
			}

			serviceAPI.loadData(urlAPI.admin_app_edit, $scope.paramData).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$scope.opOptionList = result.data.opOptionList;
					$scope.opOptionExtendsList = result.data.opOptionExtendsList;
					$scope.opAppOptionList = result.data.opAppOptionList;

					$scope.buildViewData();
				}
			});

		};

		$scope.buildViewData = function() {

			$scope.chargeOptAttrActive();

		};

		$scope.chargeOptAttrActive = function() {

			if (adminAPI.isNullOrEmpty($scope.opOptionList) 
				|| adminAPI.isNullOrEmpty($scope.opAppOptionList)) {
				return;
			}

			var activeFlg = false;
			for (var i = 0; i < $scope.opAppOptionList.length; i++) {
				var iOperationTab = $scope.opAppOptionList[i];
				var jOperation;

				for (var j = 0; j < $scope.opOptionList.length; j++) {
					jOperation = $scope.opOptionList[j];
					if (jOperation.id == iOperationTab.optionId) {
						activeFlg = true;
						break;
					} else {
						activeFlg = false;
					}
				}

				if (activeFlg) {
					jOperation.active = true;
					$scope.adminOptExtendList[jOperation.name] = [];

					for (var j = 0; j < $scope.opOptionExtendsList.length; j++) {
						var jOptExtend = $scope.opOptionExtendsList[j];
						if (jOptExtend.parentId == jOperation.id) {
							$scope.adminOptExtendList[jOperation.name].push(jOptExtend);
						}

					}
				}

				for (var j = 0; j < $scope.adminOptExtendList[jOperation.name].length; j++) {
					var jOptExtend = $scope.adminOptExtendList[jOperation.name][j];
					if (jOptExtend.parentId == jOperation.id && jOptExtend.id == iOperationTab.optionId) {
						jOptExtend.active = true;
						jOptExtend.checked = true;

						if ($scope.adminOptExtendList[jOperation.name].length >= 1) {
							jOperation.isExtendOpt = true;
						}
					}
				}
			}
		};

		$scope.getTabExtendsOptList = function(iTab) {

			$scope.adminOptExtendList[iTab.name] = [];

			for (var i = 0; i < $scope.opOptionExtendsList.length; i++) {
				var iOptExtend = $scope.opOptionExtendsList[i];
				if (iOptExtend.parentId == iTab.id) {
					$scope.adminOptExtendList[iTab.name].push(iOptExtend);
				}
			}
		};



		$scope.chooseTabApp = function(item) {

			if (adminAPI.isNullOrEmpty(item) || adminAPI.isNullOrEmpty($scope.opOptionExtendsList)) return;

			var activeFlg = false;
			var itemOpt = [];
			
			if (item.active) {
				item.isExtendOpt = true;

				if (adminAPI.isNullOrEmpty($scope.adminOptExtendList[item.name]) 
					|| $scope.adminOptExtendList[item.name].length == adminAPI.num.int_0) {
					$scope.adminOptExtendList[item.name] = [];
					
					for (var i = 0; i < $scope.opOptionExtendsList.length; i++) {
						var iOptExtend = $scope.opOptionExtendsList[i];
						if (iOptExtend.parentId == item.id) {
							itemOpt.push(iOptExtend);
						}
					}
				} else {
					itemOpt = $scope.adminOptExtendList[item.name];
				}

				for (var i = 0; i < itemOpt.length; i++) {
					if (adminAPI.isNullOrEmpty(iOptExtend.checked)) {
						activeFlg = false;
					} else {
						activeFlg = true;
						break;
					}
				}

				if (!activeFlg) {
					for (var i = 0; i < itemOpt.length; i++) {
						if (adminAPI.num.int_0 == i) {
							itemOpt[i].active = true;
							itemOpt[i].checked = true;
						} else {
							itemOpt[i].active = false;
							itemOpt[i].checked = false;
						}
					}
				}

				$scope.adminOptExtendList[item.name] = itemOpt;

			} else {
				item.isExtendOpt = false;
				if (adminAPI.isNullOrEmpty($scope.adminOptExtendList) 
					|| adminAPI.isNullOrEmpty($scope.adminOptExtendList[item.name])) return;

				for (var i = 0; i < $scope.adminOptExtendList[item.name].length; i++) {
					$scope.adminOptExtendList[item.name][i].active = false;
				}
			}

		};

		$scope.chooseTabOpt = function(itab, iopt) {

			if (adminAPI.isNullOrEmpty(itab) || adminAPI.isNullOrEmpty(iopt)) return;

			var itemOpt = $scope.adminOptExtendList[itab.name];
			for (var i = 0; i < itemOpt.length; i++) {
				if (itemOpt[i].id == iopt.id) {
					itemOpt[i].active = true;
					itemOpt[i].checked = true;
				} else {
					itemOpt[i].active = false;
					itemOpt[i].checked = false;
				}
			}

		};

		$scope.checkParameter = function() {

			if (adminAPI.isNullOrEmpty($scope.app.appName)) {
				adminAPI.comfirmPopup("App name is invalid!");
	    		return false;
	    	}

	    	if (adminAPI.isNullOrEmpty($scope.app.packageName)) {
				adminAPI.comfirmPopup("App package name is invalid!");
	    		return false;
	    	}

			if ($scope.app.appName.length > 32) {
				adminAPI.comfirmPopup("App name is too long!");
				return false;
			}
			
			if ($scope.app.packageName.length > 64) {
				adminAPI.comfirmPopup("App package name is too long!");
				return false;
			}

	    	return true;
		};

		$scope.appSave = function() {

			$scope.resubmit = true;

			if (!$scope.checkParameter()) {
				$scope.resubmit = false;
				return;
			}

			$scope.paramData.appInfo.userId = adminAPI.loginUser.id;
			$scope.paramData.appInfo.groupId = adminAPI.loginUser.groupId;
			$scope.paramData.appInfo.appName = $scope.app.appName;
			$scope.paramData.appInfo.packageName = $scope.app.packageName;

			$scope.paramData.opOptionList = $scope.opOptionList;
			$scope.paramData.opOptionExtendsList = $scope.opOptionExtendsList;

	    	var url;
	    	if (adminAPI.str.create == $scope.app.action) {
	    		url = urlAPI.admin_app_create;
	    	} else if (adminAPI.str.update == $scope.app.action) {
	    		url = urlAPI.admin_app_update;
				$scope.paramData.appInfo.appId = $scope.app.id;
	    	}

	    	serviceAPI.saveData(url, $scope.paramData).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$location.path('/view' + urlAPI.admin_app_view);
				} else if (result.status == -1 && (result.code == 80101703 || result.code == 80201703)) {
					adminAPI.comfirmPopup("App name was aready existed!");
				} else if (result.status == -1 && (result.code == 80101705 || result.code == 80201705)) {
					adminAPI.comfirmPopup("Package name was aready existed!");
				} else {
					adminAPI.comfirmPopup(result.msg);
				}

				$scope.resubmit = false;
			});

		};



		//初始化控件
		$scope.initEditView();
	}
];

return scope;