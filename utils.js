"use strict"

module.exports = {
    Strings = {
        create : (function() {
                var regexp = /{([^{]+)}/g;

                return function(str, o) {
                     return str.replace(regexp, function(ignore, key){
                           return (key = o[key]) == null ? '' : key;
                     });
                }
        })
    },
}