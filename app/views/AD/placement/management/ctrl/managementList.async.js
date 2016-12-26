var scope = ["$scope", "ModalAlert", "Upload", "serviceAPI", '$state', 'urlAPI','$stateParams',
 function($scope, ModalAlert, Upload, serviceAPI, $state, urlAPI, $stateParams) {
    $scope.resubmit = false;
    $scope.picFile = null;
    $scope.editList = function() {
        $scope.dataState = $stateParams.param;
        $('.msg').text('');
        $('.native-cont.tracked').find('i').removeClass('active');
        if ($scope.dataState == 'edit') {
            var param = {
                id: $stateParams.id
            };
            serviceAPI.loadData(urlAPI.campaign_manage_detail,param).then(function(result) {
                $scope.detailVO = result.placement;
                $scope.img_url = result.viewUrl;
                // $scope.showType = managementAPI.getshowType();
                $scope.initTackBy();
                if ($scope.detailVO.clickType == 1) {
                    $scope.clickName = 'Open a Link';
                } else if ($scope.detailVO.clickType == 2) {
                    $scope.clickName = 'Download';
                } else {
                    $scope.clickName = 'Impression';
                };
                var verParam = {
                    name: $scope.detailVO.app
                }
                serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
                    $scope.version = result.versionList;
                }).
                catch(function(result) {});
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_place_type).then(function(result) {
                $scope.placeType = result.placementTypes;
            }).
            catch(function(result) {});
            if (!$scope.click || $scope.click.length == 0 || !$scope.app || $scope.app.length == 0 || !$scope.type || $scope.type.length == 0) {
                $scope.loadSelect();
            };
        } else {
            $scope.detailVO = {
                adaptive: 1,
                app: "",
                appId: "",
                clickType: 2,
                example: "",
                id: "",
                name: "",
                nativeFlag: 1,
                placementType: 0,
                showType: "",
                skip: 0,
                countdown: 0,
                showSeconds: 1,
                priority:1,
                status: 0,
                trackedBy: "",
                version: ""
            };
            serviceAPI.loadData(urlAPI.campaign_place_type).then(function(result) {
                $scope.placeType = result.placementTypes;
                $scope.detailVO.placementTypeName = $scope.placeType[0].placementTypeName;
            }).
            catch(function(result) {});
            $('.native-cont.tracked').find('i').removeClass('active');
            $scope.img_url = '';
            if (!$scope.click || $scope.click.length == 0 || !$scope.app || $scope.app.length == 0 || !$scope.type || $scope.type.length == 0) {
                $scope.loadSelect();
            } else {
                $scope.detailVO.app = $scope.app[0].name;
                $scope.detailVO.appId = $scope.app[0].appId;
                $scope.detailVO.updatedate = $scope.type[0].name;
                $scope.detailVO.showType = $scope.type[0].typeId;
                $scope.showType = $scope.type[0].name;
                $scope.detailVO.clickType = $scope.click[0].id;
                $scope.clickName = $scope.click[0].name;
                $scope.versionList();
            };
        };
    };
    $scope.appData = function() {
        var verParam = {
            name: $scope.detailVO.app
        }
        serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
            $scope.version = result.versionList;
        }).
        catch(function(result) {});
        $scope.detailVO.version = '';
    };
    $scope.versionList = function() {
        var verParam = {
            name: $scope.detailVO.app
        }
        serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
            $scope.version = result.versionList;
            if($scope.dataState=='new'){
                $scope.detailVO.version=$scope.version[0].version;
            };
        }).
        catch(function(result) {});
    };
    $scope.typeData = function(vo) {
        $scope.detailVO.showType = vo.typeId;
        $scope.detailVO.showTypeName = vo.name;
    };
    $scope.clickData = function(vo) {
        $scope.clickName = vo.name;
        $scope.detailVO.clickType = vo.id;
    }
    $scope.radioData = function(num) {
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.nativeFlag = num;
        }
    };            
    $scope.priorityData = function(num) {
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.priority = num;
        }
    };
    $scope.placementTypeData = function(vo){
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.placementType=vo.placementType;
            $scope.detailVO.placementTypeName=vo.placementTypeName;
            if (vo.placementType == 0) {
                $scope.detailVO.skip = 0;
                $scope.detailVO.countdown = 0;
                $scope.detailVO.position = '';
            } else if (vo.placementType == 3) {
                $scope.detailVO.position = 0;
                $scope.detailVO.skip = '';
                $scope.detailVO.countdown = '';
                $scope.detailVO.showSeconds = '';
            } else {
                $scope.detailVO.skip = '';
                $scope.detailVO.countdown = '';
                $scope.detailVO.showSeconds = '';
                $scope.detailVO.position = '';
            }
        }
    };
    $scope.nativeData = function(num) {
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.adaptive = num;
        }
    };
    $scope.checkData = function(detailVO, event) {
        if (detailVO.status == 0) {
            var trackedBy = detailVO.trackedBy.split(",");
            var trackStr = $(event.target).text();
            if ($.inArray(trackStr, trackedBy) > -1) {
                trackedBy = $.grep(trackedBy, function(n, i) {
                    return n == trackStr;
                }, true);
                $(event.target).find('i').removeClass('active')
            } else {
                trackedBy.push(trackStr);
                $(event.target).find('i').addClass('active')
            };
            detailVO.trackedBy = trackedBy.join(",");
        }
    };
    $scope.uploadPic = function() {
        var file = $scope.picFile;
        $scope.begin_upload = true;
        $scope.dynamic = 20;
        Upload.upload({
            url: '/campaign/util/2007',
            data: { file: file }
        }).then(function(result) {
            $scope.img_url = result.data.viewUrl;
            $scope.detailVO.example = result.data.url;
            $scope.dynamic = 100;
            $scope.begin_upload = false;
            if (file.size >= 300000 ) {
                ModalAlert.popup({
                    msg:"The picture is too big"
                }, 2500);
                return;
            }
        }, function(result) {
            $scope.begin_upload = false;
            console.log('Error status: ' + result.status);
        }, function(evt) {
            $scope.dynamic = 80;
        });
    };
    $scope.delete = function(detailVO) {
        $scope.detailVO.example = '';
        $scope.img_url = '';
    };
    $scope.cancel = function(){
        history.go(-1);
    };
    $scope.saveData = function(detailVO) {
        if($scope.detailVO.name==""){
            ModalAlert.popup({
                msg:"The name value is necessary"
            }, 2500);
            return;
        };
        if ($scope.detailVO.name.length > 50) {
            ModalAlert.popup({
                msg:"The length of the name should be less than 50"
            }, 2500);
            return;
        };
        if($scope.detailVO.trackedBy==""){
            ModalAlert.popup({
                msg:"The trackedBy value is necessary"
            }, 2500);
            return;
        };
        if($scope.detailVO.countdown === 0 && $scope.detailVO.showSeconds==''){
            ModalAlert.popup({
                msg:"The Max show seconds value is necessary"
            });
            return;
        };
        if ($scope.detailVO.placementType == 0) {
            $scope.detailVO.position = '';
        } else if ($scope.detailVO.placementType == 3) {
            $scope.detailVO.skip = '';
            $scope.detailVO.countdown = '';
            $scope.detailVO.showSeconds = '';
        } else {
            $scope.detailVO.skip = '';
            $scope.detailVO.countdown = '';
            $scope.detailVO.showSeconds = '';
            $scope.detailVO.position = '';
        };
        if ($scope.dataState == "edit") {
            var url = urlAPI.campaign_manage_save;
        } else {
            var url = urlAPI.campaign_manage_add;
        };
        $scope.resubmit = true;
        serviceAPI.saveData(url, $scope.detailVO).then(function(result) {
            if (result.status == 0) {
                history.go(-1);
            } else {
                $scope.resubmit = false;
                ModalAlert.popup({msg:result.msg}, 2500)
            }
        }).catch(function() {})
    };
    $scope.initTackBy = function() {
        var tracke = $scope.detailVO.trackedBy.split(',');
        var y = 0;
        for (var i = 0; i < tracke.length; i++) {
            $('.native-cont.tracked li').each(function() {
                if ($(this).text().trim() == tracke[i]) {
                    $(this).find('i').addClass('active');
                    return false;
                }
            })
        };
    };
    $scope.loadSelect = function() {
        serviceAPI.loadData(urlAPI.campaign_appList).then(function(result) {
            $scope.click = result.clickList;
            $scope.app = result.appList;
            $scope.type = result.typeList;
            if ($scope.dataState == "new") {
                $scope.detailVO.app = $scope.app[0].name;
                $scope.detailVO.appId = $scope.app[0].appId;
                $scope.detailVO.updatedate = $scope.type[0].name;
                $scope.detailVO.showType = $scope.type[0].typeId;
                $scope.showType = $scope.type[0].name;
                $scope.detailVO.clickType = $scope.click[0].id;
                $scope.clickName = $scope.click[0].name;
                $scope.versionList();
            }
        }).
        catch(function(result) {});
    };
    $scope.editList();
}];
return scope;
