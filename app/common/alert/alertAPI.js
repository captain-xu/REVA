angular.module('app.services').factory('ModalAlert', ["$uibModal", function($uibModal) {
    return {
        alert: function(options) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/common/alert/alert.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    options: options
                }
            });
        },
        popup: function(options,timeout) {
            $uibModal.open({
                template: '<div class="modal-body popup">{{items.msg}}</div>',
                controller: ["$scope", "$uibModalInstance", "options", function($scope, $uibModalInstance, options) {
                    $scope.items = options;
                    setTimeout(function() {
                        $uibModalInstance.dismiss('cancel');
                    }, timeout)
                }],
                resolve: {
                    options: options
                }
            });
        },
        comfirm: function(options) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/common/alert/comfirm.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    options: options
                }
            });
        },
        warning: function(options,timeout,timer) {
            var tip = $('<div class="dafaultTip alert-warning" role="alert">' +
                            '<p class="warning"><i class="fa fa-exclamation"></i><strong>Warning</strong></p>' + 
                            '<br>' + 
                            '<p class="content">' + options.msg + '</p>' +
                        '</div>');
            tip.appendTo('body');
            $('.alert-warning').slideDown();
            setTimeout(function() {
                $('.alert-warning').remove();
            }, timeout);
        },
        success: function(options,timeout) {
            var tip = $('<div class="dafaultTip alert-success" role="alert">' +
                            '<i class="success glyphicon glyphicon-ok"></i>' +
                            '<strong>' + options.msg + '</strong>' +
                        '</div>');
            tip.appendTo('body');
            $('.alert-success').slideDown();
            setTimeout(function() {
                $('.alert-success').remove();
            }, timeout);
        },
        error: function(options,timeout) {
            var tip = $('<div class="dafaultTip alert-danger" role="alert">' +
                            '<p class="error"><i class="glyphicon glyphicon-remove"></i><strong>Error</strong></p>' + 
                            '<br>' + 
                            '<p class="content">' + options.msg + '</p>' +
                        '</div>');
            tip.appendTo('body');
            $('.alert-danger').slideDown();
            setTimeout(function() {
                $('.alert-danger').remove();
            }, timeout);
        }
    }
}]);

angular.module('app.controller').controller('ModalInstanceCtrl', function($scope, $uibModalInstance, options) {
    $scope.items = options;
    $scope.ok = function() {
        $uibModalInstance.close();
        $scope.items.confirm();
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
