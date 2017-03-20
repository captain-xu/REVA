angular.module('lewaos').config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('sessionRecoverer');
    }
]);
angular.module('lewaos').factory('sessionRecoverer', ['$q', '$injector', '$location', "$rootScope",
    function($q, $injector, $location, $rootScope) {
        var sessionRecoverer = {
            responseError: function(response) {
                if (response.status == 901) {
                    $location.path('/user/login');
                }else if(response.status == 404){
                     $location.path('/error/one');
                };

                return $q.reject(response);
            }
        };
        return sessionRecoverer;
    }
]);
