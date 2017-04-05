angular.module('app.services').factory('chartAPI', [
    function() {
        'use strict';
        return {
            getInitChart: function(id) {
                var myChart = echarts.init(document.getElementById(id), null, {
                    renderer: 'canvas'
                });

                return myChart;
            },
            getOption: function(obj1, obj2, obj3, title) {
                var option = {
                    title: {
                        text: title,
                        padding: 20,
                        textStyle: {
                            color: '#333',
                            fontStyle: 'normal',
                            fontWeight: 'bolder',
                            fontFamily: 'sans-serif',
                            fontSize: 16,
                        },
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: obj1,
                        top: '5%'
                    },
                    color: ["#3fb1e3",
                        "#6be6c1",
                        "#626c91",
                        "#a0a7e6",
                        "#c4ebad",
                        "#96dee8"
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: obj2,
                        axisLine:{
                            lineStyle: {
                                color: "#969696"
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                color: "#aaa"
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#969696"
                            }
                        /*},
                        splitLine: {
                            lineStyle: {
                                // 使用深浅的间隔色
                                color: ['#aaa', '#ddd']
                            }*/
                        }
                    },
                    series: obj3
                };
                return option;
            },
            getCampaign: function(x, y, beginData, betweenData, endData, dataValue) {
                var colorList = [
                        '#3fb1e3','#6be6c1','#626c91','#a0a7e6','#c4ebad',
                        '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0'
                ];
                var option = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            return dataValue[params[1].dataIndex]
                        }
                    },
                    grid: {
                        top:'8%',
                        left: '2%',
                        right: '0%',
                        bottom: '2%'
                    },
                    legend: {
                        data:["begin","center","end"] ,
                        show:false
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            startValue: betweenData.length-10,
                            orient: 'vertical',
                            zoomLock: true,
                            left: '0%',
                            showDetail: false,
                            showDataShadow: false
                        }
                    ],
                    xAxis: {
                        type: 'value',
                        data:  x,
                        position:'top',
                        splitNumber:x.length,
                        axisLabel: {
                            formatter: function (value,index) {
                                if (index < x.length) {
                                    var texts = x[index].replace("月","月\n");
                                    return texts;
                                }
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        show:false,
                        data: y
                    },
                    series: [
                        {
                            name: 'begin',
                            type: 'bar',
                            stack: '总量',
                            barWidth:38,
                            data: beginData,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            itemStyle:{
                                normal:{
                                    opacity:0
                                }
                            }
                        },
                        {
                            name: 'center',
                            type: 'bar',
                            stack: '总量',
                            barWidth:38,
                            data: betweenData,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside',
                                    formatter: function (params) {
                                            return dataValue[params.dataIndex]
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                },
                                emphasis:{
                                    show: true,
                                    position: 'inside',
                                    formatter: function (params) {
                                            return dataValue[params.dataIndex]
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }
                            },
                            itemStyle:{
                                normal: {
                                    color: function(params) {
                                        if (params.dataIndex>=10) {
                                            var index = params.dataIndex.toString();
                                            var laststring  = index.charAt(index.length-1);
                                            var lastNum = parseInt(laststring);
                                            return colorList[lastNum]
                                        }else{
                                            return colorList[params.dataIndex]
                                        }
                                    },
                                    barBorderRadius: 10
                                }
                            }
                        },
                        {
                            name: 'end',
                            type: 'bar',
                            stack: '总量',
                            barWidth:38,
                            data: endData,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            itemStyle:{
                                normal: {
                                    opacity:0
                                }
                            }
                        }
                    ]
                };
                return option;
            }
        };
    }
]);
