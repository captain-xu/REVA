/**
 * INSPINIA - Responsive Admin Theme
 *
 */
function config($translateProvider) {

    $translateProvider
        .translations('en', {
            // Define all menu elements
            DASHBOARD: 'Overview',
            DEVICE: 'Device',
            SALES: 'Sales Detail',
            APP: 'App'
        })
        .translations('zh', {
            // Define all menu elements
            DASHBOARD: ' 仪表盘',
            DEVICE: '机型',
            SALES: '销量报表',
            APP: '应用程序'
        });

    $translateProvider.preferredLanguage('en');

};

angular
    .module('lewaos')
    .config(config);
