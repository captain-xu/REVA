var scope = ["$scope", "chartAPI",  "serviceAPI", "urlAPI",
  function($scope, chartAPI, serviceAPI, urlAPI) {
    $scope.seachParam = {
        "startTime": moment().subtract(7, 'days').format('YYYY/MM/DD'),
        "endTime": moment().subtract(1, 'days').format('YYYY/MM/DD'),
        "appId": "",
        "placeId": ""
    };
    $scope.chart = chartAPI.getInitChart('echart-line');
    $scope.chartResponds = chartAPI.getInitChart('responds-line');
    $scope.loadAppList = function() {
        serviceAPI.loadData(urlAPI.campaign_report_app).then(function(result) {
            $scope.appList = result.appList.map(function(data) {
                return {
                    id: data.appId,
                    name: data.name
                }
            });
            $scope.appList.unshift({id:'',name:'All'});
        }).catch(function() {

        })
    };
    $scope.appSel = function() {
        $scope.seachParam.appId = $scope.selectVO.id;
        var appParam = {
            appId: $scope.seachParam.appId
        };
        serviceAPI.loadData(urlAPI.campaign_creative_place,appParam).then(function(result) {
            $scope.placeList = [];
            if (result.placements) {
                $scope.placeList = result.placements.map(function(data) {
                    return {
                        id: data.placementId,
                        name: data.placement
                    }
                });
            }
            $scope.placeList.unshift({id:'',name:'All'});
        }).catch(function() {

        });
        $scope.loadChart();
        $scope.loadResponds();
    };
    $scope.placeSel = function() {
        $scope.seachParam.placeId = $scope.selectVO.id;
        $scope.loadChart();
        $scope.loadResponds();
    };
    $scope.setTime = function(start, end) {
        $scope.seachParam.startTime = start.format('YYYY/MM/DD');
        $scope.seachParam.endTime = end.format('YYYY/MM/DD');
        $scope.loadChart();
    };
    $scope.loadChart = function() {
        serviceAPI.loadData(urlAPI.campaign_responds_line, $scope.seachParam).then(function(result) {
            var legend = ['Null', 'Normal', 'Error'];
            var seriesDate = result.report.series;
            var valueDate = result.report.xAxis.data;
            $scope.chart.hideLoading();
            $scope.chart.setOption(chartAPI.getOption(legend, valueDate, seriesDate, 'By Day'));
        }).catch(function() {

        })
    };
    $scope.loadResponds = function() {
        var respondParam = {
            "appId": $scope.seachParam.appId,
            "placeId": $scope.seachParam.placeId
        };
        serviceAPI.loadData(urlAPI.campaign_responds_respond, respondParam).then(function(result) {
            var legend = ['Null', 'Normal', 'Error'];
            var seriesDate = result.report.series;
            var valueDate = result.report.xAxis.data;
            $scope.chartResponds.hideLoading();
            $scope.chartResponds.setOption(chartAPI.getOption(legend, valueDate, seriesDate, 'Online'));
        }).catch(function() {

        });
    };
    $scope.RespondsInterval = function() {
        setInterval(function() {
            $scope.loadResponds();
        }, 5 * 60 * 1000)
    };
    $scope.init = function() {
        $scope.loadAppList();
        $scope.loadChart();
        $scope.loadResponds();
        $scope.RespondsInterval();
    };
    $scope.init();

}];
return scope;
