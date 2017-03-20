'use strict';

angular.module('app.controller').controller('daDashboardCtrl', [
    "$scope", "chartOption", "serviceAPI", "urlAPI",'msgService',
    function($scope, chartOption, serviceAPI, urlAPI,msgService) {
        $scope.loadHeadData = function(num) {
            $scope.getStaticState(urlAPI.report_device_total, 'cumulative');
            $scope.getStaticState(urlAPI.report_device_newincrese, 'newincrese');
            $scope.getStaticState(urlAPI.report_device_daily, 'daily');
            $scope.getStaticState(urlAPI.report_device_hotmodel, 'hotmodel');
            $scope.getStaticState(urlAPI.report_device_hotregion, 'hotregion');
        };
        $scope.getStaticState = function(url, state) {
            $scope[state + 'loading'] = true;
            serviceAPI.loadData(url).then(function(result) {
                if (result.status == 1 && result.code == 200) {
                    $scope[state + 'Data'] = result.data;
                    $scope[state + 'loading'] = false;
                }
            });
        };
        $scope.trendData = function() {
            $scope.getEchData(urlAPI.report_device_trend, 'trend', function(result) {
                var option = chartOption.option();
                option.xAxis.data = result.trendTime.map(function(data, index) {
                    return index % 2 == 0 ? data : '\n' + data
                });
                option.xAxis.boundaryGap=false,
                option.legend = {
                    data: ["New Device", "Operatable"],
                    show: true,
                    left:'right'
                };
                option.grid = { bottom: "15%", left: "50px", top: "30px",right:"30px" };
                option.series = [{
                    name: "New Device",
                    type: 'line',
                    data: result.totalDevice,

                    symbol: 'circle',
                    symbolSize: 2,
                    animationDelay: function(idx) {
                        return idx * 10;
                    }
                }, {
                    name: "Operatable",
                    type: 'line',
                    data: result.operatorDevice,
                    symbol: 'circle',
                    symbolSize: 2,
                    animationDelay: function(idx) {
                        return idx * 10;
                    }
                }];
                $scope.trendChart.setOption(option);
            });
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
                        $scope.error_msg=msgService.no_data;
                    }
                    $scope[load] = false;
                }
            }).catch(function(result) {
                $scope[load] = false;
                $scope[nodata] = true;
                $scope.error_msg=msgService.system_error;
            });
        };
        $scope.TopChart = function() {
            $scope.modelnodata = false;
            $scope.regionnodata = false;
            $scope.getEchData(urlAPI.report_device_topSales, 'top', function(result) {
                if (result.topModel.length > 0) {
                    var model = result.topModel.sort(function(a, b) {
                        return a.count - b.count
                    });
                    var option = $scope.getBarOption(result.topModel, 'model');
                    option.grid.left = "15%";
                    option.grid.top="8px";
                    $scope.modelChart.setOption(option, true);
                } else {
                    $scope.modelnodata = true;
                }
                if (result.topRegion.length > 0) {
                    var region = result.topRegion.sort(function(a, b) {
                        return a.count - b.count
                    });

                    var option = $scope.getBarOption(region, 'region');
                    option.grid.left = "15%";
                    option.grid.top="8px";
                    $scope.regionChart.setOption(option, true);
                } else {
                    $scope.regionnodata = true;
                }

            })
        };

        $scope.getBarOption = function(result, key) {
            var option = chartOption.option();
            option.xAxis = {
                type: 'value',
                boundaryGap: [0, 0.01]
            };
            option.yAxis = {
                type: 'category',
                data: result.map(function(data) {
                    return data[key]
                })
            }
            option.series = [{
                name: "Sales",
                type: 'bar',
                data: result.map(function(data) {
                    return data.count
                }),
                label: {
                    normal: {
                        show: true,
                        position: 'right'
                    }
                },
                animationDelay: function(idx) {
                    return idx * 10;
                }
            }];
            return option;
        };
        $scope.TabChart = function() {
            /*Telecom Operator*/
            $scope.getEchData(urlAPI.report_device_operator, 'operator', function(result) {
                 var option = $scope.getPieOption('Sales', result);
                $scope.setHollowPie(option, "operatorChart")
            });
            /*deviceLaungage */
            $scope.getEchData(urlAPI.report_device_language, 'language', function(result) {
                var option = $scope.getPieOption('Laungage', result);
                $scope.setHollowPie(option, "languageChart")
                    // $scope.languageChart.setOption($scope.getPieOption('Laungage', result), true);
            });
            /*AndroidVersion*/
            $scope.getEchData(urlAPI.report_device_android_version, 'android', function(result) {
                var option = $scope.getPieOption('AndroidVersion', result);
                $scope.setHollowPie(option, "androidChart")
            });
            /*Resolution*/
            $scope.getEchData(urlAPI.report_device_resolution, 'resolution', function(result) {
                var option = $scope.getPieOption('Resolution', result);
                $scope.setHollowPie(option, "resolutionChart")
            });
        };
        $scope.getPieOption = function(name, result) {
            var option = chartOption.pieOption();
            option.series.name = name;
            option.tooltip.show = false;
            option.series.data = result.map(function(data) {
                return {
                    name: data.key,
                    value: data.value
                }
            });
            return option;
        };
        $scope.setHollowPie = function(option, instance) {
            option.series.radius = ['60%', '90%'];
            option.series.avoidLabelOverlap = false;
            option.series.label = {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '16'
                    },
                    formatter: '{b}\n{c}\n({d}%)'
                }
            };

            $scope[instance].setOption(option, true);
        };
        $scope.init = function() {
            // $scope.initModelChart();
            // $scope.initMap();
            $scope.error_msg=msgService.no_data;
            $scope.trendData();
            $scope.loadHeadData();
            $scope.TopChart();
            $scope.TabChart();
        };
        $scope.init();
    }
]);
