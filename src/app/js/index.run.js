'use strict';

angular
    .module('lewaos')
    .run(['$rootScope', '$state', function($rootScope, $state) {
        $rootScope.$state = $state;
        // $rootScope.$on('$stateChangeSuccess', function() {
        // });
    }]);
