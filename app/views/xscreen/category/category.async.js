var scope = ["$scope", "serviceAPI", 'urlAPI',
    function($scope, serviceAPI, urlAPI) {
        $scope.type = 0;
        $scope.typeName = 'All';
        $scope.loadList = function(){
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
        $scope.loadList();
    }
];
return scope;
