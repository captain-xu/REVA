var scope = ["$scope", "ModalAlert", "Upload", "regexAPI","$state", "serviceAPI", "urlAPI",'$stateParams',
    function($scope, ModalAlert, Upload, regexAPI, $state, serviceAPI, urlAPI, $stateParams) {
    $scope.picFile = null;
    $scope.dynamic = 0;
    $scope.order_num = 10;
    $scope.begin_upload = false;
    $scope.category = [];
    $scope.resubmit = false;
    $scope.addData = function() {
        $scope.dataState = "new";
        $('.msg').text('');
        if ($scope.category.length == 0) {
            $scope.getCategory();
        }else{
            $scope.initCategory();
        }
    };
    $scope.getDetail = function() {
        $scope.dataState = $stateParams.param;
        $('.msg').text('');
        if ($scope.dataState == 'edit') {
            var param = {
                appId: $stateParams.id
            }
            serviceAPI.loadData(urlAPI.campaign_app_detail,param).then(function(result) {
                $scope.detailVO = result.app;
                $scope.img_url = result.viewUrl;
            }).catch(function() {});
        } else {
            $scope.img_url="";
            $scope.detailVO = $scope.getVO();
        };
        if ($scope.category.length == 0) {
            $scope.getCategory();
        } else {
            $scope.initCategory();
        };
            
    };
    $scope.getCategory = function() {
        serviceAPI.loadData(urlAPI.campaign_app_category).then(function(result) {
            var rows = result.rows;
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var vo = {
                    id: row.id,
                    name: row.name,
                    istitle: true
                };
                $scope.category.push(vo);
                for (var y = 0; y < row.children.length; y++) {
                    vo = {
                        id: row.children[y].id,
                        name: row.children[y].name,
                        istitle: false
                    }
                    $scope.category.push(vo);
                }
            };
            $scope.initCategory();
        }).catch(function() {});
    };
    $scope.initCategory = function() {
        if (!$scope.detailVO.type || $scope.detailVO.type == "") {
            for (var i = 0; i < $scope.category.length; i++) {
                if (!$scope.category[i].istitle) {
                    $scope.detailVO.type = $scope.category[i].id;
                    $scope.detailVO.typeName = $scope.category[i].name;

                    break;
                }
            }
        };
        $scope.categoryVO = {
            id: $scope.detailVO.type,
            name: $scope.detailVO.typeName,
            istitle: false
        };
    };
    $scope.changeBelong = function(num) {
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.belongTo = num;
        }
    };
    $scope.changeDiscover = function(num) {
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.discovery = num;
        }
    };
    $scope.getVO = function() {
        var vo = {
            appId: "",
            status: 0,
            belongTo: 0,
            discovery: 1,
            company: "",
            createTime: "",
            name: "",
            type: "",
            typeName: "",
            version: ""
        };
        return vo;
    };
    $scope.catSel = function() {
        $scope.detailVO.type = $scope.selectVO.id;
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
            $scope.detailVO.logo = result.data.url;
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
        $scope.detailVO.logo = '';
        $scope.img_url = '';
    }
    $scope.validateForm = function(url) {
        if ($scope.detailVO.name != "" && $scope.detailVO.type != "" && $scope.detailVO.version != "" && $scope.detailVO.company != "") {
            $scope.resubmit = true;
            serviceAPI.saveData(url, $scope.detailVO).then(function(result) {
                if (result.status == 0) {
                    history.go(-1);
                } else {
                    $scope.resubmit = false;
                    ModalAlert.popup({msg:result.msg}, 2500);
                }
            }).catch(function() {})
        } else {
            if ($scope.detailVO.name == "") {
                ModalAlert.popup({ msg: "the name value is necessary" }, 2500);
            } else if ($scope.detailVO.type == "") {
                ModalAlert.popup({ msg: "the category is necessary" }, 2500);
            } else if ($scope.detailVO.version == "") {
                ModalAlert.popup({ msg: "the Version value is necessary" }, 2500);
            } else if ($scope.detailVO.company == "") {
                ModalAlert.popup({ msg: "the Company value is necessary" }, 2500);
            }
        }
    };
    $scope.saveData = function() {
        if ($scope.dataState == "edit") {
            var url = urlAPI.campaign_app_edit;
        } else {
            var url = urlAPI.campaign_app_new;
        };
        $scope.detailVO.appId = $scope.detailVO.id;
        if ($scope.detailVO.name.length > 50) {
            ModalAlert.popup({msg:"The length of the name should be less than 50"}, 2500);
            return;
        };
        $scope.validateForm(url);
    };
    $scope.cancel = function(){
        history.go(-1);
    };
    $scope.getDetail();
}];
return scope;
