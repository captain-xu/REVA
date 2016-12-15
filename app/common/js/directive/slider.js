angular.module('app.directive').directive('slider', [function() {
    return {
        restrict: 'AE',
        template: '<div class="slider"><div class="complete"></div><div class="marker"></div></div>',
        replace: true,
        transclude: false,
        scope: {
            percentage: '=',
            isDrag: '=',
            confirm: '&'
        },
        controller: ["$scope", function($scope) {
            $scope.clickedOnCursor = false;
            $scope.getMousePosition = function(dom) {
                $scope.startOffser = $(dom).offset();
            };
            $scope.handleCursor = function(e) {
                if ($scope.clickedOnCursor) {
                    var pos = [];
                    pos[0] = e.pageX - ($scope.dom).offset().left;
                    var valueLevelAtCurosor = Math.floor(pos[0]);
                    var currentValue = valueLevelAtCurosor <= 0 ? 0 : valueLevelAtCurosor;
                    $scope.setValue(currentValue);
                }
            };
            $scope.setValue = function(value) {
                var left = value;
                left = Math.floor(left);
                if (left > $($scope.dom).width()) {
                    left = $($scope.dom).width();
                };
                var decimal = left / $($scope.dom).width();
                var percent = (decimal * 100).toFixed(0);
                $('.marker', $scope.dom).css({ 'left': "calc(" + percent + "% - 9px)" });
                $('.complete', $scope.dom).css({ 'width': percent + "%" });

                $scope.percentage = percent;
                $scope.$apply();
                $scope.confirm();
            };
            $scope.init = function() {
                $('.marker', $scope.dom).css({ 'left': "calc(" + $scope.percentage + "% - 9px)" });
                $('.complete', $scope.dom).css({ 'width': $scope.percentage + "%" });
            };
            $scope.$watch('percentage', function() {
                $('.marker', $scope.dom).css({ 'left': "calc(" + $scope.percentage + "% - 9px)" });
                $('.complete', $scope.dom).css({ 'width': $scope.percentage + "%" });
            });

        }],
        link: function(scope, element, attrs) {
            scope.dom = element;
            scope.init();
            $('.marker', element).mousedown(function(e) {
                if (scope.isDrag) {
                    // e.preventDefault();
                    e.stopPropagation();
                    scope.clickedOnCursor = true;
                    scope.getMousePosition(this);
                };
                $('body').on('mousemove', function(e) {
                    // e.preventDefault();
                    e.stopPropagation();
                    scope.handleCursor(e);
                })
            });
            $('body').on('mouseup', function(e) {
                // e.preventDefault();
                e.stopPropagation();
                scope.clickedOnCursor = false;
                $('body').off('mousemove');
                // scope.handleData(this);
            });
        }
    }
}])
