var scope = ["$scope", "serviceAPI", "$stateParams",'urlAPI',
    function($scope, serviceAPI, $stateParams, urlAPI) {

		var barChart = echarts.init(document.getElementById('bar'));
		var mapChart = echarts.init(document.getElementById('map'));



		var latlong = {};
		latlong.WS = {'latitude':-13, 'longitude':-172};
		latlong.YE = {'latitude':15, 'longitude':48};
		latlong.ZA = {'latitude':-29, 'longitude':24};
		latlong.ZM = {'latitude':-15, 'longitude':30};
		latlong.ZW = {'latitude':-20, 'longitude':30};

		var mapData = [
		{'code':'WS' , 'name':'West Bank and Gaza', 'value':4152369},
		{'code':'ZA' , 'name':'Vietnam', 'value':88791996},
		{'code':'YE' , 'name':'Yemen, Rep.', 'value':24799880},
		{'code':'ZM' , 'name':'Zambia', 'value':13474959},
		{'code':'ZW' , 'name':'Zimbabwe', 'value':12754378}];

		var max = -Infinity;
		var min = Infinity;
		var index = 0;
		var colorList = [
		        '#c4ebad','#6be6c1','#626c91','#a0a7e6','#3fb1e3'
		];
		mapData.forEach(function (itemOpt) {
		    if (itemOpt.value > max) {
		        max = itemOpt.value;
		    }
		    if (itemOpt.value < min) {
		        min = itemOpt.value;
		    }
		    itemOpt.color = colorList[index]; 
		    index++;
		});

		var mapOption = {
		    backgroundColor: '#fff',
		    tooltip : {
		        trigger: 'item',
		        formatter : function (params) {
		            return params.name + ' : ' + params.value[2];
		        }
		    },
		    visualMap: {
		        show: false,
		        min: 0,
		        max: max,
		        inRange: {
		            symbolSize: [10, 50]
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
		            data: mapData.map(function (itemOpt) {
		                return {
		                    name: itemOpt.name,
		                    value: [
		                        latlong[itemOpt.code].longitude,
		                        latlong[itemOpt.code].latitude,
		                        itemOpt.value
		                    ],
		                    label: {
		                        emphasis: {
		                            position: 'right',
		                            show: true
		                        }
		                    },
		                    itemStyle: {
		                        normal: {
		                            color: itemOpt.color
		                        }
		                    }
		                };
		            })
		        }
		    ]
		};
		var barOption = {
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'axis',
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
		            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
		            barWidth: '50',
		            data:[10, 52, 200, 334, 390, 330, 220]
		        }
		    ]
		};
		barChart.setOption(barOption);
		mapChart.setOption(mapOption);


}];
return scope;
