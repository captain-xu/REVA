angular.module('app.controller', []);
angular.module('app.services', []);
angular.module('app.directive', []);
angular.module('app.filter', []);
var modules = angular.module('LewaOS', ['ui.bootstrap',
    'ui.router',
    'ngFileUpload',
    'app.controller',
    'app.services',
    'app.directive',
    'app.filter',
    'ngSanitize',
    'jsonFormatter'
]);

modules.factory('sessionRecoverer', ['$q', '$injector', '$location', "$rootScope",
    function($q, $injector, $location, $rootScope) {
        var sessionRecoverer = {
            responseError: function(response) {
                if (response.status == 901) {
                    function jump(count, state) {
                        if ($(".alert").hasClass('hide') || state) {
                            $(".alert").removeClass('hide');
                            window.setTimeout(function() {
                                count--;
                                if (count > 0) {
                                    $('#num').html(count);
                                    jump(count, 1);
                                } else {
                                    location.href = "/";

                                }
                            }, 1000);
                        }
                    };
                    if (response.config.url == "/auth/main/getLoginUser" || response.config.url == "/auth/admin/getMenu" || response.config.url == "/auth/admin/getTitle") {
                        location.href = "/";

                    } else {
                        jump(5);
                    }

                } else if (response.status == 404) {
                    location.href = "/error/404.html";
                } else if (response.status < 100) {
                    // No such result code. Especially handle the unexpected result in Firefox.
                } else {
                    $rootScope.status = response.status;
                    // $location.path("/view/error");
                }

                return $q.reject(response);
            }
        };
        return sessionRecoverer;
    }
]);

modules.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('sessionRecoverer');
    }
]);
require('parentCtrl');
require('common/router/router');
