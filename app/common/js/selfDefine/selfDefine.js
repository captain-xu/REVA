'use strict';
function delIndex(i,arr) {　 //n表示要删除的对象，从0开始算起。  
    if (i == 0) {
        return arr.slice(i + 1, arr.length);
    } else {
        return arr.slice(0, i).concat(arr.slice(i + 1, arr.length));
    }
}