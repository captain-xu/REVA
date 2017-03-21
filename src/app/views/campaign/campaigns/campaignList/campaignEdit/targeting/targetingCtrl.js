'use strict';

angular.module('app.controller').controller('targrtingCtrl', ["$scope", "serviceAPI", "urlAPI",
    function($scope, serviceAPI, urlAPI) {
        $scope.param = {
            area: [],
        };
        $scope.loadList = function() {
            serviceAPI.loadData(urlAPI.campaign_operate_area).then(function(result) {
                $scope.areas = result.areaInfo.map(function(data) {
                    return {
                        name: data.name,
                        code: data.code,
                        isSelect: false
                    };
                });
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_device).then(function(result) {
                $scope.devices = result.deviceInfo.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_os).then(function(result) {
                $scope.versions = result.osVersionInfo.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_language).then(function(result) {
                $scope.languages = result.languageInfo.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_channel1).then(function(result) {
                $scope.channel1s = result.channel1List.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_apiVer).then(function(result) {
                $scope.appVers = result.appVerList.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            }).
            catch(function(result) {});
            serviceAPI.loadData(urlAPI.campaign_operate_label).then(function(result) {
                $scope.labels = result.labelList.map(function(data) {
                    return {
                        name: data,
                        isSelect: false
                    };
                });
            }).
            catch(function(result) {});
            setTimeout(function() {
                $scope.setTime();
                if ($scope.state === 'edit') {
                    $scope.loadModel();
                    $scope.loadChannel2();
                    $scope.loadChannel3();
                }
            }, 500);
        };

        /*************************************定向********************************/
        //全选状态
        $scope.selectAllState = {
            area: false,
            device: false,
            model: false,
            osVersion: false,
            language: false,
            channel1: false,
            channel2: false,
            channel3: false,
            appVer: false,
            label: false,
        };
        //set 下拉框 状态
        $scope.selectStatus = function(name, list, attr) {
            var option = $scope.targeting[name];
            if (option == "ALL") {
                for (var i = 0; i < $scope[list].length; i++) {
                    $scope[list][i].isSelect = true;
                };
                $scope.selectAllState[name] = true;
            } else if (!option) {
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
        $scope.allSelect = function(name, list, except) {
            if ($scope.targeting[name] == "ALL") {
                $scope.targeting[name] = "";
                for (var i = 0; i < $scope[list].length; i++) {
                    $scope[list][i].isSelect = false;
                };
                $scope.selectAllState[name] = false;
                $scope.targeting[except] = "";
            } else {
                $scope.targeting[name] = "ALL";
                for (var i = 0; i < $scope[list].length; i++) {
                    $scope[list][i].isSelect = true;
                };
                $scope.selectAllState[name] = true;
            }
        };
        //单选
        $scope.singleSelect = function(option) {
            // if ($scope.targeting[name] == "ALL") {
            //     if (!$scope.targeting[except]) {
            //         $scope.targeting[except] = option[attr] + ',';
            //         option.isSelect = false;
            //         $scope.selectAllState[name] = false;
            //     } else {
            //         var arr = $scope.targeting[except].split(',');
            //         if (arr[arr.length - 1] == "") {
            //             arr.length = arr.length - 1;
            //         };
            //         var index = arr.indexOf(option[attr]);
            //         if (index >= 0) {
            //             arr = arr.slice(0, index).concat(arr.slice(index + 1))
            //             arr.sort();
            //             option.isSelect = true;
            //             $scope.selectAllState[name] = false;
            //         } else {
            //             arr.push(option[attr]);
            //             option.isSelect = false;
            //         }
            //         $scope.targeting[except] = arr.toString();
            //         if ($scope.targeting[except] == "") {
            //             $scope.selectAllState[name] = true;
            //         } else {
            //             $scope.selectAllState[name] = false;
            //         };
            //     }
            // } else {
            //     if (!$scope.targeting[name]) {
            //         $scope.targeting[name] = option[attr] + ',';
            //         option.isSelect = true;
            //     } else {
            //         var arr = $scope.targeting[name].split(',');
            //         if (arr[arr.length - 1] == "") {
            //             arr.length = arr.length - 1;
            //         };
            //         var index = arr.indexOf(option[attr]);
            //         if (index >= 0) {
            //             arr = arr.slice(0, index).concat(arr.slice(index + 1))
            //             arr.sort();
            //             option.isSelect = false;
            //         } else {
            //             arr.push(option[attr]);
            //             option.isSelect = true;
            //         }
            //         $scope.targeting[name] = arr.toString();
            //     }
            // };
            // $scope.targeting[option] = $scope.targeting[option].toString();
            if (option === 'device') {
                $scope.loadModel();
            } else if (option === 'channel1') {
                $scope.loadChannel2();
            } else if (option === 'channel2') {
                $scope.loadChannel3();
            }
        };
        $scope.loadModel = function() {
            if ($scope.targeting.device) {
                var modelParam = {
                    device: $scope.targeting.device
                }
                serviceAPI.loadData(urlAPI.campaign_operate_device, modelParam).then(function(result) {
                    $scope.models = result.modelInfo.map(function(data) {
                        return {
                            name: data,
                            isSelect: false
                        };
                    });
                });
            }
        };
        $scope.loadChannel2 = function() {
            if ($scope.targeting.channel1) {
                var channel2Param = {
                    channelId1: $scope.targeting.channel1
                }
                serviceAPI.loadData(urlAPI.campaign_operate_channel2, channel2Param).then(function(result) {
                    $scope.channel2s = result.channel2List.map(function(data) {
                        return {
                            name: data,
                            isSelect: false
                        };
                    });
                });
            }
        };
        $scope.loadChannel3 = function() {
            if ($scope.targeting.channel1 && $scope.targeting.channel2) {
                var channel3Param = {
                    channelId1: $scope.targeting.channel1,
                    channelId2: $scope.targeting.channel2
                }
                serviceAPI.loadData(urlAPI.campaign_operate_channel3, channel3Param).then(function(result) {
                    $scope.channel3s = result.channel3List.map(function(data) {
                        return {
                            name: data,
                            isSelect: false
                        };
                    });
                });
            }
        };
        /*************************************定向********************************/
        //timeSet 编辑
        $scope.timeData = [{
            name: 'All',
            isSelect: true
        }, {
            name: '1',
            isSelect: true
        }, {
            name: '2',
            isSelect: true
        }, {
            name: '3',
            isSelect: true
        }, {
            name: '4',
            isSelect: true
        }, {
            name: '5',
            isSelect: true
        }, {
            name: '6',
            isSelect: true
        }, {
            name: '7',
            isSelect: true
        }, {
            name: '8',
            isSelect: true
        }, {
            name: '9',
            isSelect: true
        }, {
            name: '10',
            isSelect: true
        }, {
            name: '11',
            isSelect: true
        }, {
            name: '12',
            isSelect: true
        }, {
            name: '13',
            isSelect: true
        }, {
            name: '14',
            isSelect: true
        }, {
            name: '15',
            isSelect: true
        }, {
            name: '16',
            isSelect: true
        }, {
            name: '17',
            isSelect: true
        }, {
            name: '18',
            isSelect: true
        }, {
            name: '19',
            isSelect: true
        }, {
            name: '20',
            isSelect: true
        }, {
            name: '21',
            isSelect: true
        }, {
            name: '22',
            isSelect: true
        }, {
            name: '23',
            isSelect: true
        }, {
            name: '24',
            isSelect: true
        }];
        $scope.setTime = function() {
            var timeArr = $scope.targeting.timeSet.split(',');
            if (timeArr.length === 24) {
                return;
            } else {
                $scope.timeData[0].isSelect = false;
                for (var i = 0; i < $scope.timeData.length; i++) {
                    if (timeArr.indexOf($scope.timeData[i].name) < 0) {
                        $scope.timeData[i].isSelect = false;
                    }
                }
            }
        };
        $scope.selectTime = function(time) {
            if (time.name == "All") {
                if (time.isSelect === true) {
                    $scope.targeting.timeSet = '';
                    for (var i = 0; i < $scope.timeData.length; i++) {
                        $scope.timeData[i].isSelect = false;
                    }
                } else {
                    for (var i = 0; i < $scope.timeData.length; i++) {
                        $scope.timeData[i].isSelect = true;
                    }
                    $scope.targeting.timeSet = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24';
                };
            }else {
                if ($scope.targeting.timeSet === "") {
                    $scope.targeting.timeSet = time.name + ',';
                    time.isSelect = true;
                } else {
                    var arr = $scope.targeting.timeSet.split(',');
                    if (arr[arr.length - 1] === "") {
                        arr.length = arr.length - 1;
                    };
                    var index = arr.indexOf(time.name);
                    if (index >= 0) {
                        arr.splice(index, 1);
                        arr.sort();
                        time.isSelect = false;
                        $scope.timeData[0].isSelect = false;
                    } else {
                        arr.push(time.name);
                        time.isSelect = true;
                        if (arr.length === 24) {
                            $scope.timeData[0].isSelect = true;
                        }
                    }
                    $scope.targeting.timeSet = arr.toString();
                }
            }
        };
        $scope.loadList();
    }
]);
