angular.module('app.services').factory('sparklineConfig', [
    function() {
        'use strict';
        return {
            lineMap: {
                type: 'line',
                lineColor: '#78D4A6',
                fillColor: '#2EC02E',
                width: '100'
            },
            line: {
                type: 'line',
                lineColor: '#78D4A6',
                fillColor: '#fff',
                width: '100'
            },
            discrete: {
                type: 'discrete',
                lineColor: '#78D4A6',
                width:'150'
            }
        }

    }
]);
