var scope = ["$scope", "serviceAPI", "ModalAlert", "Upload", 'urlAPI', '$sce',"$anchorScroll","$location",
    function($scope, serviceAPI, ModalAlert, Upload, urlAPI, $sce, $anchorScroll,$location) {
        $scope.option = 0;
        $scope.getValidate = function() {
            return $scope.validateParam = {
                img: '',
                posterImg: '',
                video: '',
                url: '',
                active: '',
                msgWarn: false,
                imgWarn: false,
                posterImgWarn: false,
                videoWarn: false,
                urlWarn: false,
                activeWarn: false,
                customWarn: false
            }
        };
        $scope.getDefault = function(id, num) {
            return {
                "messageId": '',
                "title": $scope.targetApp,
                "titleLen": 50 - $scope.targetApp.length,
                "templet": 1,
                "content": "",
                "msgLen": 240,
                "imageUrl": "",
                "displayType": 1,
                "postImgUrl": "",
                "videoUrl": "",
                "action": function() {
                    if ($scope.targetApp == "System") {
                        return 2;
                    } else {
                        return 1;
                    }
                }(),
                "customdata": [],
                "sound": 1,
                "vibrate": 1,
                "delayidle": 0,
                "target": num,
                "urlStart": "http://",
                "urlEnd": "",
                "options": 0,
                "network": 0,
                "activity": '',
                "order": id,
                "triggerTime": 0
            }
        };

        $scope.receiver = $scope.getDefault('A', 100);
        $scope.notification = [$scope.receiver];
        $scope.getDetail = function() {
            $scope.getValidate();
            serviceAPI.loadData(urlAPI.push_setNtfMsg, { "pushId": $scope.pushId }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    if (result.data.notificationList) {
                        $scope.notification = result.data.notificationList;
                        for (var i = 0; i < $scope.notification.length; i++) {
                            if ($scope.notification[i].customdata) {
                                $scope.notification[i].customdata = eval('(' + $scope.notification[i].customdata + ')');
                            } else if ($scope.notification[i].customdata || $scope.notification[i].customdata == "") {
                                $scope.notification[i].customdata = [];
                            };
                            if ($scope.targetApp == "System") {
                                $scope.notification[i].action = 2;
                            }
                            if ($scope.notification[i].videoUrl) {
                                $scope.notification[i].video = $scope.notification[i].videoUrl;
                                $scope.notification[i].videoUrl = $sce.trustAsResourceUrl($scope.notification[i].videoUrl);
                            }
                            if ($scope.notification[i].url) {
                                var urlIndex = $scope.notification[i].url.indexOf('/') + 2;
                                var urlLength = $scope.notification[i].url.length;
                                $scope.notification[i].urlStart = $scope.notification[i].url.substring(0, urlIndex);
                                $scope.notification[i].urlEnd = $scope.notification[i].url.substring(urlIndex, urlLength);
                            } else {
                                $scope.notification[i].urlStart = 'http://';
                            }
                            $scope.notification[i].titleLen = 50 - $scope.notification[i].title.length;
                            if ($scope.notification[i].content) {
                                $scope.notification[i].msgLen = 240 - $scope.notification[i].content.length;
                            } else {
                                $scope.notification[i].msgLen = 240;
                            }
                        };
                        $scope.setOrder();
                        $scope.addHide = $scope.notification.length;
                    }
                }
            }).
            catch(function(result) {});
        };
        $scope.setOrder = function() {
            for (var i = 0; i < $scope.notification.length; i++) {
                if (i == 0) {
                    $scope.notification[i].order = 'A';
                } else if (i == 1) {
                    $scope.notification[i].order = 'B';
                } else {
                    $scope.notification[i].order = 'C';
                };
            };
            $scope.receiver = $scope.notification[0];
        };
        $scope.addMessage = function() {
            var receiver = $scope.getDefault('B', 20);
            if ($scope.notification.length == 1) {
                $scope.notification[0].target = 80;
                receiver.order = "B";
            } else {
                if ($scope.notification[0].target < 20) {
                    $scope.notification[1].target = $scope.notification[1].target - 20;
                } else {
                    $scope.notification[0].target = $scope.notification[0].target - 20;
                };
                receiver.order = "C";
            };
            $scope.notification.push(receiver);
            $scope.showDetail(receiver)
            $scope.addHide = $scope.notification.length;
        };
        $scope.showDetail = function(list) {
            $scope.getValidate();
            $scope.receiver = list;
        };
        $scope.removeMessage = function(index) {
            ModalAlert.alert({
                value: "Are you sure to delete Message " + $scope.notification[index].order,
                closeBtnValue: "No",
                okBtnValue: "Yes",
                confirm: function() {
                    var length = $scope.notification.length;
                    var arr = $scope.notification;
                    if ($scope.notification[index].messageId != '') {
                        serviceAPI.delData(urlAPI.push_delNtfMsg, { "messageId": $scope.notification[index].messageId }).then(function(result) {
                            if (result.status == 1 && result.code == 200) {
                                if (index == 0) {
                                    $scope.notification = arr.slice(index + 1, length);
                                } else {
                                    $scope.notification = arr.slice(0, index).concat(arr.slice(index + 1, length));
                                };
                                if ($scope.notification.length == 1) {
                                    $scope.notification[0].target = 100;
                                } else {
                                    $scope.notification[0].target = 80;
                                    $scope.notification[1].target = 20;
                                };
                                $scope.setOrder();
                                $scope.addHide = $scope.notification.length;
                            } else {
                                ModalAlert.popup({ msg: result.msg }, 2500);
                            };
                        }).catch(function() {
                        });
                    } else {
                        if (index == 0) {
                            $scope.notification = arr.slice(index + 1, length);
                        } else {
                            $scope.notification = arr.slice(0, index).concat(arr.slice(index + 1, length));
                        };
                        if ($scope.notification.length == 1) {
                            $scope.notification[0].target = 100;
                        } else {
                            $scope.notification[0].target = 80;
                            $scope.notification[1].target = 20;
                        };
                        $scope.setOrder();
                        $scope.addHide = $scope.notification.length;
                    }
                }
            });
        };
        $scope.setPercentage = function(order) {
            var total = 0;
            for (var i = 0; i < $scope.notification.length; i++) {
                if (Number($scope.notification[i].target) < 1) {
                    $scope.notification[i].target = 1;
                };
                total = Number(total) + Number($scope.notification[i].target);
            };
            if (order == "A") {
                $scope.targetNum(1, 2, 0, total);
            } else if (order == "B") {
                $scope.targetNum(2, 0, 1, total);
            } else if (order == "C") {
                $scope.targetNum(0, 1, 2, total);
            };

        };
        $scope.titleSum = function() {
            $scope.receiver.titleLen = 50 - $scope.receiver.title.length;
        };
        $scope.msgSum = function() {
            $scope.receiver.msgLen = 240 - $scope.receiver.content.length;
        };
        $scope.targetNum = function(num1, num2, num3, total) {
            var addNum = 100 - Number(total);
            var targetUser = 0;
            if ($scope.notification[num1]) {
                targetUser = $scope.notification[num1].target;
                total = Number(targetUser) + Number(addNum);
                if (Number(total) > 0) {
                    $scope.notification[num1].target = total;
                } else if (Number(total) < 1) {
                    $scope.notification[num1].target = 1;
                    total = 1 - Number(total);
                    if ($scope.notification[num2]) {
                        targetUser = $scope.notification[num2].target;
                        total = Number(targetUser) - Number(total);
                        if (Number(total) > 0) {
                            $scope.notification[num2].target = total;
                        } else {
                            $scope.notification[num2].target = 1;
                            total = 1 - Number(total);
                            $scope.notification[num3].target = Number($scope.notification[num3].target) - Number(total);
                        }
                    } else {
                        $scope.notification[num3].target = Number($scope.notification[num3].target) - Number(total);
                    }
                }
            } else if ($scope.notification[num2]) {
                targetUser = $scope.notification[num2].target;
                total = Number(targetUser) + Number(addNum);
                if (Number(total) > 0) {
                    $scope.notification[num2].target = total;
                } else if (Number(total) < 1) {
                    $scope.notification[num2].target = 1;
                    total = 1 - Number(total);
                    $scope.notification[num3].target = Number($scope.notification[num3].target) - Number(total);
                }
            } else {
                $scope.notification[num3].target = 100;
            }
        };
        $scope.templetData = function(num) {
            if (num != $scope.receiver.templet) {
                if ($scope.receiver.title != $scope.targetApp || $scope.receiver.content != '' || $scope.receiver.imageUrl != '' || $scope.receiver.videoUrl != '' || $scope.receiver.video != '' || $scope.receiver.activity != "" || $scope.receiver.options != 0 || $scope.receiver.customdata.length != 0 || $scope.receiver.urlEnd != "") {
                    ModalAlert.alert({
                        value: "Are you sure to delete Message ",
                        closeBtnValue: "No",
                        okBtnValue: "Yes",
                        confirm: function() {
                            if ($scope.receiver.imageUrl || $scope.receiver.videoUrl || $scope.receiver.video || $scope.receiver.postImgUrl) {
                                serviceAPI.delData(urlAPI.push_clearMedia, { "pushId": $scope.pushId, "messageId": $scope.receiver.messageId, "templet": $scope.receiver.templet })
                                $scope.receiver.messageId = '';
                            }
                            $scope.receiver.templet = num;
                            $scope.receiver.title = $scope.targetApp;
                            $scope.receiver.titleLen = $scope.targetApp.length;
                            $scope.receiver.content = '';
                            $scope.receiver.msgLen = 0;
                            $scope.receiver.displayType = 1;
                            $scope.receiver.imageUrl = '';
                            $scope.receiver.videoUrl = '';
                            $scope.receiver.video = '';
                            $scope.receiver.postImgUrl = '';
                            $scope.receiver.options = 0;
                            $scope.receiver.action = function() {
                                if ($scope.targetApp == "System") {
                                    return 2;
                                } else {
                                    return 1;
                                }
                            }();
                            $scope.receiver.activity = "";
                            $scope.receiver.customdata = [];
                            $scope.receiver.sound = 1;
                            $scope.receiver.vibrate = 1;
                            $scope.receiver.delayidle = 0;
                            $scope.receiver.urlStart = "http://";
                            $scope.receiver.urlEnd = "";
                            $scope.receiver.network = 0;
                            if (num == 4) {
                                $scope.receiver.triggerTime = 5;
                                $scope.receiver.action = 2;
                            } else {
                                $scope.receiver.triggerTime = 0;
                            }
                            $scope.getValidate();
                        }

                    })
                } else {
                    $scope.receiver.templet = num;
                    if (num == 4) {
                        $scope.receiver.triggerTime = 5;
                        $scope.receiver.action = 2;
                    } else {
                        $scope.receiver.triggerTime = 0;
                        $scope.receiver.action = function() {
                            if ($scope.targetApp == "System") {
                                return 2;
                            } else {
                                return 1;
                            }
                        }();
                    }
                    $scope.getValidate();
                }
            }
        };
        $scope.msgTitle = function() {
            if ($scope.receiver.title == "") {
                $scope.receiver.title = $scope.targetApp;
                $scope.receiver.titleLen = $scope.targetApp.length;
            }
        };
        $scope.uploadPic = function(file) {
            if (file) {
                if (file && file.size >= 100000) {
                    $scope.validateParam.img = "The picture is too big";
                    $scope.validateParam.imgWarn = true;
                    return false;
                } else {
                    Upload.upload({
                        url: urlAPI.push_uploadImg,
                        data: { img: file, pushId: $scope.pushId, messageId: $scope.receiver.messageId }
                    }).then(function(result) {
                        ModalAlert.success({ msg: 'Upload Succeeded' }, 2500);
                        $scope.receiver.imageUrl = result.data.data.imgUrl;
                        $scope.receiver.messageId = result.data.data.messageId;
                        $scope.validateParam.imgWarn = false;
                    })
                }
            }
        };
        $scope.uploadPoster = function(file) {
            if (file) {
                if (file.size >= 100000) {
                    $scope.validateParam.posterImg = "The picture is too big";
                    $scope.validateParam.posterImgWarn = true;
                    return false;
                } else {
                    Upload.upload({
                        url: urlAPI.push_uploadPostImg,
                        data: { postImg: file, pushId: $scope.pushId, messageId: $scope.receiver.messageId }
                    }).then(function(result) {
                        ModalAlert.success({ msg: 'Upload Succeeded' }, 2500);
                        $scope.receiver.postImgUrl = result.data.data.postImgUrl;
                        $scope.receiver.messageId = result.data.data.messageId;
                        $scope.validateParam.posterImgWarn = false;
                    })
                }
            }
        };
        $scope.uploadVideo = function(file) {
            if (file) {
                if (file.size >= 4096000) {
                    $scope.validateParam.video = "The video is too big";
                    $scope.validateParam.videoWarn = true;
                    return false;
                } else if (file.type != "video/mp4") {
                    ModalAlert.popup({ msg: 'Wrong Format' }, 2500);
                    return false;
                } else {
                    $('.fa-spin').show();
                    Upload.upload({
                        url: urlAPI.push_uploadVideo,
                        data: { video: file, pushId: $scope.pushId, messageId: $scope.receiver.messageId }
                    }).then(function(result) {
                        $('.fa-spin').hide();
                        ModalAlert.success({ msg: 'Upload Succeeded' }, 2500);
                        $scope.receiver.videoUrl = $sce.trustAsResourceUrl(result.data.data.videoUrl);
                        $scope.receiver.video = result.data.data.videoUrl;
                        $scope.receiver.messageId = result.data.data.messageId;
                        $scope.validateParam.videoWarn = false;
                    })
                }
            }
        };
        $scope.checkNum = function(num) {
            if (isNaN(Number($scope.receiver.triggerTime)) || Number($scope.receiver.triggerTime) < 0 || $scope.receiver.triggerTime == '') {
                $scope.receiver.triggerTime = num;
                ModalAlert.warning({ msg: "Please enter a number more then 0" }, 2500);
            }
            $scope.receiver.triggerTime = parseInt($scope.receiver.triggerTime);

        };
        $scope.actionData = function(num) {
            if ($scope.targetApp != "System") {
                $scope.receiver.action = num;
            }
        };
        $scope.optionClick = function() {
            if ($scope.receiver.options == 0) {
                $scope.receiver.options = 1;
            } else {
                $scope.receiver.options = 0;
                $scope.receiver.customdata = [];
            }
        };
        $scope.addCustom = function() {
            if ($scope.receiver.customdata) {
                $scope.receiver.customdata.push({ "key": "", "value": "" });
            } else {
                $scope.receiver.customdata = [];
                $scope.receiver.customdata.push({ "key": "", "value": "" });
            }
        };
        $scope.removeCustom = function(index) {
            var length = $scope.receiver.customdata.length;
            var arr = $scope.receiver.customdata;
            if (index == 0) {
                $scope.receiver.customdata = arr.slice(index + 1, length);
            } else {
                $scope.receiver.customdata = arr.slice(0, index).concat(arr.slice(index + 1, length));
            }
            $scope.validateParam.customWarn = false;
            //$scope.setOrder();
        };
        $scope.sound = function(content) {
            if (content.sound == 0) {
                content.sound = 1;
            } else {
                content.sound = 0;
            }
        };
        $scope.vibrate = function(content) {
            if (content.vibrate == 0) {
                content.vibrate = 1;
            } else {
                content.vibrate = 0;
            }
        };
        $scope.delayidle = function(content) {
            if (content.delayidle == 0) {
                content.delayidle = 1;
            } else {
                content.delayidle = 0;
            }
        };
        $scope.flag = 1;
        $scope.saveDetail = function(num) {
            // for (var i = 0; i < $scope.notification.length; i++) {
            //     $scope.notification[i].customdata = JSON.stringify($scope.notification[i].customdata);
            // };
            var receiver = {
                "pushId": $scope.pushId,
                "message": $scope.notification
            };
            var url = urlAPI.push_saveNtfMsg;
            if (num == 0) {
                if ($scope.flag) {
                    $scope.flag = 0;
                    serviceAPI.saveData(url,receiver).then(function(result) {
                        if (result.status == 1 && result.code == 200) {
                            $scope.goLIst();
                        } else {
                            ModalAlert.popup({ msg: result.msg }, 2500);
                        }
                    });
                };
            } else {
                for (var i = 0; i < $scope.notification.length; i++) {
                    var item = $scope.notification[i];
                    item.videoUrl = item.video;
                    if (!item.content || item.content == "") {
                        $scope.showDetail(item);
                        $location.hash('content');
                        $scope.validateParam.msgWarn = true;
                        return false;
                    }
                    //图片与视频校验
                    if (item.templet == 1) {
                        item.imageUrl = '';
                        item.displayType = 1;
                        item.videoUrl = '';
                        item.postImgUrl = '';
                    } else if (item.templet == 3) {
                        if (!item.imageUrl || item.imageUrl == '') {
                            $scope.showDetail(item);
                            $location.hash('content');
                            $scope.validateParam.img = 'The image is necessary.';
                            $scope.validateParam.imgWarn = true;
                            return false;
                        };
                        item.videoUrl = '';
                        item.postImgUrl = '';
                    } else {
                        if (!item.postImgUrl || item.postImgUrl == '') {
                            $scope.showDetail(item);
                            $location.hash('content');
                            $scope.validateParam.posterImg = 'The poster is necessary.';
                            $scope.validateParam.posterImgWarn = true;
                            return false;
                        }
                        if (!item.videoUrl || item.videoUrl == '') {
                            $scope.showDetail(item);
                            $location.hash('content');
                            $scope.validateParam.video = 'The video is necessary.';
                            $scope.validateParam.videoWarn = true;
                            return false;
                        };
                        item.imageUrl = '';
                    };

                    if (item.action == 3) {
                        if (!item.activity || item.activity == '') {
                            $scope.showDetail(item);
                            $location.hash('action');
                            $scope.validateParam.active = 'The activity is necessary.';
                            $scope.validateParam.activeWarn = true;
                            return false;
                        } else if (item.activity.length > 100) {
                            $scope.showDetail(item);
                            $location.hash('action');
                            $scope.validateParam.active = 'The length of the activity should be less than 100.';
                            $scope.validateParam.activeWarn = true;
                            return false;
                        }
                        item.url = '';
                    } else if (item.action == 2) {
                        if (!item.urlEnd || item.urlEnd == '') {
                            $scope.showDetail(item);
                            $location.hash('action');
                            $scope.validateParam.url = 'The url is necessary.';
                            $scope.validateParam.urlWarn = true;
                            return false;
                        } else if (item.urlEnd.length > 200) {
                            $scope.showDetail(item);
                            $location.hash('action');
                            $scope.validateParam.url = 'The length of the url should be less than 200.';
                            $scope.validateParam.urlWarn = true;
                            return false;
                        } else {
                            item.url = item.urlStart + item.urlEnd;
                        };
                        item.activity = '';
                    } else {
                        item.url = '';
                        item.activity = '';
                    };
                    for (var j = 0; j < item.customdata.length; j++) {
                        var customdata = item.customdata[j]
                        if ((customdata.key == '' && customdata.value !== '') || (customdata.key !== '' && customdata.value == '')) {
                            $scope.showDetail(item);
                            $location.hash('option');
                            $scope.validateParam.customWarn = true;
                            return false;
                        }
                    }
                    $anchorScroll();
                };
                if ($scope.flag) {
                    $scope.flag = 0;
                    serviceAPI.saveData(url,receiver).then(function(result) {
                        if (result.status == 1 && result.code == 200) {
                         $scope.nextStep(3,'push.edit.scheduling');
                        } else {
                            ModalAlert.popup({ msg: result.msg }, 2500);
                        }
                    })
                };
            }
        };
        $scope.getDetail();
    }
];
return scope;
