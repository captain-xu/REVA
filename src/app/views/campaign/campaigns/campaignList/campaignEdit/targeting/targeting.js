angular.module('app.directive').directive('targeting', [function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'app/views/campaign/campaigns/campaignList/campaignEdit/targeting/targeting.html',
        transclude: false,
        scope: {
            targeting: "=attrTargeting",
            state: "=attrState"
        },
        controller: 'targrtingCtrl'
    }
}])