var scope = ["$scope", "serviceAPI", "ModalAlert", 'urlAPI', 'Upload','$stateParams','$location',
    function($scope, serviceAPI, ModalAlert, urlAPI, Upload, $stateParams, $location) {
        $scope.loadList = function(){
            $scope.channelId = {
                id: $stateParams.id,
                cardid: $stateParams.cardid
            };
            $scope.channelName = $stateParams.name;
            serviceAPI.loadData(urlAPI.xscreen_directDetail, $scope.channelId).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.navList = result.data;
                    if ($scope.navList.length == 0) {
                        $scope.navList.push({"channelid":$scope.channelId.id, cardid: $stateParams.cardid, "navigation":"", "nav_icon":"", "nav_url":""});
                    }
                    for (var i = 0; i < $scope.navList.length; i++) {
                        $scope.navList[i].showPic = true;
                    }
                    $scope.navLength = $scope.navList.length;
                }
            })
        };
        $scope.uploadImg = function(file, nav) {
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
                            nav.picFile = file;
                            nav.showPic = false;
                            nav.nav_icon = result.data.data.filePath; 
                            ModalAlert.popup({ msg: "Upload Succeeded" }, 2500);
                        } else {
                            ModalAlert.popup({ msg: result.data.msg }, 2500);
                        }
                    })
                }
            }
        };
        $scope.deleteData = function(nav,index) {
            $scope.deleteId = {
                id: nav.id,
                cardid: $stateParams.cardid
            };
            if (!$scope.deleteId.id) {
                $scope.navList.splice(index,1);
            } else {
                serviceAPI.delData(urlAPI.xscreen_directDelete, $scope.deleteId).then(function(result) {
                    if (result.status == 0 && result.code == 0) {
                        ModalAlert.popup({ msg: "Delete Succeeded" },2500);
                        $scope.loadList();
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                })
            }
            $scope.navLength = $scope.navList.length
        };
        $scope.addData = function() {
            $scope.navLength = $scope.navList.length + 1;
            $scope.navList.push({"channelid":$scope.channelId.id, cardid: $stateParams.cardid, "navigation":"", "nav_icon":"", "nav_url":"", "showPic": true});
        };
        $scope.saveData = function() {
            for (var i = 0; i < $scope.navList.length; i++) {
                var item = $scope.navList[i];
                if (!item.nav_icon) {
                    ModalAlert.popup({ msg: "The Icon is necessary" },2500);
                    return false;
                }
                if (!item.navigation) {
                    ModalAlert.popup({ msg: "The Service Name is necessary" },2500);
                    return false;
                }
                if (!item.nav_url) {
                    ModalAlert.popup({ msg: "The URL is necessary" },2500);
                    return false;
                }
            }
            $scope.navList.channelid = $scope.channelId.id;
            serviceAPI.saveData(urlAPI.xscreen_directAdd, $scope.navList).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    history.go(-1);
                }
            })
        };
        $scope.loadList();
    }
];
return scope;
