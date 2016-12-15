var scope = ["$scope", "ModalAlert", "chartAPI", '$location', "serviceAPI", "urlAPI",'$stateParams',
  function($scope, ModalAlert, chartAPI,  $location, serviceAPI, urlAPI, $stateParams) {
    $scope.seachParam = {
        "startTime": moment().subtract(6, 'days').format('YYYY-MM-DD'),
        "endTime": moment().format('YYYY-MM-DD'),
        "placement": $stateParams.param,//接收manegement页面的参数
        "selectDateType": "week",
        "currentPage": 0
    };
    $scope.loadList = function() {

        serviceAPI.loadData(urlAPI.campaign_placement_list,$scope.seachParam).then(function(result) {
            $scope.list = JSON.parse(result.sourceDataArr);
            $scope.legend = result.legendDataArr;
            $scope.xAxisData = result.xAxisDataArr;
            $scope.yAxisData = result.yAxisDataArr;
            $scope.beginData = result.beginDataArr;
            $scope.betweenData = result.betweenDataArr;
            $scope.endData = result.endDataArr;
            $scope.dataValue = result.dataValueList;
            $scope.chart.setOption(chartAPI.getCampaign( $scope.xAxisData,$scope.yAxisData,$scope.beginData,$scope.betweenData,$scope.endData,$scope.dataValue));
            window.onresize = function () {
                $scope.chart.resize();
            };
        }).
        catch(function(result) {});
    };
    $scope.chart = chartAPI.getInitChart('echart-bar');
    $scope.loadPlaceList = function() {
        serviceAPI.loadData(urlAPI.campaign_place_list,{packageName: ''}).then(function(result) {
            $scope.placeList = result.placeList;
        }).
        catch(function(result) {});
    };
    $scope.loadPlaceList();
    $scope.typeFilter = function(event,vo) {
        $scope.seachParam.placement = vo.name;
        $scope.loadList();
        $(event.target).addClass('active').siblings().removeClass('active');
    };
    $scope.weekDate = function(event) {
        $scope.seachParam.selectDateType = "week";
        $(event.target).addClass('active').siblings().removeClass('active');
        $scope.loadList();
    };
    $scope.monthDate = function(event) {
        $scope.seachParam.selectDateType = "month";
        $(event.target).addClass('active').siblings().removeClass('active');
        $scope.loadList();
    };
    $scope.setTime = function(start, end) {
        $scope.seachParam.startTime = start.format('YYYY-MM-DD');
        $scope.seachParam.endTime = end.format('YYYY-MM-DD');
        $scope.loadList();
    };
    $scope.previous = function(event){
        if ($scope.seachParam.currentPage > 0) {
            $scope.seachParam.currentPage -= 1;
        }else{
            $scope.seachParam.currentPage = 0;
        };
        $scope.loadList();
    };
    $scope.next = function(){
        $scope.seachParam.currentPage += 1;
        $scope.loadList();
    };
    $scope.changeState = function(vo) {
        var vo1 = vo;
        if (vo1.status == 0) {
           var  alertValue = "Are you sure to turn it ON";
        }else{
            var  alertValue = "Are you sure to turn it OFF";
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
                    if (result.status == -6 && result.result == -6) {
                        ModalAlert.popup({
                            msg: result.msg
                        }, 2500);
                    } else {
                        vo.status = num;
                    }
                }).catch(function() {})
            }
        });
    };
    $scope.getDetail = function(vo) {
        $location.path("/view/campaign/placementList/" + vo.id);
    };
    $scope.priorityOver = function(vo, dom) {
        var target = $(event.target);
        if (target.hasClass('ng-empty')) {
            target.attr('readonly', 'readonly');
        }
    };
    $scope.priorityDate = function(vo) {
        var reg = new RegExp("^[1-9]*$");
        var obj = vo.priority;
        if (obj == undefined) {
            return;
        } else if (obj == '') {
            ModalAlert.popup({
                msg:"The Priority value is necessary"
            }, 2500);
            $scope.loadList();
            return;
        } else if (!reg.test(obj)) {
            ModalAlert.popup({
                msg:"The Priority value should be number and not 0"
            }, 2500);
            $scope.loadList();
            return;
        };
        var saveParam = {
            compainId: vo.id, 
            priority: vo.priority
        }
        serviceAPI.saveData(urlAPI.campaign_placement_priority,saveParam).then(function(result) {
                if (result.status == 0) {
                    $scope.loadList();
                }
            }).catch(function() {})

    };
    $scope.cancel = function(){
        history.go(-1);
    };
    $scope.loadList();
}];
return scope;
