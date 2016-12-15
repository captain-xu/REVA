var scope = ["$scope", "serviceAPI","urlAPI",
    function($scope, serviceAPI,urlAPI) {


    $scope.startTime = moment().subtract(30, 'days').format('YYYY/MM/DD');
    $scope.endTime = moment().subtract(1, 'days').format('YYYY/MM/DD');
    $scope.type = 'click';
    $scope.typeName = 'Clicks';
    $scope.setTime = function(start, end){
        $scope.startTime = start.format('YYYY/MM/DD');
        $scope.endTime = end.format('YYYY/MM/DD');
        $scope.init();
    };
    
    $scope.loadList = function(){
        var dataParam = {
            startDate: $scope.startTime,
            endDate: $scope.endTime
        }
        serviceAPI.loadData(urlAPI.campaign_dashboard_data,dataParam).then(function(result){
            $scope.rate = result;
            if (result.appStatistics == '') {
                $scope.statics = {
                    click:'-',
                    conversion:'-',
                    eCPM:'-',
                    imp:'-',
                    request:'-',
                    revenue:'-'
                }
            } else {
                $scope.statics = result.appStatistics;
            }
        });
        serviceAPI.loadData(urlAPI.campaign_dashboard_list,dataParam).then(function(result){
            $scope.dataList = result.dataList;
        });
        serviceAPI.loadData(urlAPI.campaign_dashboard_camp,dataParam).then(function(result){
            if (!result.campData || !result.campData.data) {
                $scope.campData = [];
                $scope.campX = [];
            } else {
                $scope.campData = result.campData.data.reverse();
                $scope.campX = result.campData.campaign.reverse();
            }
            $scope.campOption = $scope.getRevanueChart($scope.campX, $scope.campData);
            campChart.setOption($scope.campOption);
        });
        serviceAPI.loadData(urlAPI.campaign_dashboard_brand,dataParam).then(function(result){
            if (!result.brandData || !result.brandData.data) {
                $scope.brandData = [];
                $scope.brandX = [];
            } else {
                $scope.brandData = result.brandData.data.reverse();
                $scope.brandX = result.brandData.brandModel.map(function(brandModel) {
                    return  brandModel.brand + '&' + brandModel.model ;
                }).reverse();
            }
            $scope.brandOption = $scope.getRevanueChart($scope.brandX, $scope.brandData);
            brandChart.setOption($scope.brandOption);
        });
    };
    $scope.loadChart = function(){
        var chartParam = {
            type: $scope.type, 
            startDate: $scope.startTime, 
            endDate: $scope.endTime
        }
        serviceAPI.loadData(urlAPI.campaign_dashboard_line,chartParam).then(function(result){
            if (!result.appData || !result.appData.series) {
                $scope.lineSeries = [];
                $scope.lineX = [];
            } else {
                $scope.lineSeries = result.appData.series.map(function(series) {
                    return {
                            name: series.appName,
                            type: 'line',
                            data: series.data
                        }
                });
                $scope.lineX = result.appData.statisticalDate;
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

    $scope.typeData = function(str1, str2){
        if ($scope.type != str1) {
            $scope.type = str1;
            $scope.typeName = str2;
            $scope.loadChart();
        }
    };
    // summary chart init
    var lineChart = echarts.init(document.getElementById('chart-line'));
    var barChart = echarts.init(document.getElementById('chart-bar'));
    var pieChart = echarts.init(document.getElementById('chart-pie'));

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
    var campChart = echarts.init(document.getElementById('camp-chart'));
    var brandChart = echarts.init(document.getElementById('brand-chart'));
    $scope.getRevanueChart = function(x,str,len){
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
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
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
    $scope.changeChart = function(dom,num){
        $(dom.target).addClass('active').siblings().removeClass('active');
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
    $scope.desc = 0;
    $scope.orderField = 'conversion';
    $scope.orderBy = function(str) {
        if ($scope.desc == 0) {
            $scope.desc = 1;
        } else {
            $scope.desc = 0;
        };
        $scope.orderField = str;
    };
    $scope.init = function(){
        $scope.loadList();
        //init summary chart
        $scope.loadChart();
        window.onresize = function () {
            brandChart.resize();
            campChart.resize();
            lineChart.resize();
            barChart.resize();
            pieChart.resize();
        }

    };
    $scope.init();


}];
return scope;
