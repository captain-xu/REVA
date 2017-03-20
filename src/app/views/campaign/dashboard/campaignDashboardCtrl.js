'use strict';

angular.module('app.controller').controller('campaignDashboardCtrl', [
    "$scope", "serviceAPI","urlAPI", "msgService",
    function($scope, serviceAPI, urlAPI, msgService) {
    $scope.startTime = moment().subtract(30, 'days').format('YYYY/MM/DD');
    $scope.endTime = moment().subtract(1, 'days').format('YYYY/MM/DD');
    $scope.type = 'click';
    var lineChart = echarts.init(document.getElementById('chart-line'));
    var barChart = echarts.init(document.getElementById('chart-bar'));
    var pieChart = echarts.init(document.getElementById('chart-pie'));
    var campChart = echarts.init(document.getElementById('camp-chart'));
    var brandChart = echarts.init(document.getElementById('brand-chart'));

    $scope.setTime = function(start, end){
        $scope.startTime = start;
        $scope.endTime = end;
        $scope.init();
    };
    $scope.loadList = function(){
        var dataParam = {
            startDate: $scope.startTime,
            endDate: $scope.endTime
        };
        $scope.viewloading = true;
        $scope.viewnodata = false;
        $scope.camploading = true;
        $scope.campnodata = false;
        $scope.brandloading = true;
        $scope.brandnodata = false;
        serviceAPI.loadData(urlAPI.campaign_dashboard_data,dataParam).then(function(result){
            if (result.result === 200) {
                $scope.rate = result;
                $scope.viewloading = false;
                $scope.viewnodata = true;
            }
        });
        serviceAPI.loadData(urlAPI.campaign_dashboard_camp,dataParam).then(function(result){
            if (!result.campData || !result.campData.data) {
                $scope.campData = [];
                $scope.campX = [];
                $scope.camploading = false;
                $scope.campnodata = true;
                $scope.errorMsg = msgService.no_data;
            } else {
                $scope.campData = result.campData.data.reverse();
                $scope.campX = result.campData.campaign.reverse();
                $scope.camploading = false;
                $scope.campnodata = false;
            }
            $scope.campOption = $scope.getRevanueChart($scope.campX, $scope.campData);
            campChart.setOption($scope.campOption);
        });
        serviceAPI.loadData(urlAPI.campaign_dashboard_brand,dataParam).then(function(result){
            if (!result.brandData || !result.brandData.data) {
                $scope.brandData = [];
                $scope.brandX = [];
                $scope.brandloading = false;
                $scope.brandnodata = true;
                $scope.errorMsg = msgService.no_data;
            } else {
                $scope.brandData = result.brandData.data.reverse();
                $scope.brandX = result.brandData.brandModel.map(function(brandModel) {
                    return  brandModel.brand + '&' + brandModel.model ;
                }).reverse();
                $scope.brandloading = false;
                $scope.brandnodata = false;
            }
            $scope.brandOption = $scope.getRevanueChart($scope.brandX, $scope.brandData);
            brandChart.setOption($scope.brandOption);
        });
    };
    // summary chart init
    $scope.loadChart = function(){
        var chartParam = {
            type: $scope.type, 
            startDate: $scope.startTime, 
            endDate: $scope.endTime
        }
        $scope.summaryloading = true;
        $scope.summarynodata = false;
        serviceAPI.loadData(urlAPI.campaign_dashboard_line,chartParam).then(function(result){
            if (!result.appData || !result.appData.series) {
                $scope.lineSeries = [];
                $scope.lineX = [];
                $scope.summaryloading = false;
                $scope.summarynodata = true;
                $scope.errorMsg = msgService.no_data;
            } else {
                $scope.lineSeries = result.appData.series.map(function(series) {
                    return {
                            name: series.appName,
                            type: 'line',
                            smooth: true,
                            data: series.data
                        }
                });
                $scope.lineX = result.appData.statisticalDate;
                $scope.summaryloading = false;
                $scope.summarynodata = false;
            }
            $scope.lineOption = $scope.getLineChart($scope.lineX,$scope.lineSeries);
            lineChart.setOption($scope.lineOption, true);
        });
        serviceAPI.loadData(urlAPI.campaign_dashboard_bar,chartParam).then(function(result){
            if (!result.appData || !result.appData.data) {
                $scope.barData = [];
                $scope.barX = [];
            } else {
                $scope.barData = result.appData.data;
                $scope.barX = result.appData.app;
            }
            $scope.barOption = $scope.getBarChart($scope.barX,$scope.barData);
            barChart.setOption($scope.barOption);
        });
        serviceAPI.loadData(urlAPI.campaign_dashboard_pie,chartParam).then(function(result){
            if (!result.appData || !result.appData.data) {
                $scope.pieData = [];
            } else {
                $scope.pieData = result.appData.data;
            }
            $scope.pieOption = $scope.getPieChart($scope.pieData);
            pieChart.setOption($scope.pieOption);
        });
    };

    $scope.typeData = function(type){
        $scope.type = type;
        $scope.loadChart();
    };

    //get chart data
    $scope.getLineChart = function(x,data){
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: x
            },
            yAxis: {
                type: 'value'
            },
            series: data
        };
        return option;
    };
    $scope.getBarChart = function(x, data){
        var option = {
            tooltip : {
                trigger: 'axis',
                formatter: "{b} : {c}",
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : x ,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    type:'bar',
                    barWidth: '30',
                    data:data
                }
            ]
        };
        return option;
    };
    $scope.getPieChart = function(data){
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            series : [
                {
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return option;
    };


    // top five chart init
    $scope.getRevanueChart = function(x,str){
        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: "{b} : {c}"
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: x
            },
            series: [
                {
                    type: 'bar',
                    barWidth: '30',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                var colorList = ['rgba(85,197,60,.6)','rgba(85,197,60,.7)', 'rgba(85,197,60,.8)', 'rgba(85,197,60,.9)', 'rgba(85,197,60,1)'];
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                    data: str
                }
            ]
        };
        return option;
    };

    //change chart style
    $scope.changeChart = function(dom, num){
        $(dom.target).addClass('btn-info').removeClass('btn-default').siblings().removeClass('btn-info').addClass('btn-default');
        if (num == 0) {
            $("#chart-bar").css('z-index', '1');
            $("#chart-line").css('z-index', '0');
            $("#chart-pie").css('z-index', '0');
        } else if (num == 1) {
            $("#chart-bar").css('z-index', '0');
            $("#chart-line").css('z-index', '1');
            $("#chart-pie").css('z-index', '0');
        } else {
            $("#chart-bar").css('z-index', '0');
            $("#chart-line").css('z-index', '0');
            $("#chart-pie").css('z-index', '1');
        }
    };
//unique List start
    $scope.uniques = {
        page: 1,
        field: 'appName'
    };
    $scope.loadUniqueList = function(){
        var uniqueParam = {
            startDate: $scope.startTime,
            endDate: $scope.endTime,
            currentPage: $scope.uniques.page,
            orderBy: $scope.uniques.field
        };
        $scope.uniqueloading = true;
        $scope.uniquenodata = false;
        serviceAPI.loadData(urlAPI.campaign_dashboard_unique,uniqueParam).then(function(result){
            var pageStart = (($scope.uniques.page - 1) * 10); 
            var pageEnd = $scope.uniques.page * 10; 
            var sortBy = function(x, y) {
                return (x[$scope.uniques.field] < y[$scope.uniques.field]) ? 1 : -1;

            };
            $scope.uniques.list = result.dataList.sort(sortBy).slice(pageStart, pageEnd);
            $scope.uniques.count = result.dataList.length;
            $scope.uniqueloading = false;
            $scope.uniquenodata = false;
            if (!$scope.uniques.list || $scope.uniques.list.length === 0) {
                $scope.uniqueloading = false;
                $scope.uniquenodata = true;
                $scope.errorMsg = msgService.no_data;
            }
        });

    };
    // 排序
    $scope.orderUnique = function(str) {
        if ($scope.uniques.field != str) {
            $scope.uniques.field = str;
            $scope.loadUniqueList();
        }
    };

//unique List end

//report List start
    $scope.reports = {
        page: 1,
        name: 'Campaign',
        channel1Id: '',
        channel2Id: '',
        order: 'conversion',
        appId: '',
        placementId: ''
    }
    $scope.loadReportList = function(){
        var reportParam = {
            startDate: $scope.startTime,
            endDate: $scope.endTime,
            type: $scope.reports.name,
            currentPage: $scope.reports.page,
            orderBy: $scope.reports.order,
            channelId1: $scope.reports.channel1Id,
            channelId2: $scope.reports.channel2Id,
            appId: $scope.reports.appId,
            placementId: $scope.reports.placementId
        };
        $scope.reportsloading = true;
        $scope.reportsnodata = false;
        serviceAPI.loadData(urlAPI.campaign_dashboard_list,reportParam).then(function(result){
            $scope.reports.list = result.dataList;
            $scope.reports.count = result.totalCount;
            $scope.reportsloading = false;
            $scope.reportsnodata = false;
            if (!$scope.reports.list || $scope.reports.list.length === 0) {
                $scope.reportsloading = false;
                $scope.reportsnodata = true;
                $scope.errorMsg = msgService.no_data;
            }
        });

    };
    // 排序
    $scope.orderBy = function(str) {
        if ($scope.reports.order != str) {
            $scope.reports.order = str;
            $scope.loadReportList();
        }
    };

    //根据 report 筛选
    $scope.reportBy = function(str) {
        $scope.reports.name = str;
        $scope.reports.order = 'conversion';
        if ($scope.reports.name == 'Channel') {
            serviceAPI.loadData(urlAPI.campaign_dashboard_channel1).then(function(result){
                $scope.channel1List = result.channel1List;
            });
            $scope.reports.appId = '';
            $scope.reports.placementId = '';
        } else if ($scope.reports.name == 'Placement') {
            serviceAPI.loadData(urlAPI.campaign_report_app).then(function(result){
                $scope.appList = result.appList;
            });
            $scope.reports.channel1Id = '';
            $scope.reports.channel2Id = '';
        } else {
            $scope.reports.channel1Id = '';
            $scope.reports.channel2Id = '';
            $scope.reports.appId = '';
            $scope.reports.placementId = '';
        }
        $scope.loadReportList();
    };
    //根据 channel 筛选
    $scope.channel1Data = function(channel1) {
        $scope.reports.channel1Id = channel1 ? channel1 : '';
        $scope.reports.channel2Id = '';
        serviceAPI.loadData(urlAPI.campaign_dashboard_channel2, {channelId1: $scope.reports.channel1Id}).then(function(result){
            $scope.channel2List = result.channel2List;
        });
        $scope.loadReportList();
    };
    $scope.channel2Data = function(channel2) {
        $scope.reports.channel2Id = channel2 ? channel2 : '';
        $scope.loadReportList();
    };
    //根据placement筛选
    $scope.appData = function(app) {
        $scope.reports.appId = app ? app : '';
        $scope.reports.placementId = '';
        serviceAPI.loadData(urlAPI.campaign_report_placement, {appId: $scope.reports.appId}).then(function(result){
            $scope.placementList = result.placeList;
        });
        $scope.loadReportList();
    };
    $scope.placementData = function(place) {
        $scope.reports.placementId = place ? place : '';
        $scope.loadReportList();
    };
//report List end

// export as csv
    $scope.exportCsv = function(str) {
        if (str === "unique") {
            var uniqueParam = {
                startDate: $scope.startTime,
                endDate: $scope.endTime
            };
            serviceAPI.loadData(urlAPI.campaign_dashboard_uniqueCsv, uniqueParam).then(function(result){
                if (result.viewUrl) {
                    window.location = result.viewUrl;
                }
            }); 
        } else {
            var reportParam = {
                startDate: $scope.startTime,
                endDate: $scope.endTime,
                type: $scope.reports.name,
                orderBy: $scope.reports.order,
                channelId1: $scope.reports.channel1Id,
                channelId2: $scope.reports.channel2Id
            };
            serviceAPI.loadData(urlAPI.campaign_dashboard_reportCsv, reportParam).then(function(result){
                if (result.viewUrl) {
                    window.location = result.viewUrl;
                }
            }); 
        }
    }
    
    $scope.init = function(){
        $scope.loadList();
        //init summary chart
        $scope.loadChart();
        //init unique List
        $scope.loadUniqueList();
        //init report List
        $scope.loadReportList();
        window.onresize = function () {
            brandChart.resize();
            campChart.resize();
            lineChart.resize();
            barChart.resize();
            pieChart.resize();
        }

    };
    $scope.init();


}])
