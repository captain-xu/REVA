angular.module('app.services').factory("cookieService", [
    function() {
        'use strict';
        return {
            getCookie: function(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i].trim();
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return "";

            },
            setCookie: function(cname, cvalue, exdays) {
                if (exdays > 0) {
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                    var expires = "expires=" + d.toGMTString();
                }
                document.cookie = cname + "=" + cvalue + ";path=/"
            }
        }
    }
])
