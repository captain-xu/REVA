'use strict';

angular
    .module('lewaos')
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/user/login');
        $stateProvider
            .state('login', {
                url: "/user/login",
                templateUrl: "app/views/user/login.html",
                data: { specialClass: 'gray-bg' }
            })
            .state('error', {
                url: "/error/one",
                templateUrl: "app/views/error/errorOne.html",
                data: { specialClass: 'gray-bg' }
            })
            .state('password', {
                url: "/user/change_password",
                templateUrl: "app/views/user/change_password.html",
                data: { specialClass: 'gray-bg' }
            })
            .state('view', {
                url: "/view",
                templateUrl: "app/components/common/content.html"
            })
            .state('view.deviceDashboard', {
                url: "/device/dashboard",
                templateUrl: "app/views/da/device/dashboard.html",
                data: { showTitle: true, pageTitle: "Sales Overview", breadcrumb: ["Data Analytics", 'Device'], currentPage: 'Sales Overview' }
            })
            .state('view.deviceSales', {
                url: "/deviceSales",
                templateUrl: "app/views/da/device/detail.html",
                data: { showTitle: true, pageTitle: "Sales Detail", breadcrumb: ["Data Analytics", 'Device'], currentPage: 'Sales Detail' }
            })
            .state('view.appOverview', {
                url: "/app/overview",
                templateUrl: "app/views/da/app/overview.html",
                data: { showTitle: true, pageTitle: "User Overview", breadcrumb: ["Data Analytics", 'App'], currentPage: 'Overview' }
            })
            .state('view.appNewUser', {
                url: "/app/new_user/detail",
                templateUrl: "app/views/da/app/new_detail.html",
                data: { showTitle: true, pageTitle: "New User Detail", breadcrumb: ["Data Analytics", 'App'], currentPage: 'New User' }
            })
            .state('view.appActiveUser', {
                url: "/app/active_user/detail",
                templateUrl: "app/views/da/app/active_detail.html",
                data: { showTitle: true, pageTitle: "Active User Detail", breadcrumb: ["Data Analytics", 'App'], currentPage: 'Active User' }
            })
            .state('view.appComparison', {
                url: "/app/comparison",
                templateUrl: "app/views/da/app/comparison.html",
                data: { showTitle: true, pageTitle: "APP Comparison", breadcrumb: ["Data Analytics", 'App'], currentPage: 'Comparison' }
            }).state('view.pushMsgList', {
                url: "/message/list",
                templateUrl: "app/views/push/message/list.html",
                data: { showTitle: true, pageTitle: "Messages List", breadcrumb: ["Push", 'message'], currentPage: 'List' }
            })
            .state('view.pushDetail', {
                url: "/detail",
                templateUrl: "app/views/push/message/detail.html",

                data: { showTitle: false}
            })
            .state('view.pushDetail.step1', {
                url: "/step1",
                templateUrl: "app/views/push/message/notif/step1.html",
                params:{'id':{}},
                data: { showTitle: false}
            })
            .state('view.campaign', {
                url: "/campaign",
                templateUrl: "app/views/campaign/main/campaign.html"
            })
            .state('view.campaign.dashboard', {
                url: "/dashboard",
                templateUrl: "app/views/campaign/dashboard/campaignDashboard.html",
                data: { showTitle:true, pageTitle: "Dashboard", breadcrumb: ["Campaign"], currentPage: 'Dashboard' }
            })
            .state('view.campaign.campaignList', {
                url: "/campaignList",
                templateUrl: "app/views/campaign/campaigns/campaignList/campaignList.html",
                data: { showTitle:true, pageTitle: "Campaign List", breadcrumb: ["Campaign", "Campaigns"], currentPage: 'Campaign List' }
            })
            .state('view.campaign.operation', {
                url: "/operation/:param/:id",
                templateUrl: "app/views/campaign/campaigns/campaignList/campaignEdit/operation.html",
                data: { showTitle:true, pageTitle: "Operation Edit", breadcrumb: ["Campaign", "Campaigns"], currentPage: 'Operation Edit' }
            })
            .state('view.campaign.network', {
                url: "/network/:param/:id",
                templateUrl: "app/views/campaign/campaigns/campaignList/campaignEdit/network.html",
                data: { showTitle:true, pageTitle: "AdNetwork Edit", breadcrumb: ["Campaign", "Campaigns"], currentPage: 'AdNetwork Edit' }
            })
            .state('view.campaign.creatives', {
                url: "/creatives",
                templateUrl: "app/views/campaign/campaigns/creatives/creatives.html",
                data: { showTitle:true, pageTitle: "Creatives", breadcrumb: ["Campaign", "Campaigns"], currentPage: 'Creatives' }
            })
            .state('view.campaign.creativeEdit', {
                url: "/creativeEdit/:id",
                templateUrl: "app/views/campaign/campaigns/creatives/creativeEdit.html",
                data: { showTitle:true, pageTitle: "Creative Edit", breadcrumb: ["Campaign", "Campaigns"], currentPage: 'Creative Edit' }
            })
    });
