angular.module('app.services').factory('regexAPI', ["toaster",function(toaster) {
    return {
        isNull: function(value) {
            if (value.length == 0 && value.trim() == "") {
                return true;
            } else {
                return false;
            }
        },
        isNullMsg:"Required Field",
        letters: "^[a-zA-z]*$",
        lettersMsg:"Please input in English",
        email: "[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?",
        integer: "^[1-9]\d*$",
        url: "[a-zA-z]+://[^\s]*",
        objRegex:function(obj,arr){
            var i=0, length=arr.length;
            for(i; i<length; i++){
                obj[arr[i]] += "";
                if(!obj[arr[i]] || obj[arr[i]].trim() == ""){
                    toaster.pop({
                        type: 'error',
                        title: 'Error',
                        body: "The "+arr[i]+" value is necessary",
                        showCloseButton: true,
                        timeout: "3000"
                    });
                    return false;
                }
            };
            return true;
        }
    }
}])
