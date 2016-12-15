angular.module('app.services').factory("PowerService", [
    '$q',
    '$http',
    "$location",
    "ModalAlert",
    function($q, $http, $location, ModalAlert) {
        'use strict';
        var activeTitle = 'da';
        return {
            setActiveTitle: function(value) {
                activeTitle = value;
            },
            getActiveTitle: function() {
                return activeTitle;
            },
            signIn: function(url) {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: "/" + activeTitle + "/server/login",
                    data: JSON.stringify({
                        "authId": authId
                    }),
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            },
            logout: function() {
                $http({
                    method: "post",
                    url: "/auth/main/logout"
                }).success(function(result) {
                    location.href = "/";
                }).error(function(result) {});
            },
            getInfo: function(url) {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: url
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            },
            getInfoParam: function(url, param) {
                var defer = $q.defer();
                $http({
                    method: "post",
                    url: url,
                    data: param
                }).success(function(result) {
                    defer.resolve(result);
                }).error(function(result) {
                    defer.reject(result);
                });
                return defer.promise;
            }
        }
    }
])
