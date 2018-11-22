'use strict'

const fs = require("fs");
const express = require("express");
const router = express.Router();
const path = require("path");
const config = require("../../../config");
const mysql = require("mysql");
const multer = require("multer")
const {
    Strings,
    Messages
} = require("../utils");
const messages = require("../messages");

const DAO = require("../database/dao");
const Entity = require("../database/entity");

const multerFactory = multer();
const pool = mysql.createPool(config.mysqlConfig);

router.get("/", (request, response) => {
    response.status(200);
    // Find any ejs files
    fs.readdir(path.join.apply(this, [config.root].concat(config.files.ejs)), (err, files) => {
        // Filters by ejs files starting with name home
        let homeFiles = files.filter(element => /home.+\.ejs/.test(element));
        // Choose one randomly
        let random = Math.floor(Math.random() * homeFiles.length);
        // clearing messages cookie
        let messages = request.cookies.messages;
        response.clearCookie("messages");
        response.render("home", {
            person: homeFiles[random],
            messages: messages
        });
    });
});

router.get("/home", (request, response) => {
    response.redirect("/");
});

router.get("/login", (request, response) => {
    response.status(200);
    // Clearing messages cookies
    let messages = request.cookies.messages;
    response.clearCookie("messages");
    response.render("login-register", {
        messages: messages
    });
});

router.post("/login", multerFactory.none(), (request, response) => {
    // finds by email if exists
    new DAO.user(pool).findByEmail(request.body.email, (err, result) => {
        if (err) {
            response.render("login-register", {
                messages: [{
                        type: Messages.types.ERROR,
                        text: Strings.transform(messages[config.locale].conectionError)
                    },
                    {
                        type: Messages.types.INFO,
                        text: Strings.transform(messages[config.locale].sorry)
                    }
                ]
            });
        } else {
            // if it does exits and the password is correct
            if (result != null && request.body.password == result.password) {
                request.session.currentUser = result;
                response.cookie("messages", [{
                    type: Messages.types.SUCCESS,
                    text: Strings.transform(messages[config.locale].welcome, {
                        name: result.name
                    })
                }]);
                response.redirect("/home");
            } else {
                response.render("login-register", {
                    messages: [{
                        type: Messages.types.ERROR,
                        text: Strings.transform(messages[config.locale].failedAuthentication)
                    }]
                });
            }
        }
    });
});

router.post("/register", multerFactory.single(), (request, response) => {
    console.log(request.body);
    response.render("login-register");
});

router.get("/logout", (request, response) => {
    response.cookie("messages", [{
        type: Messages.types.SUCCESS,
        text: Strings.transform(messages[config.locale].goodBye, {
            name: request.session.currentUser.name
        })
    }]);
    // set currentuser to undefine, logout
    request.session.currentUser = undefined;
    response.redirect("/login");
});

module.exports = {
    rootRouter: router
};