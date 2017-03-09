var scope = ["$scope", "serviceAPI", "urlAPI", "Upload", "ModalAlert",
    function($scope, serviceAPI, urlAPI, Upload, ModalAlert) {
        $scope.clientAre = true;
        $scope.setValue = function(item, str, value, num) {
            item[str] = value;
            $scope.clientStatus();
            if (item.key == 'Client ID') {
                item.value1 = '';
            }
            if (num) {
                item.value3 = 'All OS Versions';
            }
        };

        $scope.addCondition = function() {
            if ($scope.devices && $scope.devices.length != 0) {
                $scope.segment.items.push({
                    "key": "Device",
                    "condition": "is",
                    "value1": $scope.devices[0].channel,
                    "value2": "All Devices",
                    "value3": "All OS Versions"
                });
            };
        };
        $scope.changeName = function(vo, str) {
            if (vo.key == str) {
                return;
            };
            vo.key = str;
            vo.value2 = "";
            switch (vo.key) {
                case "Device":
                    vo.condition = "is";
                    vo.value1 = $scope.devices[0].channel;
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
                    vo.value1 = $scope.versions[0];
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
        $scope.clientStatus = function() {
            var clientWhere = $scope.segment.items.map(function(data) {
                return data.condition;
            });
            if (clientWhere.indexOf('in') > -1) {
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
                        item.value1 = result.data.clientid;
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
        $scope.addChild = function(vo, index) {
            vo.items = [{
                "key": vo.key,
                "condition": vo.condition,
                "value1": vo.value1,
                "value2": vo.value2,
                "value3": vo.value3
            }, {
                "key": "Device",
                "condition": "is",
                "value1": $scope.devices[0].channel,
                "value2": "All Devices",
                "value3": "All OS Versions"
            }];
            vo.isAnd = 0;
            vo.isTrue = 1;
            delete vo.key;
            delete vo.condition;
            delete vo.value1;
            delete vo.value2;
            delete vo.value3;
        };
        $scope.remove = function(index) {
            var items = $scope.segment.items
            items.splice(index, 1);
            if (items.length === 1 && $scope.isChild === 'true') {
                for(var n in items[0]){
                    $scope.segment[n] = items[0][n];
                }
                // $scope.segment = items[0];
                // $scope.segment.key = items[0].key;
                // $scope.segment.condition = items[0].condition;
                // $scope.segment.value1 = items[0].value1;
                // $scope.segment.value2 = items[0].value2;
                // $scope.segment.value3 = items[0].value3;
                delete $scope.segment.items;
                delete $scope.segment.isAnd;
                delete $scope.segment.isTrue;
            } else {
                $scope.clientStatus();
            }
        };
    }
]
return scope;
