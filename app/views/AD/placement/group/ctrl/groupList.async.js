var scope = ["$scope", "ModalAlert", "Upload", "regexAPI", "serviceAPI", "$state","urlAPI",'$stateParams',
 function($scope, ModalAlert, Upload, regexAPI,serviceAPI, $state,urlAPI, $stateParams) { 
    $scope.resubmit = false; 
    $scope.picFile=null;
    $scope.dynamic = 0;
    $scope.order_num = 10;
    $scope.editList = function(vo) {
        $scope.dataState = $stateParams.param;
        $('.msg').text('');
        $('.native-cont').find('i').removeClass('active');
        if ($scope.dataState == 'edit') {
            var param = {
                groupId: $stateParams.id
            }
            serviceAPI.loadData(urlAPI.campaign_group_detail,param).then(function(result) {
                $scope.detailVO = result.group;
                $scope.img_url = result.viewUrl;
                var placeParam = {
                    app: $scope.detailVO.app, 
                    version: $scope.detailVO.version
                }
                serviceAPI.loadData(urlAPI.campaign_group_place,placeParam).then(function(result) {
                    $scope.placeList = result.placeList;
                    setTimeout(function(){
                        $scope.activePlaceData();
                    },500);
                }).
                catch(function(result) {});
                var verParam = {
                    name: $scope.detailVO.app
                }
                serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
                    $scope.version = result.versionList;
                }).
                catch(function(result) {});
            }).
            catch(function(result) {});
        } else {
            $scope.detailVO = { name:"",
                                status:0,
                                app:"",
                                version:"",
                                placementIds:"",
                                placements:""
                            };
            $scope.img_url ='';
        };
        serviceAPI.loadData(urlAPI.campaign_detailList).then(function(result) {
            $scope.appList = result.appList;
        }).
        catch(function(result) {});
    };
    $scope.appData = function(){
        var verParam = {
            name: $scope.detailVO.app
        }
        serviceAPI.loadData(urlAPI.campaign_versionList, verParam).then(function(result) {
        $scope.version = result.versionList;
        }).
        catch(function(result) {});
        $scope.detailVO.version = '';
        $scope.detailVO.placements = '';
        $scope.detailVO.placementIds = '';
        $scope.placeList = '';
    };
    $scope.versionData = function(){
        var placeParam = {
            app: $scope.detailVO.app, 
            version: $scope.detailVO.version
        }
        serviceAPI.loadData(urlAPI.campaign_group_place,placeParam).then(function(result) {
            $scope.placeList = result.placeList;
        }).
        catch(function(result) {});
    };
    $scope.activePlaceData = function(){
        var placementIds = $scope.detailVO.placementIds;
        for (var i = 0; i < $('.native-cont li').length; i++) {
            var placeIdStr = $('.native-cont li').eq(i).find('span').text();
            if (placementIds.indexOf(placeIdStr)>-1) {
                $('.native-cont li').eq(i).find('i').addClass('active');
            };
        };
    };
    $scope.checkData = function(detailVO,event){
        if (detailVO.status == 0) {
            var placementIds = detailVO.placementIds.split(",");
            var placeIdStr = $(event.target).find('span').text();
            if ($.inArray(placeIdStr,placementIds)>-1){
                placementIds = $.grep(placementIds,function(n,i){return n == placeIdStr;},true);
                $(event.target).find('i').removeClass('active')
            }else{
                placementIds.push(placeIdStr);
                $(event.target).find('i').addClass('active')
            };
            detailVO.placementIds = placementIds.join(",");
        };
    };
    $scope.uploadPic = function() {
       var file = $scope.picFile;
        $scope.begin_upload = true;
        $scope.dynamic = 20;
        Upload.upload({
            url: '/campaign/util/2007',
            data: { file: file }
        }).then(function(result) {
            $scope.img_url = result.data.viewUrl;
            $scope.detailVO.example = result.data.url;
            $scope.dynamic = 100;
            $scope.begin_upload = false;
            if (file.size >= 300000 ) {
                ModalAlert.popup({
                    msg:"The picture is too big"
                }, 2500);
                return;
            };
        }, function(result) {
            $scope.begin_upload = false;
            console.log('Error status: ' + result.status);
        }, function(evt) {
            $scope.dynamic = 80;
        });
    };
    $scope.delete = function(detailVO) {
        $scope.detailVO.example = '';
        $scope.img_url = '';
    };
    $scope.saveData = function() {
        if (regexAPI.objRegex($scope.detailVO, ["name", "app", "version"])) {
            if($scope.detailVO.placementIds==""){
                ModalAlert.popup({
                    msg:"The placement value is necessary"
                }, 2500);
                return false;
            };
            if ($scope.detailVO.name.length > 50) {
                ModalAlert.popup({
                    msg:"The length of the name should be less than 50"
                }, 2500);
                return;
            };
            $scope.detailVO.placeList = $scope.placeList;
            $scope.detailVO.placements = $scope.detailVO.placementIds;
            $scope.detailVO.groupId = $scope.detailVO.id;
            if ($scope.dataState == "edit") {
                var url = urlAPI.campaign_group_edit;
            } else {
                var url = urlAPI.campaign_group_new;
            }
            $scope.resubmit = true;
            serviceAPI.saveData(url, $scope.detailVO).then(function(result) {
                    if (result.status == 0) {
                        history.go(-1);
                    } else {
                        $scope.resubmit = false;
                        ModalAlert.popup({msg: result.msg}, 2500)
                    }
            }).catch(function() {})
        }
    };
    $scope.cancel = function(){
        history.go(-1);
    };
    $scope.editList();
}];
return scope;
