var scope = ["$scope", "$location", "ModalAlert", "urlAPI", "serviceAPI", "adminAPI", 
	function($scope, $location, ModalAlert, urlAPI, serviceAPI, adminAPI) {

		$scope.user = {};
		
		$scope.paramData = {
			userId: "",
			action: "",
			groupId: "",
			userInfo: {
				userName: "",
				realName: "",
				email: "",
				timezone: adminAPI.str.timezone,
				language: adminAPI.str.language,
				bossId: ""
			},
			userChannelChosenList: {},
			userAssignRoleOrderList: {}
		};

		$scope.userAssignRoleOrderList = [];
		$scope.userAssignRoleOrder = {
			active: 0,
			roleId: 0,
			roleName: ""
		};

		$scope.initEditView = function() {
			$scope.user = adminAPI.getUser();
			if (!$scope.user || !$scope.user.action || $scope.user.groupId == undefined || $scope.user.groupId == null) {
				adminAPI.comfirmPopup("paramter is invalid!");
				return;
			}

			$scope.userNameBk = $scope.user.userName;
			$scope.paramData.userId = $scope.user.id;
			$scope.paramData.action = $scope.user.action;
			$scope.paramData.groupId = $scope.user.groupId;

			serviceAPI.loadData(urlAPI.admin_user_edit, $scope.paramData).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					// $scope.groupList = result.data.groupList;
					// $scope.channelList = result.data.adminChannelList;
					$scope.adminUserList = result.data.adminUserList;
					$scope.adminChannelList = result.data.adminChannelList;
					$scope.adminChannelUserList = result.data.adminChannelUserList;
					$scope.userActivityRoleList = adminAPI.cloneArray(result.data.userActivityRoleList);
					$scope.userAssignedRoleList = adminAPI.cloneArray(result.data.userAssignedRoleList);
					$scope.buildViewData();
					// $scope.buildAssignTable();
				}
			});

		};

		$scope.buildViewData = function() {

			$scope.chargeChannelData();

			$scope.chargeUserBossData();

			$scope.chargeAssignUserData();
			
		};

		// $scope.chargeChannelData = function() {

		// 	$scope.adminChannelList = $scope.adminChannelList.map(function(data) {
		// 		return {
		// 			"id": data.id,
		// 			"name": data.channel
		// 		}
		// 	});

		// 	for (var i = 0; i < $scope.adminChannelUserList.length; i++) {
		// 		for (var j = 0; j < $scope.adminChannelList.length; j++) {
		// 			if ($scope.adminChannelList[j].id == $scope.adminChannelUserList[i].id) {
		// 				$scope.adminChannelList[j].active = true;
		// 				break;
		// 			}
		// 		}
		// 	}
		// };

		$scope.chargeChannelData = function() {

			$scope.userChannelChosenList = $scope.adminChannelList.map(function(data) {
				return {
					"channelId": data.id,
					"channel": data.channel
				}
			});

			var activeFlg = false;
			for (var i = 0; i < $scope.userChannelChosenList.length; i++) {
				if (adminAPI.isNullOrEmpty($scope.adminChannelUserList)) {
					$scope.userChannelChosenList[i].active = false;
					continue;
				}

				for (var j = 0; j < $scope.adminChannelUserList.length; j++) {
					if ($scope.userChannelChosenList[i].channelId == $scope.adminChannelUserList[j].id) {
						activeFlg = true;
						break;
					} else {
						activeFlg = false;
					}
				}

				if (activeFlg) {
					$scope.userChannelChosenList[i].active = true;
				} else {
					$scope.userChannelChosenList[i].active = false;
				}
			}
		};

		$scope.chargeUserBossData = function() {

			for (var i = 0; i < $scope.adminUserList.length; i++) {
				if ($scope.adminUserList[i].id == $scope.user.id) {
					$scope.adminUserList.splice(i, 1);
					break;
				}
			}


			for (var i = 0; i < $scope.adminUserList.length; i++) {
				if ($scope.adminUserList[i].id == $scope.user.bossId) {
					$scope.adminUserList[i].checked = true;
				} else {
					$scope.adminUserList[i].checked = false;
				}
			}
		};

		$scope.chargeAssignUserData = function() {

			var activeFlg;

			for (var i = 0; i < $scope.userActivityRoleList.length; i++) {
				for (var j = 0; j < $scope.userAssignedRoleList.length; j++) {
					if ($scope.userActivityRoleList[i].id == $scope.userAssignedRoleList[j].id) {
						$scope.userActivityRoleList[i].active = adminAPI.num.int_1;
						activeFlg = true;
						break;
					} else {
						activeFlg = false;
					}
				}

				if (!activeFlg) {
					$scope.userActivityRoleList[i].active = adminAPI.num.int_0;
				}
			}

			for (var i = 0; i < $scope.userAssignedRoleList.length; i++) {
				$scope.userAssignRoleOrder.active = adminAPI.num.int_1;
				$scope.userAssignRoleOrder.roleId = $scope.userAssignedRoleList[i].id;
				$scope.userAssignRoleOrder.roleName = $scope.userAssignedRoleList[i].name;
				$scope.userAssignRoleOrderList.push($scope.userAssignRoleOrder);
				$scope.userAssignRoleOrder = {};
			}
		};

	    $scope.assignRoleByUser = function($event, item) {

	    	var existFlg = false;
	    	var checkFlg;

			if (adminAPI.isNullOrEmpty($event.target.checked)) {
				checkFlg = item.active == adminAPI.num.int_1 ? adminAPI.num.int_0 : adminAPI.num.int_1;
				if (!adminAPI.isNullOrEmpty($event.target.previousElementSibling && $event.target.previousElementSibling.id == item.id)) {
					$event.target.previousElementSibling.checked = checkFlg == adminAPI.num.int_1 ? true : false;
					item.active = checkFlg;
				}
			} else {
				checkFlg = $event.target.checked == true ? adminAPI.num.int_1 : adminAPI.num.int_0;
			}

			for (var i = 0; i < $scope.userAssignRoleOrderList.length; i++) {
	    		if ($scope.userAssignRoleOrderList[i].roleId == item.id) {
					$scope.userAssignRoleOrderList[i].active = checkFlg;
					existFlg = true;
					break;
	    		} else {
	    			existFlg = false;
	    		}
	    	}

	    	if (!existFlg) {
				$scope.userAssignRoleOrder.active = checkFlg;
				$scope.userAssignRoleOrder.roleId = item.id;
				$scope.userAssignRoleOrder.roleName = item.name;
				$scope.userAssignRoleOrderList.push($scope.userAssignRoleOrder);
				$scope.userAssignRoleOrder = {};
	    	}
	    };

	    // $scope.chooseChannel = function($event, item) {

	    // 	for (var i = 0; i < $scope.adminChannelList.length; i++) {
	    // 		if ($scope.adminChannelList[i].id == item.id) {
	    // 			$scope.adminChannelList[i].active = item.active;
	    // 		}
	    // 	}
	    // };

	    $scope.chooseUserBoss = function($event, item) {
	    	$scope.user.bossId = item.id;

	    	for (var i = 0; i < $scope.adminUserList.length; i++) {
	    		if ($scope.adminUserList[i].id == item.id) {
					$scope.adminUserList[i].checked = true;
				} else {
					$scope.adminUserList[i].checked = false;
				}
	    	}
	    };

	    $scope.setRealName = function() {
	    	if (adminAPI.isNullOrEmpty($scope.user.realName)) {
	    		$scope.user.realName = $scope.user.userName;
	    	}
	    };

		$scope.checkParameter = function() {

			if (adminAPI.isNullOrEmpty($scope.user.userName)) {
				adminAPI.comfirmPopup("User name is invalid!");
	    		return false;
	    	}

	    	if (adminAPI.isNullOrEmpty($scope.user.email)) {
				adminAPI.comfirmPopup("User email is invalid!");
	    		return false;
	    	}

			if ($scope.user.userName.length > 64) {
				adminAPI.comfirmPopup("User name is too long!");
				return false;
			}
			
			if ($scope.user.email.length > 64) {
				adminAPI.comfirmPopup("User email is too long!");
				return false;
			}

	    	var regExp = new RegExp(adminAPI.str.email);
	    	if (!regExp.test($scope.user.email)) {
				adminAPI.comfirmPopup("User email is invalid!");
	    		return false;
	    	}

	    	if (adminAPI.isNullOrEmpty($scope.user.realName)) {
	    		$scope.user.realName = $scope.user.userName;
	    	}

	    	if (adminAPI.isNullOrEmpty($scope.user.timezone)) {
	    		$scope.user.timezone = adminAPI.str.timezone;
	    	}

	    	if (adminAPI.isNullOrEmpty($scope.user.language)) {
	    		$scope.user.language = adminAPI.str.language;
	    	}

	    	return true;
		};

		$scope.userSave = function() {

			$scope.resubmit = true;

			if (!$scope.checkParameter()) {
				$scope.resubmit = false;
				return;
			}

			$scope.paramData.userInfo.userName = $scope.user.userName;
			$scope.paramData.userInfo.realName = $scope.user.realName;
			// $scope.paramData.userInfo.password = "123456";
			// $scope.paramData.userInfo.password = adminAPI.getPassword();
			$scope.paramData.userInfo.email = $scope.user.email;
			$scope.paramData.userInfo.groupId = $scope.user.groupId;
			$scope.paramData.userInfo.bossId = adminAPI.isNullOrEmpty($scope.user.bossId) ? null : $scope.user.bossId;
			$scope.paramData.userInfo.timezone = $scope.user.timezone;
			$scope.paramData.userInfo.language = $scope.user.language;
			$scope.paramData.userInfo.isDefault = adminAPI.num.int_0;
			$scope.paramData.userInfo.isDisabled = adminAPI.num.int_0;
			$scope.paramData.userAssignRoleOrderList = $scope.userAssignRoleOrderList;
	    	$scope.paramData.userChannelChosenList = $scope.userChannelChosenList;

	    	var url;
	    	if (adminAPI.str.create == $scope.user.action) {
	    		url = urlAPI.admin_user_create;
	    	} else if (adminAPI.str.update == $scope.user.action) {
	    		url = urlAPI.admin_user_update;
	    	}

	    	serviceAPI.saveData(url, $scope.paramData).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$location.path('/view' + urlAPI.admin_user_view);
				} else if (result.status == -1 && result.code == 80101101) {
					adminAPI.comfirmPopup("User name was aready existed!");
				} else {
					adminAPI.comfirmPopup(result.msg);
				}

				$scope.resubmit = false;
			});

		};



		$scope.initEditView();

	}
];
return scope;