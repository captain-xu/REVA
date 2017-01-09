var scope = ["$scope", "ModalAlert", "regexAPI","serviceAPI", '$state','urlAPI','$stateParams',
    function($scope, ModalAlert, regexAPI,serviceAPI, $state,urlAPI, $stateParams) {
        $scope.resubmit = false;
        $scope.channelNames = '';
        //net获取详情数据
        $scope.editNetList = function(net) {
            $scope.dataState = $stateParams.param;
            $('.msg').text('');
            serviceAPI.loadData(urlAPI.campaign_operate_adver,{rtb: 1}).then(function(result) {
                $scope.channelList = result.advertisers.map(function(data) {
                    return {
                        name: data.name,
                        id: data.id,
                        isSelect: false
                    }
                });
            });
            if ($scope.dataState == 'edit') {
                var param = {
                    operationId: $stateParams.id
                }
                serviceAPI.loadData(urlAPI.campaign_operate_detail,param).then(function(result) {
                    $scope.detailNET = result.operation;
                    $scope.detailNET.operationId = $stateParams.id;
                    $scope.detailNET.app = result.operationRes.appId;
                    $scope.detailNET.appName = result.operationRes.appName;
                    $scope.detailNET.groupId = result.operationRes.groupId;
                    $scope.detailNET.groupName = result.operationRes.groupName;
                    $scope.detailNET.placeId = result.operationRes.placementId;
                    $scope.detailNET.placeName = result.operationRes.placementName;
                    $scope.detailNET.version = result.operationRes.version;
                    $scope.detailNET.startDate = $scope.detailNET.startDateForShow;
                    $scope.detailNET.endDate = $scope.detailNET.endDateForShow;
                    $scope.detailNET.rtb = result.rtb;
                    $scope.detailNET.offerInfoList = [
                        {
                            "advertiserName": result.operation.advertiserName,
                            "advertiserId": result.operation.advertiserId,
                            "offerName": result.operation.offerName,
                            "offerId": result.operation.offerId
                        }
                    ];
                    $scope.startDate = $scope.detailNET.startDate;
                    $scope.endDate = $scope.detailNET.endDate;
                    $scope.allNames = $scope.detailNET.offerName;
                    $scope.allIds = $scope.detailNET.offerId;
                    if ($scope.detailNET.channel) {
                        var channelIds = $scope.detailNET.channel;
                        for (var i = 0; i < $scope.channelList.length; i++) {
                            var eqId = $scope.channelList[i].id;
                            if (channelIds.indexOf(eqId) > -1) {
                                $scope.channelList[i].isSelect = true;
                                $scope.channelNames = $scope.channelNames.concat($scope.channelList[i].name) + ',';
                            }
                        }
                    } else {
                        $scope.detailNET.channel = '';
                    }
                    $('.icon-check').removeClass('active');
                    var timeSet = $scope.detailNET.timeSet.split(',');
                    for (var i = 0; i < timeSet.length; i++) {
                        var num = Number(timeSet[i]);
                        $('.timecheck:nth(' + num + ')').find('i').addClass('active');
                    };
                    if ($scope.detailNET.timeSet == "") {
                        $('.icon-check').removeClass('active');
                    }else if (timeSet.length == 24) {
                        $('.icon-check').addClass('active');
                    }
                    if ($scope.detailNET.advertiserName.indexOf('LeWa') > -1) {
                        $scope.showChannel = true;
                    }
                    var adverParam = {
                        rtb: $scope.detailNET.rtb
                    };
                    serviceAPI.loadData(urlAPI.campaign_operate_adver,adverParam).then(function(result) {
                        $scope.adverList = result.advertisers.map(function(data) {
                            return {
                                name: data.name,
                                id: data.id,
                                isSelect: false
                            }
                        });
                    });
                    //$scope.loadModel();
                    $('#datarangeNet').val(moment($scope.detailNET.startDateForShow).format('YYYY/MM/DD') + ' ~ ' + moment($scope.detailNET.endDateForShow).format('YYYY/MM/DD'));
                    
                }).
                catch(function(result) {});
            } else {
                $('.select').show();
                $scope.status = 0;
                $scope.detailNET = {
                    "name": "",
                    "cpx": "",
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
                    "status":0,
                    "timeSet": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24",
                    "rtb": 0,
                    "offerInfoList":[],
                    "offerName":'',
                    "offerId":'',
                    "advertiserName": '',
                    "advertiserId": '',
                    "channel": ''
                };
                $scope.startDate = '';
                $scope.endDate = '';
                $scope.allNames = "";
                $scope.allIds = "";
                $('#datarangeNet').val('');
                //$scope.loadModel();
                var adverParam = {
                    rtb: $scope.detailNET.rtb
                };
                serviceAPI.loadData(urlAPI.campaign_operate_adver,adverParam).then(function(result) {
                    $scope.adverList = result.advertisers.map(function(data) {
                        return {
                            name: data.name,
                            id: data.id,
                            isSelect: false
                        };
                    });
                });
            }
            if (!$scope.app || $scope.app.length == 0) {
                $scope.getAppList();
            };
            serviceAPI.loadData(urlAPI.campaign_offer_cpx).then(function(result) {
                $scope.CPX = result.CPX;
            });
            serviceAPI.loadData(urlAPI.campaign_operate_area).then(function(result) {
                $scope.areaList = result.countries.map(function(data) {
                    return {
                        name: data.name,
                        code: data.code,
                        isSelect: false
                    };
                });
            });
            // serviceAPI.loadData(urlAPI.campaign_operate_device).then(function(result) {
            //     $scope.deviceList = result.deviceInfo.map(function(data) {
            //         return {
            //             name: data,
            //             isSelect: false
            //         };
            //     });
            // });
            // serviceAPI.loadData(urlAPI.campaign_operate_os).then(function(result) {
            //     $scope.osVersionList = result.osVersionInfo.map(function(data) {
            //         return {
            //             name: data,
            //             isSelect: false
            //         };
            //     });
            // });
            // serviceAPI.loadData(urlAPI.campaign_operate_language).then(function(result) {
            //     $scope.languageList = result.languageInfo.map(function(data) {
            //         return {
            //             name: data,
            //             isSelect: false
            //         };
            //     });
            // }).
            //  catch(function(result) {});

        }
        /*加载编辑页面app数据*/
        $scope.getAppList = function() {
            serviceAPI.loadData(urlAPI.campaign_detailList).then(function(result) {
                $scope.app = result.appList;
            });
        };
        //恢复 Advertiser 数据 原始状态
        $scope.defaultAdvertiser = function(){
            $scope.detailNET.advertiserName = '';
            $scope.showChannel = false;
            $scope.channelNames = '';
            $scope.detailNET.channel = '';
            for (var i = 0; i < $scope.channelList.length; i++) {
                $scope.channelList[i].isSelect = false;
            }
            $scope.detailNET.advertiserId = '';
            $scope.allNames = "";
            $scope.allIds = '';
            $scope.detailNET.offerInfoList = [];
            if ($scope.allName) {
                for (var i = 0; i < $scope.allName.length; i++) {
                    $scope.allName[i].isSelect = false;
                };
            }
        };
        /*Network编辑页面app值修改获取version数据*/
        $scope.appNetData = function(net) {
            $scope.detailNET.app = net.appId;
            $scope.detailNET.appName = net.name;
            $scope.detailNET.groupId = "";
            $scope.detailNET.groupName = "";
            $scope.detailNET.placeId = "";
            $scope.detailNET.placeName = "";
            $scope.detailNET.version = "";
            $scope.defaultAdvertiser();
            $scope.group = [];
            $scope.place = [];
            var verParam = {
                name: $scope.detailNET.appName
            }
            serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
                $scope.version = result.versionList;
            });
        };
        /*Network编辑页面version数据修改获取group数据*/
        $scope.versionNetData = function(net) {
            $scope.detailNET.version = net.version;
            $scope.detailNET.groupId = "";
            $scope.detailNET.groupName = "";
            $scope.detailNET.placeId = "";
            $scope.detailNET.placeName = "";
            $scope.defaultAdvertiser();
            $scope.place = [];
            var groupParam = {
                app: $scope.detailNET.appName,
                version: $scope.detailNET.version
            };
            serviceAPI.loadData(urlAPI.campaign_offer_group, groupParam).then(function(result) {
                $scope.group = result.groupList;
            });
        };
        /*Network编辑页面group数据修改获取Placement数据*/
        $scope.groupNetData = function(net) {
            $scope.detailNET.groupId = net.groupId;
            $scope.detailNET.groupName = net.name;
            $scope.detailNET.placeId = "";
            $scope.detailNET.placeName = "";
            $scope.defaultAdvertiser();
            var placeParam = {
                groupId: $scope.detailNET.groupId
            };
            serviceAPI.loadData(urlAPI.campaign_offer_place, placeParam).then(function(result) {
                $scope.place = result.placeList;
                if ($scope.detailNET.inServer == 1) {
                    $scope.place.unshift({placementId:"",name:'All'})
                }
            });
        };
        /*Network编辑页面Placement数据修改获取img title数据*/
        $scope.placeNetData = function(net) {
            $scope.detailNET.placeId = net.placementId;
            $scope.detailNET.placeName = net.name;
            $scope.detailNET.rtb = 0;
            $scope.defaultAdvertiser();
        };
        //network timeSet 编辑
        $scope.checkNetData = function(num, dom) {
            if (num == "All") {
            var allSle = $(dom.target).find('i');
            if (allSle.hasClass('active')) {
                $scope.detailNET.timeSet = '';
                $('.icon-check').removeClass('active');
            }else{
                $scope.detailNET.timeSet = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24';
                $('.icon-check').addClass('active');
            };
            return;
            };
            if ($scope.detailNET.timeSet == "") {
                $scope.detailNET.timeSet = num + ',';
                $(dom.target).find('i').addClass('active');
            } else {
                var arr = $scope.detailNET.timeSet.split(',');
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
                $scope.detailNET.timeSet = arr.toString();
            }
        };
        /*cpxData值修改*/
        $scope.cpxData = function(cpx) {
            $scope.detailNET.cpx = cpx;
        };
        //清除现有时间段
        $scope.clearNetDate = function(dom){
            if ($scope.detailNET.status == 0) {
                $scope.startDate = "";
                $scope.endDate = "";
                $(dom.target).prev().val('');
            }
        };
        //Area 下拉框
         $scope.areaStatus = function() {
            var area = $scope.detailNET.area;
            if (area == "ALL") {
                for (var i = 0; i < $scope.areaList.length; i++) {
                    $scope.areaList[i].isSelect = true;
                };
                $(".icon-allArea").addClass('active');
            } else if(area == "") {
                for (var i = 0; i < $scope.areaList.length; i++) {
                    $scope.areaList[i].isSelect = false;
                };
                $(".icon-allArea").removeClass('active');
            } else {
                for (var i = 0; i < $scope.areaList.length; i++) {
                    var areaStr = $scope.areaList[i].code;
                    if (area.indexOf(areaStr) > -1) {
                        $scope.areaList[i].isSelect = true;
                    } else {
                        $scope.areaList[i].isSelect = false;
                    }
                };
            };
         };
        //地域选择
        $scope.allArea = function(){
            if ($scope.detailNET.area == "ALL") {
                $scope.detailNET.area = "";
                for (var i = 0; i < $scope.areaList.length; i++) {
                    $scope.areaList[i].isSelect = false;
                };
                $(".icon-allArea").removeClass('active');
                $scope.detailNET.areaExcept = "";
            } else {
                $scope.detailNET.area = "ALL";
                for (var i = 0; i < $scope.areaList.length; i++) {
                    $scope.areaList[i].isSelect = true;
                };
                $(".icon-allArea").addClass('active');
            }
        };
        $scope.areaData = function(area) {
            if ($scope.detailNET.area == "ALL") {
                if ($scope.detailNET.areaExcept == "") {
                    $scope.detailNET.areaExcept = area.code + ',';
                    area.isSelect = false;
                    $('.icon-allArea').removeClass('active');
                } else {
                    var arr = $scope.detailNET.areaExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(area.code);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        area.isSelect = true;
                        $('.icon-allArea').removeClass('active');
                    } else {
                        arr.push(area.code);
                        area.isSelect = false;
                    }
                    $scope.detailNET.areaExcept = arr.toString();
                    if ($scope.detailNET.areaExcept == "") {
                        $('.icon-allArea').addClass('active');
                    } else {
                        $('.icon-allArea').removeClass('active');
                    };
                }
            } else {
                if ($scope.detailNET.area == "") {
                    $scope.detailNET.area = area.code + ',';
                    area.isSelect = true;
                } else {
                    var arr = $scope.detailNET.area.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(area.code);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        area.isSelect = false;
                    } else {
                        arr.push(area.code);
                        area.isSelect = true;
                    }
                    $scope.detailNET.area = arr.toString();
                }
            };
        };

        
        $scope.loadModel = function(){
            var modelParam = {
                device: $scope.detailNET.device
            }
            serviceAPI.loadData(urlAPI.campaign_operate_device,modelParam).then(function(result) {
                $scope.modelList = result.modelInfo.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            });
        };



//定向测试


       //device 下拉框
         $scope.deviceStatus = function() {
            var device = $scope.detailNET.device;
            if (device == "ALL") {
                for (var i = 0; i < $scope.deviceList.length; i++) {
                    $scope.deviceList[i].isSelect = true;
                };
                $(".icon-alldevice").addClass('active');
            } else if(device == "") {
                for (var i = 0; i < $scope.deviceList.length; i++) {
                    $scope.deviceList[i].isSelect = false;
                };
                $(".icon-alldevice").removeClass('active');
            } else {
                for (var i = 0; i < $scope.deviceList.length; i++) {
                    var deviceStr = $scope.deviceList[i].name;
                    if (device.indexOf(deviceStr) > -1) {
                        $scope.deviceList[i].isSelect = true;
                    } else {
                        $scope.deviceList[i].isSelect = false;
                    }
                };
            };
         };
        //设备选择
        $scope.allDevice = function(){
            if ($scope.detailNET.device == "ALL") {
                $scope.detailNET.device = "";
                for (var i = 0; i < $scope.deviceList.length; i++) {
                    $scope.deviceList[i].isSelect = false;
                };
                $(".icon-alldevice").removeClass('active');
                $scope.detailNET.deviceExcept = "";
            } else {
                $scope.detailNET.device = "ALL";
                for (var i = 0; i < $scope.deviceList.length; i++) {
                    $scope.deviceList[i].isSelect = true;
                };
                $(".icon-alldevice").addClass('active');
            }
        };
        $scope.devData = function(device) {
            if ($scope.detailNET.device == "ALL") {
                if ($scope.detailNET.deviceExcept == "") {
                    $scope.detailNET.deviceExcept = device.name + ',';
                    device.isSelect = false;
                    $('.icon-alldevice').removeClass('active');
                } else {
                    var arr = $scope.detailNET.deviceExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(device.name);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        device.isSelect = true;
                        $('.icon-alldevice').removeClass('active');
                    } else {
                        arr.push(device.name);
                        device.isSelect = false;
                    }
                    $scope.detailNET.deviceExcept = arr.toString();
                    if ($scope.detailNET.deviceExcept == "") {
                        $('.icon-alldevice').addClass('active');
                    } else {
                        $('.icon-alldevice').removeClass('active');
                    };
                }
            } else {
                if ($scope.detailNET.device == "") {
                    $scope.detailNET.device = device.name + ',';
                    device.isSelect = true;
                } else {
                    var arr = $scope.detailNET.device.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(device.name);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        device.isSelect = false;
                    } else {
                        arr.push(device.name);
                        device.isSelect = true;
                    }
                    $scope.detailNET.device = arr.toString();
                }
            };
            $scope.loadModel();
        };
        //model 下拉框
         $scope.modelStatus = function() {
            var model = $scope.detailNET.model;
            if (model == "ALL") {
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].isSelect = true;
                };
                $(".icon-allmodel").addClass('active');
            } else if(model == "") {
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].isSelect = false;
                };
                $(".icon-allmodel").removeClass('active');
            } else {
                for (var i = 0; i < $scope.modelList.length; i++) {
                    var modelStr = $scope.modelList[i].name;
                    if (model.indexOf(modelStr) > -1) {
                        $scope.modelList[i].isSelect = true;
                    } else {
                        $scope.modelList[i].isSelect = false;
                    }
                };
            };
         };
        //model 选择
        $scope.allModel = function(){
            if ($scope.detailNET.model == "ALL") {
                $scope.detailNET.model = "";
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].isSelect = false;
                };
                $(".icon-allmodel").removeClass('active');
                $scope.detailNET.modelExcept = "";
            } else {
                $scope.detailNET.model = "ALL";
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].isSelect = true;
                };
                $(".icon-allmodel").addClass('active');
            }
        };
        $scope.modelData = function(model) {
            if ($scope.detailNET.model == "ALL") {
                if ($scope.detailNET.modelExcept == "") {
                    $scope.detailNET.modelExcept = model.name + ',';
                    model.isSelect = false;
                    $('.icon-allmodel').removeClass('active');
                } else {
                    var arr = $scope.detailNET.modelExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(model.name);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        model.isSelect = true;
                        $('.icon-allmodel').removeClass('active');
                    } else {
                        arr.push(model.name);
                        model.isSelect = false;
                    }
                    $scope.detailNET.modelExcept = arr.toString();
                    if ($scope.detailNET.modelExcept == "") {
                        $('.icon-allmodel').addClass('active');
                    } else {
                        $('.icon-allmodel').removeClass('active');
                    };
                }
            } else {
                if ($scope.detailNET.model == "") {
                    $scope.detailNET.model = model.name + ',';
                    model.isSelect = true;
                } else {
                    var arr = $scope.detailNET.model.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(model.name);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        model.isSelect = false;
                    } else {
                        arr.push(model.name);
                        model.isSelect = true;
                    }
                    $scope.detailNET.model = arr.toString();
                }
            }
        };
        //osVersion 下拉框
         $scope.osStatus = function() {
            var osVersion = $scope.detailNET.osVersion;
            if (osVersion == "ALL") {
                for (var i = 0; i < $scope.osVersionList.length; i++) {
                    $scope.osVersionList[i].isSelect = true;
                };
                $(".icon-allosVersion").addClass('active');
            } else if(osVersion == "") {
                for (var i = 0; i < $scope.osVersionList.length; i++) {
                    $scope.osVersionList[i].isSelect = false;
                };
                $(".icon-allosVersion").removeClass('active');
            } else {
                for (var i = 0; i < $scope.osVersionList.length; i++) {
                    var osVersionStr = $scope.osVersionList[i].name;
                    if (osVersion.indexOf(osVersionStr) > -1) {
                        $scope.osVersionList[i].isSelect = true;
                    } else {
                        $scope.osVersionList[i].isSelect = false;
                    }
                };
            }
         };
        //OS选择
        $scope.allOS = function(){
            if ($scope.detailNET.osVersion == "ALL") {
                $scope.detailNET.osVersion = "";
                for (var i = 0; i < $scope.osVersionList.length; i++) {
                    $scope.osVersionList[i].isSelect = false;
                };
                $(".icon-allosVersion").removeClass('active');
                $scope.detailNET.osVersionExcept = "";
            } else {
                $scope.detailNET.osVersion = "ALL";
                for (var i = 0; i < $scope.osVersionList.length; i++) {
                    $scope.osVersionList[i].isSelect = true;
                };
                $(".icon-allosVersion").addClass('active');
            }
        };
        $scope.osVersionData = function(osVersion) {
            if ($scope.detailNET.osVersion == "ALL") {
                if ($scope.detailNET.osVersionExcept == "") {
                    $scope.detailNET.osVersionExcept = osVersion.name + ',';
                    osVersion.isSelect = false;
                    $('.icon-allosVersion').removeClass('active');
                } else {
                    var arr = $scope.detailNET.osVersionExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(osVersion.name);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        osVersion.isSelect = true;
                        $('.icon-allosVersion').removeClass('active');
                    } else {
                        arr.push(osVersion.name);
                        osVersion.isSelect = false;
                    }
                    $scope.detailNET.osVersionExcept = arr.toString();
                    if ($scope.detailNET.osVersionExcept == "") {
                        $('.icon-allosVersion').addClass('active');
                    } else {
                        $('.icon-allosVersion').removeClass('active');
                    };
                }
            } else {
                if ($scope.detailNET.osVersion == "") {
                    $scope.detailNET.osVersion = osVersion.name + ',';
                    osVersion.isSelect = true;
                } else {
                    var arr = $scope.detailNET.osVersion.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(osVersion.name);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        osVersion.isSelect = false;
                    } else {
                        arr.push(osVersion.name);
                        osVersion.isSelect = true;
                    }
                    $scope.detailNET.osVersion = arr.toString();
                }
            }
        };
        //language 下拉框
         $scope.languageStatus = function() {
            var language = $scope.detailNET.language;
            if (language == "ALL") {
                for (var i = 0; i < $scope.languageList.length; i++) {
                    $scope.languageList[i].isSelect = true;
                };
                $(".icon-alllanguage").addClass('active');
            } else if(language == "") {
                for (var i = 0; i < $scope.languageList.length; i++) {
                    $scope.languageList[i].isSelect = false;
                };
                $(".icon-alllanguage").removeClass('active');
            } else {
                for (var i = 0; i < $scope.languageList.length; i++) {
                    var languageStr = $scope.languageList[i].name;
                    if (language.indexOf(languageStr) > -1) {
                        $scope.languageList[i].isSelect = true;
                    } else {
                        $scope.languageList[i].isSelect = false;
                    }
                };
            }
         };
        //language 选择
        $scope.allLanguage = function(){
            if ($scope.detailNET.language == "ALL") {
                $scope.detailNET.language = "";
                for (var i = 0; i < $scope.languageList.length; i++) {
                    $scope.languageList[i].isSelect = false;
                };
                $(".icon-alllanguage").removeClass('active');
                $scope.detailNET.languageExcept = "";
            } else {
                $scope.detailNET.language = "ALL";
                for (var i = 0; i < $scope.languageList.length; i++) {
                    $scope.languageList[i].isSelect = true;
                };
                $(".icon-alllanguage").addClass('active');
            }
        };
        $scope.languageData = function(language) {
            if ($scope.detailNET.language == "ALL") {
                if ($scope.detailNET.languageExcept == "") {
                    $scope.detailNET.languageExcept = language.name + ',';
                    language.isSelect = false;
                    $('.icon-alllanguage').removeClass('active');
                } else {
                    var arr = $scope.detailNET.languageExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(language.name);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        language.isSelect = true;
                        $('.icon-alllanguage').removeClass('active');
                    } else {
                        arr.push(language.name);
                        language.isSelect = false;
                    }
                    $scope.detailNET.languageExcept = arr.toString();
                    if ($scope.detailNET.languageExcept == "") {
                        $('.icon-alllanguage').addClass('active');
                    } else {
                        $('.icon-alllanguage').removeClass('active');
                    };
                }
            } else {
                if ($scope.detailNET.language == "") {
                    $scope.detailNET.language = language.name + ',';
                    language.isSelect = true;
                } else {
                    var arr = $scope.detailNET.language.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(language.name);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        language.isSelect = false;
                    } else {
                        arr.push(language.name);
                        language.isSelect = true;
                    }
                    $scope.detailNET.language = arr.toString();
                }
            }
        };

//定向测试结束

        //rtb请求
         $scope.rtbData = function(num) {
            if ($scope.detailNET.status == 0) {
                // if (num == 1) {
                //     $scope.loadOfferData();
                // }
                if ($scope.detailNET.rtb != num) {
                    $scope.detailNET.rtb = num;
                    $scope.defaultAdvertiser();
                    var adverParam = {
                        rtb: $scope.detailNET.rtb
                    }
                    serviceAPI.loadData(urlAPI.campaign_operate_adver,adverParam).then(function(result) {
                        $scope.adverList = result.advertisers;
                    });
                }
            }
         };
        //Advertiser Name下拉框
         $scope.adverClick = function(dom) {
            var adver = $scope.detailNET.advertiserName;
            if (adver == '') {
                adver = [];
            } else {
                adver = adver.split(',');
            }
            if (adver != []) {
                for (var i = 0; i < $scope.adverList.length; i++) {
                    var adverStr = $scope.adverList[i].name;
                    if (adver.indexOf(adverStr) > -1) {
                        $scope.adverList[i].isSelect = true;
                    };
                };
            }
         };
        $scope.currentPage = 1;
        // 总页数
        $scope.totalPages = 1;
        $scope.busy = false;
        $scope.firstReq = true;
         //获取 offerName 值
        $scope.offerClick = function(){
            $scope.offerParam = {
                "advertiserIds": $scope.detailNET.advertiserId,
                 "countryCodes": $scope.detailNET.area, 
                 "countryCodesExcept": $scope.detailNET.areaExcept, 
                 "placementId": $scope.detailNET.placeId,
                 "currentPage": $scope.currentPage
            }
            if ($scope.firstReq || $scope.offerParam.advertiserIds != $scope.oldParam.advertiserIds || $scope.offerParam.countryCodes != $scope.oldParam.countryCodes || $scope.offerParam.countryCodesExcept != $scope.oldParam.countryCodesExcept || $scope.offerParam.placementId != $scope.oldParam.placementId) {
                $scope.oldParam = $scope.offerParam;
                $scope.allName = [];
                $scope.totalPages = 1;
                $scope.loadMore();
            }
        };
        $scope.loadMore = function() {
            if ($scope.offerParam.currentPage <= $scope.totalPages) {
                if ($scope.busy) { 
                    return false; 
                } 
                $scope.busy = true;
                // 请求后台服务器 
                serviceAPI.loadData(urlAPI.campaign_operate_offer, $scope.offerParam).then(function(result){
                    $scope.offerParam.currentPage ++;
                    if (result.result == 200) {
                        $scope.busy = false;
                        $scope.firstReq = false;
                        if (!$scope.allName) {
                            $scope.allName = [];
                        }
                        $scope.allNameScroll = result.offers.map(function(data) {
                            return {
                                isSelect: false,
                                offerName: data.offerName,
                                offerId: data.offerId,
                                advertiserName: data.advertiserName,
                                advertiserId: data.advertiserId
                            }
                        });
                        $scope.allName = $scope.allName.concat($scope.allNameScroll);
                        $scope.totalPages = result.totalPage;
                        var offer = $scope.detailNET.offerId;
                        if (offer == '') {
                            offer = [];
                        } else {
                            offer = offer.split(',');
                        }
                        if (offer && offer.length == 1) {
                            for (var i = 0; i < $scope.allName.length; i++) {
                                var offerStr = $scope.allName[i].offerId;
                                if (offer.indexOf(offerStr) > -1) {
                                    $scope.allName[i].isSelect = true;
                                };
                            };
                        }
                    }
                }).
                catch(function(result) {});
            }
        };
        //选择广告主名并请求offerName值
         $scope.adverData = function(ad) {
            if ($scope.detailNET.advertiserName == "") {
                $scope.detailNET.advertiserId = "";
                $scope.detailNET.advertiserName = ad.name + ',';
                ad.isSelect = true;
            } else {
                var arrName = $scope.detailNET.advertiserName.split(',');
                if (arrName[arrName.length - 1] == "") {
                    arrName.length = arrName.length - 1;
                };
                var index = arrName.indexOf(ad.name);
                if (index >= 0) {
                    arrName = arrName.slice(0, index).concat(arrName.slice(index + 1));
                    arrName.sort();
                    ad.isSelect = false;
                } else {
                    arrName.push(ad.name);
                    ad.isSelect = true;
                }
                $scope.detailNET.advertiserName = arrName.toString();
            };
            if (!$scope.detailNET.advertiserId || $scope.detailNET.advertiserId == "") {
                $scope.detailNET.advertiserId = ad.id + ',';
            } else {
                var arr = $scope.detailNET.advertiserId.split(',');
                if (arr[arr.length - 1] == "") {
                    arr.length = arr.length - 1;
                };
                var numStr = String(ad.id); 
                var index = arr.indexOf(numStr);
                if (index >= 0) {
                    arr = arr.slice(0, index).concat(arr.slice(index + 1))
                    arr.sort();
                } else if (index < 0) {
                    arr.push(numStr);
                }
                $scope.detailNET.advertiserId = arr.toString();
            };
            if ($scope.detailNET.advertiserName.indexOf('LeWa') > -1) {
                $scope.showChannel = true;
            } else {
                $scope.showChannel = false;
                $scope.channelNames = '';
                $scope.detailNET.channel = '';
                for (var i = 0; i < $scope.channelList.length; i++) {
                    $scope.channelList[i].isSelect = false;
                }
            }
            $scope.allNames = "";
            $scope.allIds = "";
            $scope.detailNET.offerInfoList = [];
            for (var i = 0; i < $scope.allName.length; i++) {
                $scope.allName[i].isSelect = false;
            };
         };
        //选择All Name值
         $scope.offerData = function(all) {
            all.isSelect = !all.isSelect;
            if ($scope.allNames == "" && $scope.allIds == '') {
                $scope.allNames = all.offerName + ';';
                $scope.allIds = all.offerId + ',';
            } else {
                var allName = $scope.allNames.split(';');
                var allId = $scope.allIds.split(',');
                if (allId[allId.length - 1] == "") {
                    allId.length = allId.length - 1;
                };
                if (allName[allName.length - 1] == "") {
                    allName.length = allName.length - 1;
                };
                var index = allId.indexOf(all.offerId);
                if (index >= 0) {
                    allName = allName.slice(0, index).concat(allName.slice(index + 1));
                    allId = allId.slice(0, index).concat(allId.slice(index + 1));
                } else {
                    allName.push(all.offerName);
                    allId.push(all.offerId);
                };
                $scope.allNames = allName.join(';');
                $scope.allIds = allId.toString();
            };
            var offer = {
                "advertiserName": all.advertiserName,
                "advertiserId": all.advertiserId,
                "offerName": all.offerName,
                "offerId": all.offerId
            };
            function findOffer(checkOffer) {
                return checkOffer.offerId === offer.offerId;
            };
            var offerList = $scope.detailNET.offerInfoList;
            var offerIndex = offerList.findIndex(findOffer);
            if (offerIndex >= 0 ) {
                offerList.splice(offerIndex, 1);
            } else {
                offerList.push(offer);
            }
         };
         $scope.channelData = function(channel) {
            channel.isSelect = !channel.isSelect;
            if ($scope.channelNames == "" && $scope.detailNET.channel == '') {
                $scope.channelNames = channel.name + ',';
                $scope.detailNET.channel = channel.id + ',';
            } else {
                var channelName = $scope.channelNames.split(',');
                var channelId = $scope.detailNET.channel.split(',');
                if (channelId[channelId.length - 1] == "") {
                    channelId.length = channelId.length - 1;
                };
                if (channelName[channelName.length - 1] == "") {
                    channelName.length = channelName.length - 1;
                };
                var index = channelId.indexOf(channel.id.toString());
                if (index >= 0) {
                    channelName = channelName.slice(0, index).concat(channelName.slice(index + 1));
                    channelId = channelId.slice(0, index).concat(channelId.slice(index + 1));
                } else {
                    channelName.push(channel.name);
                    channelId.push(channel.id);
                };
                $scope.channelNames = channelName.join(',');
                $scope.detailNET.channel = channelId.toString();
            };
         };



         $scope.cancel = function(){
            history.go(-1);
         };
        //保存network数据
        $scope.saveNetData = function(detailNET) {
            // Non null check
            if (regexAPI.objRegex($scope.detailNET, ["name","appName", "version", "groupName", "placeName",  "imp", "click"])) {
                if ($scope.detailNET.name.length > 50) {
                    ModalAlert.popup({msg:"The length of the name should be less than 50"}, 2500);
                    return;
                };
                var reg = new RegExp("^[0-9]+(.[0-9]{1,4})?$");
                var payoutStr = detailNET.payout;
                var budgetStr = detailNET.budget;
                if (payoutStr && !reg.test(payoutStr)) {
                    ModalAlert.popup({msg:"Wrong payout character or this field is too long"}, 2500);
                    return;
                };
                if (budgetStr && !reg.test(budgetStr)) {
                    ModalAlert.popup({msg:"Wrong budget character or this field is too long"}, 2500);
                    return;
                };
                if ($scope.detailNET.rtb == 0) {
                    $scope.detailNET.offerInfoList = [];
                    if ($scope.detailNET.advertiserName.indexOf('LeWa') > -1) {
                        if ($scope.detailNET.channel == '') {
                            ModalAlert.popup({msg:"The Channel value is necessary"}, 2500);
                            return;
                        }
                    }
                } else {
                    if ($scope.detailNET.offerInfoList.length == 0) {
                        ModalAlert.popup({msg:"The All List value is necessary"}, 2500);
                        return;
                    };
                }
                $scope.detailNET.startDate = $scope.startDate;
                $scope.detailNET.endDate = $scope.endDate;
                if($scope.detailNET.startDate == "") {
                    ModalAlert.popup({msg:"the Data value is necessary"}, 2500);
                    return;
                };
                if ($scope.dataState == "edit") {
                   var url = urlAPI.campaign_network_edit;
                } else {
                   var url = urlAPI.campaign_network_new;
                };
                $scope.resubmit = true;
                serviceAPI.saveData(url, $scope.detailNET).then(function(result) {
                    if (result.result == 200) {
                        history.go(-1);
                    } else {
                        $scope.resubmit = false;
                        ModalAlert.popup({msg: result.msg}, 2500)
                    }
                }).catch(function() {})
            }

        };
        $scope.editNetList();
    }
];
return scope;
