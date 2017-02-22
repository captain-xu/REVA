var scope = ["$scope", "serviceAPI", "ModalAlert", "Upload", "$state", "urlAPI",'$stateParams',
 function($scope, serviceAPI, ModalAlert, Upload, $state, urlAPI, $stateParams) {
    $scope.resubmit = false;
    $scope.picFile = null;
    $scope.dynamic = 0;
    $scope.order_num = 10;
    $scope.begin_upload = false;
    $scope.showothers = false;
    $scope.getDetail = function() {
        $scope.dataState = $stateParams.param;
        $('.msg').text('');
        serviceAPI.loadData(urlAPI.campaign_show_fields).then(function(result) {
            $scope.fieldList = result.fields;
        }).catch(function() {});
        if ($scope.dataState == 'edit') {
            var param = {
                typeId: $stateParams.id
            }
            serviceAPI.loadData(urlAPI.campaign_show_detail,param).then(function(result) {
                $scope.detailVO = result;
                $scope.othersList = result.othersList;
                $scope.img_url = result.example;
                if ($scope.detailVO.status == 0) {
                    if (!$scope.othersList || $scope.othersList.length == 0) {
                        $scope.othersList = [$scope.getVO('others')];
                    };
                }
                var types = $scope.detailVO.types;
                if (types && types != '') {
                    if (types.indexOf('others') > -1) {
                        $scope.showothers = true;
                    } else {
                        $scope.showothers = false;
                    }
                }
            }).catch(function() {});
        } else {
            $scope.detailVO = $scope.getVO();
            $scope.img_url="";
            $scope.othersList = [$scope.getVO('others')];
        };
    };
    $scope.getVO = function(str) {
        var vo = {};
        if (str == "others") {
            vo = {
                othersName: "",
                othersType: 0
            };
        } else {
            vo = {
                bgColor: "",
                bgHeight: "",
                bgWidth: "",
                example: "",
                typeId: "",
                types: "",
                size: {},
                name: "",
                othersList: []
            };
        };
        return vo;
    };
    $scope.typeData = function(str){
        if (!$scope.detailVO.types || $scope.detailVO.types == '') {
            var types = [];
        } else {
            var types = $scope.detailVO.types.split(",");
        }
        if (types.indexOf(str.field) > -1) {
            var index = types.indexOf(str.field);
            types.splice(index,1);
        } else {
            types.push(str.field);
        }
        if (types.indexOf('others') > -1) {
            $scope.showothers = true;
        } else {
            $scope.showothers = false;
            $scope.othersList = [$scope.getVO('others')];
        }
        if (types.indexOf(str.field) > -1 && str.type) {
            $scope.detailVO.size[str.field] = {name: str.field, width: '',height: ''};
        } else if (types.indexOf(str.field) == -1 && str.type) {
            delete $scope.detailVO.size[str.field];
        }
        $scope.detailVO.types = types.toString();
        
    }
    $scope.editOthers = function(str,index) {
        if (str == "plus") {
            var vo = $scope.getVO('others');
            $scope.othersList.push(vo);
        } else if (str == "minus" && $scope.othersList.length > 1) {
            $scope.othersList.splice(index,1);
        }

    };
    $scope.saveData = function() {
        if ($scope.detailVO.name == "") {
            ModalAlert.popup({ msg: "The name value is necessary" }, 2500);
            return;
        };
        if ($scope.detailVO.name.length > 50) {
            ModalAlert.popup({
                msg:"The length of the name should be less than 50"
            }, 2500);
            return;
        };
        if (isNaN(Number($scope.detailVO.bgHeight))) {
            ModalAlert.popup({msg: 'The Background Height\'s value show be a number'}, 2500);
            return false;
        }
        if (isNaN(Number($scope.detailVO.bgWidth))) {
            ModalAlert.popup({msg: 'The Background Width\'s value show be a number'}, 2500);
            return false;
        }
        var sizeArr = Object.keys($scope.detailVO.size).map(function(key){return $scope.detailVO.size[key]});
        // var sizeArr = Object.values($scope.detailVO.size); ES7
        for (var i = 0; i < sizeArr.length; i++) {
            var item = sizeArr[i];
            if ((item.height && !item.width) || (item.width && isNaN(Number(item.width)))) {
                ModalAlert.popup({msg: 'The Width\'s value show be a number'}, 2500);
                return false;
            }
            if ((item.width && !item.height) || (item.height && isNaN(Number(item.height)))) {
                ModalAlert.popup({msg: 'The Height\'s value show be a number'}, 2500);
                return false;
            }
        }
        $scope.detailVO.othersList = [];
        for (var i = 0; i < $scope.othersList.length; i++) {
            var vo = $scope.othersList[i];
            var othersType = $scope.fieldList.map(function(fieldList) {
                return fieldList.field;
            });
            if (othersType.indexOf(vo.othersName) > -1) {
                ModalAlert.popup({
                    msg:"Field already exists"
                }, 2500);
                return false;
            }
            $scope.detailVO.othersList.push(vo);
        };
        if ($scope.dataState == "edit") {
            var url = urlAPI.campaign_show_edit;
        } else {
            var url = urlAPI.campaign_show_new;
        }
        $scope.resubmit = true;
        serviceAPI.saveData(url, $scope.detailVO).then(function(result) {
            if (result.result == 200) {
                history.go(-1);
            } else {
                $scope.resubmit = false;
                ModalAlert.popup({msg: result.msg}, 2500)
            }
        }).catch(function() {});
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
        }, function(evt) {
            $scope.dynamic = 80;
        });
    };
    $scope.delete = function(detailVO) {
        $scope.detailVO.example = '';
        $scope.img_url = '';
    };
    $scope.cancel = function(){
        history.go(-1);
    };
    $scope.getDetail();
}];
return scope;
