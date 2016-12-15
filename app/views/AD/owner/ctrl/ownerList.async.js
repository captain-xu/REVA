var scope = ["$scope", "ModalAlert", "serviceAPI", '$state', "urlAPI",'$stateParams',
 function($scope, ModalAlert, serviceAPI, $state, urlAPI, $stateParams) {
    $scope.resubmit = false;
    $scope.category = ['Computers,Software','Computers,Hardware','Computer Services','Telecom & Network Equipment','Telecom Operators/Service Providers','Internet/E-commerce','Online Game','Electronics/Semiconductor/IC','Instrument/Industry Automation','Accounting, Auditing','Finance/Investments/Securities','Banking','Insurance','Trading/Import & Export','Wholesale/Retail','FMCG( Food,Beverage,Cosmetics)','Apparel/Textiles/Leather Goods','Furniture/Home Appliances/Arts & Craft/Toys','Office Supplies & Equipment','Machinery, Equipment, Heavy Industries','Automobile & Components','Pharmaceuticals/Biotechnology','Healthcare/Medicine/Public Health','Medical Facilities/Equipment','Advertising','Public Relations/Marketing/Exhibitions','Films/Media/Arts','Print Media/Publishing','Printing/Packaging/Paper','Real Estate Development','Architectural Services/Construction','Interior Design/Decoration','Property Management','Agency','Professional Services (Consulting, Human Resources, etc.)','Testing, Certification','Legal','Education/Training','Science/Research','Restaurant & Food Services','Hospitality/Tourism','Entertainment/Leisure/Sports & Fitness','Beauty/Health','Personal Care & Services','Transportation/Logistic/Distribution','Aerospace/Aviation/Airlines','Oils/Chemicals/Mines/Geology','Mining/Metallurgy','Utilities/Energy','Raw Materials & Processing','Government','Non-Profit organizations','Environmental Protection','Agriculture/Fishing/Forestry','Conglomerates','Others'];
    
    $scope.getDetail = function() {
        $scope.dataState = $stateParams.param;
        $('.msg').text('');
        if ($scope.dataState == 'edit') {
            var param = {
                id: $stateParams.id
            };
            serviceAPI.loadData(urlAPI.campaign_owner_detail,param).then(function(result) {
                $scope.detailVO = result.advertiser;
                if (!$scope.detailVO.whiteIp) {
                    $scope.whiteIp = [{ip: ''}];
                } else {
                    $scope.whiteIp = $scope.detailVO.whiteIp.split("|").map(function(data) {
                        return {
                            ip: data
                        };
                    });
                }
                if (!$scope.detailVO.postParam) {
                    $scope.detailVO.postParam = {};
                }
                $scope.detailVO.id = $stateParams.id;
            }).catch(function() {});
        } else {
            serviceAPI.loadData(urlAPI.campaign_detailList);
            $scope.detailVO = $scope.getVO();
            $scope.whiteIp = [{ip: ''}];
        }
    };
    $scope.getVO = function() {
        var vo = {
            name: "",
            category: "",
            type: 1,
            postBack: 1,
            rtb: 1,
            country: "",
            phone: "",
            address: "",
            impPostback: 1,
            impUrl: "",
            whiteIp: "",
            postParam: {},
            status:0
        };
        return vo;
    };
    $scope.typeData = function(num) {
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.type = num;
        }
    };
    $scope.postData = function(num) {
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.postBack = num;
        }
    };
    $scope.rtbData = function(num) {
        if ($scope.detailVO.status == 0) {
            $scope.detailVO.rtb = num;
        }
    };
    $scope.postParamData = function(str){
        // if ($scope.detailVO.status == 0) {
            var item = $scope.detailVO.postParam;
            switch(str) {
                case "imei" :
                    if (item.imei) {
                        item.imei = "";
                    } else {
                        item.imei = "imei";
                    }
                    break;
                case "andid" :
                    if (item.andid) {
                        item.andid = "";
                    } else {
                        item.andid = "andid";
                    }
                break;
                case "mac" :
                    if (item.mac) {
                        item.mac = "";
                    } else {
                        item.mac = "mac";
                    }
                break;
                case "gid" :
                    if (item.gid) {
                        item.gid = "";
                    } else {
                        item.gid = "gid";
                    }
                break;
                case "time" :
                    if (item.time) {
                        item.time = "";
                    } else {
                        item.time = "time";
                    }
                break;
                case "device_model" :
                    if (item.device_model) {
                        item.device_model = "";
                    } else {
                        item.device_model = "device_model";
                    }
                break;
                case "device_brand" :
                    if (item.device_brand) {
                        item.device_brand = "";
                    } else {
                        item.device_brand = "device_brand";
                    }
                break;
                case "network" :
                    if (item.network) {
                        item.network = "";
                    } else {
                        item.network = "network";
                    }
                break;
                case "longitude" :
                    if (item.longitude) {
                        item.longitude = "";
                    } else {
                        item.longitude = "longitude";
                    }
                break;
                case "latitude" :
                    if (item.latitude) {
                        item.latitude = "";
                    } else {
                        item.latitude = "latitude";
                    }
                break;
                case "ip" :
                    if (item.ip) {
                        item.ip = "";
                    } else {
                        item.ip = "ip";
                    }
                break;
                case "language" :
                    if (item.language) {
                        item.language = "";
                    } else {
                        item.language = "language";
                    }
                break;
                case "OSversion" :
                    if (item.OSversion) {
                        item.OSversion = "";
                    } else {
                        item.OSversion = "OSversion";
                    }
                break;

            }
            $scope.detailVO.postParam = item;
        // }
    };
    $scope.addWhite = function(){
        $scope.whiteIp.push({ip: ''});
    };
    $scope.deleteWhite = function(index){
        $scope.whiteIp.splice(index, 1);
    };

    $scope.validateForm = function(url) {
        if ($scope.detailVO.name != "" && $scope.detailVO.country != "") {
            $scope.resubmit = true;
            serviceAPI.saveData(url, $scope.detailVO).then(function(result) {
                if (result.status == 0) {
                    $state.go("campaign.owner.list");
                } else {
                    $scope.resubmit = false;
                    ModalAlert.popup({msg:result.msg}, 2500);
                }
            }).catch(function() {})
        } else {
            if ($scope.detailVO.name == "") {
                ModalAlert.popup({ msg: "the name value is necessary" }, 2500);
            } else if ($scope.detailVO.country == "") {
                ModalAlert.popup({ msg: "the country value is necessary" }, 2500);
            }
        }
    };
    $scope.saveData = function(vo) {
        if ($scope.dataState == "edit") {
            var url = urlAPI.campaign_owner_edit;
        } else {
            var url = urlAPI.campaign_owner_new;
        };
        if ($scope.detailVO.name.length > 50) {
            ModalAlert.popup({
                msg:"The length of the name should be less than 50"
            }, 2500);
            return;
        };
        if ($scope.detailVO.phone.length > 50) {
            ModalAlert.popup({
                msg:"The length of the phone should be less than 50"
            }, 2500);
            return;
        };
        if ($scope.detailVO.country.length > 50) {
            ModalAlert.popup({
                msg:"The length of the country should be less than 50"
            }, 2500);
            return;
        };
        if ($scope.detailVO.postBack == 0) {
            $scope.detailVO.impPostback = '';
            $scope.detailVO.impUrl = '';
            $scope.detailVO.whiteIp = '';
            $scope.detailVO.postParam = {};
        }
        if ($scope.detailVO.postBack == 1 && $scope.detailVO.impPostback == 1) {
            if ($scope.detailVO.impUrl == '') {
                ModalAlert.popup({ msg: "the IMP url value is necessary" }, 2500);
                return;
            }
        }
        $scope.detailVO.whiteIp = $scope.whiteIp.map(function(data) {
            return data.ip;
        }).join("|");
        $scope.detailVO.id = $scope.detailVO.id;
        $scope.validateForm(url);
    };
    $scope.cancel = function(){
        history.go(-1);
    };
    $scope.getDetail();
}];
return scope;
