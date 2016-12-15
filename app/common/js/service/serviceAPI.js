angular.module('app.services').factory('serviceAPI', [
    '$http',
    '$q',
    function($http, $q) {
        'use strict';
        return {
            getData: function(url, params) {
                var defer = $q.defer();
                $http({
                    method: "get",
                    url: url,
                    data: params
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            },
            loadData: function(url, params) {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: url,
                    data: params
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            },
            saveData: function(url, params) {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: url,
                    data: params
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            },
            updateData: function(url, params) {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: url,
                    data: params
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            },
            delData: function(url, params) {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: url,
                    data: params
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            },
            resourceMap: function(url) {
                 url = "views/" + url + ".async";
                var res = {};
                var vo = {
                    "url": "/statics/app/" + url + ".js${TimeStampIndicator}",
                    "type": "js"
                };
                res[url] = vo;
                require.resourceMap({
                    "res": res,
                    "pkg": {}
                });
                return true;
            }
        };
    }
]);
