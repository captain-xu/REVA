var scope = ["$scope", "serviceAPI", "urlAPI", "$stateParams", "ModalAlert",
	function($scope, serviceAPI, urlAPI, $stateParams, ModalAlert) {
		$scope.status = $stateParams.status;
		$scope.appName = $stateParams.app;
		$scope.getDetail = function() {
			if ($scope.status !== "new") {
				serviceAPI.loadData(urlAPI.cms_packageDetail, {id: $stateParams.id}).then(function(result) {
					$scope.detail = result.data;
				}).
				catch(function(result){})
			} else {
				$scope.detail = {
					packagename: "",
					channel: "",
					base_version_name: "",
					target_version_name: ""
				}
			}
			serviceAPI.loadData(urlAPI.cms_packageApp).then(function(result) {
				$scope.appList = result.data;
			}).
			catch(function(result){})
			serviceAPI.loadData(urlAPI.cms_packageVendor).then(function(result) {
				$scope.vendorList = result.data;
			}).
			catch(function(result){})
		};
		$scope.changeApp = function(app) {
			$scope.appName = app.app;
			$scope.detail.packagename = app.packagename;
		};
		$scope.changeVendor = function(ven) {
			$scope.detail.channel = ven.value;
		};
		$scope.saveDetail = function() {
			if ($scope.status === "edit") {
				$scope.detail.id = $stateParams.id;
				var url = urlAPI.cms_packageEdit;
			} else {
				var url = urlAPI.cms_packageNew; 
			}
			if ($scope.validate()) {
				serviceAPI.saveData(url, $scope.detail).then(function(result) {
					if (result.status === 0 && result.code === 0) {
						history.go(-1);
						ModalAlert.success({msg: "Task is created. Patch is releasing!"}, 2500);
					} else if (result.code === 113) {
				        ModalAlert.alert({
				            value: "Hot Fix Patches from Source Version" +  $scope.detail.base_version_name + "to Target Version" +  $scope.detail.target_version_name + "are already exist, click 'Confirm' button will rebuild them, ARE YOU SURE TO REBUILD？",
				            closeBtnValue: "Cancel",
				            okBtnValue: "Confirm",
				            confirm: function() {
				                $scope.detail.F = 0;
				                serviceAPI.saveData(url, $scope.detail).then(function(result) {
									if (result.status === 0 && result.code === 0) {
										history.go(-1);
										ModalAlert.success({msg: "Task is created. Patch is releasing!"}, 2500);
				                    }
				                }).catch(function() {})
				            }
				        });
					} else if (result.code === 114) {
				        ModalAlert.comfirm({
				            value: "Hot Fix Patches from Source Version" +  $scope.detail.base_version_name + "to Target Version" +  $scope.detail.target_version_name + "are already exist, click 'Confirm' button will rebuild them, ARE YOU SURE TO REBUILD？",
				            closeBtnValue: "Cancel"
				        });
					}
				})
			}
		};
		$scope.validate = function() {
			if (!$scope.appName) {
				ModalAlert.error({msg: "App Name is necessary."}, 2500);
				return false;
			} else if (!$scope.detail.channel) {
				ModalAlert.error({msg: "Vendor is necessary."}, 2500);
				return false;
			} else if (!$scope.detail.base_version_name) {
				ModalAlert.error({msg: "Source Version Name is necessary."}, 2500);
				return false;
			} else if (!$scope.detail.target_version_name) {
				ModalAlert.error({msg: "Target Version Name is necessary."}, 2500);
				return false;
			}
			return true;
		};
		$scope.getDetail();
	}
];
return scope;