var scope = ["$scope", "serviceAPI", 'urlAPI', '$stateParams', 'ModalAlert',
	function($scope, serviceAPI, urlAPI, $stateParams, ModalAlert) {
		$scope.segment = ['Android Version', 'Location', 'Push Version', 'User'];
        $scope.segmentId = Number($stateParams.id);
        $scope.getDetail = function() {
        	if ($scope.segmentId == 0) {
        		$scope.segmDetail = {
				    "segmentId": 0,
				    "appName": "",
				    "packageName": "",
				    "segmentName": "",
				    "description": "",
				    "constraint": [{"factor": "Choose…", segmentId: $scope.segmentId}]
				}
        	} else {
	            serviceAPI.loadData(urlAPI.push_segmentDetail, { "segmentId": $scope.segmentId }).then(function(result) {
	                $scope.segmDetail = result.data;
	                for (var i = 0; i < $scope.segmDetail.constraint.length; i++) {
	                	var item = $scope.segmDetail.constraint[i];
	                	var factorVal = item.factorValue.split(";");
	                	if (factorVal.length == 1) {
		                	item.factorValue1 = factorVal[0];
	                	} else if (factorVal.length == 2) {
			                item.factorValue1 = factorVal[0];
			                item.factorValue2 = factorVal[1];
	                	} else {
			                item.factorValue1 = factorVal[0];
			                item.factorValue2 = factorVal[1];
			                item.factorValue3 = factorVal[2];
	                	}
                		var segmIndex = $scope.segment.indexOf(item.factor);
                		if (segmIndex > -1) {
                			$scope.segment.splice(segmIndex, 1);
                		}
	                }
	            });
        	}
            serviceAPI.loadData(urlAPI.pushSetReceiver, { "pushId": '' }).then(function(result) {
                $scope.appNames = result.data.appnames;
            });

            serviceAPI.loadData(urlAPI.push_segmentCondition).then(function(result) {
                $scope.androidVersion = result.data.androidVersion;
                $scope.pushVersion = result.data.pushVersion;
                $scope.areas = result.data.countryState;
            });
        };
        $scope.validateParam = {
            segmentWarn: false,
            appWarn: false,
            constraintWarn: false
        };
        $scope.appData = function(app){
        	$scope.segmDetail.appName = app.appName;
        	$scope.segmDetail.packageName = app.packageName;
        };
		$scope.chooseItem = function(item, seg){
			if (item.factor != 'Choose…') {
				$scope.segment.push(item.factor);
			}
			$scope.validateParam.constraintWarn = false;
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
					item.factorValue1 = $scope.pushVersion[0];
				break;
        		case 'User':
					item.judge = 'is active';
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
			if ($scope.segmDetail.constraint.length == 1 && $scope.segmDetail.constraint[0].factor == 'Choose…') {
				$scope.validateParam.constraintWarn = true;
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
	        		case 'User':
    					item.factorValue = item.factorValue1;
        				item.factorValueNum = 1;
					break;
					case 'Choose…':
						delete item;
					break;
            	}
    			delete item.factorValue1;
    			delete item.factorValue2;
            }
			serviceAPI.updateData(url, $scope.segmDetail).then(function(result){
				if (result.code == 200 && result.status == 1) {
					history.go(-1);
				} else {
					ModalAlert.popup({msg: result.msg}, 2500);
				}
			})
		};
        $scope.getDetail();
	}
];
return scope;