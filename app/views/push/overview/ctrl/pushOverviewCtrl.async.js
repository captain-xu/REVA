var scope = ["$scope", "serviceAPI", "$stateParams",'urlAPI',
    function($scope, serviceAPI, $stateParams, urlAPI) {

    $scope.param = {
        pushId: $stateParams.id
    } 
    
    $scope.loadList = function(){
        serviceAPI.loadData(urlAPI.push_overview,$scope.param).then(function(result){
            $scope.plan = result.data;
            if ($scope.plan.pushType == 1) {
                $scope.planData = $scope.plan.notification;
                $scope.totalData = $scope.plan.ntfTotal;
            } else if ($scope.plan.pushType == 2){
                $scope.planData = $scope.plan.inapp;
                $scope.totalData = $scope.plan.inTotal;
            } else {
                $scope.planData = $scope.plan.inapp;
                $scope.totalData = $scope.plan.inTotal;
            }
            $scope.pushType = result.data.pushType;
            $scope.percent();
        });
        $scope.loadChart();
        $scope.loadTable();
    };
    $scope.loadChart = function(){
        serviceAPI.loadData(urlAPI.push_arrive,$scope.param).then(function(result){
            $scope.arrive = result.data;
            $scope.arriveX = result.data.pushDate;
            $scope.arriveStart = result.data.pushDate.length - 8;
            $scope.arriveEnd = result.data.pushDate.length;
            if ($scope.arrive.pushType == 1) {
                $scope.arriveData = result.data.notification;
                $scope.arriveTotal = result.data.ntfTotal;
            } else if ($scope.arrive.pushType == 2){
                $scope.arriveData = result.data.inapp;
                $scope.arriveTotal = result.data.inTotal;
            } else {
                $scope.arriveData = result.data.inapp;
                $scope.arriveTotal = result.data.inTotal;
            };
            if ($scope.arriveData.A && $scope.arriveData.B && $scope.arriveData.C) {
                $scope.arrivePlan = ['PlanA','PlanB','PlanC','Total']
            } else if ($scope.arriveData.A && $scope.arriveData.B) {
                $scope.arrivePlan = ['PlanA','PlanB','Total']
            } else {
                $scope.arrivePlan = []
            };
        });
        serviceAPI.loadData(urlAPI.push_click,$scope.param).then(function(result){
            $scope.click = result.data;
            $scope.clickX = result.data.pushDate;
            $scope.clickStart = result.data.pushDate.length - 8;
            $scope.clickEnd = result.data.pushDate.length;
            if ($scope.click.pushType == 1) {
                $scope.clickData = result.data.notification;
                $scope.clickTotal = result.data.ntfTotal;
            } else if ($scope.click.pushType == 2){
                $scope.clickData = result.data.inapp;
                $scope.clickTotal = result.data.inTotal;
            } else {
                $scope.clickData = result.data.inapp;
                $scope.clickTotal = result.data.inTotal;
            };
            if ($scope.clickData.A && $scope.clickData.B && $scope.clickData.C) {
                $scope.clickPlan = ['PlanA','PlanB','PlanC','Total']
            } else if ($scope.clickData.A && $scope.clickData.B) {
                $scope.clickPlan = ['PlanA','PlanB','Total']
            } else {
                $scope.clickPlan = []
            };
        });
        serviceAPI.loadData(urlAPI.push_display,$scope.param).then(function(result){
            $scope.display = result.data;
            $scope.displayX = result.data.pushDate;
            $scope.displayStart = result.data.pushDate.length - 8;
            $scope.displayEnd = result.data.pushDate.length;
            if ($scope.display.pushType == 1) {
                $scope.displayData = result.data.notification;
                $scope.displayTotal = result.data.ntfTotal;
            } else if ($scope.display.pushType == 2){
                $scope.displayData = result.data.inapp;
                $scope.displayTotal = result.data.inTotal;
            } else {
                $scope.displayData = result.data.inapp;
                $scope.displayTotal = result.data.inTotal;
            };
            if ($scope.displayData.A && $scope.displayData.B && $scope.displayData.C) {
                $scope.displayPlan = ['PlanA','PlanB','PlanC','Total']
            } else if ($scope.displayData.A && $scope.displayData.B) {
                $scope.displayPlan = ['PlanA','PlanB','Total']
            } else {
                $scope.displayPlan = []
            };
            setTimeout(function(){
                $scope.initChart();
            },300);
        });
    };
    $scope.loadTable = function(){
        serviceAPI.loadData(urlAPI.push_arriveTable,$scope.param).then(function(result){
            $scope.arriveTB = result.data;
            if ($scope.arriveTB.pushType == 1) {
                $scope.arriveTable = result.data.notification;
                $scope.arriveTh = result.data.notification[0];
            } else if ($scope.arriveTB.pushType == 2) {
                $scope.arriveTable = result.data.inapp;
                $scope.arriveTh = result.data.inapp[0];
            } else {
                $scope.arriveTable = result.data.inapp;
                $scope.arriveTh = result.data.inapp[0];
            }
        });
        serviceAPI.loadData(urlAPI.push_clickTable,$scope.param).then(function(result){
            $scope.clickTB = result.data;
            if ($scope.clickTB.pushType == 1) {
                $scope.clickTable = result.data.notification;
                $scope.clickTh = result.data.notification[0];
            } else if ($scope.clickTB.pushType == 2) {
                $scope.clickTable = result.data.inapp;
                $scope.clickTh = result.data.inapp[0];
            } else {
                $scope.clickTable = result.data.inapp;
                $scope.clickTh = result.data.inapp[0];
            }
        });
        serviceAPI.loadData(urlAPI.push_displayTable,$scope.param).then(function(result){
            $scope.displayTB = result.data;
            if ($scope.displayTB.pushType == 1) {
                $scope.displayTable = result.data.notification;
                $scope.displayTh = result.data.notification[0];
            } else if ($scope.displayTB.pushType == 2) {
                $scope.displayTable = result.data.inapp;
                $scope.displayTh = result.data.inapp[0];
            } else {
                $scope.displayTable = result.data.inapp;
                $scope.displayTh = result.data.inapp[0];
            }
        });
    };
    $scope.initChart = function(){
        //init arrived chart
        $scope.arrivedOption = $scope.getChart($scope.arriveX, $scope.arriveData.A, $scope.arriveData.B, $scope.arriveData.C, $scope.arriveTotal, $scope.arriveStart, $scope.arriveEnd, $scope.arrivePlan);
        arrivedChart.setOption($scope.arrivedOption);
        //init displayed chart
        $scope.displayedOption = $scope.getChart($scope.displayX, $scope.displayData.A, $scope.displayData.B, $scope.displayData.C, $scope.displayTotal, $scope.displayStart, $scope.displayEnd, $scope.displayPlan);
        displayedChart.setOption($scope.displayedOption);
        //init clicked chart
        $scope.clickedOption = $scope.getChart($scope.clickX, $scope.clickData.A, $scope.clickData.B, $scope.clickData.C, $scope.clickTotal, $scope.clickStart, $scope.clickEnd, $scope.clickPlan);
        clickedChart.setOption($scope.clickedOption);
    };
    //change inapp or notification
    $scope.changeType = function(dom,num){
        if (num == 1) {
            $scope.planData = $scope.plan.notification;
            $scope.totalData = $scope.plan.ntfTotal;
            $scope.arriveData = $scope.arrive.notification;
            $scope.clickData = $scope.click.notification;
            $scope.displayData = $scope.display.notification;
            $scope.arriveTotal = $scope.arrive.ntfTotal;
            $scope.clickTotal = $scope.click.ntfTotal;
            $scope.displayTotal = $scope.display.ntfTotal;
            $scope.arriveTable = $scope.arriveTB.notification;
            $scope.arriveTh = $scope.arriveTB.notification[0];
            $scope.clickTable = $scope.clickTB.notification;
            $scope.clickTh = $scope.clickTB.notification[0];
            $scope.displayTable = $scope.displayTB.notification;
            $scope.displayTh = $scope.displayTB.notification[0];
        } else {
            $scope.planData = $scope.plan.inapp;
            $scope.totalData = $scope.plan.inTotal;
            $scope.arriveData = $scope.arrive.inapp;
            $scope.clickData = $scope.click.inapp;
            $scope.displayData = $scope.display.inapp;
            $scope.arriveTotal = $scope.arrive.inTotal;
            $scope.clickTotal = $scope.click.inTotal;
            $scope.displayTotal = $scope.display.inTotal;
            $scope.arriveTable = $scope.arriveTB.inapp;
            $scope.arriveTh = $scope.arriveTB.inapp[0];
            $scope.clickTable = $scope.clickTB.inapp;
            $scope.clickTh = $scope.clickTB.inapp[0];
            $scope.displayTable = $scope.displayTB.inapp;
            $scope.displayTh = $scope.displayTB.inapp[0];
        }
        $(dom.target).addClass('active').siblings().removeClass('active');
        $scope.percent();
        $scope.initChart();
    };
    //绘制百分比
    $scope.percent = function(){
            if ($scope.planData.A) {
                $scope.intePercent($scope.planData.A.userPct,'#A-1','#4896F1');
                $scope.intePercent($scope.planData.A.arrivePct,'#A-2','#4896F1');
                $scope.intePercent($scope.planData.A.displayPct,'#A-3','#4896F1');
                $scope.intePercent($scope.planData.A.clickPct,'#A-4','#4896F1');
            }
            if ($scope.planData.B) {
                $scope.intePercent($scope.planData.B.userPct,'#B-1','#55C53C');
                $scope.intePercent($scope.planData.B.arrivePct,'#B-2','#55C53C');
                $scope.intePercent($scope.planData.B.displayPct,'#B-3','#55C53C');
                $scope.intePercent($scope.planData.B.clickPct,'#B-4','#55C53C');
            }
            if ($scope.planData.C) {
                $scope.intePercent($scope.planData.C.userPct,'#C-1','#FF9C3C');
                $scope.intePercent($scope.planData.C.arrivePct,'#C-2','#FF9C3C');
                $scope.intePercent($scope.planData.C.displayPct,'#C-3','#FF9C3C');
                $scope.intePercent($scope.planData.C.clickPct,'#C-4','#FF9C3C');
            }
    };
    // init percent
    $scope.intePercent = function(percent,id,color) {
        var canvas_bottom = document.querySelectorAll(".canvas-bottom");
        for (var i = 0; i < canvas_bottom.length; i++) {
            var canvas_1 = canvas_bottom[i];
            var ctx_1 = canvas_1.getContext('2d');
            ctx_1.lineWidth = 5;
            ctx_1.strokeStyle = "#EFEFEF";
            //画底部的灰色圆环
            ctx_1.beginPath();
            ctx_1.arc(canvas_1.width / 2, canvas_1.height / 2, canvas_1.width / 2 - ctx_1.lineWidth / 2, 0, Math.PI * 2, false);
            ctx_1.closePath();
            ctx_1.stroke();
        }
        var canvas_2 = document.querySelector(id);
        var ctx_2 = canvas_2.getContext('2d');
        ctx_2.lineWidth = 5;
        ctx_2.strokeStyle = color;
        var angle = 0;
        var timer;
        (function draw() {
            timer = requestAnimationFrame(draw);
            ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height)
            //百分比圆环
            ctx_2.beginPath();
            ctx_2.arc(canvas_2.width / 2, canvas_2.height / 2, canvas_2.width / 2 - ctx_2.lineWidth / 2, 0, angle * Math.PI / 180, false);
            angle += 10;
            var percentAge = parseInt((angle / 360) * 100)
            if (angle > (percent / 100 * 360)) {
                percentAge = percent
                window.cancelAnimationFrame(timer);
            };
            ctx_2.stroke();
            ctx_2.closePath();
            ctx_2.save();
            ctx_2.beginPath();
            ctx_2.rotate(90 * Math.PI / 180)
            ctx_2.font = '14px Arial';
            ctx_2.fillStyle = '#000';
            var text = percentAge + '%';
            ctx_2.moveTo(35,0);
            ctx_2.lineTo(35,60);
            ctx_2.textAlign="center"; 
            ctx_2.fillText(text, 36, -30);
            ctx_2.closePath();
            ctx_2.restore();
        })()
    };


    // echarts init
    var arrivedChart = echarts.init(document.getElementById('arrived-chart'));
    var displayedChart = echarts.init(document.getElementById('displayed-chart'));
    var clickedChart = echarts.init(document.getElementById('clicked-chart'));

    //get chart data
    $scope.getChart = function(X,A, B, C, T, start, end, plan){
        if (plan.length == 4) {
            var series = [
                {
                    name:'PlanA',
                    type:'line',
                    data: A,
                    itemStyle:{
                        normal: {
                            color: '#4896F1'
                        }
                    }
                },
                {
                    name:'PlanB',
                    type:'line',
                    data: B,
                    itemStyle:{
                        normal: {
                            color: '#55C53C'
                        }
                    }
                },
                {
                    name:'PlanC',
                    type:'line',
                    data: C,
                    itemStyle:{
                        normal: {
                            color: '#FF9C3C'
                        }
                    }
                },
                {
                    name:'Total',
                    type:'line',
                    data: T,
                    itemStyle:{
                        normal: {
                            color: '#4B5B80'
                        }
                    }
                }
            ]
        } else if (plan.length == 3) {
            var series = [
                {
                    name:'PlanA',
                    type:'line',
                    data: A,
                    itemStyle:{
                        normal: {
                            color: '#4896F1'
                        }
                    }
                },
                {
                    name:'PlanB',
                    type:'line',
                    data: B,
                    itemStyle:{
                        normal: {
                            color: '#55C53C'
                        }
                    }
                },
                {
                    name:'Total',
                    type:'line',
                    data: T,
                    itemStyle:{
                        normal: {
                            color: '#4B5B80'
                        }
                    }
                }
            ]
        } else {
            var series = [
                {
                    name:'PlanA',
                    type:'line',
                    data: A,
                    itemStyle:{
                        normal: {
                            color: '#4896F1'
                        }
                    }
                }
            ]
        }
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: plan
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
                data: X
            },
            yAxis: {
                type: 'value'
            },
            dataZoom: [{
                type: 'slider'
            },{
                startValue: start,
                endValue: end
            }],
            series: series
        };
        return option;
    };

    //change chart style
    $scope.changeChart = function(dom,str,num){
        $(dom.target).addClass('active').siblings().removeClass('active');
        if (str == 'arrived') {
            $scope.showArrivedChart = num;
        } else if (str == 'displayed') {
            $scope.showDisplayedChart = num;
        } else {
            $scope.showClickedChart = num;
        }
    };
    $scope.init = function(){
        $scope.loadList();
        window.onresize = function () {
            arrivedChart.resize();
            displayedChart.resize();
            clickedChart.resize();
        };
    };
    $scope.init();


}];
return scope;
