var scope = ["$scope", "serviceAPI", "$state",'$stateParams', 'urlAPI',
 function($scope, serviceAPI, $state, $stateParams, urlAPI) {
    $scope.viewDetail = function() {
        var param = {
            offerId: $stateParams.offerId,
            advertiserId: $stateParams.id
        }
        serviceAPI.loadData(urlAPI.campaign_offer_detail,param).then(function(result) {
            $scope.detailVO = result.offer;
        }).
        catch(function(result) {});
    };
    $scope.cancel = function() {
        history.go(-1);
    };
    $scope.viewDetail();
}];
return scope;
