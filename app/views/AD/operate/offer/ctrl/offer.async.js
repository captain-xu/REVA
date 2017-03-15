var scope = ["$scope", "ModalAlert", "serviceAPI", '$state','$stateParams', 'urlAPI',
 function($scope, ModalAlert, serviceAPI, $state, $stateParams, urlAPI) {
    $scope.seachParam.order = 3;
    $scope.seachParam.orderBy = "";
    $scope.activeTab = 0;
    $scope.loadList = function() {
        if ($scope.activeTab) {
            $scope.loadOnList();
        } else {
            $scope.loadOffList();
        }
    }
    $scope.loadOffList = function() {
        serviceAPI.loadData(urlAPI.campaign_offer_list,$scope.seachParam).then(function(result) {
            $scope.list = result.offers;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
    };
    $scope.loadOnList = function() {
        serviceAPI.loadData(urlAPI.campaign_offerOn_list,$scope.seachParam).then(function(result) {
            $scope.list = result.offers;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
    };
    $scope.tabList = function(num){
        $scope.activeTab = num;
        $scope.seachParam.currentPage = 1;
        $scope.seachParam.order = 3;
        $scope.loadList();
    };
    $scope.loadSelectList = function() {
        serviceAPI.loadData(urlAPI.campaign_offer_cpx).then(function(result) {
            $scope.CPX = result.CPX;
            $scope.CPX.unshift('All')
        });
        serviceAPI.loadData(urlAPI.campaign_offer_adver).then(function(result) {
            $scope.adverList = result.advertisers;
             $scope.adverList.unshift({'name':'All','id':''})
        });
        serviceAPI.loadData(urlAPI.campaign_operate_area).then(function(result) {
            $scope.countryList = result.areaInfo;
             $scope.countryList.unshift({'name':'All','code':''})
        });
    };
    $scope.timer = null;
    $scope.searchBlur = function() {
        clearTimeout($scope.timer);
        $scope.timer = setTimeout(function() {
            $scope.loadList();
        }, 1000);
    };
    //advertiser下拉筛选
    $scope.adverFilter = function(vo) {
        $scope.seachParam.advertiserId = vo.id;
        $scope.filterParam.adverfilter = vo.name;
        $scope.loadList();
    };
    //CPX下拉筛选
    $scope.cpxFilter = function(cpx) {
        if (cpx == 'All') {
            $scope.seachParam.CPX = '';
        }else{
            $scope.seachParam.CPX = cpx;
        }
        $scope.filterParam.cpxfilter = cpx;
        $scope.loadList();
    };
    //country下拉筛选
    $scope.countryFilter = function(vo) {
        $scope.seachParam.countryCode = vo.code;
        $scope.filterParam.countryfilter = vo.name;
        $scope.loadList();
    };
    $scope.orderBy = function(num, str) {
        if ($scope.seachParam.order == num) {
            return;
        }
        $scope.seachParam.order = num;
        $scope.seachParam.orderBy = str;
        $scope.loadList();
    };
    $scope.deleteItem = function(vo) {
        ModalAlert.alert({
            value: "Are you sure to delete it?",
            closeBtnValue: "No",
            okBtnValue: "Yes",
            confirm: function() {
                var url = urlAPI.campaign_offer_delete;
                var paramId = {
                    offerId: vo.offerId,
                    advertiserId: vo.advertiserId
                }
                serviceAPI.delData(url,paramId).then(function(result){
                    if (result.result == 200) {
                        $scope.loadList();
                    } else {
                        ModalAlert.popup({msg: result.msg}, 2500)
                    }
                })
            }
        });
    };
    $scope.editDetail = function(vo) {
        $state.go("campaign.offer.detail", {id: vo.advertiserId, offerId: vo.offerId, rtb: vo.rtb});
    };
    $scope.viewDetail = function(vo) {
        $state.go("campaign.offer.view", {id: vo.advertiserId, offerId: vo.offerId, rtb: vo.rtb});
    };
    $scope.loadList();
    $scope.loadSelectList();
}];
return scope;