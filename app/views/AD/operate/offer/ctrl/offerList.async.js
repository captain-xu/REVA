var scope = ["$scope", "ModalAlert", '$state', "serviceAPI",'$stateParams', 'urlAPI',
 function($scope, ModalAlert, $state, serviceAPI, $stateParams, urlAPI) {
    $scope.resubmit = false;
    $scope.editDetail = function() {
        $('.msg').text('');
        $scope.startDate = '';
        $scope.endDate = '';
        $('#datarange').val('');
        var param = {
            offerId: $stateParams.offerId,
            advertiserId: $stateParams.id,
            rtb: $stateParams.rtb
        }
        serviceAPI.loadData(urlAPI.campaign_offer_detail,param).then(function(result) {
            $scope.detailVO = result.offer;
            $scope.name = $scope.detailVO.offerName;
            $scope.detailVO.startDate = '',
            $scope.detailVO.endDate = '',
            $scope.detailVO.app = '',
            $scope.detailVO.appName = '',
            $scope.detailVO.version = '',
            $scope.detailVO.groupId = '',
            $scope.detailVO.groupName = '',
            $scope.detailVO.placeId = '',
            $scope.detailVO.placeName = '',
            $scope.detailVO.click = '',
            $scope.detailVO.area = '',
            $scope.detailVO.areaExcept = '',
            $scope.detailVO.device = '',
            $scope.detailVO.deviceExcept = '',
            $scope.detailVO.imeiExcept = '',
            $scope.detailVO.model = '',
            $scope.detailVO.modelExcept = '',
            $scope.detailVO.osVersion = '',
            $scope.detailVO.osVersionExcept = '',
            $scope.detailVO.language = '',
            $scope.detailVO.languageExcept = '',
            $scope.detailVO.network = '',
            $scope.detailVO.networkExcept = '',
            $scope.detailVO.channel1 = '',
            $scope.detailVO.channel1Except = '',
            $scope.detailVO.channel2 = '',
            $scope.detailVO.channel2Except = '',
            $scope.detailVO.channel3 = '',
            $scope.detailVO.channel3Except = '',
            $scope.detailVO.appVer = '',
            $scope.detailVO.appVerExcept = '',
            $scope.detailVO.rtb = 1,
            $scope.detailVO.timeSet = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24"
        }).
        catch(function(result) {});
        serviceAPI.loadData(urlAPI.campaign_appList).then(function(result) {
            $scope.appList = result.appList;
        }).
        catch(function(result) {});
        serviceAPI.loadData(urlAPI.campaign_offer_country).then(function(result) {
            $scope.countryList = result.countries;
        }).
        catch(function(result) {});
        serviceAPI.loadData(urlAPI.campaign_offer_cpx).then(function(result) {
            $scope.CPX = result.CPX;
        }).
        catch(function(result) {});
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
    /*cpxData值修改*/
    $scope.cpxData = function(cpx) {
        $scope.detailVO.CPX = cpx;
    };
    //时间控件失去焦点校验
    $scope.timeDate = function(dom){
        var time = $(dom.target).val();
        if (time == "") {
            $scope.startDate = "";
            $scope.endDate = "";
        };
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
        var groupParam = {
            app: $scope.detailVO.appName,
            version: $scope.detailVO.version
        }
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
        }
        serviceAPI.loadData(urlAPI.campaign_offer_place, placeParam).then(function(result) {
            $scope.place = result.placeList;
        }).
        catch(function(result) {});
    };
    /*Placement数据修改获取img title数据*/
    $scope.placeData = function(vo) {
        $scope.detailVO.placeId = vo.placementId;
        $scope.detailVO.placeName = vo.name;
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
    $scope.validateForm = function() {
        if ($scope.detail.name != "" && $scope.detail.imp != "" && $scope.detail.click != "" && $scope.detail.startDate != "" && $scope.detail.app != "" && $scope.detail.version != "" && $scope.detail.groupId != "" && $scope.detail.placeId != "") {
            $scope.resubmit = true;
            serviceAPI.saveData(urlAPI.campaign_offer_edit,$scope.detail).then(function(result) {
                if (result.result == 200) {
                    history.go(-1);
                } else {
                    $scope.resubmit = false;
                    ModalAlert.popup({msg:result.msg}, 2500);
                }
            }).catch(function() {})
        } else {
            if ($scope.detailVO.name == "") {
                ModalAlert.popup({ msg: "the name value is necessary" }, 2500);
            } else if ($scope.detail.startDate == "") {
                ModalAlert.popup({ msg: "the Date value is necessary" }, 2500);
            } else if ($scope.detail.app == "") {
                ModalAlert.popup({ msg: "the appName value is necessary" }, 2500);
            } else if ($scope.detail.version == "") {
                ModalAlert.popup({ msg: "the version value is necessary" }, 2500);
            } else if ($scope.detail.groupId == "") {
                ModalAlert.popup({ msg: "the groupName value is necessary" }, 2500);
            } else if ($scope.detail.placeId == "") {
                ModalAlert.popup({ msg: "the placeName value is necessary" }, 2500);
            } else if ($scope.detailVO.imp == "") {
                ModalAlert.popup({ msg: "the IMP frequency is necessary" }, 2500);
            } else if ($scope.detail.click == "") {
                ModalAlert.popup({ msg: "the Click frequency value is necessary" }, 2500);
            }
        };
    };
    $scope.saveData = function() {
        $scope.detail = {
            "name": $scope.name,
            "advertiserName": $scope.detailVO.advertiserName,
            "advertiserId": $scope.detailVO.advertiserId,
            "offerName": $scope.detailVO.offerName,
            "offerId": $scope.detailVO.offerId,
            "CPX": $scope.detailVO.CPX,
            "payout": $scope.detailVO.payout,
            "budget": $scope.detailVO.budget,
            "startDate": $scope.startDate,
            "endDate": $scope.endDate,
            "app": $scope.detailVO.app,
            "appName": $scope.detailVO.appName,
            "version": $scope.detailVO.version,
            "groupId": $scope.detailVO.groupId,
            "groupName": $scope.detailVO.groupName,
            "placeId": $scope.detailVO.placeId,
            "placeName": $scope.detailVO.placeName,
            "imp": $scope.detailVO.remaining_daily_cap,
            "click": $scope.detailVO.click,
            "area": $scope.detailVO.countries,
            "areaExcept": $scope.detailVO.areaExcept,
            "device": $scope.detailVO.device,
            "deviceExcept": $scope.detailVO.deviceExcept,
            "imei": $scope.detailVO.imei,
            "imeiExcept": $scope.detailVO.imeiExcept,
            "model": $scope.detailVO.model,
            "modelExcept": $scope.detailVO.modelExcept,
            "osVersion": $scope.detailVO.osVersion,
            "osVersionExcept": $scope.detailVO.osVersionExcept,
            "language": $scope.detailVO.language,
            "languageExcept": $scope.detailVO.languageExcept,
            "network": $scope.detailVO.network,
            "networkExcept": $scope.detailVO.networkExcept,
            "channel1": $scope.detailVO.channel1,
            "channel1Except": $scope.detailVO.channel1Except,
            "channel2": $scope.detailVO.channel2,
            "channel2Except": $scope.detailVO.channel2Except,
            "channel3": $scope.detailVO.channel3,
            "channel3Except": $scope.detailVO.channel3Except,
            "appVer": $scope.detailVO.appVer,
            "appVerExcept": $scope.detailVO.appVerExcept,
            "timeSet": $scope.detailVO.timeSet
        }
        if ($scope.detail.name.length > 50) {
            ModalAlert.popup({msg:"The length of the name should be less than 50"}, 2500);
            return;
        };
        var reg = new RegExp("^[0-9]+(.[0-9]{1,4})?$");
        var payoutStr = $scope.detail.payout;
        var budgetStr = $scope.detail.budget;
        if (payoutStr && !reg.test(payoutStr)) {
            ModalAlert.popup({msg:"Wrong payout character or this field is too long"}, 2500);
            return;
        };
        if (budgetStr && !reg.test(budgetStr)) {
            ModalAlert.popup({msg:"Wrong budget character or this field is too long"}, 2500);
            return;
        };
        $scope.validateForm();
    };
    $scope.cancel = function() {
        history.go(-1);
    };
    $scope.editDetail();
}];
return scope;
