var scope = ["$scope", "$location", "urlAPI", "serviceAPI", "Upload", "ModalAlert", "adminAPI",
	function($scope, $location, urlAPI, serviceAPI, Upload, ModalAlert, adminAPI) {

		$scope.group = {};
		$scope.permissionPoolEditer = [];
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
			id: 0,
			active: 0,
			sequence: 0,
			name: ""
		};

		$scope.paramData = {
			action: "",
			groupId: "",
			groupInfo: {
				name: "",
				tableauUser: "",
				userName: "",
				userEmail: "",
				iconUrl: "",
				channel: ""
			},
			groupOrderPermitList: {}
		};

		var $tablePermission = $("#tb-permission");

		$scope.initTableView = function() {
			$scope.group = adminAPI.getGroup();

			if (adminAPI.isNullOrEmpty($scope.group) || adminAPI.isNullOrEmpty($scope.group.action)) {
				adminAPI.comfirmPopup("paramter is invalid!");
				return;
			}

			if ($scope.group.action == adminAPI.str.update) {
				if (adminAPI.isNullOrEmpty($scope.group.id)) {
					adminAPI.comfirmPopup("paramter is invalid!");
					return;
				}

				if (!adminAPI.isNullOrEmpty($scope.group.iconUrl)) {
					var iconfile = $scope.group.iconUrl.substring($scope.group.iconUrl.lastIndexOf("/") + 1);
					$scope.iconImgUrl = "http://dev.apkstorage.revanow.com/admin_image/" + iconfile;
				}
			}

			$scope.paramData.action = $scope.group.action;
			$scope.paramData.groupId = $scope.group.id;

			serviceAPI.loadData(urlAPI.admin_group_edit, $scope.paramData).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$scope.groupChannelList = result.data.adminChannelList;
					$scope.adminPermissionPool = adminAPI.cloneArray(result.data.adminPermissionPool);
					$scope.groupExistPermitList = adminAPI.cloneArray(result.data.groupExistPermitList);

					$scope.chargeTreeViewData();
					$scope.convertPerPoolToTreeViewNode($scope.adminPermissionPool);
					$scope.chargeNodeAttrIndeterminate($scope.permissionPoolEditer);

					$scope.permissionPoolEditerBk = adminAPI.cloneArray($scope.permissionPoolEditer);

					$scope.buildPermitTable($tablePermission, $scope.colsInit, $scope.permissionPoolEditer);
				}
			});
		};

		$scope.chargeTreeViewData = function() {

			var activeFlg = false;
			$scope.adminPermissionPool.sort(adminAPI.compareById(adminAPI.str.sequence));

			// IF Super Admin(Have all permission)
			if ($scope.groupExistPermitList.length == adminAPI.num.int_1 &&
				$scope.groupExistPermitList[0].permissionId == adminAPI.num.int_0) {

				for (var i = 0; i < $scope.adminPermissionPool.length; i++) {
					$scope.adminPermissionPool[i].active = adminAPI.num.int_1;
				}

				$scope.permitOrderList = adminAPI.cloneArray($scope.adminPermissionPool);

			} else if ($scope.groupExistPermitList.length == 0) {

				for (var i = 0; i < $scope.adminPermissionPool.length; i++) {
					$scope.adminPermissionPool[i].active = adminAPI.num.int_0;
				}

			} else {

				// Match exist permit
				for (var i = 0; i < $scope.adminPermissionPool.length; i++) {
					activeFlg = false;

					for (var j = 0; j < $scope.groupExistPermitList.length; j++) {
						if ($scope.groupExistPermitList[j].permissionId == $scope.adminPermissionPool[i].id) {
							$scope.adminPermissionPool[i].active = adminAPI.num.int_1;
							activeFlg = true;
							break;
						} else {
							activeFlg = false;
						}
					}

					if (!activeFlg) {
						$scope.adminPermissionPool[i].active = adminAPI.num.int_0;
					}
				}

				// Permission save data init(JSON object)
				for (var i = 0; i < $scope.groupExistPermitList.length; i++) {
					$scope.permitOrderItem.id = $scope.groupExistPermitList[i].permissionId;
					$scope.permitOrderItem.active = adminAPI.num.int_1;
					$scope.permitOrderItem.sequence = $scope.getPermitSequence($scope.permitOrderItem.id);
					$scope.permitOrderList.push($scope.permitOrderItem);
					$scope.permitOrderItem = {};
				}
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

		$scope.convertPerPoolToTreeViewNode = function(permissionPool) {

			var permitCurName, permitCurObj, permitCurArr, permitCurNamePath;

			for (var i = 0; i < permissionPool.length; i++) {
				if (adminAPI.isNullOrEmpty(permissionPool[i]) || !adminAPI.contains(permissionPool[i].name, ":")) continue;

				permitCurObj = permissionPool[i];
				permitCurName = permitCurObj.name;
				permitCurArr = permitCurName.split(":");

				if (adminAPI.endWith(permitCurName, ":*")) {
					permitCurNamePath = permitCurName.substring(0, permitCurName.length - ":*".length);

					if (permitCurArr[1] == "*" && permitCurArr.length == 2) {

						$scope.permissionPoolEditer.push({
							id    : permitCurObj.id,
							name  : permitCurName,
							field : permitCurArr[0],
							node  : [],
							active: permitCurObj.active
						});

						// superId = permitCurObj.id;
						// $scope.parentId = superId;
						continue;

					} else {
						permitCurArr = permitCurNamePath.split(":");
						$scope.addPermitNodeForTreeView(permitCurArr, $scope.permissionPoolEditer, permitCurObj);
						// $scope.parentId = permitCurObj.id;
					}

				} else {
					permitCurArr = permitCurName.split(":");
					$scope.addPermitNodeForTreeView(permitCurArr, $scope.permissionPoolEditer, permitCurObj);
				}
			}
		};

		$scope.addPermitNodeForTreeView = function(permitParentArr, permissionPool, permitCurObj) {

			var m, n, permit;

			for (m = 0; m < permitParentArr.length; m++) {
				if (adminAPI.isNullOrEmpty(permissionPool) || permissionPool.length == undefined) {

					permissionPool[adminAPI.str.node].push({
						id: permitCurObj.id,
						name: permitCurObj.name,
						field: permitParentArr[m],
						node: adminAPI.endWith(permitCurObj.name, ":*") == true ? [] : null,
						active: permitCurObj.active
						// parentId: $scope.parentId
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
					id: permitCurObj.id,
					name: permitCurObj.name,
					field: permitParentArr[m],
					node: adminAPI.endWith(permitCurObj.name, ":*") == true ? [] : null,
					active: permitCurObj.active
					// parentId: $scope.parentId
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
								// "width": $scope.css.width_6PT,
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
				if ($scope.permitOrderList[i].id === permit.id) {
					$scope.permitOrderList[i].active = status;
					existFlg = true;
					break;
				} else {
					existFlg = false;
				}
			}

			if (!existFlg) {
				$scope.permitOrderItem.id = permit.id;
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



		$scope.checkParameter = function() {

			if (adminAPI.isNullOrEmpty($scope.group.name)) {
				adminAPI.comfirmPopup("Group name is invalid!");
				return false;
			}

			if (adminAPI.isNullOrEmpty($scope.group.tableauUser)) {
				adminAPI.comfirmPopup("Group tableau user is invalid!");
				return false;
			}

			// if (adminAPI.isNullOrEmpty($scope.group.channel)) {
			// 	adminAPI.comfirmPopup("Group channel is invalid!");
			// 	return false;
			// }

			if (adminAPI.str.create == $scope.group.action) {
				if (adminAPI.isNullOrEmpty($scope.group.userName)) {
					adminAPI.comfirmPopup("Group of user name is invalid!");
					return false;
				}

				if (adminAPI.isNullOrEmpty($scope.group.userEmail)) {
					adminAPI.comfirmPopup("Group of user email is invalid!");
					return false;
				}
			}

			if ($scope.group.name.length > 24) {
				adminAPI.comfirmPopup("Group name is too long!");
				return false;
			}

			if ($scope.group.tableauUser.length > 8) {
				adminAPI.comfirmPopup("Group tableau user is too long!");
				return false;
			}

			if (!adminAPI.isNullOrEmpty($scope.group.iconUrl) && $scope.group.iconUrl.length > 64) {
				adminAPI.comfirmPopup("Group icon URL is too long!");
				return false;
			}

			if (!adminAPI.isNullOrEmpty($scope.group.channel) && $scope.group.channel.length > 16) {
				adminAPI.comfirmPopup("Group channel name is too long!");
				return false;
			}

			if (adminAPI.str.create == $scope.group.action) {
				if ($scope.group.userName.length > 64) {
					adminAPI.comfirmPopup("Group of user name is too long!");
					return false;
				}

				if ($scope.group.userEmail.length > 64) {
					adminAPI.comfirmPopup("Group of user email is too long!");
					return false;
				}

				var regExp = new RegExp(adminAPI.str.email);
				if (!regExp.test($scope.group.userEmail)) {
					adminAPI.comfirmPopup("Group of user email is invalid!");
					return false;
				}
			}

			return true;
		};

		$scope.uploadIcon = function(file) {

			if (adminAPI.isNullOrEmpty(file)) {
				$scope.uploadStart = false;
				return;
			}

			if (file.size >= 300000) {
				ModalAlert.popup({
					msg: "The logo is too big!"
				}, 2500);

				$scope.uploadStart = false;
				return;
			}

			var url = "/admin/user/fileUpload";
			Upload.upload({
				url : url,
				data: {
					groupName: $scope.group.name,
					file : file
				}
			}).then(function(result) {
				if (result.data.status == 0 && result.data.code == 0) {
					$scope.group.iconUrl = result.data.data.iconRealPath;
					// 获取 window 的 URL 工具 
					var URL = window.URL || window.webkitURL;
					// 通过 file 生成目标 url 
					$scope.iconImgUrl = URL.createObjectURL(file); 
				} else {
					adminAPI.comfirmPopup("Please upload file.");
				}
			});
		};

		$scope.selectChannel = function(ichannel) {
			$scope.group.channel = ichannel.channel;
			$scope.group.channelId = ichannel.id;
		};

		$scope.groupSave = function() {

			$scope.resubmit = true;

			if (!$scope.checkParameter()) {
				$scope.resubmit = false;
				return;
			}

			$scope.permitOrderList.sort(adminAPI.compareById(adminAPI.str.sequence));

			// Super Admin
			var status = $scope.getNodeAllCheckboxStatus($scope.permitOrderList);
			if (status == adminAPI.num.int_1 && $scope.permitOrderList.length == $scope.adminPermissionPool.length) {

				$scope.permitOrderItem.id = adminAPI.num.int_0;
				$scope.permitOrderItem.active = adminAPI.num.int_1;
				$scope.paramData.groupOrderPermitList = [];
				$scope.paramData.groupOrderPermitList.push($scope.permitOrderItem);
				$scope.permitOrderItem = {};

			} else {
				$scope.paramData.groupOrderPermitList = $scope.permitOrderList;
			}

			$scope.paramData.groupInfo.name = $scope.group.name;
			$scope.paramData.groupInfo.tableauUser = $scope.group.tableauUser;
			$scope.paramData.groupInfo.iconUrl = $scope.group.iconUrl;
			$scope.paramData.groupInfo.channel = $scope.group.channel;

			var url;
			if (adminAPI.str.create == $scope.group.action) {
				url = urlAPI.admin_group_create;
				$scope.paramData.groupInfo.userName = $scope.group.userName;
				$scope.paramData.groupInfo.userEmail = $scope.group.userEmail;
			} else if (adminAPI.str.update == $scope.group.action) {
				url = urlAPI.admin_group_update;
			}

			serviceAPI.updateData(url, $scope.paramData).then(function(result) {
				if (result.status == 0 && result.code == 0) {
					$location.path('/view' + urlAPI.admin_group_view);
				} else if (result.status == -1 && result.code == 80100101) {
					adminAPI.comfirmPopup("Group name was aready existed!");
				} else if (result.status == -1 && result.code == 80101101) {
					adminAPI.comfirmPopup("Group of user name was aready existed!");
				} else {
					adminAPI.comfirmPopup(result.msg);
				}
				
				$scope.resubmit = false;
			});
		};



		$scope.initTableView();

	}
];
return scope;