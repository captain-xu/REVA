var scope = ["$scope", "ModalAlert", "Upload", "regexAPI","serviceAPI", '$state','urlAPI','$stateParams',
    function($scope, ModalAlert, Upload, regexAPI, serviceAPI, $state, urlAPI, $stateParams) {
        $scope.resubmit = false;
        //operation获取详情数据
        $scope.editList = function(vo) {
            $scope.dataState = $stateParams.param;
            $('.msg').text('');
            $('.url').hide();
            if ($scope.dataState == 'edit') {
                var param = {
                    operationId: $stateParams.id
                }
                serviceAPI.loadData(urlAPI.campaign_operate_detail,param).then(function(result) {
                    $scope.detailVO = result.operation;
                    $scope.detailVO.app = result.operationRes.appId;
                    $scope.detailVO.appName = result.operationRes.appName;
                    $scope.detailVO.groupId = result.operationRes.groupId;
                    $scope.detailVO.groupName = result.operationRes.groupName;
                    $scope.detailVO.placeId = result.operationRes.placementId;
                    $scope.detailVO.placeName = result.operationRes.placementName;
                    $scope.detailVO.version = result.operationRes.version;
                    $scope.detailVO.startDate = $scope.detailVO.startDateForShow;
                    $scope.detailVO.endDate = $scope.detailVO.endDateForShow;
                    /*   $scope.detailVOPlace = result.operationRes;*/
                    $scope.startDate = $scope.detailVO.startDate;
                    $scope.endDate = $scope.detailVO.endDate;
                    $scope.publishTimeStart = $scope.detailVO.publishTimeStart;
                    $scope.publishTimeEnd = $scope.detailVO.publishTimeEnd;
                    $('#datarange').val(moment($scope.detailVO.startDateForShow).format('YYYY/MM/DD') + ' ~ ' + moment($scope.detailVO.endDateForShow).format('YYYY/MM/DD'));
                    if ($scope.detailVO.publishTimeStart) {
                        $('#publishtime').val(moment($scope.detailVO.publishTimeStartForShow).format('YYYY/MM/DD') + ' ~ ' + moment($scope.detailVO.publishTimeEndForShow).format('YYYY/MM/DD')); 
                   }else{
                        $('#publishtime').val('');
                   }
                    if ($scope.detailVO.inServer) {
                        $scope.getCategory();
                    };
                    $scope.setImgTitle(result);
                    /*获取下拉数据*/
                    $scope.getSelects();
                    $('.icon-check').removeClass('active');
                    if ($scope.detailVO.timeSet) {
                        var timeSet = $scope.detailVO.timeSet.split(',');
                        for (var i = 0; i < timeSet.length; i++) {
                            var num = Number(timeSet[i]);
                            $('.timecheck:nth(' + num + ')').find('i').addClass('active');
                        }
                        if (timeSet.length === 24) {
                            $('.icon-check').addClass('active');
                        }
                    } else {
                        $scope.detailVO.timeSet = '';
                        $('.icon-check').removeClass('active');
                    }
                    
                }).
                catch(function(result) {});
                if (!$scope.app || $scope.app.length == 0) {
                    $scope.getAppList();
                };
            } else {
                $scope.detailVO = {
                    "name": "",
                    "priority": "",
                    "inServer": 1,
                    "input": 1,
                    "startDate": "",
                    "endDate": "",
                    "app": "",
                    "appName": "",
                    "version": "",
                    "groupId": "",
                    "groupName": "",
                    "placeId": "",
                    "placeName": "",
                    "imp": "",
                    "click": "",
                    "area": "ALL",
                    "areaExcept": "",
                    "device": "",
                    "deviceExcept": "",
                    "imei": "",
                    "imeiExcept": "",
                    "model": "",
                    "modelExcept": "",
                    "osVersion": "",
                    "osVersionExcept": "",
                    "language": "",
                    "languageExcept": "",
                    "network": "",
                    "networkExcept": "",
                    "channel1": "",
                    "channel1Except": "",
                    "channel2": "",
                    "channel2Except": "",
                    "channel3": "",
                    "channel3Except": "",
                    "appVer": "",
                    "appVerExcept": "",
                    "timeSet": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24",
                    "targetUrl": "",
                    "deepLinkingApp": null,
                    "deepLinkingUrl": null,
                    "imageList": [],
                    "titleList": [],
                    "category": "",
                    "rank": 0,
                    "publishTimeStart": "",
                    "publishTimeEnd": "",
                    "targetAppName": "",
                    "status": 0,
                    "id": ""
                };
                $('#publishtime').val('');
                $('#datarange').val('');
                $scope.getCategory();
                if (!$scope.app || $scope.app.length == 0) {
                    $scope.getAppList();
                };
            };
            serviceAPI.loadData(urlAPI.campaign_operate_area).then(function(result) {
                $scope.areaList = result.countries.map(function(data) {
                    return {
                        name: data.name,
                        code: data.code,
                        isSelect: false
                    };
                });
            });
            serviceAPI.loadData(urlAPI.campaign_operate_device).then(function(result) {
                $scope.deviceList = result.deviceInfo.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            });
            serviceAPI.loadData(urlAPI.campaign_operate_os).then(function(result) {
                $scope.osVersionList = result.osVersionInfo.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            });
            serviceAPI.loadData(urlAPI.campaign_operate_language).then(function(result) {
                $scope.languageList = result.languageInfo.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            }).
            catch(function(result) {});
        };
        /*加载编辑页面app数据*/
        $scope.getAppList = function() {
            serviceAPI.loadData(urlAPI.campaign_detailList).then(function(result) {
                $scope.app = result.appList;
            }).
            catch(function(result) {});
        };
        /*app值修改获取version数据*/
        $scope.appData = function(vo) {
            $scope.detailVO.app = vo.appId;
            $scope.detailVO.appName = vo.name;
            $scope.detailVO.groupId = "";
            $scope.detailVO.groupName = "";
            $scope.detailVO.placeId = "";
            $scope.detailVO.placeName = "";
            $scope.detailVO.version = "";
            $scope.detailVO.imageList = [];
            $scope.detailVO.titleList = [];
            $scope.group = [];
            $scope.place = [];
            var verParam = {
                name: $scope.detailVO.appName
            }
            serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
                $scope.version = result.versionList;
            }).
            catch(function(result) {});
        };
        /*version数据修改获取group数据*/
        $scope.versionData = function(vo) {
            $scope.detailVO.version = vo.version;
            $scope.detailVO.groupId = "";
            $scope.detailVO.groupName = "";
            $scope.detailVO.placeId = "";
            $scope.detailVO.placeName = "";
            $scope.detailVO.imageList = [];
            $scope.detailVO.titleList = [];
            $scope.place = [];
            var groupParam = {
                app: $scope.detailVO.appName,
                version: $scope.detailVO.version
            };
            serviceAPI.loadData(urlAPI.campaign_offer_group, groupParam).then(function(result) {
                $scope.group = result.groupList;
            }).
            catch(function(result) {});
        };
        /*group数据修改获取Placement数据*/
        $scope.groupData = function(vo) {
            $scope.detailVO.groupId = vo.groupId;
            $scope.detailVO.groupName = vo.name;
            $scope.detailVO.placeId = "";
            $scope.detailVO.placeName = "";
            $scope.detailVO.imageList = [];
            $scope.detailVO.titleList = [];
            var placeParam = {
                groupId: $scope.detailVO.groupId
            };
            serviceAPI.loadData(urlAPI.campaign_offer_place, placeParam).then(function(result) {
                $scope.place = result.placeList;
                if ($scope.detailVO.inServer == 1) {
                    $scope.place.unshift({placementId:"",name:'All'})
                }
            }).
            catch(function(result) {});
        };
        /*Placement数据修改获取img title数据*/
        $scope.placeData = function(vo) {
            $scope.detailVO.placeId = vo.placementId;
            $scope.detailVO.placeName = vo.name;
            $scope.detailVO.imageList = [];
            $scope.detailVO.titleList = [];
            if ($scope.detailVO.inServer == 0) {
                var imgParam = {
                    placeId: $scope.detailVO.placeId
                };
                serviceAPI.loadData(urlAPI.campaign_operate_img,imgParam).then(function(result) {
                    if (result.imageList && result.imageList.length > 0) {
                        $scope.detailVO.imageList = result.imageList.map(function(data) {
                            return {
                                imageId: data.id,
                                imageUrl: "",
                                imageName: data.name,
                                imageUrlForShow: "",
                                begin_upload: false
                            }
                        });
                    };
                    if (result.titleList && result.titleList.length > 0) {
                        $scope.detailVO.titleList = result.titleList.map(function(data) {
                            return {
                                titleId: data.id,
                                value: data.value,
                                titleName: data.name
                            }
                        });
                    };
                }).
                catch(function(result) {});
            };
        };
        //改变inserver状态
        $scope.changeServer = function(num) {
            if ($scope.detailVO.status == 0) {
                $scope.detailVO.inServer = num;
                $scope.getCategory();
                if (num == 0 && $scope.detailVO.placeId) {
                    var imgParam = {
                        placeId: $scope.detailVO.placeId
                    };
                    serviceAPI.loadData(urlAPI.campaign_operate_img,imgParam).then(function(result) {
                        if (result.imageList && result.imageList.length > 0) {
                            $scope.detailVO.imageList = result.imageList.map(function(data) {
                                return {
                                    imageId: data.id,
                                    imageUrl: "",
                                    imageName: data.name,
                                    imageUrlForShow: "",
                                    begin_upload: false
                                }
                            });
                        };
                        if (result.titleList && result.titleList.length > 0) {
                            $scope.detailVO.titleList = result.titleList.map(function(data) {
                                return {
                                    titleId: data.id,
                                    value: data.value,
                                    titleName: data.name
                                }
                            });
                        };
                    }).
                    catch(function(result) {});
                } else {
                    $scope.detailVO.input = 1;
                    $scope.detailVO.imageList = [];
                    $scope.detailVO.titleList = [];
                }
            };
            var placeParam = {
                groupId: $scope.detailVO.groupId
            }
            if ($scope.detailVO.groupId) {
                serviceAPI.loadData(urlAPI.campaign_offer_place, placeParam).then(function(result) {
                    $scope.place = result.placeList;
                    if ($scope.detailVO.inServer == 1) {
                        $scope.place.unshift({placementId:"ALL",name:'All'})
                    };
                }).
                catch(function(result) {});
            }
        };
        $scope.changeInput = function(num) {
            $scope.detailVO.input = num;
        };
        //获取operation 详情页 category 数据
        $scope.getCategory = function() {
            if (!$scope.category || $scope.category.length == 0) {
                serviceAPI.loadData(urlAPI.campaign_appInfo_category).then(function(result) {
                    $scope.category = result.category.split(',');
                })
            };
        };
        $scope.setImgTitle = function(result) {
            if (result.imageList && result.imageList.length > 0) {
                $scope.detailVO.imageList = result.imageList.map(function(data) {
                    return {
                        imageId: data.imageId,
                        imageUrl: data.imageUrl,
                        imageName: data.imageName,
                        imageUrlForShow: data.imageUrlForShow,
                        width: data.width,
                        height: data.height,
                        begin_upload: false
                    }
                });
            } else {
                $scope.detailVO.imageList = [];
            };
            if (result.titleList && result.titleList.length > 0) {
                $scope.detailVO.titleList = result.titleList.map(function(data) {
                    return {
                        titleId: data.titleId,
                        value: data.value,
                        titleName: data.titleName
                    }
                });
            } else {
                $scope.detailVO.titleList = [];
            };
        };
        $scope.getSelects = function() {
            var verParam = {
                name: $scope.detailVO.appName
            }
            serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
                $scope.version = result.versionList;
            });
            var groupParam = {
                app: $scope.detailVO.appName,
                version: $scope.detailVO.version
            };
            serviceAPI.loadData(urlAPI.campaign_offer_group, groupParam).then(function(result) {
                $scope.group = result.groupList;
            });
            var placeParam = {
                groupId: $scope.detailVO.groupId
            };
            serviceAPI.loadData(urlAPI.campaign_offer_place,placeParam).then(function(result) {
                $scope.place = result.placeList;
                if ($scope.detailVO.inServer == 1) {
                    $scope.place.unshift({placementId:"ALL",name:'All'})
                };
            });
        };
        //清除现有时间段
        $scope.clearDate = function(dom){
            if ($scope.detailVO.status == 0) {
                $scope.startDate = "";
                $scope.endDate = "";
                $(dom.target).prev().val('');
            }
        };
        //清除现有时间段
        $scope.clearPubDate = function(dom){
            if ($scope.detailVO.status == 0) {
                $scope.publishTimeStartForShow = "";
                $scope.publishTimeEndForShow = "";
                $(dom.target).prev().val('');
            }
        };
        //operation timeSet 编辑
        $scope.checkData = function(num, dom) {
            if (num == "All") {
                var allSle = $(dom.target).find('i');
                if (allSle.hasClass('active')) {
                    $scope.detailVO.timeSet = '';
                    $('.icon-check').removeClass('active');
                }else{
                    $scope.detailVO.timeSet = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24';
                    $('.icon-check').addClass('active');
                };
                return;
            };
            if ($scope.detailVO.timeSet == "") {
                $scope.detailVO.timeSet = num + ',';
                $(dom.target).find('i').addClass('active');
            } else {
                var arr = $scope.detailVO.timeSet.split(',');
                if (arr[arr.length - 1] == "") {
                    arr.length = arr.length - 1;
                };
                var index = arr.indexOf(num);
                if (index >= 0) {
                    arr = arr.slice(0, index).concat(arr.slice(index + 1))
                    arr.sort();
                    $(dom.target).find('i').removeClass('active');
                    $(dom.target).siblings().first().find('i').removeClass('active');
                } else {
                    arr.push(num);
                    $(dom.target).find('i').addClass('active');
                    if (arr.length == 24) {
                        $(dom.target).siblings().first().find('i').addClass('active');
                    }
                }
                $scope.detailVO.timeSet = arr.toString();
            }
        };
        //上传图片
        $scope.uploadPic = function(vo, file, errFiles) {
            if (file) {
                vo.begin_upload = true;
                $scope.dynamic = 20;
                vo.imageUrlForShow = "";
                Upload.upload({
                    url: '/campaign/util/2007',
                    data: { file: file }
                }).then(function(result) {
                    vo.imageUrlForShow = result.data.viewUrl;
                    vo.imageUrl = result.data.url;
                    vo.width = result.data.width;
                    vo.height = result.data.height;
                    $scope.dynamic = 100;
                    vo.begin_upload = false;
                    if (file.size >= 300000 ) {
                        ModalAlert.popup({
                            msg:"The picture is too big"
                        }, 2500);
                        return;
                    };
                }, function(result) {
                    vo.begin_upload = false;
                }, function(evt) {
                    $scope.dynamic = 80;
                });
            }
        };
        //删除已上传的图片
        $scope.delete = function(vo) {
            vo.imageUrlForShow = '';
            vo.imageUrl = '';
        };

/*************************************定向********************************/
        //全选状态
        $scope.selectAllState = {
            area: false,
            device: false,
            model: false,
            osVersion: false,
            language: false,
            advertiser: false,
            channel: false
        };
        //set 下拉框 状态
         $scope.selectStatus = function(name, list, attr) {
            var option = $scope.detailVO[name];
            if (option == "ALL") {
                for (var i = 0; i < $scope[list].length; i++) {
                    $scope[list][i].isSelect = true;
                };
                $scope.selectAllState[name] = true;
            } else if(!option) {
                for (var i = 0; i < $scope[list].length; i++) {
                    $scope[list][i].isSelect = false;
                };
                $scope.selectAllState[name] = false;
            } else {
                for (var i = 0; i < $scope[list].length; i++) {
                    var optionStr = $scope[list][i][attr];
                    if (option.indexOf(optionStr) > -1) {
                        $scope[list][i].isSelect = true;
                    } else {
                        $scope[list][i].isSelect = false;
                    }
                };
            };
         };
        //全选ALL
        $scope.allSelect = function(name, list, except){
            if ($scope.detailVO[name] == "ALL") {
                $scope.detailVO[name] = "";
                for (var i = 0; i < $scope[list].length; i++) {
                    $scope[list][i].isSelect = false;
                };
                $scope.selectAllState[name] = false;
                $scope.detailVO[except] = "";
            } else {
                $scope.detailVO[name] = "ALL";
                for (var i = 0; i < $scope[list].length; i++) {
                    $scope[list][i].isSelect = true;
                };
                $scope.selectAllState[name] = true;
            }
        };
        //单选
        $scope.singleSelect = function(option, attr, name, except) {
            if ($scope.detailVO[name] == "ALL") {
                if (!$scope.detailVO[except]) {
                    $scope.detailVO[except] = option[attr] + ',';
                    option.isSelect = false;
                    $scope.selectAllState[name] = false;
                } else {
                    var arr = $scope.detailVO[except].split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(option[attr]);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        option.isSelect = true;
                        $scope.selectAllState[name] = false;
                    } else {
                        arr.push(option[attr]);
                        option.isSelect = false;
                    }
                    $scope.detailVO[except] = arr.toString();
                    if ($scope.detailVO[except] == "") {
                        $scope.selectAllState[name] = true;
                    } else {
                        $scope.selectAllState[name] = false;
                    };
                }
            } else {
                if (!$scope.detailVO[name]) {
                    $scope.detailVO[name] = option[attr] + ',';
                    option.isSelect = true;
                } else {
                    var arr = $scope.detailVO[name].split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(option[attr]);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        option.isSelect = false;
                    } else {
                        arr.push(option[attr]);
                        option.isSelect = true;
                    }
                    $scope.detailVO[name] = arr.toString();
                }
            };
            if (name === 'device') {
                $scope.loadModel();
            }
        };
        $scope.loadModel = function(){
            if ($scope.detailVO.device) {
                var modelParam = {
                    device: $scope.detailVO.device
                }
                serviceAPI.loadData(urlAPI.campaign_operate_device,modelParam).then(function(result) {
                    $scope.modelList = result.modelInfo.map(function(data) {
                        return {
                            name: data,
                            isSelect: false
                        };
                    });
                });
            }
        };
/*************************************定向********************************/
         $scope.cancel = function(){
            history.go(-1);
         };
        //保存operation数据
        $scope.saveData = function() {
            // Non null check
            if (regexAPI.objRegex($scope.detailVO, ["name", "priority", "inServer", "imp", "click", "appName", "version", "groupName", "placeName"])) {
                if ($scope.detailVO.imageList.length > 0) {
                    for (var i = 0; i < $scope.detailVO.imageList.length; i++) {
                        if ($scope.detailVO.imageList[i].imageUrl == "") {
                            ModalAlert.popup({
                                msg: "Please upload the picture"
                            }, 2500);
                            return false;
                        }
                    }
                };
                if ($scope.detailVO.titleList.length > 0) {
                    for (var i = 0; i < $scope.detailVO.titleList.length; i++) {
                        if (!$scope.detailVO.titleList[i].value || $scope.detailVO.titleList[i].value == "") {
                            ModalAlert.popup({
                                msg: "The title value is necessary"
                            }, 2500);
                            return false;
                        }
                    }
                };
                if ($scope.detailVO.name.length > 50) {
                    ModalAlert.popup({
                        msg:"The length of the name should be less than 50"
                    }, 2500);
                    return;
                };
                if ($scope.detailVO.inServer == 0) {
                    if ($scope.detailVO.placeName == 'All') {
                        ModalAlert.popup({
                            msg:"The Placement Name should not be \"All\""
                        }, 2500);
                        return;
                    }; 
                };
                $scope.detailVO.startDate = $scope.startDate;
                $scope.detailVO.endDate = $scope.endDate;
                if($scope.detailVO.startDate == "") {
                    ModalAlert.popup({msg:"the Data value is necessary"}, 2500);
                    return;
                };
                //operationURL校验
                var urlStr = $scope.detailVO.targetUrl;
                var regUrl = /^(http:\/\/)|(http:\\\\)|(https:\/\/)|(https:\\\\)/i;
                if (urlStr) {
                    var result = urlStr.match(regUrl); 
                }  
                if (urlStr && result==null) {
                    $('.url').show();
                    return;
                } else {
                    $('.url').hide();
                };
                $scope.detailVO.publishTimeStart = $scope.publishTimeStartForShow;
                $scope.detailVO.publishTimeEnd = $scope.publishTimeEndForShow;
                $scope.detailVO.operationId = $scope.detailVO.id;
                if ($scope.dataState == "edit") {
                    var url = urlAPI.campaign_operate_edit;
                } else {
                    var url = urlAPI.campaign_operate_new;
                };
                $scope.resubmit = true;
                serviceAPI.saveData(url,$scope.detailVO).then(function(result) {
                    if (result.result == 200) {
                        history.go(-1);
                    } else {
                        $scope.resubmit = false;
                        ModalAlert.popup({msg: result.msg}, 2500)
                    }
                }).catch(function() {})
            }

        };
        $scope.editList();
    }
];
return scope;
