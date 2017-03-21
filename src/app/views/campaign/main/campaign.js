'use strict';

angular.module('app.controller').controller('campaignCtrl', ["$scope", 'toaster',
    function($scope, toaster) {
        $scope.seachParam = {
            pageSize: 20,
            currentPage: 1,
            adNetWork: 0
        };
        $scope.popAlert = function(type, title, body) {
            toaster.pop({
                type: type,
                title: title,
                body: body,
                showCloseButton: true,
                timeout: "3000"
            });
        };
    }
]);
