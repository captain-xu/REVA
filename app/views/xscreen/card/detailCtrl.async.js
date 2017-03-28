var scope = ["$scope", "serviceAPI", 'urlAPI','$stateParams','$location',
    function($scope, serviceAPI, urlAPI, $stateParams, $location) {
        $scope.loadChannel = function() {
            serviceAPI.getData(urlAPI.xscreen_channel).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.channelList = result.data;
                    $scope.channel = $scope.channelList[0];
                    $scope.loadList($scope.channel);
                }
            })
        };
        $scope.statu = $stateParams.param;
        $scope.channelDetail = $stateParams.name;
        $scope.loadList = function(channel){
            $scope.channelId = {
                id: channel.id
            };
            $scope.channelName = channel.name;
            serviceAPI.loadData(urlAPI.xscreen_detail, $scope.channelId).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.openList = result.data.openinfo;
                    $scope.closeList = result.data.closeinfo;
                    $scope.exchangeChannel($scope.openList);
                    $scope.exchangeChannel($scope.closeList);
                    $scope.param = result.data;
                }
            })
        };
        $scope.exchangeChannel = function(item) {
            for (var i = 0; i < item.length; i++) {
                switch(item[i].owner) {
                    case '0':
                        item[i].channel = '--';
                    break;
                    case '1':
                        item[i].channel = 'News Dog';
                    break;
                    case '2':
                        item[i].channel = 'Le Tang';
                    break;
                    case '3':
                        item[i].channel = 'Google';
                    break;
                }
            }
        };
        $scope.changeDisplay = function(list,num){
            if ($scope.statu == 'edit') {
                list.display = num;
            }
        };

        $scope.changeCard = function(list,index,num){
            list.isopen = num;
            if ($scope.statu == 'edit') {
                if (num == 0) {
                    $scope.closeList.push(list);
                    $scope.openList.splice(index, 1);
                } else {
                    $scope.openList.push(list);
                    $scope.closeList.splice(index, 1);
                }
            }
        };

        $scope.swapItems = function(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        };
     
        // 上移
        $scope.upRecord = function(arr, $index) {
            if ($scope.statu == 'edit') {
                if($index == 0) {
                    return;
                }
                $scope.swapItems(arr, $index, $index - 1);
            }
        };
     
        // 下移
        $scope.downRecord = function(arr, $index) {
            if ($scope.statu == 'edit') {
                if($index == arr.length -1) {
                    return;
                }
                $scope.swapItems(arr, $index, $index + 1);
            }
        };
        $scope.saveData = function(){
            $scope.changeParam = {
                id: $scope.param.channelid,
                openinfo: $scope.openList,
                closeinfo: $scope.closeList
            };
            serviceAPI.saveData(urlAPI.xscreen_edit, $scope.changeParam).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $location.path('/view/xscreen/card');
                }
            })
        };
        $scope.init = function() {
            if ($stateParams.name == 'new') {
                $scope.loadChannel();
            } else {
                $scope.channel = {
                    id: $stateParams.id,
                    name: $stateParams.name
                };
                $scope.loadList($scope.channel);
            }
        };
        $scope.init();
    }
];
return scope;
