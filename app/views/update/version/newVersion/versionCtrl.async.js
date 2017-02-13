var scope = ["$scope", "serviceAPI", "ModalAlert", "Upload", "$stateParams", 'urlAPI', '$state',
    function($scope, serviceAPI, ModalAlert, Upload, $stateParams, urlAPI, $state) {
        $scope.getDetail = function() {
            $scope.detail = {
                "appicon": "",
                "fullpackage": "",
                "appName": $stateParams.app,
                "app": $stateParams.package,
                "appid": 0,
                "packagename": "",
                "version_code": "",
                "version_name": "",
                "updatenote": "",
                "mandatory_update": 0,
                "silenceinstall": 0,
                "target": 100,
                "updatepriority": 0,
                "segment": "where 1=1",
                "requiresandroid": "",
                "incrementalpack": [],
                "frontsql": {
                    "isAnd": 1,
                    "isTrue": 1,
                    "params": []
                }
            };
        };
        $scope.showPic = true;
        $scope.isShow = true;
        $scope.fullState = false;
        $scope.incState = false;
        $scope.loadDetail = function(id) {
            serviceAPI.loadData(urlAPI.update_appdetail, { "id": id }).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.detail = result.data;
                    $scope.detail.appName = result.data.app;
                    if (!$scope.detail.frontsql || $scope.detail.frontsql == '') {
                        $scope.detail.frontsql = {
                            "isAnd": 1,
                            "isTrue": 1,
                            "params": []
                        }
                    } else {
                        $scope.detail.frontsql = JSON.parse($scope.detail.frontsql);
                    };
                    if ($scope.detail.incrementalpack.length >= 3) {
                        $scope.isShow = false;
                    };
                }
            })
        };
        $scope.getImg = function(id) {
            serviceAPI.loadData(urlAPI.update_getImg, { "id": id }).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.detail.appicon = result.data;
                }
            });
        };
        $scope.loadDevice = function() {
            serviceAPI.loadData(urlAPI.update_getDevice).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    var arr = [];
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].channel && result.data[i].channel != "") {
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
        $scope.delInc = function(index, id) {
            var arr = $scope.detail.incrementalpack;
            var length = arr.length;
            if (index == 0) {
                $scope.detail.incrementalpack = arr.slice(index + 1, length);
            } else {
                $scope.detail.incrementalpack = arr.slice(0, index).concat(arr.slice(index + 1, length));
            };
            if (id) {
                serviceAPI.delData(urlAPI.update_delincrepack, { id: id }).then(function(result) {
                    if (result.status == 0 && result.code == 0) {
                        $scope.androidVersion = result.data;
                    }
                })
            }
            $scope.isShow = true;
        };
        $scope.addInc = function() {
            if ($scope.detail.fullpackage == "") {
                return;
            };
            $scope.detail.incrementalpack.push({
                "version": "",
                "pack": "",
                "id": 0
            });
            if ($scope.detail.incrementalpack.length == 3) {
                $scope.isShow = false;
            }
        };
        $scope.changeState = function(str) {
            if ($scope.detail[str] == 0) {
                $scope.detail[str] = 1;
            } else {
                $scope.detail[str] = 0;
            }
        };
        $scope.changeTarget = function() {
            if ($scope.detail.target == 100) {
                $scope.detail.target = 99;
            } else {
                $scope.detail.target = 100;
            }
        };
        $scope.checkTarget = function() {
            if (!$scope.detail.target || $scope.detail.target <= 0) {
                $scope.detail.target = 1;
            } else if (isNaN(Number($scope.detail.target))) {
                $scope.detail.target = 1;
            }
            $scope.detail.target = parseInt($scope.detail.target);
        }
        $scope.changePriority = function(str, num) {
            $scope.detail[str] = num;
        };
        $scope.uploadFull = function(file, errFiles) {
            if (file) {
                $scope.fullState = true;
                Upload.upload({
                    url: urlAPI.update_uploadfile,
                    data: { file: file }
                    // , idType: 1
                }).then(function(result) {
                    var result = result.data;
                    $scope.fullState = false;
                    if (result.status == 0 && result.code == 0) {
                        $scope.detail.fullpackage = result.data.filePath;
                        $scope.detail.packagename = result.data.packageName;
                        $scope.detail.version_name = result.data.versionName;
                        $scope.detail.version_code = result.data.versionCode;
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                });
            }
        };
        $scope.uploadInc = function(file, errFiles, vo) {
            if (file) {
                $scope.incState = true;
                Upload.upload({
                    url: urlAPI.update_uploadfile,
                    data: { file: file, id: vo.id }
                    // , idType: 1
                }).then(function(result) {
                    var result = result.data;
                    $scope.incState = false;
                    if (result.status == 0 && result.code == 0) {
                        vo.pack = result.data.filePath;
                        if (result.data.versionCode) {
                            vo.version = result.data.versionCode;
                        } else {
                            ModalAlert.popup({ msg: 'incorrect fileName' }, 2500);
                        }
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                });
            }
        };
        $scope.uploadImg = function(file, errFiles) {
            if (file) {
                if (file.size >= 102400) {
                    ModalAlert.popup({
                        msg: "The picture is too big"
                    }, 2500);
                    return false;
                } else {
                    $scope.picFile = file;
                    Upload.upload({
                        url: urlAPI.update_uploadfile,
                        data: { file: file }
                        // , idType: 1
                    }).then(function(result) {
                        var result = result.data;
                        if (result.status == 0 && result.code == 0) {
                            $scope.showPic = false;
                            $scope.detail.appicon = result.data.filePath;
                        } else {
                            ModalAlert.popup({ msg: result.msg }, 2500);
                        }
                    });
                }
            }
        };
        $scope.sigleSegment = function(vo) {
            var where = " ";
            switch (vo.name) {
                case "Device":
                    if (vo.value1 != "All Devices") {
                        where += " $_channel='" + vo.value1 + "' ";
                    } else {
                        where += " 1=1 "
                    };
                    if (vo.value2 && vo.value2 != "") {
                        if (vo.value2 != "All Devices") {
                            where += " and $_model='" + vo.value2 + "' ";
                        } else {
                            where += " and 1=1 ";
                        };
                    };
                    if (vo.value3 && vo.value3 != "") {
                        if (vo.value3 != "All OS Versions") {
                            where += " and $_osversion='" + vo.value3 + "' ";
                        } else {
                            where += " and 1=1 ";
                        };
                    };
                    if (vo.where != "is") {
                        where = " not(" + where + ")";
                    }
                    break;
                case "Location":
                    if (vo.value1 != "All Country") {
                        where += " $_country='" + vo.value1 + "' ";
                    } else {
                        where += " 1=1"
                    };
                    if (vo.value2 && vo.value2 != "") {
                        if (vo.value2 != "All States") {
                            where += " and $_state='" + vo.value2 + "' ";
                        } else {
                            where += " and 1=1 ";
                        }
                    };
                    if (vo.where != "is") {
                        where = " not(" + where + ")";
                    }
                    break;
                case "Android Version":
                    if (vo.value2 && vo.value2 != "") {
                        where = " $_androidVersion between '" + vo.value1 + "'' and '" + vo.value2 + "' ";
                    } else {
                        where = " $_androidVersion >= " + vo.value1;
                    }
                    break;
                case "Create Time":
                    if (vo.value2 && vo.value2 != "") {
                        where = " to_days($_current_time)-to_days($_serverTime) between " + vo.value1 + " and " + vo.value2;
                    } else {
                        where = " to_days($_current_time)-to_days($_serverTime) > " + vo.value1;
                    }
                    break;
                case "Client ID":
                    if (vo.where == "are") {
                        where = " $_clientid in " + "(" + vo.value1 + ") ";
                    } else {
                        where = " $_clientid = " + "'" + vo.value1 + "' ";
                        if (vo.where != "is") {
                            where = " not(" + where + ")";
                        }
                    }
                    break;
            };
            return "(" + where + ")";
        };
        $scope.setSegment = function(vo) {
            var where = "";
            var str = "or";
            if (vo.isAnd == '1') {
                str = "and"
            };
            var wherepart = vo.params;
            for (var i = 0; i < wherepart.length; i++) {
                if (i > 0) {
                    where += str;
                };
                if (wherepart[i].param) {
                    var param=$scope.sigleSegment(wherepart[i].param);
                    if(param){
                         where += param;
                     }else{
                        return false;
                     }
                   
                } else {
                    where += "(" + $scope.setSegment(wherepart[i]) + ")";
                }
            }
            return where;
        };
        $scope.saveDetail = function() {
            if (!$scope.detail.fullpackage || $scope.detail.fullpackage == '') {
                ModalAlert.popup({ msg: "Please upload a package" }, 2500)
                return false;
            }
            if (!$scope.detail.updatenote || $scope.detail.updatenote == '') {
                ModalAlert.popup({ msg: "The updatenote is required" }, 2500)
                return false;
            }
            for (var i = 0; i < $scope.detail.frontsql.params.length; i++) {
                var item = $scope.detail.frontsql.params[i];
                if (item.param.name === "Client ID") {
                    if (item.param.value1 === "") {
                        ModalAlert.error({ msg: "Client ID can not be empty!" }, 2500)
                        return false;
                    }
                    if (item.param.where !== "are") {
                        if (item.param.value1.length < 32 || item.param.value1.length > 93) {
                            ModalAlert.error({ msg: "Client ID length is not correct!" }, 2500)
                            return false;
                        };
                    }
                }

            }
            var param = $scope.setSegment($scope.detail.frontsql);
            if (param) {
               $scope.detail.segment = param;
            } else {
                $scope.detail.segment = '';
            }
            $scope.frontsql = $scope.detail.frontsql;
            // $scope.detail.incrementalpack = JSON.stringify($scope.detail.incrementalpack);
            $scope.detail.frontsql = JSON.stringify($scope.detail.frontsql);
            var url = urlAPI.update_saveVersion;
            if ($stateParams.param == "edit") {
                url = urlAPI.update_editappver;
            };
            serviceAPI.saveData(url, $scope.detail).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    history.go(-1);
                } else {
                    $scope.detail.frontsql = $scope.frontsql;
                    ModalAlert.popup({ msg: result.msg }, 2500)
                }
            });
        };
        $scope.init = function() {
            if ($stateParams.param == "edit") {
                $scope.loadDetail($stateParams.id);
            } else {
                $scope.getDetail();
                $scope.detail.appid = $stateParams.id;
                $scope.getImg($stateParams.package);
            };
            $scope.loadDevice();
            $scope.loadCountry();
            $scope.loadAndroidVersion();
        };
        $scope.init();
    }
];
return scope;
