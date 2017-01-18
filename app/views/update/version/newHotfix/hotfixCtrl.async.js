var scope = ["$scope", "serviceAPI", "ModalAlert", "Upload", "$stateParams", 'urlAPI', '$state',
    function($scope, serviceAPI, ModalAlert, Upload, $stateParams, urlAPI, $state) {
        $scope.appName = $stateParams.app;
        $scope.getDetail = function() {
            $scope.detail = {
                "app": $stateParams.package,
                "versionCode": "",
                "fullpackage": "",
                "hotfixCode": "",
                "updatenote": "",
                "target": 100,
                "segment": {
                    "isAnd": 1,
                    "isTrue": 1,
                    "params": []
                }
            };
        };
        $scope.loadDetail = function(id) {
            serviceAPI.loadData(urlAPI.update_hotfixdetail, { "id": id }).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.detail = result.data;
                    $scope.detail.appName = result.data.app;
                    if (!$scope.detail.segment || $scope.detail.segment == '') {
                        $scope.detail.segment = {
                            "isAnd": 1,
                            "isTrue": 1,
                            "params": []
                        }
                    } else {
                        $scope.detail.segment = $scope.getSegment(JSON.parse($scope.detail.segment));
                    };
                    var fileName = result.data.fullpackage;
                    var index1 = fileName.indexOf('_'),
                        index2 = fileName.indexOf('_', fileName.indexOf('_')+1),
                        index3 = fileName.indexOf('.');
                    $scope.fileCode = fileName.slice(index1 + 1, index2);
                }
            })
        };
        $scope.getSegment = function(vo) {
            for (var i = 0; i < vo.params.length; i++) {
                var item = vo.params[i];
                if (item.value.indexOf(',') > -1) {
                    var value = item.value.split(",");
                }
                switch (item.key) {
                    case "Device": 
                        item.value1 = value[0];
                        item.value2 = value[1] == '*' ? 'All Devices' : value[1];
                        item.value3 = value[2] == '*' ? 'All OS Versions' : value[2];
                    break;
                    case "Android Version": 
                        if (item.condition == 'is above') {
                            item.value1 = item.value;
                        } else {
                            item.value1 = value[0];
                            item.value2 = value[1];
                        }
                    break;
                    case "Location": 
                        item.value1 = value[0];
                        item.value2 = value[1] == '*' ? 'All States' : value[1];
                    break;
                    case "Create Time": 
                        if (item.condition == 'more than') {
                            item.value1 = item.value;
                        } else {
                            item.value1 = value[0];
                            item.value2 = value[1];
                        }
                    break;
                    case "Client ID": 
                        item.value1 = item.value;
                    break;
                }
                delete item.value;
            }
            return vo;
            
        };
        $scope.loadTargetVersion = function() {
            serviceAPI.loadData(urlAPI.update_hotfixVer, {app : $stateParams.package}).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.targetVersions = result.data;
                }
            });
        };
        $scope.loadDevice = function() {
            serviceAPI.loadData(urlAPI.update_getDevice).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    var arr = [];
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].chl && result.data[i].chl != "") {
                            arr.push(result.data[i]);
                        }
                    };
                    $scope.devices = arr;
                }
            });
        };
        $scope.loadAndroidVersion = function() {
            serviceAPI.loadData(urlAPI.update_androidVersion).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.androidVersion = result.data;
                }
            })
        };
        $scope.loadCountry = function() {
            serviceAPI.loadData(urlAPI.update_getArea).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.areas = result.data;
                }
            })
        };
        $scope.changeTarget = function() {
            if ($scope.detail.target == 100) {
                $scope.detail.target = 99;
            } else {
                $scope.detail.target = 100;
            }
        };
        $scope.checkTarget = function() {
            if (!$scope.detail.target || $scope.detail.target == 0) {
                $scope.detail.target = 1;
            }
            $scope.detail.target = parseInt($scope.detail.target);
        }
        $scope.uploadPatch = function(file, errFiles) {
            if (file) {
                Upload.upload({
                    url: urlAPI.update_uploadfile,
                    data: { file: file }
                    // , idType: 1
                }).then(function(result) {
                    var result = result.data;
                    if (result.status == 0 && result.code == 0) {
                        $scope.detail.fullpackage = result.data.filePath;
                        var fileName = file.name;
                        var index1 = fileName.indexOf('_'),
                            index2 = fileName.indexOf('_', fileName.indexOf('_') + 1),
                            index3 = fileName.indexOf('.');
                        $scope.fileCode = fileName.slice(index1 + 1, index2);
                        $scope.detail.hotfixCode = Number(fileName.slice(index2 + 1, index3));
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                });
            }
        };
        $scope.setSegment = function(vo) {
            for (var i = 0; i < vo.params.length; i++) {
                var item = vo.params[i];
                switch (item.key) {
                    case "Device": 
                        item.value2 = item.value2 == 'All Devices' ? '*' : item.value2;
                        item.value3 = item.value3 == 'All OS Versions' ? '*' : item.value3;
                        item.value = item.value1 + ',' + item.value2 + ',' + item.value3;
                    break;
                    case "Android Version": 
                        if (item.condition == 'is above') {
                            item.value = item.value1;
                        } else {
                            item.value = item.value1 + ',' + item.value2;
                        }
                    break;
                    case "Location": 
                        item.value2 = item.value2 == 'All States' ? '*' : item.value2;
                        item.value = item.value1 + ',' + item.value2;
                    break;
                    case "Create Time": 
                        if (item.condition == 'more than') {
                            item.value = item.value1;
                        } else {
                            item.value = item.value1 + ',' + item.value2;
                        }
                    break;
                    case "Client ID": 
                        item.value = item.value1;
                    break;
                }
                delete item.value1;
                delete item.value2;
                delete item.value3;
                delete item.$$hashKey;
            }
            return vo;
            
        };
        $scope.saveDetail = function() {
            if (!$scope.detail.fullpackage || $scope.detail.fullpackage == '') {
                ModalAlert.popup({ msg: "Please upload a package" }, 2500);
                return false;
            } else if (!$scope.detail.updatenote || $scope.detail.updatenote == '') {
                ModalAlert.popup({ msg: "The updatenote is required" }, 2500);
                return false;
            } else if ($scope.detail.versionCode != $scope.fileCode) {
                ModalAlert.popup({ msg: "Patch is illegal!" }, 2500);
                return false;
            }
            $scope.segment = $scope.detail.segment;
            $scope.detail.segment = JSON.stringify($scope.setSegment($scope.detail.segment));
            var url = urlAPI.update_saveHotfix;
            if ($stateParams.param == "edit") {
                url = urlAPI.update_editHotfix;
            };
            serviceAPI.saveData(url, $scope.detail).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    history.go(-1);
                } else {
                    $scope.detail.segment = $scope.getSegment($scope.segment);
                    ModalAlert.popup({ msg: result.msg }, 2500)
                }
            });
        };
        $scope.init = function() {
            if ($stateParams.param == "edit") {
                $scope.loadDetail($stateParams.id);
            } else {
                $scope.getDetail();
            };
            $scope.loadTargetVersion();
            $scope.loadDevice();
            $scope.loadCountry();
            $scope.loadAndroidVersion();
        };
        $scope.init();
    }
];
return scope;
