'use strict';

angular.module('app.controller').controller('newUserCtrl', [
    "$scope", "chartOption", "serviceAPI", "urlAPI", "msgService",
    function($scope, chartOption, serviceAPI, urlAPI, msgService) {
        $scope.getCondition = function() {
            serviceAPI.loadData(urlAPI.report_app_detail_condition).then(function(result) {
                if (result.status == 1) {
                    $scope.condationData = result.data;
                    $scope.setCondition();
                }
            });
            serviceAPI.loadData(urlAPI.report_app_applist_condition).then(function(result) {
                if (result.status == 1) {
                    $scope.appList = result.data.appList;
                    $scope.appName = $scope.appList[0].app;
                    $scope.updateView();
                }
            });
        };

        $scope.setCondition = function(state) {
            if (state == "channel") {
                $scope.updateView();
                $scope.modelList = [];
                $scope.paramModel = [];
                for (var i = 0; i < $scope.condationData.channelLevel.length; i++) {
                    if ($scope.paramChannel.indexOf($scope.condationData.channelLevel[i].channel) >= 0) {
                        var models = $scope.condationData.channelLevel[i].models;
                        for (var y = 0; y < models.length; y++) {
                            if ($scope.modelList.indexOf(models[y]) < 0) {
                                $scope.modelList.push(models[y]);
                            }
                        }
                    }
                };
            } else if (state == "country") {
                $scope.updateView();
                $scope.stateList = [];
                $scope.paramState = [];
                for (var i = 0; i < $scope.condationData.countryLevel.length; i++) {
                    if ($scope.paramCountry.indexOf($scope.condationData.countryLevel[i].country) >= 0) {
                        var states = $scope.condationData.countryLevel[i].states;
                        for (var y = 0; y < states.length; y++) {
                            if ($scope.stateList.indexOf(states[y]) < 0) {
                                $scope.stateList.push(states[y]);
                            }
                        }
                    }
                }
            } else {
                $scope.modelList = [];
                $scope.stateList = [];
                for (var i = 0; i < $scope.condationData.channelLevel.length; i++) {
                    var models = $scope.condationData.channelLevel[i].models;
                    for (var y = 0; y < models.length; y++) {
                        if ($scope.modelList.indexOf(models[y]) < 0) {
                            $scope.modelList.push(models[y]);
                        }
                    }
                }
                for (var i = 0; i < $scope.condationData.countryLevel.length; i++) {
                    var states = $scope.condationData.countryLevel[i].states;
                    for (var y = 0; y < states.length; y++) {
                        if ($scope.stateList.indexOf(states[y]) < 0) {
                            $scope.stateList.push(states[y]);
                        }
                    }
                }
            }
        };
        $scope.setTime = function(start, end) {
            $scope.startDate = start;
            $scope.endDate = end;
            $scope.updateView();
        };
        $scope.getEchData = function(url, state, cb) {
            var nodata = state + "nodata";
            $scope[nodata] = false;
            var load = state + "loading";
            $scope[load] = true;
            serviceAPI.loadData(url, {
                "appkey": $scope.appName,
                "channelkey": $scope.paramChannel.toString(),
                "modelkey": $scope.paramModel.toString(),
                "countrykey": $scope.paramCountry.toString(),
                "statekey": $scope.paramState.toString(),
                "from": $scope.startDate,
                "to": $scope.endDate

            }).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    if (!Array.isArray(result.data) || result.data.length > 0) {
                        cb(result.data);
                    } else {
                        var nodata = state + "nodata";
                        $scope[nodata] = true;
                        $scope.errorMsg = msgService.no_data;
                    }
                    $scope[load] = false;
                }
            }).catch(function(result) {
                $scope[load] = false;
                $scope[nodata] = true;
                $scope.errorMsg = msgService.system_error;
            });
        };
        $scope.getBarOption = function(result, key) {
            var option = chartOption.option();
            option.xAxis = {
                type: 'value',
                boundaryGap: [0, 0.01],
                position: 'top',
                axisLabel: {
                    formatter: function(value, index) {
                        if (value >= 1000) {
                            value = (value / 1000).toFixed(1) + "(K)"
                        }
                        return value;
                    }
                }
            };
            option.grid.left = "100px";
            option.yAxis = {
                type: 'category',
                data: result.map(function(data) {
                    return data[key]
                }),
                // axisLine: {
                //     show: false
                // },
                // axisLabel: {
                //     show: false
                // }
            }
            option.dataZoom = [{
                type: 'slider',
                orient: 'vertical',
                show: result.length > 10 ? true : false,
                zoomLock: true,
                left: 'right',
                start: 100-((10 / result.length) * 100),
                end: 100,
                showDetail: false,
                showDataShadow: false
            }];
            option.series = [{
                name: "Sales",
                type: 'bar',
                data: result.map(function(data) {
                    return data.count
                }),
                barMaxWidth: "40",
                animationDelay: function(idx) {
                    return idx * 10;
                }
            }];
            return option;
        };
        $scope.setTrendChart = function(num) {
            $scope.trendNum = num;
            var url = urlAPI.report_app_newuser_channelTrend;
            if (num == 0) {
                url = urlAPI.report_app_newuser_modelTrend;
            };
            $scope.getEchData(url, 'trend', function(result) {
                if (result.trendData.length == 0) {
                    $scope.errorMsg = msgService.no_data;
                    $scope.trendnodata = true;
                    return;
                };
                var option = chartOption.option();
                option.xAxis.data = result.time;
                option.xAxis.axisLabel = {
                    formatter: function(value, index) {
                        var date = new Date(value);
                        var texts = [(date.getMonth() + 1), date.getDate()];
                        if (index === 0) {
                            texts.unshift(date.getFullYear());
                        }
                        return texts.join('/');
                    }
                };
                option.xAxis.boundaryGap = false,
                    option.grid = {
                        bottom: "15%",
                        left: "50px",
                        top: "30px",
                        right: "30px"
                    };
                option.legend = {
                    data: result.trendData.map(function(data) {
                        return data.key
                    }),
                    show: true,
                    left: 'right'
                };
                option.series = result.trendData.map(function(data) {
                    return {
                        name: data.key,
                        type: 'line',
                        data: data.dataList,
                        symbol: 'circle',
                        symbolSize: 2,
                        animationDelay: function(idx) {
                            return idx * 10;
                        }
                    }
                });
                $scope.trendChart.setOption(option, true);
            });
        };
        $scope.rankChart = function() {
            $scope.getEchData(urlAPI.report_app_newuser_channelRank, 'channel', function(result) {
                var option = $scope.getBarOption(result, 'channel');

                $scope.channelChart.setOption(option);
            });
            $scope.getEchData(urlAPI.report_app_newuser_modelRank, 'modelrank', function(result) {
                var option = $scope.getBarOption(result, 'model');
                $scope.modelrankChart.setOption(option);
            });
            $scope.getEchData(urlAPI.report_app_newuser_regionRank, 'regionrank', function(result) {
                var option = $scope.getBarOption(result, 'region');
                $scope.regionrankChart.setOption(option);
            });
        };
        $scope.tableData = function(num) {
            $scope.tableNum = num;
            $scope.tdDetails = [];
            $scope.totalList = 0;
            $scope.thItems = [];
            var url = urlAPI.report_app_newuser_channelDetail;
            if (num == 0) {
                url = urlAPI.report_app_newuser_modelDetail;
            };
            $scope.tableloading = true;
            serviceAPI.loadData(url, {
                "appkey": $scope.appName,
                "channelkey": $scope.paramChannel.toString(),
                "modelkey": $scope.paramModel.toString(),
                "countrykey": $scope.paramCountry.toString(),
                "statekey": $scope.paramState.toString(),
                "from": $scope.startDate,
                "to": $scope.endDate
            }).then(function(result) {
                if (result.data.details.keys.length == 0) {
                    $scope.errorMsg = msgService.no_data;
                    $scope.tablenodata = true;
                } else {
                    $scope.thItems = result.data.details.keys;
                    $scope.detailsData = result.data.details.detail;
                    $scope.totleData = result.data.details.detail[$scope.detailsData.length - 1];
                    $scope.detailsData.pop();
                    $scope.totalList = result.data.listSize;
                    $scope.setDetail();
                }
                $scope.tableloading = false;
            })
        };
        $scope.setDetail = function() {
            var limit = ($scope.pageNum - 1) * 10;
            $scope.tdDetails = $scope.detailsData.slice(limit, limit + 10);
        };
        $scope.updateView = function() {
            $scope.rankChart();
            $scope.tableData($scope.tableNum);
            $scope.setTrendChart($scope.trendNum);
        };
        $scope.init = function() {
            $scope.pageNum = 1;
            $scope.maxSize = 5;
            $scope.paramChannel = [];
            $scope.paramModel = [];
            $scope.paramCountry = [];
            $scope.paramState = [];
            $scope.tableNum = 0;
            $scope.trendNum = 0;
            $scope.errorMsg = msgService.no_data;
            $scope.startDate = moment().subtract(30, 'days').format('YYYY/MM/DD');
            $scope.endDate = moment().subtract(1, 'days').format('YYYY/MM/DD');
            $scope.getCondition();
        };
        $scope.init();
    }
]);
