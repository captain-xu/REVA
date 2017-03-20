'use strict';

angular.module('app.controller').controller('campaignCtrl',
    ["$scope",function($scope) {
        $scope.seachParam = {
            pageSize: 20,
            currentPage: 1,
            adNetWork: 0
        }
    }]
);