'use strict';
angular.module('app.controller', []);
angular.module('app.services', []);
angular.module('app.directive', []);
angular.module('lewaos', ['ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'app.controller',
    'app.services',
    'app.directive',
    'pascalprecht.translate',
    'toaster',
    'oitozero.ngSweetAlert',
    'ngFileUpload'
]);
