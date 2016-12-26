var scope = ["$scope", "chartAPI",  "serviceAPI", "urlAPI",
  function($scope, chartAPI, serviceAPI, urlAPI) {
    $scope.seachParam = {
        "startTime": moment().subtract(7, 'days').format('YYYY/MM/DD'),
        "endTime": moment().subtract(1, 'days').format('YYYY/MM/DD'),
        "eventType": 'imp',
        "appId": "",
        "placeId": "",
        "adId": "",
        "currentPage": 1,
        "pageSize": 20
    };
    $scope.tyleLIst = [{
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
        id: 'imp',
        name: "Impression",
        istitle: false
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
        serviceAPI.loadData(urlAPI.campaign_report_camp,appParam).then(function(result) {
            $scope.camList = [];
            if (result.adList) {
                $scope.camList = result.adList.map(function(data) {
                    return {
                        id: data.operationId,
                        name: data.name
                    }
                });
            }
            $scope.camList.unshift({id:'',name:'All'});
        }).catch(function() {

        });
        $scope.loadChart();
    };
    $scope.camSel = function() {
        $scope.seachParam.adId = $scope.selectVO.id;
        var adParam = {
            operationId: $scope.seachParam.adId
        };
        serviceAPI.loadData(urlAPI.campaign_creative_place,adParam).then(function(result) {
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
                var vo = result.reports;
                var series = {
                    type: 'line',
                    data: [],
                    symbol: "circle",
                    symbol: "circle",
                    symbolSize: [10, 10]
                };
                for (var y = 0; y < vo.length; y++) {
                    var vo1 = vo[y];
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
            $scope.chart.hideLoading();
            $scope.chart.setOption(chartAPI.getOption('', valueDate, seriesDate));
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
        $scope.loadAppList();
        $scope.loadChart();
        $scope.loadList();
    };
    $scope.init();

}];
return scope;
