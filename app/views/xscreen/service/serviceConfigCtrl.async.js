var scope = ["$scope", "serviceAPI", "ModalAlert", 'urlAPI', 'Upload','$stateParams','$location',
    function($scope, serviceAPI, ModalAlert, urlAPI, Upload, $stateParams, $location) {
        $scope.loadList = function(channel){
            $scope.channelId = {
                id: channel.id
            };
            $scope.channelName = channel.name;
            serviceAPI.loadData(urlAPI.xscreen_lifeDetail, $scope.channelId).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.lifeList = result.data;
                    if ($scope.lifeList.length == 0) {
                        $scope.lifeList.push({"channelid":$scope.channelId.id, "life":"", "life_icon":"", "life_url":""});
                    }
                    for (var i = 0; i < $scope.lifeList.length; i++) {
                        $scope.lifeList[i].showPic = true;
                    }
                    $scope.lifeLength = $scope.lifeList.length;
                }
            })
        };
        $scope.uploadImg = function(file, life) {
            if (file) {
                if (file && file.size >= 200000 ) {
                    ModalAlert.popup({
                        msg:"The picture is too big"
                    }, 2500);
                    return false;
                } else {
                    Upload.upload({
                        url: urlAPI.xscreen_upload,
                        data: { file: file}
                    }).then(function(result) {
                        if (result.data.code == 0 && result.data.status == 0) {
                            life.picFile = file;
                            life.showPic = false;
                            life.life_icon = result.data.data.filePath; 
                            ModalAlert.popup({ msg: "Upload Succeeded" }, 2500);
                        } else {
                            ModalAlert.popup({ msg: result.data.msg }, 2500);
                        }
                    })
                }
            }
        };
        $scope.deleteData = function(life,index) {
            $scope.deleteId = {
                id: life.id
            };
            if (!$scope.deleteId.id) {
                $scope.lifeList.splice(index,1);
            } else {
                serviceAPI.delData(urlAPI.xscreen_lifeDelete, $scope.deleteId).then(function(result) {
                    if (result.status == 0 && result.code == 0) {
                        ModalAlert.popup({ msg: "Delete Succeeded" },2500);
                        $scope.loadList($scope.channel);
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                })
            }
            $scope.lifeLength = $scope.lifeList.length
        };
        $scope.addData = function() {
            $scope.lifeLength = $scope.lifeList.length + 1;
            $scope.lifeList.push({"channelid":$scope.channelId.id, "life":"", "life_icon":"", "life_url":"", "showPic": true});
        };
        $scope.saveData = function() {
            for (var i = 0; i < $scope.lifeList.length; i++) {
                var item = $scope.lifeList[i];
                if (!item.life_icon) {
                    ModalAlert.popup({ msg: "The Icon is necessary" },2500);
                    return false;
                }
                if (!item.life) {
                    ModalAlert.popup({ msg: "The Service Name is necessary" },2500);
                    return false;
                }
                if (!item.life_url) {
                    ModalAlert.popup({ msg: "The URL is necessary" },2500);
                    return false;
                }
            }
            $scope.lifeList.channelid = $scope.channelId.id;
            serviceAPI.saveData(urlAPI.xscreen_lifeAdd, $scope.lifeList).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    history.go(-1);
                }
            })
        };
        $scope.init = function() {
            $scope.channel = {
                id: $stateParams.id,
                name: $stateParams.name
            };
            $scope.loadList($scope.channel);
        };
        $scope.init();
    }
];
return scope;
