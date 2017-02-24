var scope = ["$scope", "ModalAlert", "chartAPI", '$location', "serviceAPI", "urlAPI", '$stateParams',
    function($scope, ModalAlert, chartAPI, $location, serviceAPI, urlAPI, $stateParams) {
        $scope.placementName = $stateParams.param;
        $scope.seachParam = {
            "startTime": moment().subtract(6, 'days').format('YYYY-MM-DD'),
            "endTime": moment().format('YYYY-MM-DD'),
            "placement": $stateParams.id,
            "selectDateType": "week",
            "currentPage": 0
        };
        $scope.loadList = function() {
            serviceAPI.loadData(urlAPI.campaign_placement_list, $scope.seachParam).then(function(result) {
                $scope.list = JSON.parse(result.sourceDataArr);
                $scope.legend = result.legendDataArr;
                $scope.xAxisData = result.xAxisDataArr;
                $scope.yAxisData = result.yAxisDataArr;
                $scope.beginData = result.beginDataArr;
                $scope.betweenData = result.betweenDataArr;
                $scope.endData = result.endDataArr;
                $scope.dataValue = result.dataValueList;
                $scope.chart.setOption(chartAPI.getCampaign($scope.xAxisData, $scope.yAxisData, $scope.beginData, $scope.betweenData, $scope.endData, $scope.dataValue));
                window.onresize = function() {
                    $scope.chart.resize();
                };
            }).
            catch(function(result) {});
        };
        $scope.chart = chartAPI.getInitChart('echart-bar');
        $scope.loadPlaceList = function() {
            serviceAPI.loadData(urlAPI.campaign_place_list, { packageName: '' }).then(function(result) {
                $scope.placeList = result.placeList;
            }).
            catch(function(result) {});
        };
        $scope.typeFilter = function(vo) {
            $scope.placementName = vo.name;
            $scope.seachParam.placement = vo.placementId;
            $scope.loadList();
        };
        $scope.setTime = function(start, end) {
            $scope.seachParam.startTime = start.format('YYYY-MM-DD');
            $scope.seachParam.endTime = end.format('YYYY-MM-DD');
            $scope.loadList();
        };
        $scope.timeChange = function(str) {
            if (str == 'previous') {
                if ($scope.seachParam.currentPage > 0) {
                    $scope.seachParam.currentPage -= 1;
                } else {
                    $scope.seachParam.currentPage = 0;
                };
            } else {
                $scope.seachParam.currentPage += 1;
            }
            $scope.loadList();
        };
        $scope.timeRange = function(str) {
            $scope.seachParam.selectDateType = str;
            $scope.loadList();
        };
        $scope.changeState = function(vo) {
            var vo1 = vo;
            if (vo1.status == 0) {
                var alertValue = "Are you sure to turn it ON";
            } else {
                var alertValue = "Are you sure to turn it OFF";
            }
            ModalAlert.alert({
                value: alertValue,
                closeBtnValue: "No",
                okBtnValue: "Yes",
                confirm: function() {
                    var num = 0;
                    if (vo.status == 0) {
                        num = 1;
                    };
                    var statusParam = {
                        compainId: vo.id,
                        status: num
                    }
                    serviceAPI.updateData(urlAPI.campaign_placement_state, statusParam).then(function(result) {
                        if (result.result == 200) {
                            vo.status = num;
                        } else {
                            ModalAlert.popup({
                                msg: result.msg
                            }, 2500);
                        }
                    }).catch(function() {})
                }
            });
        };
        $scope.getDetail = function(vo) {
            $location.path("/view/campaign/placementList/" + vo.id);
        };
        $scope.priorityDate = function(vo) {
            var reg = new RegExp("^[1-9]*$");
            var obj = vo.priority;
            if (obj == undefined) {
                return;
            } else if (obj == '') {
                ModalAlert.popup({
                    msg: "The Priority value is necessary"
                }, 2500);
                $scope.loadList();
                return;
            } else if (!reg.test(obj)) {
                ModalAlert.popup({
                    msg: "The Priority value should be number and not 0"
                }, 2500);
                $scope.loadList();
                return;
            };
            var saveParam = {
                compainId: vo.id,
                priority: vo.priority
            }
            serviceAPI.saveData(urlAPI.campaign_placement_priority, saveParam).then(function(result) {
                if (result.result == 200) {
                    $scope.loadList();
                }
            }).catch(function() {})

        };
        $scope.cancel = function() {
            history.go(-1);
        };
        $scope.loadList();
        $scope.loadPlaceList();
    }
];
return scope;
