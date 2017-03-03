angular.module('app.services').factory('adminAPI', [
	'$http',
	'$q',
	'$location',
	'ModalAlert',
	function($http, $q, $location, ModalAlert) {
		 'use strict';

		var adminAPI = {
			group : undefined,
			role  : undefined,
			user  : undefined,
			app   : undefined
		};

		return {

			loginUser: {},

			str: {
				id: "id",
				node: "node",
				name: "name",
				lewa: "lewa",
				admin: "admin",
				blank: "blank",
				level: "level",
				label: "label",
				table: "table",
				active: "active",
	        	create: "create",
	        	update: "update",
				timezone: "UTC",
				language: "English",
				checkbox: "checkbox",
				sequence: "sequence",
				selectAll: "Select All",
				email: "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$",
				imageDirPath: "http://dev.apkstorage.revanow.com/admin_image/"
	        },

	        num: {
				int_0: 0,
				int_1: 1,
				int_2: 2,
				int_5: 5
			},

	        pageBar: {
	            pageSize: "20",
	            pageIndex: "1"
	        },

			setGroup: function(group) {
				adminAPI.group = group;
			},
			getGroup: function() {
				return adminAPI.group;
			},

			setRole: function(role) {
				adminAPI.role = role;
			},
			getRole: function() {
				return adminAPI.role;
			},

			setUser: function(user) {
				adminAPI.user = user;
			},
			getUser: function() {
				return adminAPI.user;
			},

			setApp: function(app) {
				adminAPI.app = app;
			},
			getApp: function() {
				return admin.app;
			},

			getPassword: function() {
				var numword = "";

				for (var i = 0; i < 6; i++) {
					numword += Math.floor((Math.random()*10));
				}

				return numword;
			},

			isNullOrEmpty: function(val) {
				if (val == null || val == undefined || val.toString().trim() == "") {
					return true;
				} else {
					return false;
				}
			},

			cloneArray: function(data) {
				if (data) {
					return [].concat(data);
				} else {
					return [];
				}
			},

			startWith: function(str1, str2) {
				if (str1 == null || str1 == undefined || str1 == "" || str1.length == 0 
					|| str2 == null || str2 == undefined  || str2 == "" || str2.length == 0 || str1.length < str2.length ) {
					return false;
				} else if (str1.toString().substring(0, str2.toString().length) == str2.toString()) {
					return true;
				} else {
					return false;
				}
			},

			endWith: function(str1, str2) {
				if (str1 == null || str1 == undefined || str1 == "" || str1.length == 0 
					|| str2 == null || str2 == undefined  || str2 == "" || str2.length == 0 || str1.length < str2.length ) {
					return false;
				} else if (str1.toString().substring(str1.toString().length - str2.toString().length) == str2.toString()) {
					return true;
				} else {
					return false;
				}
			},

			contains: function(str, substr) {
				return str.indexOf(substr) != -1;
			},

			compareById: function(prop) {
				return function(obj1, obj2) {
					var val1 = obj1[prop];
					var val2 = obj2[prop];
					if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
						val1 = Number(val1);
						val2 = Number(val2);
					}
					if (val1 < val2) {
						return -1;
					} else if (val1 > val2) {
						return 1;
					} else {
						return 0;
					}
				}
			},

			comfirmPopup: function(msg) {
				ModalAlert.comfirm({
					value: msg,
					closeBtnValue: "OK"
				});
			},

			
		};

	}
]);