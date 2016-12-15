angular.module('app.services').factory('tableauAPI', [
    '$http',
    '$q',
    '$location',
    function($http, $q, $location) {
        'use strict';
        var tableauHost = "https://report.revanow.com/",
            tableauParam = "?:embed=y&:showShareOptions=true&:display_count=no&:showVizHome=no&:toolbar=no&:render=false",

            // "":testing  _0:demo _1:production _2:staging
            envFlag = "${TableauEnvironmentIndicator}";

        return {
            // Dashboard
            dashboard: tableauHost + "views/Dashboard" + envFlag + "/Dashboard" + tableauParam,
            getDashboard: function(ticket) {
                var dashboard = tableauHost + "trusted/" + ticket + "/views/Dashboard" + envFlag + "/Dashboard" + tableauParam;
                return dashboard;
            },
            // Model
            model_overview: tableauHost + "views/ModelOverview" + envFlag + "/ModelOverview" + tableauParam,
            model_monthly: tableauHost + "views/ModelMonthlyAnalysis" + envFlag + "/ModelMonthlyAnalysis" + tableauParam,
            model_weekly: tableauHost + "views/ModelWeeklyAnalysis" + envFlag + "/ModelWeeklyAnalysis" + tableauParam,
            model_trend: tableauHost + "views/ModelTrendAnalysis" + envFlag + "/ModelTrendAnalysis" + tableauParam,

            // Region
            region_overview: tableauHost + "views/RegionalOverview" + envFlag + "/RegionalOverview" + tableauParam,
            region_monthly: [
                tableauHost + "views/RegionalMonthlyStateAnalysis" + envFlag + "/RegionalMonthlyStateAnalysis" + tableauParam,
                tableauHost + "views/RegionalMonthlyCityAnalysis" + envFlag + "/RegionalMonthlyCityAnalysis" + tableauParam
            ],
            region_weekly: [
                tableauHost + "views/RegionalWeeklyStateAnalysis" + envFlag + "/RegionalWeeklyStateAnalysis" + tableauParam,
                tableauHost + "views/RegionalWeeklyCityAnalysis" + envFlag + "/RegionalWeeklyCityAnalysis" + tableauParam
            ],
            region_contrast: tableauHost + "views/RegionalContrastAnalysis" + envFlag + "/RegionalContrastAnalysis" + tableauParam,

            // APP Analysis
            // user_basis: tableauHost + "views/UserScaleAnalysis" + envFlag + "/UserScaleAnalysis" + tableauParam,
            // user_engagement: tableauHost + "views/UserEngagementAnalysis" + envFlag + "/UserEngagementAnalysis" + tableauParam,

            //Data Download
            data_donwload: tableauHost + "views/DataDownload" + envFlag + "/DataDownload" + tableauParam,
            os_analysis: [
                tableauHost + "views/OS" + envFlag + "/Overview" + tableauParam,
                tableauHost + "views/OS" + envFlag + "/NewUsers" + tableauParam,
                tableauHost + "views/OS" + envFlag + "/ActiveUsers" + tableauParam

            ],
            os_basic: tableauHost + "views/Demo/OSUserBasic" + tableauParam,
            basic_behavior: tableauHost + "views/Demo/BasicBehavior" + tableauParam,
            data_behavior: tableauHost + "views/Demo/DataBehavior" + tableauParam,
            app_behavior: tableauHost + "views/Demo/APPBehavior" + tableauParam,
            app_basic: tableauHost + "views/Demo/APPUserBasic" + tableauParam,
            retention: tableauHost + "views/Demo/APPRetention" + tableauParam,
            participation: tableauHost + "views/Demo/APPParticipation" + tableauParam,

            user_basis: [
                tableauHost + "views/APPUsers" + envFlag + "/Overview" + tableauParam,
                tableauHost + "views/Launcher" + envFlag + "/UserBasis" + tableauParam
            ],
            revenue_report: [
                tableauHost + "views/Launcher" + envFlag + "/RevenueReport" + tableauParam,
            ],
            btn_bar: function() {
                var vo = {
                    user_basis: ["Pre Install", "Launcher"]
                };
                return vo;
            },
            getTicket: function() {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: "/auth/da/getTicket"
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            },
            activate: function() {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: "/auth/da/validate"
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            }

        };
    }
])
