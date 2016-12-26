var scope = ["$scope", "ModalAlert", "regexAPI","serviceAPI", '$state','urlAPI','$stateParams',
    function($scope, ModalAlert, regexAPI,serviceAPI, $state,urlAPI, $stateParams) {
        $scope.resubmit = false;
        //net获取详情数据
        $scope.editNetList = function(net) {
            $scope.dataState = $stateParams.param;
            $('.msg').text('');
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
                    };
                    var adverParam = {
                        rtb: $scope.detailNET.rtb
                    }
                    serviceAPI.loadData(urlAPI.campaign_operate_adver,adverParam).then(function(result) {
                        $scope.adverList = result.advertisers;
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
                    "advertiserId": ''
                };
                $scope.startDate = '';
                $scope.endDate = '';
                $scope.allNames = "";
                $scope.allIds = "";
                $('#datarangeNet').val('');
                //$scope.loadModel();
                var adverParam = {
                    rtb: $scope.detailNET.rtb
                }
                serviceAPI.loadData(urlAPI.campaign_operate_adver,adverParam).then(function(result) {
                    $scope.adverList = result.advertisers;
                }).
                catch(function(result) {});
            }
            if (!$scope.app || $scope.app.length == 0) {
                $scope.getAppList();
            };
            serviceAPI.loadData(urlAPI.campaign_offer_cpx).then(function(result) {
                $scope.CPX = result.CPX;
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_area).then(function(result) {
                $scope.areaList = result.countries;
            }).
            catch(function(result) {});

/*
            serviceAPI.loadData(urlAPI.campaign_operate_device).then(function(result) {
                $scope.deviceList = result.deviceInfo.split(',');
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_os).then(function(result) {
                $scope.osList = result.osVersionInfo;
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_language).then(function(result) {
                $scope.languageList = result.languageInfo;
            }).
             catch(function(result) {});
*/
        }
        /*加载编辑页面app数据*/
        $scope.getAppList = function() {
            serviceAPI.loadData(urlAPI.campaign_detailList).then(function(result) {
                $scope.app = result.appList;
            }).
            catch(function(result) {});
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
            $scope.detailNET.advertiserName = '';
            $scope.detailNET.advertiserId = '';
            $scope.allNames = "";
            $scope.allIds = '';
            $scope.group = [];
            $scope.place = [];
            var verParam = {
                name: $scope.detailNET.appName
            }
            serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
                $scope.version = result.versionList;
            }).
            catch(function(result) {});
        };
        /*Network编辑页面version数据修改获取group数据*/
        $scope.versionNetData = function(net) {
            $scope.detailNET.version = net.version;
            $scope.detailNET.groupId = "";
            $scope.detailNET.groupName = "";
            $scope.detailNET.placeId = "";
            $scope.detailNET.placeName = "";
            $scope.detailNET.advertiserName = '';
            $scope.detailNET.advertiserId = '';
            $scope.allNames = "";
            $scope.allIds = '';
            $scope.place = [];
            var groupParam = {
                app: $scope.detailNET.appName,
                version: $scope.detailNET.version
            };
            serviceAPI.loadData(urlAPI.campaign_offer_group, groupParam).then(function(result) {
                $scope.group = result.groupList;
            }).
            catch(function(result) {});
        };
        /*Network编辑页面group数据修改获取Placement数据*/
        $scope.groupNetData = function(net) {
            $scope.detailNET.groupId = net.groupId;
            $scope.detailNET.groupName = net.name;
            $scope.detailNET.placeId = "";
            $scope.detailNET.placeName = "";
            $scope.detailNET.advertiserName = '';
            $scope.detailNET.advertiserId = '';
            $scope.allNames = "";
            $scope.allIds = '';
            var placeParam = {
                groupId: $scope.detailNET.groupId
            };
            serviceAPI.loadData(urlAPI.campaign_offer_place, placeParam).then(function(result) {
                $scope.place = result.placeList;
                if ($scope.detailNET.inServer == 1) {
                    $scope.place.unshift({placementId:"",name:'All'})
                }
            }).
            catch(function(result) {});
        };
        /*Network编辑页面Placement数据修改获取img title数据*/
        $scope.placeNetData = function(net) {
            $scope.detailNET.placeId = net.placementId;
            $scope.detailNET.placeName = net.name;
            $scope.detailNET.rtb = 0;
            $scope.detailNET.advertiserName = '';
            $scope.detailNET.advertiserId = '';
            $scope.allNames = "";
            $scope.allIds = '';
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
         $scope.areaClick = function(dom) {
            var area = $scope.detailNET.area;
            if (area == "ALL") {
                $(dom.target).next().find('.icon-area').addClass('active');
            } else if(area == "") {
                $(dom.target).next().find('.icon-area').removeClass('active');
            } else {
                for (var i = 0; i < $('.area-date li').length; i++) {
                    var areaStr = $('.area-date li').eq(i).find('span').text();
                    if (area.indexOf(areaStr) > -1) {
                        $('.area-date li').eq(i).find('.icon-area').addClass('active');
                    };
                };
            };
         };
        //地域选择
        $scope.allArea = function(detailNET,dom){
            if ($scope.detailNET.area == "ALL") {
                $scope.detailNET.area = "";
                $('.icon-area').removeClass('active');
                $scope.detailNET.areaExcept = "";
            } else {
                $scope.detailNET.area = "ALL";
                $('.icon-area').addClass('active');
            }
        };
        $scope.areaData = function(area, dom) {
            if ($scope.detailNET.area == "ALL") {
                if ($scope.detailNET.areaExcept == "") {
                    $scope.detailNET.areaExcept = area.code + ',';
                    $(dom.target).find('i').removeClass('active');
                    $('.icon-all').removeClass('active');
                } else {
                    var arr = $scope.detailNET.areaExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(area.code);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').addClass('active');
                        $(dom.target).siblings().first().find('i').removeClass('active');
                    } else {
                        arr.push(area.code);
                        $(dom.target).find('i').removeClass('active');
                    }
                    $scope.detailNET.areaExcept = arr.toString();
                    if ($scope.detailNET.areaExcept == "") {
                        $('.icon-all').addClass('active');
                    } else {
                        $('.icon-all').removeClass('active');
                    };
                }
            } else {
                if ($scope.detailNET.area == "") {
                    $scope.detailNET.area = area.code + ',';
                    $(dom.target).find('i').addClass('active');
                } else {
                    var arr = $scope.detailNET.area.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(area.code);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').removeClass('active');
                    } else {
                        arr.push(area.code);
                        $(dom.target).find('i').addClass('active');
                    }
                    $scope.detailNET.area = arr.toString();
                }
            };
        };

/*        
        $scope.loadModel = function(){
            var modelParam = {
                device: $scope.detailNET.device
            }
            serviceAPI.loadData(urlAPI.campaign_operate_device,modelParam).then(function(result) {
                $scope.modelList = result.modelInfo.split(',');
            }).
            catch(function(result) {});
        };

*/

//定向测试


/*       //device 下拉框
         $scope.deviceClick = function(dom) {
            var device = $scope.detailNET.device;
            if (device == "ALL") {
                $(dom.target).next().find('.icon-device').addClass('active');
            } else if(device == "") {
                $(dom.target).next().find('.icon-device').removeClass('active');
            } else {
                for (var i = 0; i < $('.device-date li').length; i++) {
                    var deviceStr = $('.device-date li').eq(i).find('span').text();
                    if (device.indexOf(deviceStr) > -1) {
                        $('.device-date li').eq(i).find('.icon-device').addClass('active');
                    };
                };
            };
         };
        //设备选择
        $scope.allDevice = function(detailNET,dom){
            if ($scope.detailNET.device == "ALL") {
                $scope.detailNET.device = "";
                $('.icon-device').removeClass('active');
                $scope.detailNET.deviceExcept = "";
            } else {
                $scope.detailNET.device = "ALL";
                $('.icon-device').addClass('active');
            }
        };
        $scope.devData = function(device, dom) {
            if ($scope.detailNET.device == "ALL") {
                if ($scope.detailNET.deviceExcept == "") {
                    $scope.detailNET.deviceExcept = device + ',';
                    $(dom.target).find('i').removeClass('active');
                    $('.icon-alldevice').removeClass('active');
                } else {
                    var arr = $scope.detailNET.deviceExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(device);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').addClass('active');
                        $(dom.target).siblings().first().find('i').removeClass('active');
                    } else {
                        arr.push(device);
                        $(dom.target).find('i').removeClass('active');
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
                    $scope.detailNET.device = device + ',';
                    $(dom.target).find('i').addClass('active');
                } else {
                    var arr = $scope.detailNET.device.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(device);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').removeClass('active');
                    } else {
                        arr.push(device);
                        $(dom.target).find('i').addClass('active');
                    }
                    $scope.detailNET.device = arr.toString();
                }
            };
            $scope.loadModel();
        };
        //model 下拉框
         $scope.modelClick = function(dom) {
            var model = $scope.detailNET.model;
            if (model == "ALL") {
                $(dom.target).next().find('.icon-model').addClass('active');
            } else if(model == "") {
                $(dom.target).next().find('.icon-model').removeClass('active');
            } else {
                for (var i = 0; i < $('.model-date li').length; i++) {
                    var modelStr = $('.model-date li').eq(i).find('span').text();
                    if (model.indexOf(modelStr) > -1) {
                        $('.model-date li').eq(i).find('.icon-model').addClass('active');
                    };
                };
            };
         };
        //model 选择
        $scope.allModel = function(detailNET,dom){
            if ($scope.detailNET.model == "ALL") {
                $scope.detailNET.model = "";
                $('.icon-model').removeClass('active');
                $scope.detailNET.modelExcept = "";
            } else {
                $scope.detailNET.model = "ALL";
                $('.icon-model').addClass('active');
            }
        };
        $scope.modelData = function(model, dom) {
            if ($scope.detailNET.model == "ALL") {
                if ($scope.detailNET.modelExcept == "") {
                    $scope.detailNET.modelExcept = model + ',';
                    $(dom.target).find('i').removeClass('active');
                    $('.icon-allmodel').removeClass('active');
                } else {
                    var arr = $scope.detailNET.modelExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(model);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').addClass('active');
                        $(dom.target).siblings().first().find('i').removeClass('active');
                    } else {
                        arr.push(model);
                        $(dom.target).find('i').removeClass('active');
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
                    $scope.detailNET.model = model + ',';
                    $(dom.target).find('i').addClass('active');
                } else {
                    var arr = $scope.detailNET.model.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(model);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').removeClass('active');
                    } else {
                        arr.push(model);
                        $(dom.target).find('i').addClass('active');
                    }
                    $scope.detailNET.model = arr.toString();
                }
            };
        };
        //osVersion 下拉框
         $scope.osClick = function(dom) {
            var osVersion = $scope.detailNET.osVersion;
            if (osVersion == "ALL") {
                $(dom.target).next().find('.icon-osVersion').addClass('active');
            } else if(osVersion == "") {
                $(dom.target).next().find('.icon-osVersion').removeClass('active');
            } else {
                for (var i = 0; i < $('.osVersion-date li').length; i++) {
                    var osVersionStr = $('.osVersion-date li').eq(i).find('span').text();
                    if (osVersion.indexOf(osVersionStr) > -1) {
                        $('.osVersion-date li').eq(i).find('.icon-osVersion').addClass('active');
                    };
                };
            };
         };
        //OS选择
        $scope.allOS = function(detailNET,dom){
            if ($scope.detailNET.osVersion == "ALL") {
                $scope.detailNET.osVersion = "";
                $('.icon-osVersion').removeClass('active');
                $scope.detailNET.osVersionExcept = "";
            } else {
                $scope.detailNET.osVersion = "ALL";
                $('.icon-osVersion').addClass('active');
            }
        };
        $scope.osVersionData = function(osVersion, dom) {
            if ($scope.detailNET.osVersion == "ALL") {
                if ($scope.detailNET.osVersionExcept == "") {
                    $scope.detailNET.osVersionExcept = osVersion + ',';
                    $(dom.target).find('i').removeClass('active');
                    $('.icon-allosVersion').removeClass('active');
                } else {
                    var arr = $scope.detailNET.osVersionExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(osVersion);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').addClass('active');
                        $(dom.target).siblings().first().find('i').removeClass('active');
                    } else {
                        arr.push(osVersion);
                        $(dom.target).find('i').removeClass('active');
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
                    $scope.detailNET.osVersion = osVersion + ',';
                    $(dom.target).find('i').addClass('active');
                } else {
                    var arr = $scope.detailNET.osVersion.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(osVersion);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').removeClass('active');
                    } else {
                        arr.push(osVersion);
                        $(dom.target).find('i').addClass('active');
                    }
                    $scope.detailNET.osVersion = arr.toString();
                }
            };
        };
        //language 下拉框
         $scope.languageClick = function(dom) {
            var language = $scope.detailNET.language;
            if (language == "ALL") {
                $(dom.target).next().find('.icon-language').addClass('active');
            } else if(language == "") {
                $(dom.target).next().find('.icon-language').removeClass('active');
            } else {
                for (var i = 0; i < $('.language-date li').length; i++) {
                    var languageStr = $('.language-date li').eq(i).find('span').text();
                    if (language.indexOf(languageStr) > -1) {
                        $('.language-date li').eq(i).find('.icon-language').addClass('active');
                    };
                };
            };
         };
        //language 选择
        $scope.allLanguage = function(detailNET,dom){
            if ($scope.detailNET.language == "ALL") {
                $scope.detailNET.language = "";
                $('.icon-language').removeClass('active');
                $scope.detailNET.languageExcept = "";
            } else {
                $scope.detailNET.language = "ALL";
                $('.icon-language').addClass('active');
            }
        };
        $scope.languageData = function(language, dom) {
            if ($scope.detailNET.language == "ALL") {
                if ($scope.detailNET.languageExcept == "") {
                    $scope.detailNET.languageExcept = language + ',';
                    $(dom.target).find('i').removeClass('active');
                    $('.icon-alllanguage').removeClass('active');
                } else {
                    var arr = $scope.detailNET.languageExcept.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(language);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').addClass('active');
                        $(dom.target).siblings().first().find('i').removeClass('active');
                    } else {
                        arr.push(language);
                        $(dom.target).find('i').removeClass('active');
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
                    $scope.detailNET.language = language + ',';
                    $(dom.target).find('i').addClass('active');
                } else {
                    var arr = $scope.detailNET.language.split(',');
                    if (arr[arr.length - 1] == "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(language);
                    if (index >= 0) {
                        arr = arr.slice(0, index).concat(arr.slice(index + 1))
                        arr.sort();
                        $(dom.target).find('i').removeClass('active');
                    } else {
                        arr.push(language);
                        $(dom.target).find('i').addClass('active');
                    }
                    $scope.detailNET.language = arr.toString();
                }
            };
        };
*/
//定向测试结束

        //rtb请求
         $scope.rtbData = function(num) {
            if ($scope.detailNET.status == 0) {
                // if (num == 1) {
                //     $scope.loadOfferData();
                // }
                $scope.detailNET.rtb = num;
                $scope.detailNET.advertiserName = '';
                $scope.detailNET.advertiserId = '';
                // $scope.allNames = "";
                // $scope.allIds = "";
                // $scope.detailNET.offerName = '';
                // $scope.detailNET.offerInfoList = [];
                // $('.icon-offer').removeClass('active');
                var adverParam = {
                    rtb: $scope.detailNET.rtb
                }
                serviceAPI.loadData(urlAPI.campaign_operate_adver,adverParam).then(function(result) {
                    $scope.adverList = result.advertisers;
                }).
                catch(function(result) {});
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
                for (var i = 0; i < $('.adver li').length; i++) {
                    var adverStr = $('.adver li').eq(i).find('span').text();
                    if (adver.indexOf(adverStr) > -1) {
                        $('.adver li').eq(i).find('.icon-offer').addClass('active');
                    };
                };
            }
         };
        $scope.currentPage = 1;
        // 总页数
        $scope.totalPages = 1;
        $scope.busy = false;
        $scope.firstReq = true;
         //获取offerName值
        $scope.offerClick = function(detailNET,dom){
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
                    if (result.status == 0) {
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
         $scope.adverData = function(ad, dom) {
            if ($scope.detailNET.advertiserName == "") {
                $scope.detailNET.advertiserId = "";
                $scope.detailNET.advertiserName = ad.name + ',';
                $(dom.target).find('.icon-offer').addClass('active');
            } else {
                var arrName = $scope.detailNET.advertiserName.split(',');
                if (arrName[arrName.length - 1] == "") {
                    arrName.length = arrName.length - 1;
                };
                var index = arrName.indexOf(ad.name);
                if (index >= 0) {
                    arrName = arrName.slice(0, index).concat(arrName.slice(index + 1))
                    arrName.sort();
                    $(dom.target).find('.icon-offer').removeClass('active');
                } else {
                    arrName.push(ad.name);
                    $(dom.target).find('.icon-offer').addClass('active');
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
            $scope.allNames = "";
            $scope.allIds = "";
            $scope.detailNET.offerName = '';
            $scope.detailNET.offerInfoList = [];
         };
        //选择All Name值
         $scope.offerData = function(all, event) {
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
                    allName.sort();
                    allId.sort();
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
                offerList.pop(offer);
            } else {
                offerList.push(offer);
            }
         };;
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
                    if (result.status == 0) {
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
