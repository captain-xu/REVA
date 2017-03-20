var scope = ["$scope", "chartAPI",  "serviceAPI", "urlAPI",
  function($scope, chartAPI, serviceAPI, urlAPI) {
    $scope.seachParam = {
        "startTime": moment().subtract(7, 'days').format('YYYY/MM/DD'),
        "endTime": moment().subtract(1, 'days').format('YYYY/MM/DD'),
        "eventType": 'imp',
        "appId": "",
        "placeId": "",
        "type": 'ALL',
        "currentPage": 1,
        "pageSize": 20
    };
    $scope.typeList = [{
        id: 'imp',
        name: "Impression",
        istitle: false
    }, {
        id: 'click',
        name: "Click",
        istitle: false
    }, {
        id: 'download',
        name: "Download",
        istitle: false
    }, {
        id: 'revenue',
        name: "Revenue",
        istitle: false
    }, {
        id: 'conversion',
        name: "Conversion",
        istitle: false
    }, {
        id: 'request',
        name: "Request",
        istitle: false
    }, {
        id: 'imp',
        name: "Impression",
        istitle: false
    }];
    $scope.placementList = [{
        name: 'ALL', 
        id: 'ALL'
    }, {
        name: 'REVA', 
        id: 'REVA'
    }, {
        name: 'Facebook', 
        id: 'Facebook'
    }];
    $scope.orderField = 'imp';
    $scope.desc = true;
    $scope.chart = chartAPI.getInitChart('echart-line');
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
    };
    $scope.placeSel = function() {
        $scope.seachParam.placeId = $scope.selectVO.id;
        $scope.loadChart();
    };
    $scope.typeClick = function() {
        $scope.seachParam.eventType = $scope.selectVO.id;
        $scope.loadChart();
    };
    $scope.setTime = function(start, end) {
        $scope.seachParam.startTime = start.format('YYYY/MM/DD');
        $scope.seachParam.endTime = end.format('YYYY/MM/DD');
        $scope.loadChart();
        $scope.loadList();
    };
    $scope.placementSel = function() {
        $scope.seachParam.type = $scope.selectVO.id;
        $scope.loadList();
    };
    $scope.orderBy = function(str) {
        $scope.orderField = str;
        $scope.desc = !$scope.desc;
    };
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_report_list,$scope.seachParam).then(function(result) {
            if (result.result == 200) {
                $scope.dataList = result.reports;
                $scope.totalItems = result.totalCount;
            }
        }).catch(function() {

        })
    };
    $scope.loadChart = function() {
        serviceAPI.loadData(urlAPI.campaign_report_chart,$scope.seachParam).then(function(result) {
            var legend = ['ALL', 'REVA', 'Facebook'];
            var seriesDate = result.report.series;
            var valueDate = result.report.xAxis.data;
            $scope.chart.hideLoading();
            $scope.chart.setOption(chartAPI.getOption(legend, valueDate, seriesDate));
        }).catch(function() {

        })
    };
    $scope.exportCsv = function() {
        var csvParam = {
            startTime: $scope.seachParam.startTime,
            endTime: $scope.seachParam.endTime,
            type: $scope.seachParam.type
        };
        serviceAPI.loadData(urlAPI.campaign_report_csv, csvParam).then(function(result) {
            if (result.viewUrl) {
                window.location = result.viewUrl;
            }
        });
    };
    $scope.init = function() {
        $scope.loadAppList();
        $scope.loadChart();
        $scope.loadList();
    };
    $scope.init();

}];
return scope;
