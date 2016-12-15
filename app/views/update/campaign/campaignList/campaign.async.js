var scope = ["$scope", "ModalAlert", "serviceAPI",  '$state', 'urlAPI', '$stateParams', '$location',
 function($scope, ModalAlert, serviceAPI, $state, urlAPI, $stateParams, $location) {
    $scope.appName = $stateParams.param;
    $scope.packageName = $stateParams.package;
    $scope.seachParam = {
        pageSize: 20,
        currentPage: 1,
        packageName: $scope.packageName
    };
    $scope.filterParam = {
        appfilter: 'All',
        typefilter: 'All'
    };
    $scope.defaultTitle = function(){
        var titleActive = $location.path();
        if (titleActive.indexOf('placement') > -1) {
            $scope.activeState = true;
        } else {
            $scope.activeState = false;
        }
    };
    $scope.changeTitle = function(str){
        if ((str == 'placement' && !$scope.activeState) || (str == 'device' && $scope.activeState)) {
            $scope.seachParam = {
                pageSize: 20,
                currentPage: 1,
                packageName: $scope.packageName
            };
            if ($scope.activeState) {
                $state.go('update.list.campaign.device');    
                $scope.loadDeviceList();
            } else {
                $state.go('update.list.campaign.placement');
                $scope.loadPlaceList();
            }
            $scope.activeState = !$scope.activeState;
        }
    };
    $scope.loadPlaceList = function() {
        serviceAPI.loadData(urlAPI.campaign_manage_list,$scope.seachParam).then(function(result) {
            $scope.list = result.placeList;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
    };
    $scope.loadDeviceList = function() {
        var params = {
            appname: $scope.packageName,
            page: 1,
            pagesize : 20,
            searchData: $scope.seachParam.searchData
        };
        serviceAPI.loadData(urlAPI.update_campDevlist, params).then(function(result){
            if (result.code == 0 && result.status == 0) {
                $scope.devlist = result.data.result;
                $scope.totalItems = result.data.totalcount;
            }
        })
    };
    $scope.loadAppList = function() {
        serviceAPI.loadData(urlAPI.campaign_appList).then(function(result) {
            $scope.appList = result.appList;
            $scope.typeList = result.typeList;
            $scope.appList.unshift({appId:'',name:'All'});
            $scope.typeList.unshift({typeId:'',name:'All'});
        }).
        catch(function(result) {});
    }
    $scope.searchBlur = function() {
        $scope.loadList();
    };
    $scope.typeFilter = function(vo) {
        $scope.seachParam.typeId = vo.typeId;
        $scope.filterParam.typefilter = vo.name;
        $scope.loadPlaceList();
    };
    $scope.changePageSize = function(num){
        $scope.seachParam.pageSize = num;
        $scope.loadList();
    };
    $scope.loadList = function(){
        if ($scope.activeState) {
            $scope.loadPlaceList();
        } else {
            $scope.loadDeviceList();
        }
    };
    $scope.init = function(){
        $scope.defaultTitle();
        $scope.loadList();
        $scope.loadAppList();
    };
    $scope.init();

}];
return scope;
