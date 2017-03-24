'use strict';
angular.module('app.controller').controller('launcherCtrl', [
    "$scope", "chartOption", "serviceAPI", "urlAPI", "msgService",
    function($scope, chartOption, serviceAPI, urlAPI, msgService) {
        $scope.param = {
            channelkey: '',
            type: '',
            from: moment().subtract(30, 'days').format('YYYY/MM/DD'),
            to: moment().subtract(1, 'days').format('YYYY/MM/DD'),
            pageNum: 1,
            pageSize: 10
        };
        $scope.getCondition = function() {
            serviceAPI.loadData(urlAPI.report_revenue_condition).then(function(result) {
                if (result.status == 1) {
                    $scope.channelData = result.data.condition.channel;
                    $scope.productType = result.data.condition.productType;
                }
            });
        };
        $scope.chartData = function() {
            $scope.trendloading = true;
            serviceAPI.loadData(urlAPI.report_revenue_daily, $scope.param).then(function(result) {
                if (result.status == 1) {
                    result = result.data.daily;
                    $scope.trendloading = false;
                    if (result.trend.length == 0) {
                        $scope.trendnodata = true;
                        $scope.errorMsg = msgService.no_data;
                    } else {
                        var option = chartOption.option();
                        option.title = {
                            text: 'Total:' + result.totalRevenue
                        };
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
                        option.grid = {
                            bottom: "15%",
                            left: "50px",
                            top: "50px",
                            right: "30px"
                        };
                        option.series = {
                            name: 'Revenue',
                            type: 'line',
                            data: result.trend,
                            symbol: 'circle',
                            symbolSize: 2
                        };
                        $scope.trendChart.setOption(option);
                    }
                }
            });
        };
        $scope.tableData = function() {
            serviceAPI.loadData(urlAPI.report_revenue_detail, $scope.param).then(function(result) {
                if (result.status == 1) {
                    if (result.data.recordCount > 0) {
                        $scope.totalList = result.data.recordCount;
                        $scope.items = result.data.details;
                        if ($scope.param.pageNum == 1) {
                            $scope.total = result.data.total;
                        }
                    } else {
                        $scope.tablenodata = true;
                        $scope.errorMsg = msgService.no_data;
                    }

                }
            })
        };
        $scope.updateView = function() {
            $scope.param.pageNum = 1;
            $scope.chartData();
            $scope.tableData();
        };
        $scope.setTime = function(start, end) {
            $scope.param.from = start;
            $scope.param.to = end;
            $scope.updateView();
        };
        $scope.getCondition();
        $scope.updateView();
    }
])
