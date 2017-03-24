'use strict';

angular.module('app.controller').controller('campaignOfferCtrl', 
    ["$scope", "SweetAlert", "serviceAPI", '$state', '$stateParams', 'urlAPI', "msgService",
    function($scope, SweetAlert, serviceAPI, $state, $stateParams, urlAPI, msgService) {
        $scope.seachParam.order = 3;
        $scope.seachParam.orderBy = "";
        $scope.activeTab = 0;
        $scope.loadList = function() {
            $scope.listloading = true;
            $scope.listnodata = false;
            if ($scope.activeTab) {
                $scope.loadOfferList(urlAPI.campaign_offerOn_list);
            } else {
                $scope.loadOfferList(urlAPI.campaign_offer_list);
            }
        }
        $scope.loadOfferList = function(url) {
            serviceAPI.loadData(url, $scope.seachParam).then(function(result) {
                if (!result.offers || result.offers.length == 0) {
                    $scope.listloading = false;
                    $scope.listnodata = true;
                    $scope.errorMsg = msgService.no_data;
                } else {
                    $scope.list = result.offers;
                    $scope.totalItems = result.totalCount;
                    $scope.listloading = false;
                    $scope.listnodata = false;
                }
            }).
            catch(function(result) {});
        };
        $scope.tabList = function(num) {
            $scope.activeTab = num;
            $scope.seachParam.currentPage = 1;
            $scope.seachParam.orderBy = "";
            $scope.seachParam.order = 3;
            $scope.loadList();
        };
        $scope.loadSelectList = function() {
            serviceAPI.loadData(urlAPI.campaign_offer_cpx).then(function(result) {
                $scope.CPX = result.CPX;
            });
            serviceAPI.loadData(urlAPI.campaign_offer_adver).then(function(result) {
                $scope.adverList = result.advertisers;
            });
            serviceAPI.loadData(urlAPI.campaign_operate_area).then(function(result) {
                $scope.countryList = result.areaInfo;
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
            $scope.seachParam.advertiserId = vo;
            // $scope.filterParam.adverfilter = vo.name;
            $scope.loadList();
        };
        //CPX下拉筛选
        $scope.cpxFilter = function(cpx) {
            $scope.seachParam.CPX = cpx;
            $scope.loadList();
        };
        //country下拉筛选
        $scope.countryFilter = function(vo) {
            $scope.seachParam.countryCode = vo;
            $scope.loadList();
        };
        $scope.orderBy = function(str) {
            $scope.seachParam.order = $scope.seachParam.order === 0 ? 1 : 0;
            $scope.seachParam.orderBy = str;
            $scope.loadList();
        };
        $scope.deleteItem = function(vo) {
            SweetAlert.swal({
                title: "Are you sure to delete it?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2ec02e",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, 
            function(isConfirm){ 
                if (isConfirm) {
                    var url = urlAPI.campaign_offer_delete;
                    var paramId = {
                        offerId: vo.offerId,
                        advertiserId: vo.advertiserId
                    };
                    serviceAPI.delData(url, paramId).then(function(result) {
                        if (result.result == 200) {
                            $scope.loadList();
                            SweetAlert.success("Success!", '');
                        } else {
                            SweetAlert.warning("Warning", result.msg);
                        }
                    }).catch(function() {});
                }
            });
        };
        $scope.editDetail = function(vo) {
            $state.go("campaign.offer.detail", { id: vo.advertiserId, offerId: vo.offerId, rtb: vo.rtb });
        };
        $scope.viewDetail = function(vo) {
            $state.go("campaign.offer.view", { id: vo.advertiserId, offerId: vo.offerId, rtb: vo.rtb });
        };
        $scope.loadList();
        $scope.loadSelectList();
    }
]);
