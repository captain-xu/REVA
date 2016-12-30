var scope = ["$scope", "serviceAPI", 'urlAPI', 'ModalAlert',
	function($scope, serviceAPI, urlAPI, ModalAlert) {
        $scope.segmentNum = 1;
        $scope.segmentSize = 20;
        $scope.segmentName = '';
		$scope.loadList = function(){
            var param = {
                segmentName: $scope.segmentName,
                pageSize: $scope.segmentSize,
                pageNum: $scope.segmentNum
            }
			serviceAPI.loadData(urlAPI.push_segment, param).then(function(result){
				if (result.code == 200 && result.status == 1) {
                    $scope.segmList = result.data.SegmentList;
					$scope.totalItems = result.data.ListCount;
				}
			});
		};
		$scope.deleteData = function(vo){
			ModalAlert.alert({
                value: "Sure to delete this segment?",
                closeBtnValue: "Cancel",
                okBtnValue: "Confirm",
                confirm: function() {
                    serviceAPI.loadData(urlAPI.push_segmentDelete, { "segmentId": vo.segmentId }).then(function(result) {
                        if (result.status == 1 && result.code == 200) {
                            ModalAlert.success({ msg: "Delete Succeeded" }, 2500);
                            $scope.loadList();
                        } else {
                            ModalAlert.error({ msg: result.msg }, 2500)
                        }
                    })
                }
            });
		}
        $scope.orderBy = function(str) {
            $scope.desc = !$scope.desc;
            $scope.orderField = str;
        };
		$scope.loadList();
	}
];
return scope;