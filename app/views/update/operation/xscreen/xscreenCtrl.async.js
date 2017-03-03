var scope = ["$scope", "serviceAPI", 'urlAPI',
    function($scope, serviceAPI, urlAPI) {
        $scope.type = 0;
        $scope.typeName = 'All';
        $scope.loadList = function() {
            serviceAPI.getData(urlAPI.xscreen_list).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.cardList = result.data;
                }
            });
            serviceAPI.getData(urlAPI.xscreen_searchList).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.searchList = result.data;
                }
            });
            serviceAPI.getData(urlAPI.xscreen_channelList).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.channelList = result.data;
                }
            });
            serviceAPI.loadData(urlAPI.xscreen_categoryList, {type: $scope.type}).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.categoryList = result.data;
                }
            });  
        };
        $scope.selectType = function(num, str){
            $scope.type = num;
            $scope.typeName = str;
            $scope.loadList();
        };
        $scope.editData = function(list) {
            var param = {
                cid: list.cataid,
                name: list.truename
            };
            serviceAPI.updateData(urlAPI.xscreen_categoryEdit, param).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    
                }
            });  
        };
        $scope.init = function() {
            $scope.loadList();
        };
        $scope.init();
    }
];
return scope;
