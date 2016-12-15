var scope = ["$scope", "$state", "serviceAPI", "urlAPI",'$stateParams',
  function($scope, $state, serviceAPI, urlAPI, $stateParams) {
    $scope.getDetail = function() {
            $('.native-cont.timeset').find('i').removeClass('active');
            var param = {
                operationId : $stateParams.id
            }
            serviceAPI.loadData(urlAPI.campaign_placement_detail,param).then(function(result) {
                $scope.detailVO = result.operation;
                $scope.rtb = result.rtb;
                $scope.detailVO.app = result.operationRes.appId;
                $scope.detailVO.appName = result.operationRes.appName;
                $scope.detailVO.groupId = result.operationRes.groupId;
                $scope.detailVO.groupName = result.operationRes.groupName;
                $scope.detailVO.placeId = result.operationRes.placementId;
                $scope.detailVO.placeName = result.operationRes.placementName;
                $scope.detailVO.version = result.operationRes.version;
                $scope.detailVO.startDate = $scope.detailVO.startDateForShow;
                $scope.detailVO.endDate = $scope.detailVO.endDateForShow;
                /*   $scope.detailVOPlace = result.operationRes;*/
                $scope.startDate = $scope.detailVO.startDate;
                $scope.endDate = $scope.detailVO.endDate;
                $scope.publishTimeStart = $scope.detailVO.publishTimeStart;
                $scope.publishTimeEnd = $scope.detailVO.publishTimeEnd;
                $scope.setImgTitle(result);
                /*获取下拉数据*/
                var timeSet = $scope.detailVO.timeSet.split(',');
                for (var i = 0; i < timeSet.length; i++) {
                    var num = Number(timeSet[i]);
                    $('.timecheck:nth(' + num + ')').find('i').addClass('active');
                };
                if ($scope.detailVO.timeSet == "") {
                    $('.icon-check').removeClass('active');
                }else if (timeSet.length == 24) {
                    $('.icon-check').addClass('active');
                };
                $('#datarange').val(moment($scope.detailVO.startDateForShow).format('YYYY/MM/DD') + ' ~ ' + moment($scope.detailVO.endDateForShow).format('YYYY/MM/DD'));
                $('#publishtime').val(moment($scope.detailVO.publishTimeStart).format('YYYY/MM/DD') + ' ~ ' + moment($scope.detailVO.publishTimeEnd).format('YYYY/MM/DD'));
            }).
            catch(function(result) {});
            $scope.showList = false;
    };
    $scope.setImgTitle = function(result) {
        if (result.imageList && result.imageList.length > 0) {
            $scope.detailVO.imageList = result.imageList.map(function(data) {
                return {
                    imageId: data.imageId,
                    imageUrl: data.imageUrl,
                    imageName: data.imageName,
                    imageUrlForShow: data.imageUrlForShow,
                    begin_upload: false
                }
            });
        } else {
            $scope.detailVO.imageList = [];
        };
        if (result.titleList && result.titleList.length > 0) {
            $scope.detailVO.titleList = result.titleList.map(function(data) {
                return {
                    titleId: data.titleId,
                    value: data.value,
                    titleName: data.titleName
                }
            });
        } else {
            $scope.detailVO.titleList = [];
        };
    };
    $scope.cancel = function(){
        history.go(-1);
    };
    $scope.getDetail();
}];
return scope;
