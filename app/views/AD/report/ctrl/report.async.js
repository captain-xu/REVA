var scope = ["$scope", "chartAPI",  "serviceAPI", "urlAPI",
  function($scope, chartAPI, serviceAPI, urlAPI) {
    $scope.seachParam = {
        "startTime": moment().subtract(6, 'days'),
        "endTime": moment(),
        "eventType": 1,
        "adId": "",
        "placeId": "",
        "currentPage": "1",
        "pageSize": 20
    };
    $scope.tyleLIst = [{
        id: 1,
        name: "Impressions",
        istitle: false
    }, {
        id: 2,
        name: "Clicks",
        istitle: false
    }, {
        id: 3,
        name: "Downloads",
        istitle: false
    }, {
        id: 1,
        name: "Impressions",
        istitle: false
    }];
    $scope.orderField = 'imp';
    $scope.desc = true;
    $scope.chart = chartAPI.getInitChart('echart-line');
    $scope.loadCamList = function() {
        serviceAPI.loadData(urlAPI.campaign_creative_camp).then(function(result) {
            $scope.camList = result.operList.map(function(data) {
                return {
                    id: data.id,
                    name: data.name
                }
            });
            $scope.camList.unshift({id:'',name:'All'});
        }).catch(function() {

        })
    };
    $scope.setTime = function(start, end) {
        $scope.seachParam.startTime = start.format('YYYY-MM-DD');
        $scope.seachParam.endTime = end.format('YYYY-MM-DD');
        $scope.loadChart();
        $scope.loadList();
    };
    $scope.placeSel = function() {
        $scope.seachParam.placeId = $scope.selectVO.id;
        $scope.loadChart();
    };
    $scope.camSel = function() {
        $scope.seachParam.adId = $scope.selectVO.id;
        var camParam = {
            operationId: $scope.seachParam.adId
        }
        serviceAPI.loadData(urlAPI.campaign_creative_place,camParam).then(function(result) {
            $scope.placeList = result.placements.map(function(data) {
                return {
                    id: data.placementId,
                    name: data.placement
                }
            });
            $scope.placeList.unshift({id:'',name:'All'});
        }).catch(function() {

        });
        $scope.loadChart();
    };
    $scope.typeClick = function() {
        $scope.seachParam.eventType = $scope.selectVO.id;
        $scope.loadChart();
    };
    $scope.orderBy = function(str) {
        $scope.orderField = str;
        $scope.desc = !$scope.desc;
    };
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_report_list,$scope.seachParam).then(function(result) {
            if (result.status == 0) {
                $scope.dataList = result.reports;
                $scope.totalItems = result.totalCount;
            }
        }).catch(function() {

        })
    };
    $scope.loadChart = function() {
        serviceAPI.loadData(urlAPI.campaign_report_chart,$scope.seachParam).then(function(result) {
            var legend = [];
            var seriesDate = [];
            var valueDate = [];
            for (var i = 0; i < result.pids.length; i++) {
                var vo = result.pids[0];
                legend.push(vo.pName);
                var series = {
                    name: vo.pName,
                    type: 'line',
                    data: [],
                    symbol: "circle",
                    symbol: "circle",
                    symbolSize: [10, 10]
                };
                for (var y = 0; y < vo.reports.length; y++) {
                    var vo1 = vo.reports[y];
                    var num = valueDate.indexOf(vo1.date);
                    if (num > 0) {
                        var arr = series.date.slice
                        series.date = 0;
                    } else {
                        valueDate = setValueDate(valueDate, vo1.date);
                        num = valueDate.indexOf(vo1.date);
                        series.date = setSeriesDate(series.data, vo1.count, num);
                    }
                };
                seriesDate.push(series);
            };
            $scope.chart.hideLoading();
            $scope.chart.setOption(chartAPI.getOption(legend, valueDate, seriesDate));
        }).catch(function() {

        })
    };

    function setSeriesDate(arr, value, index) {
        if (index == 0 && arr.length == 0) {
            arr.push(value);
            return arr;
        } else if (arr.length < index) {
            for (var i = arr.length; i < index; i++) {
                arr.push(0);
            }
            arr.push(value);
            return arr;
        } else if (arr.length >= index) {
            arr[index] = value;
            return arr;
        }
    };

    function setValueDate(arr, value) {
        arr.push(value);
        arr = arr.sort(function(a, b) {    
            return  new Date(a)  -  new Date(b);
        });
        return arr;
    };
    $scope.init = function() {
        $scope.loadCamList();
        
    };
    $scope.init();
    $scope.loadChart();
    $scope.loadList();

}];
return scope;
