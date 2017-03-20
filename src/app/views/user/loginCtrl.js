'use strict';
/**
 *  Module
 *
 * Description
 */
angular.module('app.controller').controller('loginCtrl', [
    "$scope", "serviceAPI", 'toaster',
    function($scope, serviceAPI, toaster) {
        $scope.signupForm = function() {
            if ($scope.signup_form.$valid) {
                serviceAPI.loadData('/auth/main/login', {
                    "userName": $scope.username,
                    "password": $scope.password
                }).then(function(result) {
                    if (result.status == 0) {
                       
                        $scope.getLoginUser();
                    }
                })
            } else {
                $scope.signup_form.submitted = true;
            }
        };
    }
]).controller('passCtrl', [
    "$scope", "serviceAPI", 'toaster',
    function($scope, serviceAPI, toaster) {
        $scope.confirm = function() {
            $scope.diff = false;
            if ($scope.pass_form.$valid) {
                if ($scope.new_pass != $scope.confirm_pass) {
                    $scope.diff = true
                    $scope.pass_form.submitted = true;
                    return;
                } else {
                    serviceAPI.loadData('/admin/user/changePassword', {
                        'oldPassword': $scope.old_pass,
                        'newPassword': $scope.new_pass
                    }).then(function(result) {
                        if (result.status == 0) {
                            toaster.success({ body:"Change password successfully"});
                            $scope.logout();
                        }
                    })
                }

            } else {
                $scope.pass_form.submitted = true;

            }
        };
    }
]);
