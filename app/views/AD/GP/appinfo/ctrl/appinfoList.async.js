var scope = ["$scope", "$state",'$stateParams',"serviceAPI", 'urlAPI',
 function($scope, $state, $stateParams, serviceAPI, urlAPI) {
    $scope.getDetail = function() {
        var param = {
            id: $stateParams.id
        }
        serviceAPI.loadData(urlAPI.campaign_appInfo_detail,param).then(function(result) {
            $scope.detailVO = result.appInfo;
        }).
        catch(function(result) {});
    };
    $scope.cancel = function(){
        $state.go('campaign.appinfo.list');
    };
    $scope.getDetail();
}];
return scope;
