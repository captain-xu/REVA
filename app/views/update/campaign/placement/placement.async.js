var scope = ["$scope", "ModalAlert", "serviceAPI",  '$state', 'urlAPI', "$stateParams",
 function($scope, ModalAlert, serviceAPI, $state, urlAPI, $stateParams) {
    $scope.packageName = $stateParams.package;
    $scope.changeState = function(vo) {
        if (vo.placeStatus == 0) {
           var  alertValue = "Are you sure to turn it ON";
        }else{
            var  alertValue = "Are you sure to turn it OFF";
        };
        ModalAlert.alert({
            value: alertValue,
            closeBtnValue: "No",
            okBtnValue: "Yes",
            confirm: function() {
                var num = 0;
                if (vo.placeStatus == 0) {
                    num = 1;
                };
                var statusParam = {
                    id: vo.id,
                    placeStatus: num
                }
                serviceAPI.updateData(urlAPI.campaign_manage_state,statusParam).then(function(result) {
                    if (result.status == 0 && result.result == 0) {
                        vo.placeStatus = num;
                    } else {
                        ModalAlert.popup({
                            msg: result.msg
                        }, 2500);
                    }
                }).catch(function() {})
            }
        });
    };
    // $scope.deleteItem = function(vo) {
    //     ModalAlert.alert({
    //         value: "Are you sure to delete it?",
    //         closeBtnValue: "No",
    //         okBtnValue: "Yes",
    //         confirm: function() {
    //             var url = urlAPI.campaign_manage_delete;
    //             var paramId = {
    //                 id: vo.id
    //             }
    //             serviceAPI.delData(url,paramId).then(function(result){
    //                 if (result.status == 0 && result.result == 0) {
    //                     $scope.loadList();
    //                 } else {
    //                     ModalAlert.popup({msg: result.msg}, 2500)
    //                 }
    //             })
    //         }
    //     });
    // };
}];
return scope;
