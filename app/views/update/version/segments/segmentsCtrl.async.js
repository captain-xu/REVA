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
        item[str] = value;
        $scope.clientStatus();
        if (value == 'All Devices') {
            $scope.OSList = [];
        }
        if (item.key == 'Client ID') {
            item.value1 = '';
        }
        if (num) {
            var osParam = {
                channel: item.value1,
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
            $scope.segments.params.push({
                "key": "Device",
                "condition": "is",
                "value1": $scope.devices[0].chl,
                "value2": "All Devices",
                "value3": "All OS Versions"
            });
        }
    };
    $scope.changeName = function(vo, str) {
        $scope.checkData();
        if (vo.key == str) {
            return;
        };
        vo.key = str;
        vo.value2 = "";
        switch (vo.key) {
            case "Device":
                vo.condition = "is";
                vo.value1 = $scope.devices[0].chl;
                vo.value2 = "All Devices";
                vo.value3 = "All OS Versions";
                break;
            case "Location":
                vo.condition = "is";
                vo.value1 = $scope.areas[0].country;
                vo.value2 = "All States";
                break;
            case "Android Version":
                vo.condition = "is above";
                vo.value1 = $scope.androidVersion[0];
                break;
            case "Create Time":
                vo.condition = "more than"
                vo.value1 = "";
                break;
            case "Client ID":
                vo.condition = "is"
                vo.value1 = "";
                $scope.clientStatus();
                break;
        }
    };
    $scope.clientStatus = function(){
        var clientWhere = $scope.segments.params.map(function(data) {
            return data.condition;
        });
        if (clientWhere.indexOf('are') > -1) {
            $scope.clientAre = false;
        } else {
            $scope.clientAre = true;
        }
    };
    $scope.uploadClient = function(file, errFiles, item) {
        if (file) {
            Upload.upload({
                url: urlAPI.update_uploadfile,
                data: { file: file }
            }).then(function(result) {
                var result = result.data;
                if (result.status == 0 && result.code == 0) {
                    item.value1 = result.data.clientid;
                    ModalAlert.success({ msg: 'upload successed' }, 2500);
                } else {
                    ModalAlert.error({ msg: result.msg }, 2500);
                }
            });
        }
    };
    $scope.changeValue = function(vo, str) {
        if (!str || vo.value1 == str) {
            return;
        };
        vo.value1 = str;
        switch (vo.key) {
            case "Device":
                vo.value2 = "All Devices";
                vo.value3 = "All OS Versions";
                break;
            case "Location":
                vo.value2 = "All States";
                break;
        }
    };
    // $scope.addChild = function(vo, index) {
    //     $scope.checkData();
    //     vos = [{ param: vo }, {
    //         param: {
    //             "key": "Device",
    //             "condition": "is",
    //             "value1": $scope.devices[0].chl,
    //             "value2": "All Devices",
    //             "value3": "All OS Versions"
    //         }
    //     }];
    //     vo = null;
    // };
    $scope.remove = function(index) {
        $scope.segments.params.splice(index, 1);
        $scope.clientStatus();
    };
}]
return scope;
