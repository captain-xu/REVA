'use strict';

angular.module('app.controller').controller('appOverCtrl', [
    "$scope", "chartOption", "serviceAPI", "urlAPI", 'msgService',
    function($scope, chartOption, serviceAPI, urlAPI, msgService) {
        $scope.loadHeadData = function(num) {
            serviceAPI.loadData(urlAPI.report_app_over_basic).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope.headData = result.data.basicInfo;
                }
            });
        };
        $scope.appChart = function() {
            $scope.getEchData(urlAPI.report_app_over_new, 'appnew', function(result) {
                var option = $scope.getOption(result);
                $scope.appnewChart.setOption(option);
            });
            $scope.getEchData(urlAPI.report_app_over_active, 'appactive', function(result) {
                var option = $scope.getOption(result);
                $scope.appactiveChart.setOption(option);
            });
            $scope.getEchData(urlAPI.report_app_over_active_rate, 'apprate', function(result) {
                var option = $scope.getOption(result);
                option.yAxis.axisLabel = {
                    formatter: '{value} %'
                };
                $scope.apprateChart.setOption(option);
            });
        };
        $scope.changeApp = function() {
            $scope.eachData('newData', "modelnewChart");
            $scope.eachData('activeData', "modelactiveChart");
            $scope.eachData('rateData', "modelrateChart");
        };
        $scope.eachData = function(items, instance) {
            for (var i = 0; i < $scope[items].length; i++) {
                if ($scope.appName == $scope[items][i].app) {
                    $scope.setOption({
                        time: $scope[items][i].time,
                        trendData: $scope[items][i].trendData
                    }, instance)
                }
            }
        };
        $scope.setOption = function(result, instance) {
            var option = $scope.getOption(result);
            if (instance == "modelrateChart") {
                option.yAxis.axisLabel = {
                    formatter: '{value} %'
                };
            };
            $scope[instance].setOption(option, true);
        };
        $scope.modelChart = function() {
            $scope.getEchData(urlAPI.report_app_over_model_new, 'modelnew', function(result) {
                $scope.newData = result;
                $scope.appData = result.map(function(data) {
                    return data.app;
                });
                $scope.appName = $scope.appData[0];
                $scope.setOption({
                    time: $scope.newData[0].time,
                    trendData: $scope.newData[0].trendData
                }, 'modelnewChart');
                $scope.getEchData(urlAPI.report_app_over_model_active, 'modelactive', function(result) {
                    $scope.activeData = result;
                    $scope.eachData("activeData", "modelactiveChart");
                });
                $scope.getEchData(urlAPI.report_app_over_model_rate, 'modelrate', function(result) {
                    $scope.rateData = result;
                    $scope.eachData("rateData", "modelrateChart");
                });
            });

        };
        $scope.getOption = function(result) {
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
            option.xAxis.boundaryGap = false;
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
        $scope.getEchData = function(url, state, cb) {
            var nodata = state + "nodata";
            $scope[nodata] = false;
            var load = state + "loading";
            $scope[load] = true;

            serviceAPI.loadData(url).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    if (!Array.isArray(result.data) || result.data.length > 0) {
                        cb(result.data);
                    } else {
                        var nodata = state + "nodata";
                        $scope[nodata] = true;
                        $scope.error_msg = msgService.no_data;
                    }
                    $scope[load] = false;
                }
            }).catch(function(result) {
                $scope[load] = false;
                $scope[nodata] = true;
                $scope.error_msg = msgService.system_error;
            });
        };
        $scope.init = function() {
            $scope.error_msg = msgService.no_data;
            $scope.appChart();
            $scope.loadHeadData();
            $scope.modelChart();
        };
        $scope.init();
    }
]);
