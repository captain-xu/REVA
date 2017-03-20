var scope = ["$scope", "ModalAlert", '$state','$stateParams',"serviceAPI", 'urlAPI',  
 function($scope, ModalAlert, $state, $stateParams, serviceAPI, urlAPI) {
    $scope.orderField = 'id';
    $scope.desc = true;
    $scope.loadList = function() {
        serviceAPI.loadData(urlAPI.campaign_appInfo_list,$scope.seachParam).then(function(result) {
            $scope.list = result.appInfoList;
            $scope.totalItems = result.totalCount;
        }).
        catch(function(result) {});
        if ($scope.seachParam.publishTimeStart && $scope.seachParam.publishTimeStart != '') {
            $("#datarangeSelect").attr('value', $scope.seachParam.publishTimeStart + '~' + $scope.seachParam.publishTimeEnd);
        } else {
            $("#datarangeSelect").attr('value', '');
        }
    };
    $scope.searchBlur = function() {
        $scope.loadList();
    };
    $scope.loadCategory = function() {
        if (!$scope.category || $scope.category.length == 0) {
            serviceAPI.loadData(urlAPI.campaign_appInfo_category).then(function(result) {
                $scope.category = result.category.split(',');
                $scope.category.unshift('All');
            })
        };
    };
    $scope.loadCountry = function() {
        if (!$scope.country || $scope.country.length == 0) {
            serviceAPI.loadData(urlAPI.campaign_offer_country).then(function(result) {
                $scope.countryList = result.areaInfo;
                $scope.countryList.unshift({name: 'All', code: ''});
            })
        };
    };
    $scope.orderBy = function(str) {
        $scope.desc = !$scope.desc;
        $scope.orderField = str;
    };
    $scope.categoryFilter = function(vo) {
        $scope.seachParam.category = vo;
        $scope.filterParam.category = vo;
        $scope.loadList();
    };
    $scope.countryFilter = function(vo) {
        $scope.seachParam.country = vo.code;
        $scope.filterParam.country = vo.name;
        $scope.loadList();
    };
    $scope.setTime = function(start, end) {
        $scope.seachParam.publishTimeStart = start.format('YYYY/MM/DD');
        $scope.seachParam.publishTimeEnd = end.format('YYYY/MM/DD');
        $scope.loadList();
    };
    $scope.dateSelect = function(event){
        var dateRange = $(event.target).val();
        if (dateRange == '') {
            $scope.seachParam.publishTimeStart = '';
            $scope.seachParam.publishTimeEnd = '';
            serviceAPI.loadData(urlAPI.campaign_appInfo_list,$scope.seachParam).then(function(result) {
                $scope.list = result.appInfoList;
                $scope.totalItems = result.totalCount;
            }).
            catch(function(result) {});
        }
    }
    $scope.getDetail = function(vo) {
        $state.go("campaign.appinfo.detail", {id: vo.id});
    };
    $scope.deleteDate = function(vo) {
        ModalAlert.alert({
            value: "Are you sure to delete it?",
            closeBtnValue: "No",
            okBtnValue: "Yes",
            confirm: function() {
                var paramId = {
                    id: vo.id
                }
                serviceAPI.delData(urlAPI.campaign_appInfo_delete,paramId).then(function(result) {
                }).
                catch(function(result) {});
                $scope.loadList();
            }
        });
    };
    $scope.loadList();
    $scope.loadCategory();
    $scope.loadCountry();
}];
return scope;
