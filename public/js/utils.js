"use strict"

// private libs
const config = require('../../config');
const messages = require('./messages');

// public libs
const fs = require('fs');
const path = require('path');

Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth - 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});

let Strings = {
    // Function which transforms string with parameters
    transform: (function (str, o = {}) {
        let regexp = /{([^{]+)}/g;
        return str.replace(regexp, function (ignore, key) {
            return (key = o[key]) == null ? '' : key;
        });
    })
}

let Arrays = {
    getItems(array, count) {
        let result = [];
        while (array.length > 0 && result.length < count) {
            let number = Math.floor(Math.random() * array.length);
            result.push(array[number]);
            array.splice(number, 1);
        }
        return result;
    }
}

let validators = {
    notIn: function (entry, check) {
        return (check.indexOf(entry) == -1);
    },
    allDifferent: function (array, ignore = []) {
        array = array.filter(element => ignore.indexOf(element) == -1);
        array.sort();
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] == array[i + 1]) {
                return false;
            }
        }
        return true;
    },
    allSame: function (array) {
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] != array[i + 1]) {
                return false;
            }
        }
        return true;
    }
}

let middleWares = {
    /**
     * Checks if the user is logged, if not redirects to login page
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    checkUserLogged: function checkUserLogged(request, response, next) {
        if (request.session.currentUser == undefined) {
            response.redirect("/login");
        } else {
            response.locals.user = request.session.currentUser;
            next();
        }
    },
    showMessages: function (request, response, next) {
        response.locals.user = request.session.currentUser;
        //response.locals.messages = request.cookies.messages;
        //response.clearCookie("messages");
        next();
    },
    /**
     * Error pages
     * @param {*} error 
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    error: function (error, request, response, next) {
        // Searching all ejs
        fs.readdir(path.join.apply(this, [config.root].concat(config.files.ejs)), (err, files) => {
            // Filters by all ejs files starting with names game
            let errorFiles = files.filter(element => /game.+\.ejs/.test(element));
            // Choose one random file
            let random = Math.floor(Math.random() * errorFiles.length);
            response.render("error", {
                url: request.url,
                status: response.statusCode,
                text: {
                    error: error.message,
                    stayAndPlay: Strings.transform(messages[config.locale].stayAndPlay)
                },
                redirection: {
                    name: "Inicio",
                    url: "/"
                },
                game: errorFiles[random]
            });
        });
    },
    flash: function (request, response, next) {
        response.setFlash = function (msg) {
            if (!request.session.flashMsg) {
                request.session.flashMsg = [];
            }
            request.session.flashMsg = request.session.flashMsg.concat(msg);
        };
        response.locals.getAndClearFlash = function () {
            let msg = request.session.flashMsg;
            delete request.session.flashMsg;
            return msg;
        };
        next();
    }
}

module.exports = {
    Strings: Strings,
    Arrays: Arrays,
    Messages: {
        // Enum containing message colors types
        types: Object.freeze({
            INFO: "info", // blue
            SUCCESS: "success", // green
            WARNING: "warning", // yellow
            ERROR: "error" // red
        })
    },
    MiddleWares: middleWares,
    Validators: validators
}