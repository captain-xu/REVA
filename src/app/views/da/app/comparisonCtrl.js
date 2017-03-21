'use strict';

angular.module('app.controller').controller('comparisonCtrl', [
    "$scope", "chartOption", "serviceAPI", "urlAPI", "msgService",
    function($scope, chartOption, serviceAPI, urlAPI, msgService) {
        $scope.getCondition = function() {
            serviceAPI.loadData(urlAPI.report_app_detail_condition).then(function(result) {
                if (result.status == 1) {
                    $scope.condationData = result.data;
                    $scope.setCondition();
                }
            })
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
                $scope.paramState=[];
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
                        console.log($scope.errorMsg);
                    }
                    $scope[load] = false;
                }
            }).catch(function(result) {
                $scope[load] = false;
                $scope[nodata] = true;
                $scope.errorMsg = msgService.system_error;
            });
        };
        $scope.setTrendChart = function() {
            $scope.getEchData(urlAPI.report_app_compar_new_user, 'newtrend', function(result) {
                if (result.trendData.length == 0) {
                    $scope.errorMsg = msgService.no_data;
                    console.log($scope.errorMsg);
                    $scope.newtrendnodata = true;
                    return;
                }
                var option = $scope.getLineOption(result);
                $scope.newtrendChart.setOption(option, true);
            });
            $scope.getEchData(urlAPI.report_app_compar_active_user, 'activetrend', function(result) {
                if (result.trendData.length == 0) {
                    $scope.errorMsg = msgService.no_data;
                    console.log($scope.errorMsg);
                    $scope.activetrendnodata = true;
                    return;
                }
                var option = $scope.getLineOption(result);
                $scope.activetrendChart.setOption(option, true);
            });
            $scope.getEchData(urlAPI.report_app_compar_rate_user, 'ratetrend', function(result) {
                if (result.trendData.length == 0) {
                    $scope.errorMsg = msgService.no_data;
                    console.log($scope.errorMsg);
                    $scope.ratetrendnodata = true;
                    return;
                }
                var option = $scope.getLineOption(result);
                option.legend.show = false;
                option.yAxis.axisLabel = {
                    formatter: "{value}%"
                };
                $scope.ratetrendChart.setOption(option, true);
            });
        };
        $scope.getLineOption = function(result) {
            var option = chartOption.option();
            option.xAxis.data = result.time;
            option.xAxis.boundaryGap = false;
            option.grid = {
                bottom: "30px",
                left: "50px",
                top: "30px",
                right: "30px"
            };
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
            return option;
        };
        $scope.tableData = function(num) {
            $scope.tdDetails = [];
            $scope.totalList = 0;
            $scope.titles = [];
            $scope.subtitle = [];
            $scope.detailsData = [];
            $scope.tableloading = true;
            serviceAPI.loadData(urlAPI.report_app_compar_detail, {
                "channelkey": $scope.paramChannel.toString(),
                "modelkey": $scope.paramModel.toString(),
                "countrykey": $scope.paramCountry.toString(),
                "statekey": $scope.paramState.toString(),
                "from": $scope.startDate,
                "to": $scope.endDate
            }).then(function(result) {
                if (result.data.detail.length == 0) {
                    $scope.errorMsg = msgService.no_data;
                    $scope.tablenodata = true;
                } else {
                    for (var i = 0; i < result.data.detail.length; i++) {
                        var vo = result.data.detail[i];
                        $scope.titles.push(vo.key);
                        $scope.subtitle = $scope.subtitle.concat(['New User', 'Active User', 'Active Rate']);
                        for (var y = 0; y < vo.detail.length; y++) {
                            if (i == 0) {
                                var trdata = [result.data.time[y]];
                                trdata = trdata.concat(vo.detail[y]);
                                $scope.detailsData.push(trdata);
                            } else {
                                var trdata = $scope.detailsData[y];
                                trdata = trdata.concat(vo.detail[y]);
                                $scope.detailsData[y] = trdata;
                            }
                        };

                    };
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
            $scope.tableData();
            $scope.setTrendChart();
        };
        $scope.init = function() {
            $scope.pageNum = 1;
            $scope.maxSize = 5;
            $scope.paramChannel = [];
            $scope.paramModel = [];
            $scope.paramCountry = [];
            $scope.paramState = [];
            $scope.errorMsg = msgService.no_data;
            $scope.startDate = moment().subtract(30, 'days').format('YYYY/MM/DD');
            $scope.endDate = moment().subtract(1, 'days').format('YYYY/MM/DD');
            $scope.getCondition();
            $scope.tableData();
            $scope.setTrendChart();
        };
        $scope.init();
    }
]);
