angular.module('app.directive').directive('dateRange', [function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY/MM/DD',
                    "separator": ' ~ '
                },
                "startDate": moment().subtract(6, 'days'),
                "endDate": moment(),
                "maxDate": moment(),
                "opens": "left"
                // "startDate": moment().subtract(7, 'days'),
                // "endDate": moment().subtract(1, 'days'),
                // "maxDate": moment().subtract(1, 'days'),
                // 下版本释放
            }, cb);
            //cb(moment().subtract(6, 'days'), moment());

            function cb(start, end) {
                ele.val(start.format('YYYY/MM/DD') + ' ~ ' + end.format('YYYY/MM/DD'));
                scope.setTime(start, end);
            };
        }
    };
}]).directive('dateUnlimited', [function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY/MM/DD',
                    "separator": ' ~ '
                },
                "minDate": moment(),
                "autoUpdateInput": false,
                "parentEl": '.edit-container',
                "opens": "right"
            });
            $('input[name=datarange]').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'));
                scope[ele.attr('data-start')] = picker.startDate.format('YYYY/MM/DD');
                scope[ele.attr('data-end')] = picker.endDate.format('YYYY/MM/DD');
            });

            // function cb(start, end) {
            //     ele.val(start.format('YYYY/MM/DD') + ' ~ ' + end.format('YYYY/MM/DD'));
            //     scope[ele.attr('data-start')] = start.format('YYYY/MM/DD');
            //     scope[ele.attr('data-end')] = end.format('YYYY/MM/DD');
            // };
        }
    };
}]).directive('datenetUnlimited', [function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY/MM/DD',
                    "separator": ' ~ '
                },
                "minDate": moment(),
                "autoUpdateInput": false,
                "parentEl": '.editnet-container',
                "opens": "right"
            });
            $('input').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'));
                scope[ele.attr('data-start')] = picker.startDate.format('YYYY/MM/DD');
                scope[ele.attr('data-end')] = picker.endDate.format('YYYY/MM/DD');
            });
            // function cb(start, end) {
            //     ele.val(start.format('YYYY/MM/DD') + ' ~ ' + end.format('YYYY/MM/DD'));
            //     scope[ele.attr('data-start')] = start.format('YYYY/MM/DD');
            //     scope[ele.attr('data-end')] = end.format('YYYY/MM/DD');
            // };
        }
    };
}]).directive('datePublish', [function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY/MM/DD',
                    "separator": ' ~ '
                },
                "opens": "right",
                "parentEl": '.edit-container',
                "autoUpdateInput": false
            });
            $('input[name=publish]').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'));
                scope[ele.attr('publish-start')] = picker.startDate.format('YYYY/MM/DD');
                scope[ele.attr('publish-end')] = picker.endDate.format('YYYY/MM/DD');
            });
            // function cb(start, end) {
            //     ele.val(start.format('YYYY/MM/DD') + ' ~ ' + end.format('YYYY/MM/DD'));
            //     scope[ele.attr('publish-start')] = start.format('YYYY/MM/DD');
            //     scope[ele.attr('publish-end')] = end.format('YYYY/MM/DD');
            // };
        }
    };
}]).directive('datePlacement', [function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY/MM/DD',
                    "separator": ' ~ '
                },
                "opens": "left",
                "autoUpdateInput": false
            });
            $('input').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'));
                scope[ele.attr('data-start')] = picker.startDate.format('YYYY/MM/DD');
                scope[ele.attr('data-end')] = picker.endDate.format('YYYY/MM/DD');
                scope.setTime(picker.startDate, picker.endDate);
            });
            // function cb(start, end, picker) {
            //     ele.val(picker.startDate.format('YYYY/MM/DD') + ' ~ ' + picker.endDate.format('YYYY/MM/DD'));
            //     scope[ele.attr('data-start')] = picker.startDate.format('YYYY/MM/DD');
            //     scope[ele.attr('data-end')] = picker.endDate.format('YYYY/MM/DD');
            //     scope.setTime(picker.startDate, picker.endDate);
            // };
        }
    };
}]).directive('datePlacements', [function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY-MM-DD',
                    "separator": ' ~ '
                },
                "startDate": moment().subtract(6, 'days'),
                "endDate": moment(),
                "parentEl": '.edit-container',
                "opens": "right"
            }, cb);

            function cb(start, end) {
                ele.val(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
                scope[ele.attr('startTime')] = start.format('YYYY-MM-DD');
                scope[ele.attr('endTime')] = end.format('YYYY-MM-DD');
                scope.setTime(start, end);
            };
        }
    };
}]).directive('singleDate', [function() {
    return {
        restrict: 'A',
        scope:{
            datavalue:"="
        },
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY-MM-DD',
                    "separator": ' ~ '
                },
                "singleDatePicker": true,
                "minDate":moment(),
                // "timePicker": true,
                // "timePicker24Hour": true,
                "opens": "center",
                // "autoUpdateInput": false,
            }, cb);

            function cb(start) {
              scope.datavalue=start.format('YYYY-MM-DD')
            };
        }
    };
}]).directive('reportDate', [function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY/MM/DD',
                    "separator": ' ~ '
                },
                "opens": "left",
                "maxDate":moment().subtract(1, 'days'),
                // "showCustomRangeLabel": false,
                "autoApply": true,
                "ranges": {
                    "Last Day": [
                        moment().subtract(1, 'days'),
                        moment().subtract(1, 'days')
                    ],
                    "Last 7 Days": [
                        moment().subtract(7, 'days'),
                        moment().subtract(1, 'days')
                    ],
                    "Last 30 Days": [
                        moment().subtract(30, 'days'),
                        moment().subtract(1, 'days')
                    ]
                },
                "startDate": moment().subtract(30, 'days'),
                "endDate": moment().subtract(1, 'days')
            });
            $("input").on('apply.daterangepicker', function(ev, picker){
                $(this).val(picker.startDate.format('YYYY/MM/DD') + '-' + picker.endDate.format('YYYY/MM/DD'));
                scope[ele.attr('data-start')] = picker.startDate.format('YYYY/MM/DD');
                scope[ele.attr('data-end')] = picker.endDate.format('YYYY/MM/DD');
                scope.setTime(picker.startDate, picker.endDate);
            });
        }
    };
}]).directive('deviceDate', [function() {
    return {
        restrict: 'A',
        scope:{
            datavalue:"="
        },
        link: function(scope, ele, attrs) {
            ele.daterangepicker({
                "locale": {
                    "format": 'YYYY-MM-DD'
                },
                "singleDatePicker": true,
                "minDate":moment().subtract(-1, 'days'),
                "opens": "center",
                "parentEl": ".version-con"
            }, cb);

            function cb(start) {
              scope.datavalue=start.format('YYYY-MM-DD')
            };
        }
    };
}]);
