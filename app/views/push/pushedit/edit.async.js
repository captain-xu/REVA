var scope = ["$scope", "serviceAPI", '$stateParams', 'urlAPI', '$state',
    function($scope, serviceAPI, $stateParams, urlAPI, $state) {
        $scope.currentStep = 1;
        $scope.targetApp = "";
        $scope.getStep = function() {
            serviceAPI.loadData(urlAPI.push_step, { "pushId": $stateParams.id }).then(function(result) {
                $scope.step = result.data.step;
            });
        };
        $scope.nextStep = function(num, url) {
            $scope.currentStep = num;
            if ($scope.step < num) {
                $scope.step = num;
            };
            $state.go(url);
        };
        $scope.goStep = function(num) {
            if ($scope.step < num && $scope.step < 3) {
                return;
            };
            $scope.currentStep = num;
            $state.go($scope.childArr[num-1]);
        };
        $scope.goList = function() {
            $state.go("push.list");
        };
        $scope.setAppName = function(name) {
            $scope.targetApp = name;
        };
        $scope.setPushId = function(id) {
            $scope.pushId = id;
        };
        $scope.init = function() {
            $scope.childArr=$stateParams.childArr;
            if ($stateParams.step > $scope.currentStep) {
                if ($state.current.name.indexOf(".editApp.") >= 0) {
                    $state.go('push.editApp.apptargetuser');
                } else {
                    $state.go('push.edit.targetuser');
                }
            };
            if ($stateParams.id != "new") {
                $scope.pushId = $stateParams.id;
                $scope.getStep();
            } else {
                $scope.pushId = '';
                $scope.step = 1;
            }
        };
        $scope.init();
    }
];
return scope;
