var scope = ["$scope",function($scope) {
    $scope.seachParam = {
        pageSize: 20,
        currentPage: 1,
        adNetWork: 0
    };
    $scope.filterParam = {
    	appfilter: 'All',
    	typefilter: 'All',
    	countryfilter: 'All',
    	cpxfilter: 'All',
    	adverfilter: 'All',
    	campfilter: 'All',
        placefilter: 'All',
    	category: 'All',
    	country: 'All'
    };
}];
return scope;
