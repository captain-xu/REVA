var scope = ["$scope", "serviceAPI", "urlAPI", "Upload", "ModalAlert", 
  function($scope, serviceAPI, urlAPI, Upload, ModalAlert) {
    $scope.clientAre = true;
    $scope.getData = function() {
        $scope.areas = $scope.$parent.areas;
        $scope.devices = $scope.$parent.devices;
        $scope.androidVersion = $scope.$parent.androidVersion;
    };
    $scope.checkData = function() {
        if (!$scope.$parent.areas || !$scope.$parent.devices || !$scope.$parent.androidVersion) {
            return;
        }
        if ($scope.areas.length == 0 || $scope.devices.length == 0 || $scope.androidVersion.length == 0) {
            $scope.getData();
        };
    };
    $scope.setValue = function(item, str, value, num) {
        item.param[str] = value;
        $scope.clientStatus();
        if (value == 'All Devices') {
            $scope.OSList = [];
        }
        if (item.param.name == 'Client ID') {
            item.param.value1 = '';
        }
        if (num) {
            var osParam = {
                channel: item.param.value1,
                model: value
            }
            serviceAPI.loadData(urlAPI.update_getOSVersion, osParam).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.OSList = result.data;
                }
            });
        }
    };

    $scope.addCondition = function() {
        $scope.checkData();
        if ($scope.devices && $scope.devices.length != 0) {
            $scope.segment.params.push({
                param: {
                    "name": "Device",
                    "where": "is",
                    "value1": $scope.devices[0].chl,
                    "value2": "All Devices",
                    "value3": "All OS Versions"
                },
                "isAnd": 0,
                "isTrue": 1
            });
        }
    };
    $scope.changeName = function(vo, str) {
        $scope.checkData();
        if (vo.name == str) {
            return;
        };
        vo.name = str;
        vo.value2 = "";
        switch (vo.name) {
            case "Device":
                vo.where = "is";
                vo.value1 = $scope.devices[0].chl;
                vo.value2 = "All Devices";
                vo.value3 = "All OS Versions";
                break;
            case "Location":
                vo.where = "is";
                vo.value1 = $scope.areas[0].country;
                vo.value2 = "All States";
                break;
            case "Android Version":
                vo.where = "is above";
                vo.value1 = $scope.androidVersion[0];
                break;
            case "Create Time":
                vo.where = "more than"
                vo.value1 = "";
                break;
            case "Client ID":
                vo.where = "is"
                vo.value1 = "";
                $scope.clientStatus();
                break;
        }
    };
    $scope.clientStatus = function(){
        var clientWhere = $scope.segment.params.map(function(data) {
            return data.param.where;
        });
        if (clientWhere.indexOf('are') > -1) {
            $scope.clientAre = false;
        } else {
            $scope.clientAre = true;
        }
    };
    $scope.uploadClient = function(file, errFiles, item) {
        if (file) {
            if (file.type !== 'text/plain') {
                ModalAlert.popup({ msg: 'The file type is illegal!' }, 2500);
                return false;
            }
            Upload.upload({
                url: urlAPI.update_uploadfile,
                data: { file: file }
            }).then(function(result) {
                var result = result.data;
                if (result.status == 0 && result.code == 0) {
                    item.param.value1 = result.data.clientid;
                    ModalAlert.success({ msg: 'upload successed' }, 2500);
                } else if (result.status == -1 && result.code == 112) {
                    ModalAlert.error({ msg: 'Invalid client ID has been found in the uploaded file, please recheck the file.' }, 2500);
                } else {
                    ModalAlert.error({ msg: 'Client ID can not be empty!' }, 2500);
                }
            });
        }
    };
    $scope.changeValue = function(vo, str) {
        if (!str || vo.value1 == str) {
            return;
        };
        vo.value1 = str;
        switch (vo.name) {
            case "Device":
                vo.value2 = "All Devices";
                vo.value3 = "All OS Versions";
                break;
            case "Location":
                vo.value2 = "All States";
                break;
        }
    };
    $scope.addChild = function(vo, index) {
        $scope.checkData();
        vo.params = [{ param: vo.param }, {
            param: {
                "name": "Device",
                "where": "is",
                "value1": $scope.devices[0].chl,
                "value2": "All Devices",
                "value3": "All OS Versions"
            }
        }];
        vo.param = null;
    };
    $scope.remove = function(index) {
        var arr = $scope.segment.params;
        var length = arr.length;
        if (index == 0) {
            $scope.segment.params = arr.slice(index + 1, length);
        } else {
            $scope.segment.params = arr.slice(0, index).concat(arr.slice(index + 1, length));
        };
        if ($scope.segment.params.length == 1 && $scope.isChild == 'true') {
            $scope.segment.param = $scope.segment.params[0].param;
            $scope.segment.params = [];
        };
        $scope.clientStatus();
    };
}]
return scope;
