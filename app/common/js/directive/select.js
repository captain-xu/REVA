angular.module('app.directive').directive('osselect', [function() {
    return {
        restrict: 'E',
        template: '<div class="dropdown os_filter">' +
            '<div class="dropdown-toggle" data-toggle="dropdown">' +
            '<input type="text" placeholder="{{dataplace}}" class="form-control" id="{{dataValue.id}}" ng-change="editData()" ng-model="dataValue.name" ng-click="getfocus($event)"/>' +
            '<span class="caret"></span></div>' +
            '<ul class="dropdown-menu">' +
            '<li ng-repeat="vo in datalists | filter:{name:seach}" id="{{vo.id}}"  ng-click="selected(vo,$event)">{{vo.name}}</li>' +
            '</ul></div>',
        replace: true,
        transclude: false,
        scope: {
            datalists: "=",
            dataid: "=",
            dataplace: "=",
            confirm: "&"
        },
        controller: "selectCtl",
        link: function(scope, element, attrs) {
            scope.inputDom = $('input', element);
            scope.init();
            $(element).on('hidden.bs.dropdown', function() {
                scope.setDate();
                scope.confirm();
                scope.select = true;
                scope.seach = "";
                $(this).find('input.form-control').blur();
            });
        }
    }
}]).directive('osselecter', [function() {
    return {
        restrict: 'E',
        template: '<div class="dropdown os_filter">' +
            '<div class="dropdown-toggle" data-toggle="dropdown">' +
            '<input type="text" class="form-control" id="{{dataValue.id}}" ng-change="editData()" ng-model="dataValue.name" ng-blur="resetData()" ng-click="getfocus($event)" spellcheck="false" ng-init="dataValue.name=' + "'ALL'" + '"/>' +
            '<span class="caret"></span></div>' +
            '<ul class="dropdown-menu">' +
            '<li ng-repeat="vo in datalists | filter:{name:seach}" id="{{vo.id}}" ng-click="selected(vo,$event)" ng-class="{' + "'active':vo.id == dataid" + '}">{{vo.name}}</li>' +
            '</ul></div>',
        replace: true,
        transclude: false,
        scope: {
            datalists: "=",
            dataid: "=",
            dataname: "=",
            confirm: "&"
        },
        controller: ["$scope", function($scope) {
            $scope.seach = "";
            $scope.init = function() {
                if ($scope.dataid != "" && $scope.datalists) {
                    for (var i = 0; i < $scope.datalists.length; i++) {
                        if ($scope.dataid == $scope.datalists[i].id) {
                            $scope.dataValue = {
                                id: $scope.datalists[i].id,
                                name: $scope.datalists[i].name
                            };
                            break;
                        }
                    }
                }
            };
            $scope.selected = function(vo, event) {
                $scope.setSelect(vo);
                $(event.target).addClass('active').siblings().removeClass('active');

            };
            $scope.editData = function() {
//            	$scope.dataValue.id = "";
                $scope.seach = $scope.dataValue.name;
                $scope.dataid = $scope.dataValue.id;
            };
            $scope.resetData = function() {
            	$scope.dataid = $scope.dataValue.id;
            	$scope.dataValue.name = $scope.dataname;
            };
            $scope.setDate = function() {
                if ($scope.dataValue && $scope.dataValue.id == "" && $scope.dataValue.name != "") {
                    for (var i = 0; i < $scope.datalists.length; i++) {
                        var item = $scope.datalists[i];
                        var str = item.name.toLocaleLowerCase(),
                            str1 = $scope.dataValue.name.toLocaleLowerCase();
                        if (str == str1) {
                            $scope.setSelect(item)
                            break;
                        } else if (i == $scope.datalists.length - 1) {
                            $scope.setSelect();
                        }
                    };
                }
            };
            $scope.setSelect = function(vo) {
                if (vo) {
                    $scope.dataValue = {
                        id: vo.id,
                        name: vo.name
                    };
                } else {
                    $scope.dataValue = {
                        id: "",
                        name: ""
                    };
                };
                $scope.dataid = $scope.dataValue.id;
                $scope.dataname = $scope.dataValue.name;

            };
        }],
        link: function(scope, element, attrs) {
            scope.inputDom = $('input', element);
            scope.init();
            $(element).on('hidden.bs.dropdown', function() {
                scope.setDate();
                scope.confirm();
                scope.select = true;
                scope.seach = "";
                $(this).find('input.form-control').blur();
            });
        }
    }
}]).directive('osSelect', [function() {
    return {
        restrict: 'AE',
        template: '<div class="dropdown os_filter">' +
            '<div class="dropdown-toggle" data-toggle="dropdown">' +
            '<p class="form-control message-name" id="{{datavalue.id}}" ng-show="datavalue.name">{{datavalue.name}}</p>' +
            '<p class="form-control message-name warn-tip" id="{{datavalue.id}}" ng-hide="datavalue.name">Please select an app</p>' +
            '<span class="caret"></span></div>' +
            '<ul class="dropdown-menu">' +
            '<li ng-repeat="vo in datalists | filter:{name:seach}" id="{{vo.id}}"  ng-click="selected(vo,$event)">{{vo.name}}</li>' +
            '</ul></div>',
        replace: true,
        transclude: false,
        scope: {
            datalists: "=",
            datavalue: "=",
            confirm: "&"
        },
        controller: ["$scope", function($scope) {
            $scope.seach = "";
            $scope.selected = function(vo, event) {
                $scope.setSelect(vo);
                $(event.target).addClass('active').siblings().removeClass('active');
            };
            $scope.editData = function() {
                $scope.datavalue.id = "";
                $scope.seach = $scope.datavalue.name; 
            };
            $scope.setDate = function() {
                if ($scope.datavalue && $scope.datavalue.id == "" && $scope.datavalue.name != "") {
                    for (var i = 0; i < $scope.datalists.length; i++) {
                        var item = $scope.datalists[i];
                        var str = item.name.toLocaleLowerCase(),
                            str1 = $scope.datavalue.name.toLocaleLowerCase();
                        if (str == str1) {
                            $scope.setSelect(item)
                            break;
                        } else if (i == $scope.datalists.length - 1) {
                            $scope.setSelect();
                        }
                    };
                }
            };
            $scope.setSelect = function(vo) {
                if (vo) {
                    $scope.datavalue = {
                        id: vo.id,
                        name: vo.name
                    };
                } else {
                    $scope.datavalue = {
                        id: "",
                        name: ""
                    };
                };
            };
        }],
        link: function(scope, element, attrs) {
            scope.inputDom = $('input', element);
            $(element).on('hidden.bs.dropdown', function() {
                scope.setDate();
                scope.confirm();
                scope.seach = "";
                $(this).find('input.form-control').blur();
            });
        }
    }
}]).directive('multiSelect', [function() {
    return {
        restrict: 'AE',
        template: '<div class="dropdown os_filter">' +
            '<div class="dropdown-toggle" data-toggle="dropdown">' +
            '<p class="form-control">Status Filter</p>' +
            '<span class="caret"></span></div>' +
            '<ul class="dropdown-menu">' +
            '<li ng-repeat="vo in datalists" data-value="{{vo.id}}"  ng-click="setDate(vo,$event)">' +
            '<i class="fa" aria-hidden="true" ng-class="{true:' +
            "'fa-check-square'" + ',false:' + "'fa-square-o'" + '}[vo.isSelect]"></i>{{vo.name}}</li>' +
            '</ul></div>',
        replace: true,
        transclude: false,
        scope: {
            datalists: "=",
            datavalue: "=",
            confirm: "&"
        },
        controller: ['$scope', function($scope) {
            $scope.setDate = function(vo, event) {
                vo.isSelect = !vo.isSelect;
                if ($scope.datavalue || $scope.datavalue.length == 0) {
                    $scope.datavalue = [];
                    for (var i = 0; i < $scope.datalists.length; i++) {
                        var item = $scope.datalists[i];
                        if (item.isSelect) {
                            $scope.datavalue.push(item.id);
                        }
                    };
                }
                event.stopPropagation();
            };
        }],
        link: function(scope, element, attrs) {
            $(element).on('hidden.bs.dropdown', function() {
                scope.confirm();
            });
        }
    }
}]).directive('reportselect', [function() {
    return {
        restrict: 'E',
        template: '<div class="dropdown os_filter">' +
            '<div class="dropdown-toggle" data-toggle="dropdown">' +
            '<input type="text" placeholder="Please select" class="form-control" id="{{vo.id}}" ng-model="vo.name" ng-change="editInput()" ng-blur="setDate()" ng-click="getfocus($event)"/>' +
            '<span class="caret"></span></div>' +
            '<ul class="dropdown-menu">' +
            '<li ng-repeat="vo in datalists | filter:{name:seach}" id="{{vo.id}}"  ng-click="selected(vo,$event)">{{vo.name}}</li>' +
            '</ul></div>',
        replace: true,
        transclude: false,
        scope: {
            datalists: "=",
            confirm: "&"
        },
        controller:["$scope", function($scope) {
            $scope.getVO = function() {
                $scope.vo = {
                    id: "",
                    name: "",
                    isClick: false
                }
            };
            $scope.getVO();
            $scope.selected = function(vo,event) {
                if (!vo.istitle) {
                    $scope.select = true;
                    $scope.vo = {
                        id: vo.id,
                        name: vo.name,
                        isClick: false
                    };
                    $scope.$parent.selectVO = vo;
                    $scope.confirm();
                    $(event.target).addClass('active').siblings().removeClass('active');
                }

            };
            $scope.editInput = function() {
                $scope.seach = $scope.vo.name;
            };
            $scope.setDate = function() {
                setTimeout(function() {
                    if (!$scope.select) {
                        if ($scope.vo.name == "" || $scope.datalists.length == 0) {
                            $scope.getVO();
                        } else {
                            for (var i = 0; i < $scope.datalists.length; i++) {
                                var item = $scope.datalists[i];
                                var str = item.name.toLocaleLowerCase(),
                                    str1 = $scope.vo.name.toLocaleLowerCase();
                                if (str == str1) {
                                    $scope.vo = {
                                        id: item.id,
                                        name: item.name,
                                        isClick: false
                                    };
                                    break;
                                } else if (i == $scope.datalists.length - 1) {
                                    $scope.getVO();
                                }
                            };
                        };
                        $scope.$parent.selectVO = $scope.vo;
                        $scope.confirm();
                    }
                }, 500);
            };
            $scope.getfocus = function(dom) {
                $scope.select = false;
                if ($scope.vo.isClick) {
                    $(dom.target).blur();
                    $scope.vo.isClick = false;
                } else {
                    $scope.vo.isClick = true;
                }
            };
        }],
        link: function(scope, element, attrs) {
            $(element).on('hidden.bs.dropdown', function() {
                scope.seach = "";
            })
        }
    }
}]).directive('osselecttitle', [function() {
    return {
        restrict: 'E',
        template: '<div class="dropdown os_filter">' +
            '<div class="dropdown-toggle report-type" data-toggle="dropdown">' +
            '{{vo.name}}<span class="caret"></span></div>' +
            '<ul class="dropdown-menu type">' +
            '<li ng-repeat="vo in datalists track by $index" id="{{vo.id}}" ng-class="{true:' + "'dropdown-header'" + '}[vo.istitle]" ng-click="selected(vo)">{{vo.name}}</li>' +
            '</ul></div>',
        replace: true,
        transclude: false,
        scope: {
            datalists: "=",
            confirm: "&",
            vo: "="
        },
        controller: ["$scope", function($scope) {
            $scope.selected = function(vo) {
                if (!vo.istitle) {
                    $scope.vo = vo;
                    $scope.$parent.selectVO = vo;
                    $scope.confirm();
                }
            };
        }]
    }
}]);
angular.module('app.controller').controller('selectCtl', ["$scope", function($scope) {
    $scope.seach = "";
    $scope.init = function() {
        if ($scope.dataid != "" && $scope.datalists) {
            for (var i = 0; i < $scope.datalists.length; i++) {
                if ($scope.dataid == $scope.datalists[i].id) {
                    $scope.dataValue = {
                        id: $scope.datalists[i].id,
                        name: $scope.datalists[i].name
                    };
                    break;
                }
            }
        }
    };
    $scope.selected = function(vo, event) {
        $scope.setSelect(vo);
        $(event.target).addClass('active').siblings().removeClass('active');

    };
    $scope.editData = function() {
        $scope.dataValue.id = "";
        $scope.seach = $scope.dataValue.name;
        $scope.dataid = $scope.dataValue.id;
    };
    $scope.setDate = function() {
        if ($scope.dataValue && $scope.dataValue.id == "" && $scope.dataValue.name != "") {
            console.log(2);
            for (var i = 0; i < $scope.datalists.length; i++) {
                var item = $scope.datalists[i];
                var str = item.name.toLocaleLowerCase(),
                    str1 = $scope.dataValue.name.toLocaleLowerCase();
                if (str == str1) {
                    $scope.setSelect(item)
                    break;
                } else if (i == $scope.datalists.length - 1) {
                    $scope.setSelect();
                }
            };
        }
    };
    $scope.setSelect = function(vo) {
        if (vo) {
            $scope.dataValue = {
                id: vo.id,
                name: vo.name
            };
        } else {
            $scope.dataValue = {
                id: "",
                name: ""
            };
        };
        $scope.dataid = $scope.dataValue.id;

    };
}])