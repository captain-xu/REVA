angular.module('app.services').factory('chartOption', [
    function() {
        'use strict';
        return {
            option: function() {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        show: false
                    },
                    yAxis: {
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        
                        data: []
                    },
                    grid: {
                        top: "20px",
                        left: '10%',
                        right: '10%',
                        bottom: '8%',
                    },
                    series: []
                }
            },
            pieOption: function() {
                return {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: {
                        name: "Sales",
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: []
                    }
                }
            },
            mapOption: function() {
                return {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}<br/>sales:{c}'
                    },

                    visualMap: {
                        min: 0,
                        max: 4000,
                        text: ['High', 'Low'],
                        realtime: false,
                        calculable: true,
                        show: false,
                        inRange: {
                            color: ['lightskyblue', 'yellow', 'orangered']
                        }
                    },
                    series: []
                }
            }
        }

    }
]);
