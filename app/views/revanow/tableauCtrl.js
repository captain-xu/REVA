 require('tableauAPI');
 angular.module('app.controller').controller('modelCtrl', ["$scope", '$stateParams', 'tableauAPI', '$timeout',
     function($scope, $stateParams, tableauAPI, $timeout) {
         $scope.isShow = false;
         $scope.init = function() {
             $(".load-fail").hide();
             if ($stateParams.param == "dashboard") {
                 $scope.isShow = true;
                 $scope.getTicket();
             } else {
                 tableauAPI.activate();
                 $scope.loadTabelau(tableauAPI[$stateParams.param]);
             };

             $scope.timer = $timeout(function() {
                 $(".load-fail").show();
             }, 10000)
             $scope.setTableauTitle();
         };

         $scope.getTicket = function() {
             tableauAPI.getTicket().then(function(result) {
                 var url = tableauAPI.dashboard
                 if (result.data != "-1") {
                     var url = tableauAPI.getDashboard(result.data);
                 };
                 $scope.loadTabelau(url);
             }).catch(function() {
                 $scope.loadTabelau(tableauAPI[$stateParams.param]);
             })
         };
         $scope.loadTabelau = function(url) {
             new tableau.Viz($('.tableau-div')[0],
                 url, {
                     hideTabs: true,
                     'p_chl': $scope.userInfo.channels,
                 });
         };
         $scope.$on(
             "$destroy",
             function(event) {
                 $timeout.cancel($scope.timer);
             }
         );
         $scope.init();
     }
 ]).controller('regionCtrl', ["$scope", '$stateParams', 'tableauAPI', '$timeout',
     function($scope, $stateParams, tableauAPI, $timeout) {
         $scope.init = function() {
             $(".load-fail").hide();
             $scope.slide_num = 0;
             tableauAPI.activate();
             $('.tableau-div').each(function(i, dom) {
                 new tableau.Viz(dom,
                     tableauAPI[$stateParams.param][i], {
                         hideTabs: true,
                         'p_chl': $scope.userInfo.channels
                     });
             });
             $('.banner').unslider({ nav: false, arrows: false });
             $scope.timer = $timeout(function() {
                 $(".load-fail").show();
             }, 10000);
             $scope.setTableauTitle();
         };
         $scope.showSlide = function(num) {
             $scope.slide_num = num;
             $('.banner').unslider('animate:' + num);
         };
         $scope.$on(
             "$destroy",
             function(event) {
                 $timeout.cancel($scope.timer);
             }
         );
         $scope.init();
     }
 ]).controller('tableauDownCtrl', ["$scope", 'tableauAPI', '$timeout',
     function($scope, tableauAPI, $timeout) {
         $scope.init = function() {
             $(".load-fail").hide();
             tableauAPI.activate();
             $scope.viz = new tableau.Viz($('.tableau-div')[0],
                 tableauAPI.data_donwload, {
                     hideTabs: true,
                     'Channel': $scope.userInfo.channels
                 });
             $scope.timer = $timeout(function() {
                 $(".load-fail").show();
             }, 10000);
             $scope.setTableauTitle();
         };
         $scope.exportToPDF = function() {
             $scope.viz.showExportPDFDialog();
         };
         $scope.exportToCSV = function() {
             $scope.viz.showExportDataDialog();
         };
         $scope.$on(
             "$destroy",
             function(event) {
                 $timeout.cancel($scope.timer);
             }
         );
         $scope.init();
     }
 ]).controller('tableauCtrl', ["$scope", '$stateParams', 'tableauAPI', '$timeout',
     function($scope, $stateParams, tableauAPI, $timeout) {
         $scope.init = function() {
             $(".load-fail").hide();
             $scope.slide_num = 0;
             tableauAPI.activate();
             $scope.initTableau();
             $scope.timer = $timeout(function() {
                 $(".load-fail").show();
             }, 10000);
             $scope.setTableauTitle();
         };
         $scope.initTableau = function() {
             $scope.btnDatas = tableauAPI.btn_bar()[$stateParams.param];
             $scope.tableauUrl = tableauAPI[$stateParams.param];
             if ($scope.tableauUrl.length > 1) {
                 for (var i = 1; i < $scope.tableauUrl.length; i++) {
                     $('.banner ul').append('<li class="tableau-div"></li>');
                 }
             };
             $('.tableau-div').each(function(i, dom) {
                 new tableau.Viz(dom,
                     $scope.tableauUrl[i], {
                         hideTabs: true,
                         'p_chl': $scope.userInfo.channels
                     });
             });
             $('.banner').unslider({ nav: false, arrows: false });
         };
         $scope.showSlide = function(num) {
             $scope.slide_num = num;
             $('.banner').unslider('animate:' + num);
         };
         $scope.$on(
             "$destroy",
             function(event) {
                 $timeout.cancel($scope.timer);
             }
         );
         $scope.init();
     }
 ]);
