"use strict"

let Strings = {
    // Function which transforms string with parameters
    transform: (function (str, o = {}) {
        let regexp = /{([^{]+)}/g;
        return str.replace(regexp, function (ignore, key) {
            return (key = o[key]) == null ? '' : key;
        });
    })
}

module.exports = {
    Strings: Strings,
    Messages: {
        // Enum containing message colors types
        types: Object.freeze({
            INFO: "info", // blue
            SUCCESS: "success", // green
            WARNING: "warning", // yellow
            ERROR: "error" // red
        })
    }
}