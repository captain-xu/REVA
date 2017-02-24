'use strict';
require('../alert/alertAPI');
require('../js/service/regexAPI');
require('../js/service/chartAPI');
require('../js/service/urlAPI');
require('../js/service/serviceAPI');

require('../main/layerCtrl');
/*import directive*/
require('../js/directive/validate');
require('../js/directive/daterange');
require('../js/directive/select');
require('../js/directive/slider');
require('../js/directive/selfDefine');
require('../js/directive/pullRefresh');

//update directive
require('app/views/update/version/newVersion/segment');
require('app/views/update/check/checkVersion/checkSegment');
require('app/views/update/version/segments/segments');
require('app/views/update/check/checkSegments/checkSegments');

//admin
require('app/views/admin/api/adminAPI');
require('app/views/error/errorCtrl');
angular.module('LewaOS').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/view/da');
    $stateProvider
        .state('error', {
            url: '/view/error',
            templateUrl: 'app/views/error/error.html'
        })
        .state('setupPassword', {
            url: '/setupPassword',
            templateUrl: 'app/views/user/setupPassword.html'
        })
        .state('changePassword', {
            url: '/changePassword',
            templateUrl: 'app/views/user/changePassword.html'
        })
        .state('userBasicInfo', {
            url: '/view/stub/userBasicInfo',
            templateUrl: 'app/views/stub/userBasicInfo.html'
        })
        .state('insertApp', {
            url: '/view/stub/appActive',
            templateUrl: 'app/views/stub/insertApp.html'
        })
        .state('push', {
            url: '/view/push',
            templateUrl: 'app/views/main/layout.html',
            params: { activeTitle: "push" }
        })
        .state('push.list', {
            url: '/list',
            templateUrl: 'app/views/push/list/list.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/list/listCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/list/listCtrl'); }
            }
        })
        .state('push.empty', {
            url: '/empty',
            templateUrl: 'app/views/push/list/empty.html'
        })
        .state('push.overview', {
            url: '/overview/:id',
            templateUrl: 'app/views/push/overview/pushOverview.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/overview/ctrl/pushOverviewCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/overview/ctrl/pushOverviewCtrl') }
            }
        })
        .state('push.latestWeek', {
            url: '/latestWeek/:id',
            templateUrl: 'app/views/push/weeklyReport/latestWeek/latestWeek.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/weeklyReport/latestWeek/ctrl/latestWeek.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/weeklyReport/latestWeek/ctrl/latestWeek') }
            }
        })
        .state('push.historyWeeks', {
            url: '/historyWeeks',
            templateUrl: 'app/views/push/weeklyReport/historyWeeks/historyWeeks.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/weeklyReport/historyWeeks/ctrl/historyWeeks.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/weeklyReport/historyWeeks/ctrl/historyWeeks') }
            }
        })
        .state('push.segments', {
            url: "/segments",
            templateUrl: 'app/views/push/segment/pushSegment.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/segment/pushSegment.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/segment/pushSegment') }
            }
        })
        .state('push.segmentDetail', {
            url: "/segmentDetail/:id",
            templateUrl: 'app/views/push/segment/newPushSegment.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/segment/newPushSegment.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/segment/newPushSegment') }
            }
        })
        .state('push.edit', {
            url: '/edit/:id',
            templateUrl: 'app/views/push/pushedit/edit.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/pushedit/edit.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { childArr: ["push.edit.targetuser", "push.edit.creative", "push.edit.scheduling", "push.edit.confirm"] },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/pushedit/edit') }
            }
        })
        .state('push.edit.targetuser', {
            url: '/targetuser',
            templateUrl: 'app/views/push/notification/targetuser.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/notification/ctrl/targetuserCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { step: 1 },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/notification/ctrl/targetuserCtrl') }
            }
        })
        .state('push.edit.creative', {
            url: '/creative',
            templateUrl: 'app/views/push/notification/creative.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/notification/ctrl/creativeCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { step: 2 },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/notification/ctrl/creativeCtrl') }
            }
        })
        .state('push.edit.scheduling', {
            url: '/scheduling',
            templateUrl: 'app/views/push/notification/scheduling.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/notification/ctrl/schedulingCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { step: 3 },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/notification/ctrl/schedulingCtrl') }
            }
        })
        .state('push.edit.confirm', {
            url: "/confirm",
            templateUrl: 'app/views/push/notification/confirm.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/notification/ctrl/confirmCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { step: 4 },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/notification/ctrl/confirmCtrl') }
            }
        })
        .state('push.editApp', {
            url: '/editApp/:id',
            templateUrl: 'app/views/push/pushedit/edit.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/pushedit/edit.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { childArr: ["push.editApp.apptargetuser", "push.editApp.appcreative", "push.editApp.appscheduling", "push.editApp.appconfirm"] },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/pushedit/edit') }
            }
        })
        .state('push.editApp.apptargetuser', {
            url: "/apptargetuser",
            templateUrl: 'app/views/push/appmessages/apptargetuser.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/appmessages/ctrl/apptargetuserCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { step: 1 },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/appmessages/ctrl/apptargetuserCtrl') }
            }
        })
        .state('push.editApp.appcreative', {
            url: "/appcreative",
            templateUrl: 'app/views/push/appmessages/appcreative.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/appmessages/ctrl/appcreativeCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { step: 2 },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/appmessages/ctrl/appcreativeCtrl') }
            }
        })
        .state('push.editApp.appscheduling', {
            url: "/appscheduling",
            templateUrl: 'app/views/push/appmessages/appscheduling.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/appmessages/ctrl/appschedulingCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { step: 3 },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/appmessages/ctrl/appschedulingCtrl') }
            }
        })
        .state('push.editApp.appconfirm', {
            url: "/appconfirm",
            templateUrl: 'app/views/push/appmessages/appconfirm.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/appmessages/ctrl/appconfirmCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            params: { step: 4 },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/appmessages/ctrl/appconfirmCtrl') }
            }
        })
        .state('push.launcher', {
            url: '/launcher',
            templateUrl: 'app/views/push/launcher/launcher.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/launcher/launcherCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/launcherCtrl/launcherCtrl') }
            }
        })
        .state('push.launcherEdit', {
            url: '/launcherEdit/:pushId',
            templateUrl: 'app/views/push/launcher/launcherEdit.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/launcher/launcherEditCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/launcher/launcherEditCtrl') }
            }
        })
        .state('push.settings', {
            url: "/settings",
            templateUrl: 'app/views/push/settings/settings.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/push/settings/settingCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('push/settings/settingCtrl') }
            }
        })
        .state('admin', {
            url: '/view/admin',
            templateUrl: 'app/views/main/layout.html',
            params: { activeTitle: "admin" }
        })
        .state('admin.app', {
            url: "/app",
            templateUrl: 'app/views/admin/app/appList/appList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/admin/app/appList/appListCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('admin/app/appList/appListCtrl') }
            }
        })
        .state('admin.newApp', {
            url: "/newApp/:id/:param",
            templateUrl: 'app/views/admin/app/newApp/newApp.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/admin/app/newApp/newAppCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('admin/app/newApp/newAppCtrl') }
            }
        })
        .state('admin.group', {
            url: '/group',
            templateUrl: 'app/views/main/main.html'
        })
        .state('admin.group.view', {
            url: '/view',
            templateUrl: 'app/views/admin/group/groupView.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/admin/group/groupViewCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('admin/group/groupViewCtrl') }
            }
        })
        .state('admin.group.edit', {
            url: '/edit',
            templateUrl: 'app/views/admin/group/groupEdit.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/admin/group/groupEditCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('admin/group/groupEditCtrl') }
            }
        })
        .state('admin.role', {
            url: '/role',
            templateUrl: 'app/views/main/main.html'
        })
        .state('admin.role.view', {
            url: '/view',
            templateUrl: 'app/views/admin/role/roleView.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/admin/role/roleViewCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('admin/role/roleViewCtrl') }
            }
        })
        .state('admin.role.edit', {
            url: '/edit',
            templateUrl: 'app/views/admin/role/roleEdit.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/admin/role/roleEditCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('admin/role/roleEditCtrl') }
            }
        })
        .state('admin.user', {
            url: '/user',
            templateUrl: 'app/views/main/main.html'
        })
        .state('admin.user.view', {
            url: '/view',
            templateUrl: 'app/views/admin/user/userView.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/admin/user/userViewCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('admin/user/userViewCtrl') }
            }
        })
        .state('admin.user.edit', {
            url: '/edit',
            templateUrl: 'app/views/admin/user/userEdit.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/admin/user/userEditCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('admin/user/userEditCtrl') }
            }
        })
        .state('da', {
            url: '/view/da',
            templateUrl: 'app/views/main/layout.html',
            params: { activeTitle: "da" }
        })
        .state('da.tableau', {
            url: '/tableau/:param',
            templateUrl: 'app/views/revanow/tableau.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/revanow/tableauCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('revanow/tableauCtrl') }
            }
        })
        .state('da.download', {
            url: '/download',
            templateUrl: 'app/views/revanow/dataDownload.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/revanow/tableauCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('revanow/tableauCtrl') }
            },
            params: { param: "data_download" }
        })
        .state('campaign', {
            url: "/view/campaign",
            templateUrl: 'app/views/main/layout.html',
            params: { activeTitle: "campaign" }
        })
        .state('campaign.dashboard', {
            url: "/dashboard",
            templateUrl: 'app/views/AD/dashboard/campaignOverview.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/dashboard/ctrl/campaignOverviewCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/dashboard/ctrl/campaignOverviewCtrl') }
            }
        })
        .state('campaign.list', {
            url: "/list",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.list.list', {
            url: "/list",
            templateUrl: 'app/views/AD/placement/management/management.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/management/ctrl/management.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/management/ctrl/management') }
            }
        })
        .state('campaign.list.detail', {
            url: "/detail/:param/:id",
            templateUrl: 'app/views/AD/placement/management/managementList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/management/ctrl/managementList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/management/ctrl/managementList') }
            }
        })
        .state('campaign.placement', {
            url: "/placement/:param/:id",
            templateUrl: 'app/views/AD/placement/management/placement.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/management/ctrl/placement.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/management/ctrl/placement') }
            }
        })
        .state('campaign.placementList', {
            url: "/placementList/:id",
            templateUrl: 'app/views/AD/placement/management/placementList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/management/ctrl/placementList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/management/ctrl/placementList') }
            }
        })
        .state('campaign.showtype', {
            url: "/showtype",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.showtype.list', {
            url: "/list",
            templateUrl: 'app/views/AD/placement/show_type/showType.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/show_type/ctrl/showType.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/show_type/ctrl/showType') }
            }
        })
        .state('campaign.showtype.detail', {
            url: "/detail/:param/:id",
            templateUrl: 'app/views/AD/placement/show_type/showTypeList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/show_type/ctrl/showTypeList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/show_type/ctrl/showTypeList') }
            }
        })
        .state('campaign.group', {
            url: "/group",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.group.list', {
            url: "/list",
            templateUrl: 'app/views/AD/placement/group/group.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/group/ctrl/group.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/group/ctrl/group') }
            }
        })
        .state('campaign.group.detail', {
            url: "/detail/:param/:id",
            templateUrl: 'app/views/AD/placement/group/groupList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/group/ctrl/groupList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/group/ctrl/groupList') }
            }
        })
        .state('campaign.report', {
            url: "/report",
            templateUrl: 'app/views/AD/report/report.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/report/ctrl/report.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/report/ctrl/report') }
            }
        })
        .state('campaign.app', {
            url: "/app",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.app.list', {
            url: "/list",
            templateUrl: 'app/views/AD/app/app.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/app/ctrl/app.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/app/ctrl/app') }
            }
        })
        .state('campaign.app.detail', {
            url: "/detail/:param/:id",
            templateUrl: 'app/views/AD/app/appList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/app/ctrl/appList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/app/ctrl/appList') }
            }
        })
        .state('campaign.operation', {
            url: "/operation",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.operation.list', {
            url: "/list",
            templateUrl: 'app/views/AD/operate/operation/operation.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/operate/operation/ctrl/operation.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/operate/operation/ctrl/operation') }
            }
        })
        .state('campaign.operation.operation', {
            url: "/operation/:param/:id",
            templateUrl: 'app/views/AD/operate/operation/operationList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/operate/operation/ctrl/operationList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/operate/operation/ctrl/operationList') }
            }
        })
        .state('campaign.operation.network', {
            url: "/network/:param/:id",
            templateUrl: 'app/views/AD/operate/operation/network.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/operate/operation/ctrl/network.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/operate/operation/ctrl/network') }
            }
        })
        .state('campaign.offer', {
            url: "/offer",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.offer.list', {
            url: "/list",
            templateUrl: 'app/views/AD/operate/offer/offer.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/operate/offer/ctrl/offer.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/operate/offer/ctrl/offer') }
            }
        })
        .state('campaign.offer.detail', {
            url: "/detail/:id/:offerId/:rtb",
            templateUrl: 'app/views/AD/operate/offer/offerList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/operate/offer/ctrl/offerList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/operate/offer/ctrl/offerList') }
            }
        })
        .state('campaign.offer.view', {
            url: "/view/:id/:offerId/:rtb",
            templateUrl: 'app/views/AD/operate/offer/offerView.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/operate/offer/ctrl/offerView.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/operate/offer/ctrl/offerView') }
            }
        })
        .state('campaign.owner', {
            url: "/owner",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.owner.list', {
            url: "/list",
            templateUrl: 'app/views/AD/owner/owner.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/owner/ctrl/owner.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/owner/ctrl/owner') }
            }
        })
        .state('campaign.owner.detail', {
            url: "/detail/:param/:id",
            templateUrl: 'app/views/AD/owner/ownerList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/owner/ctrl/ownerList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/owner/ctrl/ownerList') }
            }
        })
        .state('campaign.creative', {
            url: "/creative",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.creative.list', {
            url: "/list",
            templateUrl: 'app/views/AD/creative/creative.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/creative/ctrl/creative.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/creative/ctrl/creative') }
            }
        })
        .state('campaign.creative.detail', {
            url: "/detail/:id",
            templateUrl: 'app/views/AD/creative/creativeList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/creative/ctrl/creativeList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/creative/ctrl/creativeList') }
            }
        })
        .state('campaign.appinfo', {
            url: "/appinfo",
            templateUrl: 'app/views/AD/main/main.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/main/main.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/main/main') }
            }
        })
        .state('campaign.appinfo.list', {
            url: "/list",
            templateUrl: 'app/views/AD/GP/appinfo/appinfo.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/GP/appinfo/ctrl/appinfo.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/GP/appinfo/ctrl/appinfo') }
            }
        })
        .state('campaign.appinfo.detail', {
            url: "/detail/:id",
            templateUrl: 'app/views/AD/GP/appinfo/appinfoList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/GP/appinfo/ctrl/appinfoList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/GP/appinfo/ctrl/appinfoList') }
            }
        })
        .state('update', {
            url: "/view/update",
            templateUrl: 'app/views/main/layout.html',
            params: {
                activeTitle: "osdiy"
            },
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/version/newVersion/segmentCtrl') }
            }
        })
        .state('update.list', {
            url: "/list/:param/:package",
            templateUrl: 'app/views/update/list/list.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/list/listCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/list/listCtrl') }
            }
        })
        .state('update.list.version', {
            url: "/version",
            templateUrl: 'app/views/update/version/versionList/versionList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/version/versionList/versionListCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/version/versionList/versionListCtrl') }
            }
        })
        .state('update.list.extends', {
            url: "/extends",
            templateUrl: 'app/views/update/extends/extendList/extend.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/extends/extendList/extendCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/extends/extendList/extendCtrl') }
            }
        })
        .state('update.list.campaign', {
            url: "/campaign",
            templateUrl: 'app/views/update/campaign/campaignList/campaign.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/campaign/campaignList/campaign.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/campaign/campaignList/campaign') }
            }
        })
        .state('update.list.campaign.placement', {
            url: "/placement",
            templateUrl: 'app/views/update/campaign/placement/placement.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/campaign/placement/placement.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/campaign/placement/placement') }
            }
        })
        .state('update.newPlace', {
            url: "/newPlace/:id/:param/:package",
            templateUrl: 'app/views/AD/placement/management/managementList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/AD/placement/management/ctrl/managementList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('AD/placement/management/ctrl/managementList') }
            }
        })
        .state('update.list.campaign.device', {
            url: "/device",
            templateUrl: 'app/views/update/campaign/device/device.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/campaign/device/device.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/campaign/device/device') }
            }
        })
        .state('update.newVersion', {
            url: "/newVersion/:id/:param/:app/:package",
            templateUrl: 'app/views/update/version/newVersion/detail.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/version/newVersion/versionCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/version/newVersion/versionCtrl') }
            }
        })
        .state('update.checkVersion', {
            url: "/checkVersion/:id/:param",
            templateUrl: 'app/views/update/check/checkVersion/checkDetail.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/check/checkVersion/checkVersionCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/check/checkVersion/checkVersionCtrl') }
            }
        })
        .state('update.newHotfix', {
            url: "/newHotfix/:id/:param/:app/:package",
            templateUrl: 'app/views/update/version/newHotfix/hotfix.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/version/newHotfix/hotfixCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/version/newHotfix/hotfixCtrl') }
            }
        })
        .state('update.checkHotfix', {
            url: "/checkHotfix/:app/:id/:param",
            templateUrl: 'app/views/update/check/checkHotfix/checkHotfix.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/check/checkHotfix/checkHotfixCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/check/checkHotfix/checkHotfixCtrl') }
            }
        })
        .state('update.newExtend', {
            url: "/newExtend/:id/:name/:param/:package",
            templateUrl: 'app/views/update/extends/newExtend/newExtend.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/extends/newExtend/newExtendCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/extends/newExtend/newExtendCtrl') }
            }
        })
        .state('update.newDevice', {
            url: "/newDevice/:id/:name/:param/:package",
            templateUrl: 'app/views/update/campaign/newDevice/newDevice.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/update/campaign/newDevice/newDevice.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('update/campaign/newDevice/newDevice') }
            }
        })
        .state('xscreen', {
            url: "/view/xscreen",
            templateUrl: 'app/views/main/layout.html',
            params: { activeTitle: "operation" }
        })
        .state('xscreen.card', {
            url: "/card",
            templateUrl: 'app/views/xscreen/card/cardList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/card/listCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/card/listCtrl') }
            }
        })
        .state('xscreen.cardDetail', {
            url: "/card-detail/:id/:name/:param",
            templateUrl: 'app/views/xscreen/card/detail.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/card/detailCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/card/detailCtrl') }
            }
        })
        .state('xscreen.search', {
            url: "/search",
            templateUrl: 'app/views/xscreen/search/searchList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/search/searchCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/search/searchCtrl') }
            }
        })
        .state('xscreen.searchConfig', {
            url: "/searchConfig/:id/:name/:param",
            templateUrl: 'app/views/xscreen/search/searchConfig.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/search/searchConfigCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/search/searchConfigCtrl') }
            }
        })
        .state('xscreen.channel', {
            url: "/channel",
            templateUrl: 'app/views/xscreen/channel/channelList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/channel/channelCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/channel/channelCtrl') }
            }
        })
        .state('xscreen.channelConfig', {
            url: "/channelConfig/:id/:name/:param",
            templateUrl: 'app/views/xscreen/channel/channelConfig.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/channel/channelConfigCtrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/channel/channelConfigCtrl') }
            }
        })
        // .state('xscreen.service', {
        //     url: "/service",
        //     templateUrl: 'app/views/xscreen/service/serviceList.html',
        //     controller: ['$scope', "$injector", function($scope, $injector) {
        //         require.async('app/views/xscreen/service/serviceCtrl.async.js', function(ctrl) {
        //             $injector.invoke(ctrl, this, { '$scope': $scope });
        //         })
        //     }],
        //     resolve: {
        //         resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/service/serviceCtrl') }
        //     }
        // })
        // .state('xscreen.serviceConfig', {
        //     url: "/serviceConfig/:id/:name/:param",
        //     templateUrl: 'app/views/xscreen/service/serviceConfig.html',
        //     controller: ['$scope', "$injector", function($scope, $injector) {
        //         require.async('app/views/xscreen/service/serviceConfigCtrl.async.js', function(ctrl) {
        //             $injector.invoke(ctrl, this, { '$scope': $scope });
        //         })
        //     }],
        //     resolve: {
        //         resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/service/serviceConfigCtrl') }
        //     }
        // })
        .state('xscreen.configUrl', {
            url: "/configUrl/:id/:cardid/:name",
            templateUrl: 'app/views/xscreen/configUrl/configUrl.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/configUrl/configUrl.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/configUrl/configUrl') }
            }
        })
        .state('xscreen.configPlace', {
            url: "/configPlace/:id/:cardid/:name",
            templateUrl: 'app/views/xscreen/configPlace/configPlace.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/configPlace/configPlace.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/configPlace/configPlace') }
            }
        })
        .state('xscreen.category', {
            url: "/category",
            templateUrl: 'app/views/xscreen/category/category.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/xscreen/category/category.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('xscreen/category/category') }
            }
        })
        .state('cms', {
            url: "/view/cms",
            templateUrl: 'app/views/main/layout.html',
            params: {
                activeTitle: "cms"
            }
        })
        .state('cms.packageList', {
            url: "/packageList",
            templateUrl: 'app/views/cms/packages/packageList.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/cms/packages/packageList.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('cms/packages/packageList') }
            }
        })
        .state('cms.packageEdit', {
            url: "/packageEdit/:status/:id/:app",
            templateUrl: 'app/views/cms/packages/packageEdit.html',
            controller: ['$scope', "$injector", function($scope, $injector) {
                require.async('app/views/cms/packages/packageEdit.async.js', function(ctrl) {
                    $injector.invoke(ctrl, this, { '$scope': $scope });
                })
            }],
            resolve: {
                resourceMap: function(serviceAPI) { serviceAPI.resourceMap('cms/packages/packageEdit') }
            }
        });
});
