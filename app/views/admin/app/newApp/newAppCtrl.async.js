var scope = ["$scope", "serviceAPI", "$location", "ModalAlert", "Upload",'urlAPI',
	function($scope, serviceAPI, $location, ModalAlert,Upload,urlAPI) {
		$scope.loadVersion = function(){
            serviceAPI.loadData(urlAPI.update_androidVersion).then(function(result){
                if (result.status == 0 && result.code == 0) {
                    $scope.version = result.data;
                }
            })
		};
		$scope.loadVersion();
        $scope.detail = {
            fullpackage:'',
            appicon: ''
        }
        $scope.uploadPackage = function(file) {
            if (file) {
                Upload.upload({
                    url: urlAPI.update_uploadfile,
                    data: { file: file}
                }).then(function(result) {
                    var data = result.data;
                    if (data.status == 0 && data.code == 0) {
                        $scope.fullpackage = file.name;
                        $scope.detail.fullpackage = data.data.filePath;
                        $scope.detail.packagename = data.data.packageName;
                        $scope.detail.version_code = data.data.versionCode;
                        $scope.detail.version_name = data.data.versionName;
                    } else {
                        ModalAlert.popup({ msg: data.msg }, 2500);
                    }
                });
            }
        };
        $scope.uploadPic = function(file) {
            if (file) {
                Upload.upload({
                    url: urlAPI.update_uploadfile,
                    data: { file: file}
                }).then(function(result) {
                    var data = result.data;
                    if (data.status == 0 && data.code == 0) {
                        $scope.appicon = file.name;
                        $scope.detail.appicon = data.data.filePath;
                        // 获取 window 的 URL 工具 
                        var URL = window.URL || window.webkitURL; 
                        // 通过 file 生成目标 url 
                        $scope.imgURL = URL.createObjectURL(file); 
                    } else {
                        ModalAlert.popup({ msg: data.msg }, 2500);
                    }
                });
            }
        };
        $scope.versionData = function(vs, str){
            if (str == 'start') {
                $scope.versionstart = vs;
                $scope.versionend = '';
            } else {
                $scope.versionend = vs;
            }
        };
		$scope.saveData = function(){
            if ($scope.detail.fullpackage == '') {
                $('.package').css('border-color', 'red');
                return false;
            }
            if ($scope.detail.appicon == '') {
                return false;
            }
            if ($scope.detail.description == '') {
                return false;
            }
            if ($scope.versionstart == '') {
                return false;
            }
            if ($scope.versionend == '') {
                return false;
            }
            $scope.detail.requiresandroid = $scope.versionstart + '~' + $scope.versionend;
			serviceAPI.saveData(urlAPI.update_addapp, $scope.detail).then(function(result){
				if (result.status == 0 && result.code == 0) {
					$location.path = '/view/admin/' + $scope.detail.app;
				} else {
					ModalAlert.popup({ msg: result.msg }, 2500);
				}
			})
		};
	}
];
return scope;