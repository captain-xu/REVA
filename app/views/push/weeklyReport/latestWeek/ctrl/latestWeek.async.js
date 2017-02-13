var scope = ["$scope", "serviceAPI", "$stateParams", 'urlAPI',
    function($scope, serviceAPI, $stateParams, urlAPI) {
        $scope.tohistory = {url: "/view/push/historyWeeks"};
    	$scope.loadData = function(){
    		if (!$stateParams.id) {
    			$stateParams.id = '';
    		}
    		serviceAPI.loadData(urlAPI.push_weeklyReport, {wekrepId: $stateParams.id}).then(function(result){
    			if (result.code == 200 && result.status == 1) {
    				var startDate = moment(result.data.weeklyTime.startTime).format('YYYY.MM.DD');
    				var endDate = moment(result.data.weeklyTime.endTime).format('YYYY.MM.DD');
    				$scope.publishDate = moment(result.data.weeklyTime.publishTime).format('YYYY.MM.DD');
    				$scope.dateRange = startDate + '-' + endDate;
	    			$scope.basicInfo = result.data.basicInfo;
	    			$scope.appClick = result.data.appClickRate;
	    			$scope.areaClick = result.data.areaClickRate;
	    			$scope.channelClick = result.data.channelClickRate;
	    			if (result.data.averageClickRate.length == 0) {
						$scope.barValue = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
						$scope.topClick = [];
	    			} else {
		    			$scope.barValue = result.data.averageClickRate.map(function(data) {
		    				return data.click;
		    			});
		    			$scope.topClick = result.data.averageClickRate;
						$scope.topClick.sort($scope.compare("click"));
						$scope.topClick = $scope.topClick.slice(0, 5);
	    			}
	    			$scope.initCharts($scope.barValue, $scope.areaClick);
    			}
    		});
    	};
		$scope.compare = function (prop) {
		    return function (obj1, obj2) {
		        var val1 = obj1[prop];
		        var val2 = obj2[prop];
		        if (val1 < val2) {
		            return 1;
		        } else if (val1 > val2) {
		            return -1;
		        } else {
		            return 0;
		        }            
		    } 
		};
		$scope.initCharts = function(bar, area){
			/***********************bar chart start***********************/
			var barChart = echarts.init(document.getElementById('bar'));
			var barOption = {
			    color: ['#3398DB'],
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        },
			        formatter: '{b}: {c}'
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
			            data : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
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
			            data: bar
			        }
			    ]
			};
			barChart.setOption(barOption);
			/***********************bar chart end***********************/
			/***********************map chart start***********************/
			var mapChart = echarts.init(document.getElementById('map'));
			var colorList = [
			        '#2E46A1','#FD5922','#2FBE58','#695CB1','#695CB1',
			        '#2E46A1','#FD5922','#2FBE58','#695CB1','#695CB1'
			];
			var mapOption = {
			    backgroundColor: '#fff',
			    tooltip : {
			        trigger: 'item',
			        formatter : function (params) {
			            return params.name + ' : ' + params.value[2] + '%';
			        }
			    },
			    visualMap: {
			        show: false,
			        min: 0,
			        max: area[0].clickRate,
			        inRange: {
			            symbolSize: [15, 50]
			        }
			    },
			    geo: {
			        type: 'map',
			        map: 'world',
			        label: {
			            emphasis: {
			                show: false
			            }
			        },
			        itemStyle: {
			            normal: {
			                areaColor: '#F7F7F7',
			                borderColor: '#D5D5D5'
			            },
			            emphasis: {
			                areaColor: '#F7F7F7'
			            }
			        }
			    },
			    series : [
			        {
			            type: 'scatter',
			            coordinateSystem: 'geo',
			            data: area.map(function (itemOpt, index) {
			                return {
			                    name: itemOpt.state,
			                    value: [
			                        itemOpt.longitude,
			                        itemOpt.latitude,
			                        itemOpt.clickRate
			                    ],
			                    itemStyle: {
			                        normal: {
			                            color: colorList[index]
			                        }
			                    }
			                };
			            })
			        }
			    ]
			};
			mapChart.setOption(mapOption);
			/***********************map chart end***********************/
			window.onresize = function () {
	            barChart.resize();
            	mapChart.resize();
	        };
		};
		$scope.printPage = function(){ 
			$("#lewaos-sidebar").hide();
			$(".header").hide();
			$("#weeklyReport").css({
				'position': 'fixed',
                'left': '0',
                'top': '0',
                'z-index': '100',
                'margin': '0',
                'padding': '0 20px',
                'width': '1024px',
                'border': '1px solid #000'
			});
			$(".weekly-container h4").css('padding-top', '20px');
			$(".data-detail").css('padding', '6px 0');
			$("#bar").css('height', '220px');
			$("#bar canvas").css({
				'width': '1000px',
				'height': '220px'
			});
			$("#appCli").css('height', '150px');
			$("#map").css('height', '240px');;
			$("#map canvas").css({
				'width': '1024px',
				'height': '240px'
			});
			$(".rating ol li").css('font-size', '36px');
			setTimeout(function(){
				window.location.reload();
				window.print();
			}, 100);
		};
		$scope.loadData();
}];
return scope;
