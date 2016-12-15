angular.module('app.directive').directive('verification', ['regexAPI', function(regexAPI) {
    return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            $('input', ele).blur(function() {
                validate($(this).val())
            });

            function validate(value) {
                if (regexAPI.isNull(value)) {
                    ele.find('.msg').text(regexAPI.isNullMsg);
                }
            };
            $('input', ele).focus(function() {
                $(ele).find('.msg').text("");
            });

            function regexJudge(arr, value) {
                for (var i = 0; i < arr.length; i++) {
                    var str = arr[i];
                    if (!value.match(regexAPI[str])) {
                        str = str + "Msg";
                        $(ele).find('.msg').text(regexAPI[str]);
                        break;
                    };
                }
            };
        }
    };
}]);
