var scope = ["$scope", "$location", "ModalAlert", "urlAPI", "serviceAPI", "adminAPI",
	function($scope, $location, ModalAlert, urlAPI, serviceAPI, adminAPI) {

		$scope.role = {};
		$scope.permissionPoolEditer = [];
		$scope.permissionPoolResource = [];
		// $scope.parentId = "";

		$scope.colsInit = [{
			field: adminAPI.str.id
		}, {
			field: adminAPI.str.node
		}, {
			field: adminAPI.str.active
		}, {
			field: adminAPI.str.label
		}];

		$scope.css = {
			width_6PT: "6%",
			width_30: "30px !important",
			width_100: "100px",
			border_none: "none",
			border_right: "1px solid #dddddd",
			font_weight_bold: "bold",
			vertical_align_middle: "middle"
		};

		$scope.permitOrderList = [];
		$scope.permitOrderItem = {
			active: 0,
			permissionId: 0,
			sequence: 0,
			name: ""
		};

		$scope.roleUserOrderList = [];
		$scope.roleUserOrder = {
			active: 0,
			userId: 0,
			userName: ""
		};

		$scope.paramData = {
			roleId: "",
			action: "",
			groupId: "",
			roleInfo: {
				name: "",
				groupId: "",
				isDeleted: adminAPI.num.int_0,
				isDisabled: adminAPI.num.int_0
			},
			roleUserOrderList: {},
			rolePermitOrderList: {}
		};

		var $tablePermission = $("#tb-permission");

		$scope.initEditView = function() {
			$scope.role = adminAPI.getRole();
			if (!$scope.role || !$scope.role.action || $scope.role.groupId == undefined || $scope.role.groupId == null) {
				// alert("paramter is invalid!");
				adminAPI.comfirmPopup("paramter is invalid!");
				return;
			}

			$scope.roleNameBk = $scope.role.name;
			$scope.paramData.roleId = $scope.role.id;
			$scope.paramData.action = $scope.role.action;
			$scope.paramData.groupId = $scope.role.groupId;

			serviceAPI.loadData(urlAPI.admin_role_edit, $scope.paramData).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$scope.adminPermissionPool = adminAPI.cloneArray(result.data.adminPermissionPool);
					$scope.roleActivityPermits = adminAPI.cloneArray(result.data.groupExistPermitList);
					$scope.roleExistPermitList = adminAPI.cloneArray(result.data.roleExistPermitList);
					$scope.roleActivityUserList = adminAPI.cloneArray(result.data.roleActivityUserList);
					$scope.roleAssignedUserList = adminAPI.cloneArray(result.data.roleAssignedUserList);

					$scope.chargeTreeViewData();
					$scope.convertPerPoolToTreeViewNode($scope.permissionPoolEditer, $scope.roleActivityPermits);
					$scope.chargeNodeAttrIndeterminate($scope.permissionPoolEditer);
					$scope.chargeNodeAttrActive($scope.permissionPoolEditer);

					$scope.permissionPoolEditerBk = adminAPI.cloneArray($scope.permissionPoolEditer);

					$scope.buildPermitTable($tablePermission, $scope.colsInit, $scope.permissionPoolEditer);
				}
			});
		};

		$scope.chargeTreeViewData = function() {

			$scope.convertPerPoolToTreeViewNode($scope.permissionPoolResource, $scope.adminPermissionPool);

			$scope.chargeNodePermitLength($scope.permissionPoolResource);

			$scope.chargePermitTable();

			$scope.chargeAssignUser();
		};

		$scope.chargeNodePermitLength = function(permissionPool) {
  			var permit;
  			for (var i = 0; i < permissionPool.length; i++) {
  				permit = permissionPool[i];
  				if ($scope.isPermissionNode(permit)) {
  
					permit.nodeLengthOrg = permit.node.length;
					$scope.addAttrNodeLength(permit.name, permit.node.length);

					$scope.chargeNodePermitLength(permit.node);
  					
  				} else {
  					permit.nodeLengthOrg = adminAPI.num.int_0;
  					$scope.addAttrNodeLength(permit.name, adminAPI.num.int_0);
  				}
  			}
		};

		$scope.addAttrNodeLength = function(nodeName, nodeSize) {

			for (var i = 0; i < $scope.adminPermissionPool.length; i++) {
				if ($scope.adminPermissionPool[i].name == nodeName) {
					$scope.adminPermissionPool[i].nodeLengthOrg = nodeSize;
					break;
				}
			}
		};

		$scope.chargePermitTable = function() {

			var activeFlg = false;
			var perAppendList = [];

			$scope.adminPermissionPool.sort(adminAPI.compareById(adminAPI.str.sequence));

			// IF Super Admin Role(Have all permission)
			if ($scope.roleActivityPermits.length == adminAPI.num.int_1 &&
				$scope.roleActivityPermits[0].permissionId == adminAPI.num.int_0) {

				var superAdminPer = {};
				$scope.roleActivityPermits = [];
				for (var i = 0; i < $scope.adminPermissionPool.length; i++) {
					superAdminPer.permissionId = $scope.adminPermissionPool[i].id;
					superAdminPer.name = $scope.adminPermissionPool[i].name;
					superAdminPer.sequence = $scope.adminPermissionPool[i].sequence;
					superAdminPer.nodeLengthOrg = $scope.adminPermissionPool[i].nodeLengthOrg;
					$scope.roleActivityPermits.push(superAdminPer);
					superAdminPer = {};
				}

			} else {

				// Find permit name at permission pool
				for (var i = 0; i < $scope.roleActivityPermits.length; i++) {
					for (var j = 0; j < $scope.adminPermissionPool.length; j++) {
						if ($scope.roleActivityPermits[i].permissionId == $scope.adminPermissionPool[j].id) {
							$scope.roleActivityPermits[i].name = $scope.adminPermissionPool[j].name;
							$scope.roleActivityPermits[i].sequence = $scope.adminPermissionPool[j].sequence;
							$scope.roleActivityPermits[i].nodeLengthOrg = $scope.adminPermissionPool[j].nodeLengthOrg;
							break;
						}
					}
				}

				// Append node permit which child permit were not checked all
				for (var i = 0; i < $scope.adminPermissionPool.length; i++) {

					activeFlg = true;
					var perId = $scope.adminPermissionPool[i].id;
					var perName = $scope.adminPermissionPool[i].name;
					var perSequence = $scope.adminPermissionPool[i].sequence;
  					var nodeLengthOrg = $scope.adminPermissionPool[i].nodeLengthOrg;

					if (adminAPI.endWith(perId + "", "0") && adminAPI.endWith(perName, ":*")) {

						for (var j = 0; j < $scope.roleActivityPermits.length; j++) {

							if ($scope.roleActivityPermits[j].permissionId == perId) {
								activeFlg = true;
								break;
							} else {
								activeFlg = false;
							}
						}
					}

					if (!activeFlg) {
						for (var j = 0; j < $scope.roleActivityPermits.length; j++) {
							if (adminAPI.startWith($scope.roleActivityPermits[j].name, perName.substring(0, perName.length - "*".length))) {
								if (perAppendList.length == 0) {
									$scope.permitOrderItem.permissionId = perId;
									$scope.permitOrderItem.name = perName;
									$scope.permitOrderItem.active = adminAPI.num.int_0;
									$scope.permitOrderItem.sequence = perSequence;
  									$scope.permitOrderItem.nodeLengthOrg = nodeLengthOrg;
									perAppendList.push($scope.permitOrderItem);
									$scope.permitOrderItem = {};
								} else {
									var perAppendFlg = false;
									for (var k = 0; k < perAppendList.length; k++) {
										if (perAppendList[k].permissionId == perId) {
											perAppendFlg = false;
											break;
										} else {
											perAppendFlg = true;
										}
									}

									if (perAppendFlg) {
										$scope.permitOrderItem.permissionId = perId;
										$scope.permitOrderItem.name = perName;
										$scope.permitOrderItem.active = adminAPI.num.int_0;
										$scope.permitOrderItem.sequence = perSequence;
  										$scope.permitOrderItem.nodeLengthOrg = nodeLengthOrg;
										perAppendList.push($scope.permitOrderItem);
										$scope.permitOrderItem = {};
									}
								}
							}
						}
					}
				}

				$scope.roleActivityPermits = $scope.roleActivityPermits.concat(perAppendList);
				perAppendList = [];

			}

			// When node permit is active, but only herself.
			var isSubNodeExist = false;
			for (var i = 0; i < $scope.adminPermissionPool.length; i++) {
				var inode = $scope.adminPermissionPool[i];
				var jnode;
				for (var j = 0; j < $scope.roleActivityPermits.length; j++) {
					jnode = $scope.roleActivityPermits[j];
					// if (adminAPI.endWith(jnode.name, ":*")) {
						if (adminAPI.startWith(inode.sequence, jnode.sequence)) {
							if (inode.id == jnode.permissionId) {
								isSubNodeExist = true;
								break;
							} else {
								isSubNodeExist = false;
							}
						}
					// }
				}

				if (!isSubNodeExist) {
					if (jnode.active == adminAPI.num.int_1) {
						inode.active = adminAPI.num.int_1;
					} else {
						inode.active = adminAPI.num.int_0;
					}

					inode.permissionId = inode.id;
					$scope.permissionPoolEditer.push(inode);
				}

			}
			// // When node permit is active, but only herself.
			// for (var i = 0; i < $scope.roleActivityPermits.length; i++) {
			// 	var inode = $scope.roleActivityPermits[i];
			// 	if (adminAPI.endWith(inode.name, ":*")) {
			// 		for (var j = 0; j < $scope.adminPermissionPool.length; j++) {
			// 			if (adminAPI.startWith($scope.adminPermissionPool[j].sequence, inode.sequence) && $scope.adminPermissionPool[j].id != inode.permissionId) {
			// 				if (inode.active == adminAPI.num.int_1) {
			// 					$scope.adminPermissionPool[j].active = adminAPI.num.int_1;
			// 				} else {
			// 					$scope.adminPermissionPool[j].active = adminAPI.num.int_0;
			// 				}

			// 				$scope.adminPermissionPool[j].permissionId = $scope.adminPermissionPool[j].id;
			// 				$scope.permissionPoolEditer.push($scope.adminPermissionPool[j]);
			// 			}
			// 		}

			// 	}
			// }

			// $scope.permissionPoolEditerTemp = [];
			// var isSubNodeExist = false;

			// for (var i = 0; i < $scope.permissionPoolEditer.length; i++) {
			// 	var inode = $scope.permissionPoolEditer[i];
			// 	for (var j = 0; j < $scope.roleActivityPermits.length; j++) {
			// 		if ($scope.roleActivityPermits[j].permissionId == inode.permissionId) {
			// 			isSubNodeExist = true;
			// 			break;
			// 		} else {
			// 			isSubNodeExist = false;
			// 		}
			// 	}

			// 	if (!isSubNodeExist) {
			// 		$scope.permissionPoolEditerTemp.push($scope.permissionPoolEditer[i]);
			// 	}
			// }

			$scope.roleActivityPermits = $scope.roleActivityPermits.concat($scope.permissionPoolEditer);
			$scope.roleActivityPermits.sort(adminAPI.compareById(adminAPI.str.sequence));

			$scope.permissionPoolEditer = [];
			$scope.permissionPoolEditerTemp = [];

			// Charge permit active status which will show and checked or not
			if ($scope.roleExistPermitList.length == adminAPI.num.int_1 &&
				$scope.roleExistPermitList[0].permissionId == adminAPI.num.int_0) {

				for (var i = 0; i < $scope.roleActivityPermits.length; i++) {
					$scope.roleActivityPermits[i].active = adminAPI.num.int_1;
				}

				$scope.permitOrderList = adminAPI.cloneArray($scope.roleActivityPermits);

			} else if ($scope.roleExistPermitList.length == adminAPI.num.int_0) {

				for (var i = 0; i < $scope.roleActivityPermits.length; i++) {
					$scope.roleActivityPermits[i].active = adminAPI.num.int_0;
				}

			} else {

				// Permission save data init(JSON object)
				for (var i = 0; i < $scope.roleActivityPermits.length; i++) {
					for (var j = 0; j < $scope.roleExistPermitList.length; j++) {
						if ($scope.roleActivityPermits[i].permissionId == $scope.roleExistPermitList[j].permissionId) {
							$scope.roleActivityPermits[i].active = adminAPI.num.int_1;
							activeFlg = true;
							break;
						} else {
							activeFlg = false;
						}
					}

					if (!activeFlg) {
						$scope.roleActivityPermits[i].active = adminAPI.num.int_0;
					}
				}

				for (var i = 0; i < $scope.roleExistPermitList.length; i++) {
					$scope.permitOrderItem.permissionId = $scope.roleExistPermitList[i].permissionId;
					$scope.permitOrderItem.name = $scope.roleExistPermitList[i].name;
					$scope.permitOrderItem.active = adminAPI.num.int_1;
					$scope.permitOrderItem.sequence = $scope.getPermitSequence($scope.permitOrderItem.permissionId);
					$scope.permitOrderList.push($scope.permitOrderItem);
					$scope.permitOrderItem = {};
				}
			}

			$scope.permissionPoolEditer = [];

		};

		$scope.chargeAssignUser = function() {

			var activeFlg;

			for (var i = 0; i < $scope.roleActivityUserList.length; i++) {
				for (var j = 0; j < $scope.roleAssignedUserList.length; j++) {
					if ($scope.roleActivityUserList[i].id == $scope.roleAssignedUserList[j].id) {
						$scope.roleActivityUserList[i].active = adminAPI.num.int_1;
						activeFlg = true;
						break;
					} else {
						activeFlg = false;
					}
				}

				if (!activeFlg) {
					$scope.roleActivityUserList[i].active = adminAPI.num.int_0;
				}
			}

			for (var i = 0; i < $scope.roleAssignedUserList.length; i++) {
				$scope.roleUserOrder.userId = $scope.roleAssignedUserList[i].id;
				$scope.roleUserOrder.userName = $scope.roleAssignedUserList[i].userName;
				$scope.roleUserOrder.active = adminAPI.num.int_1;
				$scope.roleUserOrderList.push($scope.roleUserOrder);
				$scope.roleUserOrder = {};
			}
		};

		$scope.getPermitSequence = function(permitId) {

			for (var i = 0; i < $scope.adminPermissionPool.length; i++) {
				if ($scope.adminPermissionPool[i].id == permitId) {
					return $scope.adminPermissionPool[i].sequence;
				}
			}

			return "";
		};

		$scope.convertPerPoolToTreeViewNode = function(permissionPoolEditer, permissionPool) {

			var permitCurName, permitCurObj, permitCurArr, permitCurNamePath;

			for (var i = 0; i < permissionPool.length; i++) {
				if (adminAPI.isNullOrEmpty(permissionPool[i]) || !adminAPI.contains(permissionPool[i].name, ":")) continue;

				permitCurObj = permissionPool[i];
				permitCurName = permitCurObj.name;
				permitCurArr = permitCurName.split(":");

				if (adminAPI.endWith(permitCurName, ":*")) {
					permitCurNamePath = permitCurName.substring(0, permitCurName.length - ":*".length);

					if (permitCurArr[1] == "*" && permitCurArr.length == 2) {

						permissionPoolEditer.push({
							id    : permitCurObj.permissionId,
							name  : permitCurName,
							field : permitCurArr[0],
							node  : [],
							active: permitCurObj.active,
							nodeLengthOrg: permitCurObj.nodeLengthOrg
						});

						// superId = permitCurObj.permissionId;
						// $scope.parentId = superId;
						continue;

					} else {
						permitCurArr = permitCurNamePath.split(":");
						$scope.addPermitNodeForTreeView(permitCurArr, permissionPoolEditer, permitCurObj);
						// $scope.parentId = permitCurObj.permissionId;
					}

				} else {
					permitCurArr = permitCurName.split(":");
					$scope.addPermitNodeForTreeView(permitCurArr, permissionPoolEditer, permitCurObj);
				}
			}
		};

		$scope.addPermitNodeForTreeView = function(permitParentArr, permissionPool, permitCurObj) {

			var m, n, permit;

			for (m = 0; m < permitParentArr.length; m++) {
				if (adminAPI.isNullOrEmpty(permissionPool) || permissionPool.length == undefined) {

					permissionPool[adminAPI.str.node].push({
						id: permitCurObj.permissionId,
						name: permitCurObj.name,
						field: permitParentArr[m],
						node: adminAPI.endWith(permitCurObj.name, ":*") == true ? [] : null,
						active: permitCurObj.active,
						// parentId: $scope.parentId,
						nodeLengthOrg: permitCurObj.nodeLengthOrg
					});

					return;
				}

				for (n = 0; n < permissionPool.length; n++) {
					if (permissionPool[n].field == permitParentArr[m]) {
						$scope.hasParentNode = true;
						permit = permissionPool[n];
						break;
					} else {
						$scope.hasParentNode = false;
					}
				}

				break;
			}

			if ($scope.hasParentNode) {
				permitParentArr.shift();

				if (adminAPI.endWith(permit.name, ":*")) {
					if (permit.node.length == 0) {
						return $scope.addPermitNodeForTreeView(permitParentArr, permit, permitCurObj);
					} else {
						return $scope.addPermitNodeForTreeView(permitParentArr, permit.node, permitCurObj);
					}
				} else {
					return $scope.addPermitNodeForTreeView(permitParentArr, permit, permitCurObj);
				}
			} else {
				permissionPool.push({
					id: permitCurObj.permissionId,
					name: permitCurObj.name,
					field: permitParentArr[m],
					node: adminAPI.endWith(permitCurObj.name, ":*") == true ? [] : null,
					active: permitCurObj.active,
					// parentId: $scope.parentId,
					nodeLengthOrg: permitCurObj.nodeLengthOrg
				});
			}

			return;
		};

		$scope.chargeNodeAttrIndeterminate = function(permissionPool) {

			var permit;
			for (var i = 0; i < permissionPool.length; i++) {
				permit = permissionPool[i];
				if ($scope.isPermissionNode(permit)) {

					$scope.chargeNodeAttrIndeterminateSub(permit, permit.node);
					$scope.setAttributeParentId(permit, permit.node);

					var status = $scope.getNodeAllCheckboxStatus(permit.node);
					var indeterminateFlg = $scope.isIndeterminateNode(permit.node);

					if (status == adminAPI.num.int_0 || status == adminAPI.num.int_1) {
						permit.indeterminate = indeterminateFlg;
					} else if (status == adminAPI.num.int_2) {
						permit.indeterminate = true;
					}
				}
			}
		};

		$scope.chargeNodeAttrIndeterminateSub = function(node, nodePermission) {

			if (adminAPI.isNullOrEmpty(nodePermission)) return;

			if ($scope.isPermissionNode(nodePermission)) {

				for (var i = 0; i < nodePermission.length; i++) {
					$scope.setAttributeParentId(node, nodePermission);

					var permit = nodePermission[i];
					var status = $scope.chargeNodeAttrIndeterminateSub(permit, permit.node);
					if (status == adminAPI.num.int_0 || status == adminAPI.num.int_1) {
						permit.indeterminate = false;
					} else if (status == adminAPI.num.int_2) {
						permit.indeterminate = true;
					}
				}

			} else {
				$scope.setAttributeParentId(node, nodePermission);
				return $scope.getNodeAllCheckboxStatus(nodePermission);
			}

		};

		$scope.setAttributeParentId = function(node, nodePermission) {
			for (var i = 0; i < nodePermission.length; i++) {
				nodePermission[i].parentId = node.id;
			}
		};

		$scope.chargeNodeAttrActive = function(permissionPool) {

			var permit;
			for (var i = 0; i < permissionPool.length; i++) {
				permit = permissionPool[i];
				if ($scope.isPermissionNode(permit)) {

					$scope.chargeNodeAttrActiveSub(permit.node);

					var status = $scope.getNodeAllCheckboxStatus(permit.node);
					if (status == adminAPI.num.int_0 || status == adminAPI.num.int_2) {
						permit.active = adminAPI.num.int_0;
					} else if (status == adminAPI.num.int_1) {
						permit.active = adminAPI.num.int_1;
					}

					$scope.updatePermitOrderList(permit, permit.active);
				}
			}
		};

		$scope.chargeNodeAttrActiveSub = function(nodePermission) {

			if ($scope.isPermissionNode(nodePermission)) {

				for (var i = 0; i < nodePermission.length; i++) {
					var permit = nodePermission[i];
					var status = $scope.chargeNodeAttrActiveSub(permit.node);
					if (status == adminAPI.num.int_0 || status == adminAPI.num.int_2) {
						permit.active = adminAPI.num.int_0;
					} else if (status == adminAPI.num.int_1) {
						permit.active = adminAPI.num.int_1;
					}

					$scope.updatePermitOrderList(permit, permit.active);
				}

			} else {
				return $scope.getNodeAllCheckboxStatus(nodePermission);
			}

		};

		$scope.getPermitNodeCols = function(cols) {

			var i, col, columns = [];

			for (i = 0; i < cols.length; i++) {
				col = cols[i];
				switch (col.field) {
					case adminAPI.str.id:
						columns.push({
							field: col.field,
							title: col.field,
							visible: false
						});
						break;
					case adminAPI.str.node:
						columns.push({
							field: col.field,
							title: col.field,
							align: 'left',
							cellStyle: function cellStyle(value, row, index) {
								return {
									css: {
										'width': '88%',
										"font-weight": $scope.css.font_weight_bold,
										"border-right": $scope.css.border_none
									}
								}
							},
						});
						break;
					case adminAPI.str.active:
						columns.push({
							field: col.field,
							title: '',
							align: 'center',
							checkbox: true,
							cellStyle: function cellStyle(value, row, index) {
								return {
									classes: 'per-nodeCheckBox'
								}
							},
						});
						break;
					case adminAPI.str.label:
						columns.push({
							field: col.field,
							title: adminAPI.str.selectAll,
							align: 'left',
							cellStyle: function cellStyle(value, row, index) {
								return {
									css: {
										'width': '15% !important',
										'border-left': '0px !important',
										'border-right': '0px !important'
									}
								}

							},
						});
						break;
				}
			}

			return columns;
		};

		$scope.getPermitNodeRows = function(rows, columns) {

			var i, j, row, col, rowsData = [];

			for (i = 0; i < rows.length; i++) {
				row = {};
				for (j = 0; j < columns.length; j++) {
					col = columns[j];
					if (col.field == adminAPI.str.id) {
						row[col.field] = rows[i].id;
					} else if (col.field == adminAPI.str.active) {
						row[col.field] = rows[i].active;
					} else if (col.field == adminAPI.str.label) {
						row[col.field] = adminAPI.str.selectAll;
					} else if (col.field == adminAPI.str.node) {
						row[col.field] = rows[i].field;
					}
				}

				rowsData.push(row);
			}

			return rowsData;
		};

		$scope.getPermitChildCols = function(cols) {

			var i, col, colIndex = 0,
				columns = [];
			for (i = 0; i < cols.length; i++) {
				col = cols[i];
				columns.push({
					field: col.id,
					title: '',
					checkbox: true
				});

				colIndex++;

				columns.push({
					field: col.field,
					title: col.field,
					align: 'left',
					cellStyle: function cellStyle(value, row, index) {
						return {
							css: {
								"width": $scope.css.width_6PT,
								"border-left": $scope.css.border_none,
								"border-right": $scope.css.border_right
							}
						}
					},
				});

				colIndex++;
			}

			// 五列补齐
			for (var i = 0; i < adminAPI.num.int_5 - cols.length; i++) {
				columns.push({
					field: adminAPI.str.checkbox + colIndex,
					cellStyle: function cellStyle(value, row, index) {
						return {
							css: {
								"width": '2% !important',
								"vertical-align": 'middle !important',
								"border-left": $scope.css.border_none,
								"border-right": $scope.css.border_none
							}
						}
					},
				});

				colIndex++;

				columns.push({
					field: adminAPI.str.blank + colIndex,
					cellStyle: function cellStyle(value, row, index) {
						return {
							css: {
								"width": $scope.css.width_6PT,
								"border-left": $scope.css.border_none,
								"border-right": $scope.css.border_none
							}
						}
					},
				});

				colIndex++;
			}

			// 预留(两列Blank)
			columns.push({
				field: adminAPI.str.blank + colIndex,
				cellStyle: function cellStyle(value, row, index) {
					return {
						css: {
							"width": $scope.css.width_6PT,
							"border-left": $scope.css.border_none,
							"border-right": $scope.css.border_none
						}
					}
				},
			});

			colIndex++;

			columns.push({
				field: adminAPI.str.blank + colIndex,
				cellStyle: function cellStyle(value, row, index) {
					return {
						css: {
							"width": $scope.css.width_6PT,
							"border-left": $scope.css.border_none,
							"border-right": $scope.css.border_none
						}
					}
				},
			});

			return columns;
		};

		$scope.getPermitChildRows = function(rows, columns) {

			var i, j, col, row = {},
				rowsData = [];

			for (i = 0; i < columns.length; i++) {
				for (j = 0; j < rows.length; j++) {
					col = columns[i];
					if (col.field == rows[j].id) {
						row[col.field] = rows[j].active;
						break;
					} else if (col.field == rows[j].field) {
						row[col.field] = rows[j].field;
						break;
					} else if (col.field == adminAPI.str.checkbox + i) {
						row[col.field] = "";
						break;
					} else if (col.field == adminAPI.str.blank + i) {
						row[col.field] = "";
						break;
					}
				}
			}

			rowsData.push(row);
			return rowsData;
		};

		$scope.getPermitFromPerPoolById = function(permissionPool, nodeId) {

			for (var i = 0; i < permissionPool.length; i++) {
				var permit = permissionPool[i];
				if (permit.id == nodeId) {
					return permit;
				} else if ($scope.isPermissionNode(permit.node)) {
					var permitNode = $scope.getPermitFromPerPoolByIdSub(permit.node, nodeId);
					if (adminAPI.isNullOrEmpty(permitNode)) {
						continue;
					} else {
						return permitNode;
					}
				}
			}
		};

		$scope.getPermitFromPerPoolByIdSub = function(permissionPool, nodeId) {

			if (permissionPool.id == nodeId) {
				return permissionPool;
			} else if ($scope.isPermissionNode(permissionPool)) {
				return $scope.getPermitFromPerPoolById(permissionPool, nodeId);
			} else {
				return null;
			}
		};

		$scope.isPermissionNode = function(permission) {

			var row, isPermissionNodeFlg = false;
			if (adminAPI.isNullOrEmpty(permission)) return isPermissionNodeFlg;

			if (adminAPI.isNullOrEmpty(permission.length)) {
				if (!adminAPI.isNullOrEmpty(permission.node) && permission.node.length != 0) {
					return true;
				}
			}

			for (var i = 0; i < permission.length; i++) {
				row = permission[i];
				if (adminAPI.isNullOrEmpty(row) || adminAPI.isNullOrEmpty(row.node) || row.node.length == 0) {
					isPermissionNodeFlg = false;
				} else {
					isPermissionNodeFlg = true;
					break;
				}
			}

			return isPermissionNodeFlg;
		};

		$scope.isIndeterminateNode = function(permitNode) {

			var isIndeterminateFlg = false;
			if (adminAPI.isNullOrEmpty(permitNode) || permitNode.length == 0) return false;

			for (var i = 0; i < permitNode.length; i++) {
				if (permitNode[i].indeterminate === true) {
					return true;
				} else {
					isIndeterminateFlg = false;
				}
			}

			return isIndeterminateFlg;
		};

		$scope.getNodeAllCheckboxStatus = function(permitNode) {

			var countActive = 0;
			for (var i = 0; i < permitNode.length; i++) {
				if (permitNode[i].active == adminAPI.num.int_1) {
					countActive++;
				}
			}

			if (countActive == adminAPI.num.int_0) {
				return adminAPI.num.int_0;
			} else if (countActive == permitNode.length) {
				return adminAPI.num.int_1;
			} else {
				return adminAPI.num.int_2;
			}
		};

		$scope.changeDomParentSwitchStatus = function(permitNode) {

			if (adminAPI.isNullOrEmpty(permitNode.parentId)) return;

			var permit = $scope.getPermitFromPerPoolById($scope.permissionPoolEditer, permitNode.parentId);
			var indeterminateFlg = $scope.isIndeterminateNode(permit.node);
			var status = $scope.getNodeAllCheckboxStatus(permit.node);
			var nodeId = "#" + permit.id;

			if (status == adminAPI.num.int_0) {
				$(nodeId)[0].checked = false;
				$(nodeId)[0].indeterminate = indeterminateFlg;
				permit.indeterminate = indeterminateFlg;
				$scope.updatePermitOrderList(permit, adminAPI.num.int_0);

			} else if (status == adminAPI.num.int_1) {
				$(nodeId)[0].checked = true;
				$(nodeId)[0].indeterminate = false;
				permit.indeterminate = false;
				$scope.updatePermitOrderList(permit, adminAPI.num.int_1);

			} else if (status == adminAPI.num.int_2) {
				$(nodeId)[0].indeterminate = true;
				permit.indeterminate = true;
				$scope.updatePermitOrderList(permit, adminAPI.num.int_0);
			}

			$scope.changeDomParentSwitchStatus(permit);

		};

		$scope.updatePermitOrderList = function(permit, status) {

			var existFlg = false;
			permit.active = status;

			for (var i = 0; i < $scope.permitOrderList.length; i++) {
				if ($scope.permitOrderList[i].permissionId === permit.id) {
					$scope.permitOrderList[i].active = status;
					existFlg = true;
					break;
				} else {
					existFlg = false;
				}
			}

			if (!existFlg) {
				$scope.permitOrderItem.permissionId = permit.id;
				$scope.permitOrderItem.active = status;
				$scope.permitOrderItem.sequence = $scope.getPermitSequence(permit.id);
				$scope.permitOrderList.push($scope.permitOrderItem);
				$scope.permitOrderItem = {};
			}

		};

		$scope.updateNodePermitOrderList = function(permit, status) {

			$scope.updatePermitOrderList(permit, status);

			if (!adminAPI.isNullOrEmpty(permit.node)) {
               permit.indeterminate = false;
            }

			if (!adminAPI.isNullOrEmpty(permit.node)) {
				for (var i = 0; i < permit.node.length; i++) {
					$scope.updateNodePermitOrderList(permit.node[i], status);
				}
			}
		};

		$scope.buildPermitTable = function($el, colsRes, rowsRes) {

			var colsData = [],
				rowsData = [];

			var isPermissionNodeFlg = $scope.isPermissionNode(rowsRes);
			if (isPermissionNodeFlg) {
				// Node
				colsData = $scope.getPermitNodeCols(colsRes);
				rowsData = $scope.getPermitNodeRows(rowsRes, colsData);
				$scope.doPermitNodeTable($el, colsData, rowsData, colsRes, rowsRes);
			} else {
				// Child
				colsData = $scope.getPermitChildCols(rowsRes);
				rowsData = $scope.getPermitChildRows(rowsRes, colsData);
				$scope.doPermitChildTable($el, colsData, rowsData, colsRes, rowsRes);
			}

			$scope.onSelectSwitch($el, rowsData, rowsRes);
		};

		$scope.doPermitNodeTable = function($el, colsData, rowsData, colsRes, rowsRes) {
			$el.bootstrapTable({
				columns: colsData,
				data: rowsData,
				detailView: true,
				showHeader: false,
				onExpandRow: function(index, row, $detail) {
					var nodeId = rowsRes[index].id;
					var nodePermit = rowsRes[index].node;

					$scope.expandTable($detail, colsData, nodePermit, nodeId);
				},

				onCheck: function(row, $ele) {
					var item;

					for (var i = 0; i < rowsRes.length; i++) {
						if (rowsRes[i].id == $ele[0].id) {
							item = rowsRes[i];
							break;
						}
					}

					$scope.isChildCheckBoxClick = false;
					$("#" + item.id)[0].checked = true;
    				$("#" + item.id)[0].indeterminate = false;

					var tableId = adminAPI.str.table + item.id;
					$scope.switchNodeChildCheckBox($("#" + tableId), true);
					$scope.updateNodePermitOrderList(item, adminAPI.num.int_1);

					if (!adminAPI.isNullOrEmpty(item.parentId)) {
		  				$scope.changeDomParentSwitchStatus(item);
		  			}

				},

				onUncheck: function(row, $ele) {
					var item;

					for (var i = 0; i < rowsRes.length; i++) {
						if (rowsRes[i].id == $ele[0].id) {
							item = rowsRes[i];
							break;
						}
					}

					$scope.isChildCheckBoxClick = false;
					$("#" + item.id)[0].checked = false;
    				$("#" + item.id)[0].indeterminate = false;

					var tableId = adminAPI.str.table + item.id;

					$scope.switchNodeChildCheckBox($("#" + tableId), false);
					$scope.updateNodePermitOrderList(item, adminAPI.num.int_0);
					
					if (!adminAPI.isNullOrEmpty(item.parentId)) {
		  				$scope.changeDomParentSwitchStatus(item);
		  			}

				},
			});
		};

		$scope.doPermitChildTable = function($el, colsData, rowsData, colsRes, rowsRes) {
			$el.bootstrapTable({
				columns: colsData,
				data: rowsData,
				detailView: false,
				showHeader: false,
				onExpandRow: function(index, row, $detail) {
					var nodeId = rowsRes[index].id;
					var nodePermit = rowsRes[index].node;

					$scope.expandTable($detail, colsData, nodePermit, nodeId);
				},

				onCheck: function(row, $ele) {
					var item;

					for (var i = 0; i < rowsRes.length; i++) {
						if (rowsRes[i].id == $ele[0].id) {
							item = rowsRes[i];
							break;
						}
					}

					$scope.isChildCheckBoxClick = true;
					$scope.updatePermitOrderList(item, adminAPI.num.int_1);

					$scope.changeDomParentSwitchStatus(item);

				},

				onUncheck: function(row, $ele) {
					var item;

					for (var i = 0; i < rowsRes.length; i++) {
						if (rowsRes[i].id == $ele[0].id) {
							item = rowsRes[i];
							break;
						}
					}

					$scope.isChildCheckBoxClick = true;
					$scope.updatePermitOrderList(item, adminAPI.num.int_0);

					$scope.changeDomParentSwitchStatus(item);

				},
			});
		};

		$scope.onSelectSwitch = function($ele, rowsData, rowsRes) {

			$ele.find('tbody > tr').map(function(index, elem) {
				var nodeId = rowsData[index].id;
				elem.setAttribute("permit", adminAPI.str.node + nodeId);
			});

			$ele.find('input[name="btSelectItem"]').map(function(index, $item) {
				var permit = rowsRes[index];
				$item.id = permit.id;
				$item.indeterminate = permit.indeterminate;
				$item.checked = permit.active == adminAPI.num.int_1 ? true : false;
			});

		};

		$scope.expandTable = function($detail, cols, rows, nodeId) {
			var tableId = adminAPI.str.table + nodeId;
			var html = '<table id="' + tableId + '"></table>';

			$scope.buildPermitTable($detail.html(html).find('#' + tableId), cols, rows);

			if ($scope.isExpandAllNode) {
				$scope.expandAllNode($detail);
			}

		};

		// Click To Expand All Nodes
		$scope.expandAllNode = function($target) {

			$scope.isExpandAllNode = true;

			if (adminAPI.isNullOrEmpty($target)) {
				$target = $tablePermission;
			}

			$target.find('tr[permit^="node"]').map(function(index, elem) {
				var $node = $(elem);
				var that = $node;
				if (!$node.next().is('tr.detail-view')) {
					$node.find('> td > .detail-icon').click();

				} else if (!$node.next().next().is('tr.detail-view')) {
					$node.next().find('.detail-icon').click();
				}
			});
		};

		$scope.collapseAllNode = function() {

			$scope.isExpandAllNode = false;

			$tablePermission.find('tr[permit^="node"]').map(function(index, elem) {
				var $node = $(elem);
				for (var i = 0; i < $scope.permissionPoolEditer.length; i++) {
					var trId = $scope.permissionPoolEditer[i].id;
					if (adminAPI.str.node + trId == $node[0].getAttribute("permit")) {
						if ($node.next().is('tr.detail-view')) {
							$node.find('> td > .detail-icon').click();
							break;
						}
					}
				}
			});
		};

		$scope.switchNodeChildCheckBox = function($ele, state) {
			$ele.find('input[name="btSelectItem"]').map(function(index, $item) {
				$item.checked = state;
			});
		};

		$scope.selectRoleUser = function($event, item) {

			var existFlg = false;
			var checkFlg;

			if (adminAPI.isNullOrEmpty($event.target.checked)) {
				checkFlg = item.active == adminAPI.num.int_1 ? adminAPI.num.int_0 : adminAPI.num.int_1;
				if (!adminAPI.isNullOrEmpty($event.target.previousElementSibling && $event.target.previousElementSibling.id == item.id)) {
					$event.target.previousElementSibling.checked = checkFlg == adminAPI.num.int_1 ? true : false;
					item.active = checkFlg;
				}
			} else {
				checkFlg = $event.target.checked == true ? adminAPI.num.int_1 : adminAPI.num.int_0;
			}

			for (var i = 0; i < $scope.roleUserOrderList.length; i++) {
				if ($scope.roleUserOrderList[i].userId == item.id) {
					$scope.roleUserOrderList[i].active = checkFlg;
					existFlg = true;
					break;
				} else {
					existFlg = false;
				}
			}

			if (!existFlg) {
				$scope.roleUserOrder.active = checkFlg;
				$scope.roleUserOrder.userId = item.id;
				$scope.roleUserOrder.userName = item.userName;
				$scope.roleUserOrderList.push($scope.roleUserOrder);
				$scope.roleUserOrder = {};
			}
		};

		$scope.roleSave = function() {

			$scope.resubmit = true;

			if (!$scope.checkParameter()) {
				$scope.resubmit = false;
				return;
			}

			$scope.permitOrderList.sort(adminAPI.compareById(adminAPI.str.sequence));

			$scope.checkNodePermitActive($scope.permissionPoolEditer);

			// Super Admin
			var status = $scope.getNodeAllCheckboxStatus($scope.permitOrderList);
			if (status == adminAPI.num.int_1 && $scope.permitOrderList.length == $scope.adminPermissionPool.length) {

				$scope.permitOrderItem.permissionId = adminAPI.num.int_0;
				$scope.permitOrderItem.active = adminAPI.num.int_1;
				$scope.paramData.rolePermitOrderList = [];
				$scope.paramData.rolePermitOrderList.push($scope.permitOrderItem);
				$scope.permitOrderItem = {};

			} else {
				$scope.paramData.rolePermitOrderList = $scope.permitOrderList;
			}

			$scope.paramData.roleInfo.name = $scope.role.name;
			$scope.paramData.roleInfo.groupId = $scope.role.groupId;
			$scope.paramData.roleInfo.isDefault = adminAPI.num.int_0;
			$scope.paramData.roleInfo.isDisabled = adminAPI.num.int_0;
			$scope.paramData.roleUserOrderList = $scope.roleUserOrderList;

			var url;
			if (adminAPI.str.create == $scope.role.action) {
				url = urlAPI.admin_role_create;
			} else if (adminAPI.str.update == $scope.role.action) {
				url = urlAPI.admin_role_update;
			}

			serviceAPI.saveData(url, $scope.paramData).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$location.path('/view' + urlAPI.admin_role_view);
				} else if (result.status == -1 && result.code == 80100501) {
					adminAPI.comfirmPopup("Role name was aready existed!");
				} else {
					adminAPI.comfirmPopup(result.msg);
				}

				$scope.resubmit = false;
			});

		};



		$scope.checkParameter = function() {

			if (adminAPI.isNullOrEmpty($scope.role.name)) {
				adminAPI.comfirmPopup("Role name is invalid!");
				return false;
			}

			if ($scope.role.name.length > 20) {
				adminAPI.comfirmPopup("Role name is too long!");
				return false;
			}

			return true;
		};

		$scope.checkNodePermitActive = function(permissionPool) {

			var permit;
			for (var i = 0; i < permissionPool.length; i++) {
				permit = permissionPool[i];
				if ($scope.isPermissionNode(permit)) {

					$scope.checkNodePermitActiveSub(permit.node);

					var status = $scope.getNodeAllCheckboxStatus(permit.node);
					if (status == adminAPI.num.int_0 || status == adminAPI.num.int_2) {
						permit.active = adminAPI.num.int_0;
					} else if (status == adminAPI.num.int_1) {
						permit.active = adminAPI.num.int_1;
					}

					$scope.setAttrNodeActive(permit);
					$scope.updatePermitOrderList(permit, permit.active);
				}
			}
		};

		$scope.checkNodePermitActiveSub = function(nodePermission) {

			if ($scope.isPermissionNode(nodePermission)) {
				for (var i = 0; i < nodePermission.length; i++) {
					var permit = nodePermission[i];
					if ($scope.checkNodePermitActiveSub(permit.node)) {
						$scope.setAttrNodeActive(permit);
					}
				}
			} else {
				return true;
			}

		};

		$scope.setAttrNodeActive = function(permit) {

			for (var i = 0; i < $scope.permitOrderList.length; i++) {
				if ($scope.permitOrderList[i].permissionId == permit.id) {
					if (permit.node.length != permit.nodeLengthOrg) {
						$scope.updatePermitOrderList(permit, adminAPI.num.int_0);
					}
					break;
				}
			}
		};



		$scope.initEditView();

	}
];
return scope;