var scope = ["$scope", "serviceAPI", 'urlAPI', '$stateParams',
	function($scope, serviceAPI, urlAPI, $stateParams) {
		$scope.segment = ['Android Version', 'Location', 'Push Version', 'Created Time'];
        $scope.segmentId = Number($stateParams.id);
        $scope.getDetail = function() {
        	if ($scope.segmentId == 0) {
        		$scope.segmDetail = {
				    "segmentId": 0,
				    "appName": "",
				    "segmentName": "",
				    "description": "",
				    "constraint": [{"factor": "Choose…", segmentId: $scope.segmentId}]
				}
        	} else {
	            serviceAPI.loadData(urlAPI.push_segmentDetail, { "segmentId": $scope.segmentId }).then(function(result) {
	                $scope.segmDetail = result.data;
	                for (var i = 0; i < $scope.segmDetail.constraint.length; i++) {
	                	var item = $scope.segmDetail.constraint[i].factorValue.split(";");
	                	if (item.length == 1) {
		                	$scope.segmDetail.constraint[i].factorValue1 = item[0];
	                	} else if (item.length == 2) {
			                $scope.segmDetail.constraint[i].factorValue1 = item[0];
			                $scope.segmDetail.constraint[i].factorValue2 = item[1];
	                	} else {
			                $scope.segmDetail.constraint[i].factorValue1 = item[0];
			                $scope.segmDetail.constraint[i].factorValue2 = item[1];
			                $scope.segmDetail.constraint[i].factorValue3 = item[2];
	                	}
	                }
	            });
        	}
            serviceAPI.loadData(urlAPI.pushSetReceiver, { "pushId": '' }).then(function(result) {
                $scope.appNames = result.data.appnames;
            });

            serviceAPI.loadData(urlAPI.push_segmentCondition).then(function(result) {
                $scope.androidVersion = result.data.androidVersion;
                $scope.areas = result.data.countryState;
            });
        };
        $scope.validateParam = {
            segmentWarn: false,
            appWarn: false
        };
        $scope.appData = function(app){
        	$scope.segmDetail.appName = app.appName;
        };
		$scope.chooseItem = function(item, seg){
			if (item.factor != 'Choose…') {
				$scope.segment.push(item.factor);
			}
			item.factor = seg;
        	switch (seg){
        		case 'Location':
					item.judge = 'is';
					item.factorValue1 = $scope.areas[0].country;
					item.factorValue2 = 'All States';
				break;
        		case 'Android Version':
					item.judge = 'is above';
					item.factorValue1 = $scope.androidVersion[0];
				break;
        		case 'Push Version':
					item.judge = 'is above';
					item.factorValue1 = $scope.androidVersion[0];
				break;
        		case 'Created Time':
					item.judge = 'is more than';
					item.factorValue1 = '1';
				break;
        	}
			$scope.checkSegment(1, item);
		};

		$scope.addItem = function(item){
			$scope.segmDetail.constraint.push({"factor": "Choose…", segmentId: $scope.segmentId});
			$scope.checkSegment(1, item);
		};
		$scope.removeItem = function(item, index){
			$scope.segmDetail.constraint.splice(index, 1);
			$scope.checkSegment(0, item);
		};
		$scope.checkSegment = function(num, item){
			var itemIndex = $scope.segment.indexOf(item.factor);
			if (num) {
				if (itemIndex > -1) {
					$scope.segment.splice(itemIndex, 1);
				}
			} else {
				if (itemIndex > -1) {
					return;
				}
				$scope.segment.push(item.factor);
			}
		};
        $scope.removeValidate = function(str) {
            switch (str) {
                case 'segmentWarn':
                    $scope.validateParam.segmentWarn = false;
                    break;
                case 'appWarn':
                    $scope.validateParam.appWarn = false;
                    break;
            }
        };
		$scope.saveDetail = function(){
			if (!$scope.segmDetail.segmentName) {
				$scope.validateParam.segmentWarn = true;
				return;
			} else if (!$scope.segmDetail.appName) {
				$scope.validateParam.appWarn = true;
				return;
			}
			if ($scope.segmentId == 0) {
				var url = urlAPI.push_segmentNew;
			} else {
				var url = urlAPI.push_segmentUpdate;
			}
			$scope.segmDetail.segmentId = $scope.segmentId;
            for (var i = 0; i < $scope.segmDetail.constraint.length; i++) {
            	var item = $scope.segmDetail.constraint[i];
            	switch (item.factor){
            		case 'Location':
            			item.factorValue = item.factorValue1 + ';' + item.factorValue2;
            			item.factorValueNum = 2;
        			break;
        			case 'Android Version':
        				if (item.judge == "is above") {
        					item.factorValue = item.factorValue1;
            				item.factorValueNum = 1;
        				} else {
	            			item.factorValue = item.factorValue1 + ';' + item.factorValue2;
            				item.factorValueNum = 2;
        				}
        			break;
	        		case 'Push Version':
						if (item.judge == "is above") {
        					item.factorValue = item.factorValue1;
            				item.factorValueNum = 1;
        				} else {
	            			item.factorValue = item.factorValue1 + ';' + item.factorValue2;
            				item.factorValueNum = 2;
        				}
					break;
	        		case 'Created Time':
						if (item.judge == "is more than") {
        					item.factorValue = item.factorValue1;
            				item.factorValueNum = 1;
        				} else {
	            			item.factorValue = item.factorValue1 + ';' + item.factorValue2;
            				item.factorValueNum = 2;
        				}
					break;
            	}
    			delete item.factorValue1;
    			delete item.factorValue2;
            }
			serviceAPI.updateData(url, $scope.segmDetail).then(function(result){
				if (result.code == 200 && result.status == 1) {
					history.go(-1);
				}
			})
		};
        $scope.getDetail();
	}
];
return scope;