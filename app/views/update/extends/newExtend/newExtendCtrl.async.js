var scope = ["$scope", "serviceAPI", "$stateParams", 'urlAPI', 'JSONFormatterConfig', '$state',
    function($scope, serviceAPI, $stateParams, urlAPI, JSONFormatterConfig, $state) {

    $scope.state = $stateParams.param;
    $scope.appName = $stateParams.name;
    $scope.packageName = $stateParams.package;
    $scope.loadList = function(){
        if ($scope.state == 'new') {
            serviceAPI.getData(urlAPI.update_getDevice).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    var deviceList = [];
                    for (var i = 0, len = result.data.length; i < len; i++) {
                        deviceList = deviceList.concat(result.data[i].mod);
                    }
                    $scope.deviceList = [];
                    for (var i = 0, listlen = deviceList.length; i < listlen; i++) {
                        deviceList.sort();
                        if (deviceList[i] != deviceList[i-1] && deviceList[i]) {
                            $scope.deviceList.push(deviceList[i]);
                        }
                    }
                }
            })
        } else {
            var searchParam = {
                id: $stateParams.id
            }
            serviceAPI.loadData(urlAPI.update_getextend,searchParam).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.device = result.data.device;
                    $scope.textarea = result.data.extendstext;
                }
            })
        }
    }();
    $scope.deviceData = function(dev){
        $scope.device = dev;
    }
    $scope.saveExtend = function(){
        if ($scope.state == 'new') {
            $scope.param = {
                "appname":$scope.packageName,
                "extends":$scope.textarea,
                "device":$scope.device
            };
            serviceAPI.saveData(urlAPI.update_createext,$scope.param).then(function(result){
                if (result.code == 0 && result.status == 0) {
                    history.go(-1);
                }
            })
        } else {
            $scope.param = {
                "id":$stateParams.id,
                "extends":$scope.textarea
            };
            serviceAPI.updateData(urlAPI.update_editextend,$scope.param).then(function(result){
                if (result.code == 0 && result.status == 0) {
                    history.go(-1);
                }
            })
        }
    };

        $scope.isCome = false;     
        $scope.isFocus = false; 

        $scope.getFocus = function(){
            $scope.isFocus = true; 
            $scope.isCome = true;  
        };

        $scope.setBlur = function(){
            $scope.isFocus = false;
        }



        $scope.format = function() {//格式化json
            for (var e = $scope.textarea.replace(/\s+/g, ""), c = [], b = 0, d = !1, f = 0, g = e.length; f < g; f++) {
                var h = e.charAt(f);//charAt() 方法可返回指定位置的字符
                //当d=!1时，d为false；当d=字符串时，!d = false;
                if (d && h === d) {
                    e.charAt(f - 1) !== "\\" && (d = !1)
                } else if (!d && (h === '"' || h === "'")) {//当d等于!1或者字符串时，如果h为引号，则 d强制变为引号
                    d = h
                } else if (!d && (h === " " || h === "\t")) {//当d等于!1或者字符串时，如果h为空格或者tab，则 h强制变为空
                    h = ""
                } else if (!d && h === ":") {//当d等于!1或者字符串时，如果h为冒号，则 h等于自身加空格
                    h += " "
                } else if (!d && h === ",") {//当d等于!1或者字符串时，如果h为逗号，则 h变为回车加上b*2空格
                    var space = "  ";
                    for(var i =0; i < b*2; i++){
                        space = space + "  ";
                    }//添加空格
                    h += "\n" + space//添加换行+空格
                } else if (!d && (h === "[" || h === "{")) {//当d等于!1或者字符串时，如果h为[或者{，则 b先加1，h变为回车加上b*2空格
                    b++;
                    var space = "  ";
                    for(var i =0; i < b*2; i++){
                        space = space + "  ";
                    }
                    h += "\n" + space
                } else if (!d && (h === "]" || h === "}")) {//当d等于!1或者字符串时，如果h为]或者}，则 b先减1，h变为回车加上b*2空格 再加上h自身
                    b--;
                    var space = "  ";
                    for(var i =0; i < b*2; i++){
                        space = space + "  ";
                    }
                    h = "\n" + space + h
                }
                c.push(h)
            }
            $scope.textarea = c.join("")
        };
        $scope.removeWhiteSpace = function() {//移除空格
            for (var e = $scope.textarea.replace(/\s+/g, ""), c = [], b = !1, d = 0; d < e.length; d++) {
                var g = e.charAt(d);//返回e在d坐标中的值
                if (b && g === b) e.charAt(d - 1) !== "\\" && (b = !1);
                else if (!b && (g === '"' || g === "'")) b = g;//如何g是引号，则 b 等于引号，即：b等于true
                else if (!b && (g === " " || g === "\t")) g = "";//如果是空格或者tab，则把空格和tab清掉
                c.push(g)
            }
            $scope.textarea = c.join("")
        };
        $scope.clearText = function() {//清除内容
            $scope.textarea = "";//清空textarea
            $scope.getFocus();//textarea获取焦点
        };
        $scope.previewstatus = false;

        $scope.check = function() {
            $scope.previewstatus = true;
        }//check

        $scope.$watch('textarea', function (str){
            //var result = {};
            try {
                $scope.textareaJson = JSON.parse(str);
            } catch (e) {}
        });

        $scope.hidepreview = function(){
            $scope.previewstatus = false;
        }

    }
];
return scope;
