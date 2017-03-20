var scope = ["$scope", "serviceAPI", "$state", '$stateParams', 'urlAPI', "ModalAlert",
    function($scope, serviceAPI, $state, $stateParams, urlAPI, ModalAlert) {
        $scope.viewDetail = function() {
            var param = {
                offerId: $stateParams.offerId,
                advertiserId: $stateParams.id,
                rtb: $stateParams.rtb
            }
            serviceAPI.loadData(urlAPI.campaign_offer_detail, param).then(function(result) {
                $scope.detailVO = result.offer;
            }).
            catch(function(result) {});
        };
        $scope.labelState = true;
        $scope.editLabel = function() {
            $scope.labelState = false;
        };
        $scope.submitLabel = function() {
            var labelParam = {
                "advertiserId": $scope.detailVO.advertiserId,
                "offerId": $scope.detailVO.offerId,
                "label": $scope.detailVO.label
            };
            serviceAPI.saveData(urlAPI.campaign_offer_label, labelParam).then(function(result) {
                if (result.result === 200) {
                    ModalAlert.success({msg: "Success!"}, 2500);
                    $scope.labelState = true;
                } else {
                    ModalAlert.error({msg: result.msg}, 2500);
                    $scope.labelState = false;
                }
            });
        };
        $scope.cancel = function() {
            history.go(-1);
        };
        $scope.viewDetail();
    }
];
return scope;
