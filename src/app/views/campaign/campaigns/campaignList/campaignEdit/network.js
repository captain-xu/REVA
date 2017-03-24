'use strict';

angular.module('app.controller').controller('campaignNetworkCtrl',
	["$scope", "serviceAPI", 'regexAPI', '$state','urlAPI','$stateParams',
	    function($scope, serviceAPI, regexAPI, $state, urlAPI, $stateParams) {
	        $scope.resubmit = false;
	        $scope.showTab = 'placement';
	        $scope.channelNames = '';
	        $(document).click(function(event) {
                var dom = $(event.target).closest('.chosen-container');
                var ele = $('.chosen-container');
                if (ele.hasClass('chosen-with-drop') && (dom.length == 0 || !dom.is(ele))) {
                    ele.removeClass('chosen-with-drop chosen-container-active');
                    $scope.filter_value = "";
                }
            });
	        //net获取详情数据
	        $scope.editList = function(net) {
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
	                if ($scope.dataState == 'edit') {
	                    var param = {
	                        operationId: $stateParams.id
	                    }
	                    serviceAPI.loadData(urlAPI.campaign_operate_detail,param).then(function(result) {
	                        $scope.detailVO = result.operation;
	                        $scope.detailVO.operationId = $stateParams.id;
	                        $scope.detailVO.app = result.operationRes.appId;
	                        $scope.detailVO.appName = result.operationRes.appName;
	                        $scope.detailVO.groupId = result.operationRes.groupId;
	                        $scope.detailVO.groupName = result.operationRes.groupName;
	                        $scope.detailVO.placeId = result.operationRes.placementId;
	                        $scope.detailVO.placeName = result.operationRes.placementName;
	                        $scope.detailVO.version = result.operationRes.version;
	                        $scope.detailVO.startDate = $scope.detailVO.startDateForShow;
	                        $scope.detailVO.endDate = $scope.detailVO.endDateForShow;
	                        $scope.detailVO.rtb = result.rtb;
	                        if (!$scope.detailVO.offerId) {
	                            $scope.detailVO.offerInfoList = [];
	                        } else {
	                            $scope.detailVO.offerInfoList = [
	                                {
	                                    "advertiserName": result.operation.advertiserName,
	                                    "advertiserId": result.operation.advertiserId,
	                                    "offerName": result.operation.offerName,
	                                    "offerId": result.operation.offerId
	                                }
	                            ];
	                        }
	                        $scope.startDate = $scope.detailVO.startDate;
	                        $scope.endDate = $scope.detailVO.endDate;
	                        $('#datarange').val(moment($scope.detailVO.startDateForShow).format('YYYY/MM/DD') + ' ~ ' + moment($scope.detailVO.endDateForShow).format('YYYY/MM/DD'));
		                    /*获取下拉数据*/
		                    $scope.getSelects();
	                        $scope.allNames = $scope.detailVO.offerName;
	                        $scope.allIds = $scope.detailVO.offerId;
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
	                        if ($scope.detailVO.advertiserName === "ALL" || $scope.detailVO.advertiserName.indexOf('LeWa') > -1) {
	                            $scope.showChannel = true;
	                        }
	                        var adverParam = {
	                            rtb: $scope.detailVO.rtb
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
	                        if ($scope.detailVO.channel) {
	                            var channelIds = $scope.detailVO.channel;
	                            if (channelIds === "ALL") {
	                                $scope.selectAllState.channel = true;
	                                for (var i = 0; i < $scope.channelList.length; i++) {
	                                    $scope.channelList[i].isSelect = true;
	                                    $scope.channelNames = 'ALL';
	                                }
	                            } else {
	                                for (var i = 0; i < $scope.channelList.length; i++) {
	                                    var eqId = $scope.channelList[i].id;
	                                    if (channelIds.indexOf(eqId) > -1) {
	                                        $scope.channelList[i].isSelect = true;
	                                        $scope.channelNames = $scope.channelNames.concat($scope.channelList[i].name) + ',';
	                                    }
	                                }
	                            }
	                        } else {
	                            $scope.detailVO.channel = '';
	                        }
	                    }).
	                    catch(function(result) {});
	                } else {
	                    $('.select').show();
	                    $scope.status = 0;
	                    $scope.detailVO = {
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
	                    $('#datarange').val('');
	                    var adverParam = {
	                        rtb: $scope.detailVO.rtb
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
	            });
	            if (!$scope.app || $scope.app.length == 0) {
	                $scope.getAppList();
	            };
	            serviceAPI.loadData(urlAPI.campaign_offer_cpx).then(function(result) {
	                $scope.CPX = result.CPX;
	            });
	        }
	        /*加载编辑页面app数据*/
	        $scope.getAppList = function() {
	            serviceAPI.loadData(urlAPI.campaign_detailList).then(function(result) {
	                $scope.appList = result.appList;
	            });
	        };
	        $scope.getSelects = function() {
	            var verParam = {
	                name: $scope.detailVO.appName
	            }
	            serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
	                $scope.versionList = result.versionList;
	            });
	            var groupParam = {
	                app: $scope.detailVO.appName,
	                version: $scope.detailVO.version
	            };
	            serviceAPI.loadData(urlAPI.campaign_offer_group, groupParam).then(function(result) {
	                $scope.groupList = result.groupList;
	            });
	            var placeParam = {
	                groupId: $scope.detailVO.groupId
	            };
	            serviceAPI.loadData(urlAPI.campaign_offer_place,placeParam).then(function(result) {
	                $scope.placeList = result.placeList;
	                if ($scope.detailVO.inServer == 1) {
	                    $scope.placeList.unshift({placementId:"ALL",name:'All'})
	                };
	            });
	        };
	        //恢复 Advertiser 数据 原始状态
	        $scope.defaultAdvertiser = function(){
	            $scope.detailVO.advertiserName = '';
	            $scope.showChannel = false;
	            $scope.channelNames = '';
	            $scope.detailVO.channel = '';
	            for (var i = 0; i < $scope.channelList.length; i++) {
	                $scope.channelList[i].isSelect = false;
	            }
	            $scope.detailVO.advertiserId = '';
	            $scope.allNames = "";
	            $scope.allIds = '';
	            $scope.detailVO.offerInfoList = [];
	            if ($scope.allName) {
	                for (var i = 0; i < $scope.allName.length; i++) {
	                    $scope.allName[i].isSelect = false;
	                };
	            }
	        };
	        $scope.selectData = {
	        	name: '',
	        	id: ''
	        };
	        /*work编辑页面app值修改获取version数据*/
	        $scope.appData = function() {
	            $scope.detailVO.app = $scope.selectData.id;
	            $scope.detailVO.appName = $scope.selectData.name;
	            $scope.detailVO.groupId = "";
	            $scope.detailVO.groupName = "";
	            $scope.detailVO.placeId = "";
	            $scope.detailVO.placeName = "";
	            $scope.detailVO.version = "";
	            $scope.defaultAdvertiser();
	            $scope.group = [];
	            $scope.place = [];
	            var verParam = {
	                name: $scope.detailVO.appName
	            }
	            serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
	                $scope.versionList = result.versionList;
	            });
	        };
	        /*work编辑页面version数据修改获取group数据*/
	        $scope.versionData = function() {
	            $scope.detailVO.version = $scope.selectData.name;
	            $scope.detailVO.groupId = "";
	            $scope.detailVO.groupName = "";
	            $scope.detailVO.placeId = "";
	            $scope.detailVO.placeName = "";
	            $scope.defaultAdvertiser();
	            $scope.place = [];
	            var groupParam = {
	                app: $scope.detailVO.appName,
	                version: $scope.detailVO.version
	            };
	            serviceAPI.loadData(urlAPI.campaign_offer_group, groupParam).then(function(result) {
	                $scope.groupList = result.groupList;
	            });
	        };
	        /*work编辑页面group数据修改获取Placement数据*/
	        $scope.groupData = function() {
	            $scope.detailVO.groupId = $scope.selectData.id;
	            $scope.detailVO.groupName = $scope.selectData.name;
	            $scope.detailVO.placeId = "";
	            $scope.detailVO.placeName = "";
	            $scope.defaultAdvertiser();
	            var placeParam = {
	                groupId: $scope.detailVO.groupId
	            };
	            serviceAPI.loadData(urlAPI.campaign_offer_place, placeParam).then(function(result) {
	                $scope.placeList = result.placeList;
	                if ($scope.detailVO.inServer == 1) {
	                    $scope.placeList.unshift({placementId:"",name:'All'})
	                }
	            });
	        };
	        /*work编辑页面Placement数据修改获取img title数据*/
	        $scope.placeData = function() {
	            $scope.detailVO.placeId = $scope.selectData.id;
	            $scope.detailVO.placeName = $scope.selectData.name;
	            $scope.detailVO.rtb = 0;
	            $scope.defaultAdvertiser();
	        };
	        //清除现有时间段
	        $scope.clearDate = function(dom){
	            if ($scope.detailVO.status == 0) {
	                $scope.startDate = "";
	                $scope.endDate = "";
	                $("#datarange").val('');
	            }
	        };
	        //rtb请求
	        $scope.rtbData = function(num) {
	            if ($scope.detailVO.status == 0) {
	                // if (num == 1) {
	                //     $scope.loadOfferData();
	                // }
	                if ($scope.detailVO.rtb != num) {
	                    $scope.detailVO.rtb = num;
	                    $scope.defaultAdvertiser();
	                    var adverParam = {
	                        rtb: $scope.detailVO.rtb
	                    }
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
	            }
	        };
	        $scope.selectAllState = {
	            advertiser: false,
	            channel: false
	        };
	        //Advertiser Name下拉框
	        $scope.adverClick = function(dom) {
	        	if (!$scope.detailVO.status) {
					$('.chosen-container').removeClass('chosen-with-drop chosen-container-active');
	        		$(dom.target).parents('.chosen-container').toggleClass('chosen-with-drop chosen-container-active');
					$(dom.target).parents('.chosen-container').find('.chosen-results .active-result').hover(function() {
	                    $(this).addClass('highlighted');
	                    $(this).find('i').removeClass('text-navy');
	                }).mouseleave(function() {
	                    $(this).removeClass('highlighted');
	                    $(this).find('i').addClass('text-navy');
	                });
		            var adver = $scope.detailVO.advertiserName;
		            if (adver === '') {
		                adver = [];
		            } else if (adver === 'ALL') {
		                $scope.selectAllState.advertiser = true;
		                for (var i = 0; i < $scope.adverList.length; i++) {
		                    $scope.adverList[i].isSelect = true;
		                }
		            } else {
		                adver = adver.split(',');
		                for (var i = 0; i < $scope.adverList.length; i++) {
		                    var adverStr = $scope.adverList[i].name;
		                    if (adver.indexOf(adverStr) > -1) {
		                        $scope.adverList[i].isSelect = true;
		                    };
		                }
		            }
	        	}
	        };
	        $scope.adverAll = function() {
	            if ($scope.selectAllState.advertiser) {
	                $scope.defaultAdvertiser();
	                for (var i = 0; i < $scope.adverList.length; i++) {
	                    $scope.adverList[i].isSelect = false;
	                }
	            } else {
	                $scope.detailVO.advertiserName = "ALL";
	                $scope.detailVO.advertiserId = "ALL";
	                $scope.showChannel = true;
	                for (var i = 0; i < $scope.adverList.length; i++) {
	                    $scope.adverList[i].isSelect = true;
	                }
	            }
	            $scope.selectAllState.channel = false;
	            $scope.selectAllState.advertiser = !$scope.selectAllState.advertiser;
	        };
	        //选择广告主名并请求offerName值
	        $scope.adverData = function(ad) {
	            if ($scope.detailVO.advertiserName == "") {
	                $scope.detailVO.advertiserId = ad.id + ',';
	                $scope.detailVO.advertiserName = ad.name + ',';
	                ad.isSelect = true;
	            } else {
	                if ($scope.detailVO.advertiserName === "ALL") {
	                    var arr = [];
	                    var arrName = [];
	                    for (var i = 0; i < $scope.adverList.length; i++) {
	                        arrName.push($scope.adverList[i].name);
	                        arr.push($scope.adverList[i].id.toString());
	                    }
	                } else {
	                    var arr = $scope.detailVO.advertiserId.split(',');
	                    var arrName = $scope.detailVO.advertiserName.split(',');
	                }
	                if (arr[arr.length - 1] == "") {
	                    arr.length = arr.length - 1;
	                    arrName.length = arrName.length - 1;
	                };
	                var numStr = String(ad.id); 
	                var index = arr.indexOf(numStr);
	                if (index >= 0) {
	                    arr = arr.slice(0, index).concat(arr.slice(index + 1));
	                    arrName = arrName.slice(0, index).concat(arrName.slice(index + 1));
	                    ad.isSelect = false;
	                } else {
	                    arr.push(numStr);
	                    arrName.push(ad.name);
	                    ad.isSelect = true;
	                }
	                $scope.detailVO.advertiserId = arr.toString();
	                $scope.detailVO.advertiserName = arrName.toString();
	            };
	            if ($scope.detailVO.advertiserName.indexOf('LeWa') > -1) {
	                $scope.showChannel = true;
	            } else {
	                $scope.showChannel = false;
	                $scope.selectAllState.channel = false;
	                $scope.channelNames = '';
	                $scope.detailVO.channel = '';
	                for (var i = 0; i < $scope.channelList.length; i++) {
	                    $scope.channelList[i].isSelect = false;
	                }
	            }
	            $scope.allNames = "";
	            $scope.allIds = "";
	            $scope.detailVO.offerInfoList = [];
	            $scope.detailVO.offerId = "";
	            $scope.selectAllState.advertiser = false;
	            if ($scope.allName) {
	                for (var i = 0; i < $scope.allName.length; i++) {
	                    $scope.allName[i].isSelect = false;
	                }
	            }
	        };
	        $scope.offerLoad = {
	            currentPage: 1,
	            totalPages: 1,
	            busy: false,
	            firstReq: true
	        };
	         //获取 offerName 值
	        $scope.offerClick = function(dom){
	        	if (!$scope.detailVO.status) {
					$('.chosen-container').removeClass('chosen-with-drop chosen-container-active');
	        		$(dom.target).parents('.chosen-container').toggleClass('chosen-with-drop chosen-container-active');
					$(dom.target).parents('.chosen-container').find('.chosen-results .active-result').hover(function() {
	                    $(this).addClass('highlighted');
	                    $(this).find('i').removeClass('text-navy');
	                }).mouseleave(function() {
	                    $(this).removeClass('highlighted');
	                    $(this).find('i').addClass('text-navy');
	                });
		            $scope.offerParam = {
		                "advertiserIds": $scope.detailVO.advertiserId,
		                 "countryCodes": $scope.detailVO.area, 
		                 "countryCodesExcept": $scope.detailVO.areaExcept, 
		                 "placementId": $scope.detailVO.placeId,
		                 "currentPage": $scope.offerLoad.currentPage
		            }
		            if ($scope.offerLoad.firstReq || $scope.offerParam.advertiserIds != $scope.oldParam.advertiserIds || $scope.offerParam.countryCodes != $scope.oldParam.countryCodes || $scope.offerParam.countryCodesExcept != $scope.oldParam.countryCodesExcept || $scope.offerParam.placementId != $scope.oldParam.placementId) {
		                $scope.oldParam = $scope.offerParam;
		                $scope.allName = [];
		                $scope.offerLoad.totalPages = 1;
		                $scope.loadMore();
		            }
		        }
	        };
	        $scope.loadMore = function() {
	            if ($scope.offerParam.currentPage <= $scope.offerLoad.totalPages) {
	                if ($scope.offerLoad.busy) { 
	                    return false; 
	                } 
	                $scope.offerLoad.busy = true;
	                // 请求后台服务器 
	                serviceAPI.loadData(urlAPI.campaign_operate_offer, $scope.offerParam).then(function(result){
	                    $scope.offerParam.currentPage ++;
	                    if (result.result == 200) {
	                        $scope.offerLoad.busy = false;
	                        $scope.offerLoad.firstReq = false;
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
	                        $scope.offerLoad.totalPages = result.totalPage;
	                        var offer = $scope.detailVO.offerId;
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
	            var offerList = $scope.detailVO.offerInfoList;
	            var offerIndex = offerList.findIndex(findOffer);
	            if (offerIndex >= 0 ) {
	                offerList.splice(offerIndex, 1);
	            } else {
	                offerList.push(offer);
	            }
	         };
	         $scope.channelClick = function(dom) {
				if (!$scope.detailVO.status) {
					$('.chosen-container').removeClass('chosen-with-drop chosen-container-active');
	        		$(dom.target).parents('.chosen-container').toggleClass('chosen-with-drop chosen-container-active');
					$(dom.target).parents('.chosen-container').find('.chosen-results .active-result').hover(function() {
	                    $(this).addClass('highlighted');
	                    $(this).find('i').removeClass('text-navy');
	                }).mouseleave(function() {
	                    $(this).removeClass('highlighted');
	                    $(this).find('i').addClass('text-navy');
	                });
		        }
	         };
	         $scope.channelAll = function() {
	            if ($scope.selectAllState.channel) {
	                $scope.channelNames = "";
	                $scope.detailVO.channel = "";
	                for (var i = 0; i < $scope.channelList.length; i++) {
	                    $scope.channelList[i].isSelect = false;
	                }
	            } else {
	                $scope.channelNames = "ALL";
	                $scope.detailVO.channel = "ALL";
	                for (var i = 0; i < $scope.channelList.length; i++) {
	                    $scope.channelList[i].isSelect = true;
	                }
	            }
	            $scope.selectAllState.channel = !$scope.selectAllState.channel;
	        };
	        $scope.channelData = function(channel) {
	            channel.isSelect = !channel.isSelect;
	            $scope.selectAllState.channel = false;
	            if ($scope.channelNames == "" && $scope.detailVO.channel == '') {
	                $scope.channelNames = channel.name + ',';
	                $scope.detailVO.channel = channel.id + ',';
	            } else {
	                if ($scope.channelNames === "ALL") {
	                    var channelName = [];
	                    var channelId = [];
	                    for (var i = 0; i < $scope.channelList.length; i++) {
	                        channelName.push($scope.channelList[i].name);
	                        channelId.push($scope.channelList[i].id.toString());
	                    }
	                } else {
	                    var channelName = $scope.channelNames.split(',');
	                    var channelId = $scope.detailVO.channel.split(',');
	                }
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
	                $scope.detailVO.channel = channelId.toString();
	            };
	        };
	        $scope.cancel = function(){
	            history.go(-1);
	        };
	        $scope.saveData = function() {
	            if (regexAPI.objRegex($scope.detailVO, ["name", "appName", "version", "groupName", "placeName", "imp", "click"])) {
	                var reg = new RegExp("^[0-9]+(.[0-9]{1,4})?$");
	                var payoutStr = $scope.detailVO.payout;
	                var budgetStr = $scope.detailVO.budget;
	                if (payoutStr && !reg.test(payoutStr)) {
	                	$scope.popAlert('error', 'Error', 'Wrong payout character or this field is too long');
	                    return;
	                };
	                if (budgetStr && !reg.test(budgetStr)) {
	                	$scope.popAlert('error', 'Error', 'Wrong budget character or this field is too long');
	                    return;
	                };
	                if ($scope.detailVO.rtb == 0) {
	                    $scope.detailVO.offerInfoList = [];
	                    if ($scope.detailVO.advertiserName === 'ALL' || $scope.detailVO.advertiserName.indexOf('LeWa') > -1) {
	                        if (!$scope.detailVO.channel) {
	                			$scope.popAlert('error', 'Error', 'The channel value is necessary');
	                            return;
	                        }
	                    } else if (!$scope.detailVO.advertiserName) {
                			$scope.popAlert('error', 'Error', 'The advertiser value is necessary');
                            return;
	                    }
	                } else {
	                    if ($scope.detailVO.offerInfoList.length == 0) {
                			$scope.popAlert('error', 'Error', 'The all list value is necessary');
	                        return;
	                    };
	                }
	                $scope.detailVO.startDate = $scope.startDate;
	                $scope.detailVO.endDate = $scope.endDate;
	                if(!$scope.detailVO.startDate) {
            			$scope.popAlert('error', 'Error', 'The date value is necessary');
	                    return;
	                };
	                var url;
	                if ($scope.dataState == "edit") {
	                   url = urlAPI.campaign_network_edit;
	                } else {
	                   url = urlAPI.campaign_network_new;
	                };
	                $scope.resubmit = true;
	                serviceAPI.saveData(url, $scope.detailVO).then(function(result) {
	                    if (result.result == 200) {
	                        history.go(-1);
	                    } else {
	                        $scope.resubmit = false;
            				$scope.popAlert('error', 'Error', result.msg);
	                    }
	                }).catch(function() {})
	            }
	        };
	        $scope.editList();
	    }
	]
);