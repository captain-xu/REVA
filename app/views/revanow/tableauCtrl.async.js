var scope = ["$scope", '$stateParams', 'serviceAPI', '$timeout',
    function($scope, $stateParams, serviceAPI, $timeout) {
        $scope.isShow = false;
        $scope.init = function() {
            $(".load-fail").hide();
            $scope.slide_num = 0;
            serviceAPI.loadData("/auth/da/getReport", { reportId: $stateParams.param }).then(function(result) {
                if (result.status == 0) {
                    $scope.tableauData = result.data;
                    $scope.initTableau();
                }
            });
            $scope.timer = $timeout(function() {
                $(".load-fail").show();
            }, 10000)
        };
        $scope.initTableau = function() {
            if ($scope.tableauData.urls.length > 1) {
                for (var i = 1; i < $scope.tableauData.urls.length; i++) {
                    $('.banner ul').append('<li class="tableau-div"></li>');
                }
            };
            var option = function() {
                if ($stateParams.param == "data_download") {
                    return {
                        hideTabs: true,
                        'Channel': $scope.userInfo.channels
                    }
                } else {
                    return {
                        hideTabs: true,
                        'p_chl': $scope.userInfo.channels
                            // onFirstInteractive: function(viz) {
                            //     workbook = viz.getViz().getWorkbook();
                            //     activeSheet = workbook.getActiveSheet();
                            //     Worksheet = activeSheet.getWorksheets()[0];
                            //     Worksheet.getFiltersAsync().then(function(result) {
                            //         console.log(result)
                            //     }, function() {
                            //         console.log(123)
                            //     })
                            // }
                    }
                }
            }
            $('.tableau-div').each(function(i, dom) {
                $scope.viz = new tableau.Viz(dom,
                    $scope.tableauData.urls[i], option());
            });
            $('.banner').unslider({ nav: false, arrows: false });
        };
        $scope.showSlide = function(num) {
            $scope.slide_num = num;
            $('.banner').unslider('animate:' + num);
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
];
return scope;
