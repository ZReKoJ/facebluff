'use strict'

// private libs
const config = require("../../../config");
const messages = require("../messages");
const DAO = require("../database/dao");
const Entity = require("../database/entity");
const {
    Strings,
    Messages
} = require("../utils");

// public libs
const fs = require("fs");
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const multer = require("multer")

const router = express.Router();
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
            throw err;
        } else {
            // if it does exits and the password is correct
            if (result != null && request.body.password == result.password) {
                request.session.currentUser = result;
                response.cookie("messages", [{
                    type: Messages.types.SUCCESS,
                    text: Strings.transform(messages[config.locale].welcome, {
                        name: result.username
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

router.post("/register", multerFactory.single("avatar"), (request, response) => {
    if (request.body.password[0] == request.body.password[1]) {
        request.body.password = request.body.password[0];
        let daoUser = new DAO.user(pool);
        daoUser.findByEmail(request.body.email, (err, result) => {
            if (err) {
                throw err;
            } else {
                if (result != null) {
                    response.render("login-register", {
                        messages: [{
                            type: Messages.types.ERROR,
                            text: Strings.transform(messages[config.locale].emailExists)
                        }]
                    });
                } else {
                    daoUser.insert(new Entity.user({
                        username: request.body.username,
                        email: request.body.email,
                        password: request.body.password,
                        birthdate: Date.parse(request.body.birthdate),
                        gender: request.body.gender
                    }), (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            let dir = [config.root].concat(config.files.user);
                            dir.push(String(result.id));
                            fs.mkdir(path.join.apply(this, dir), {
                                recursive: true
                            }, (err) => {
                                if (err) {
                                    throw err;
                                } else {
                                    request.session.currentUser = result;
                                    if (request.file != undefined) {
                                        dir.push("avatar");
                                        console.log(dir)
                                        dir = path.join.apply(this, dir);
                                        fs.writeFile(dir, request.file.buffer, "binary", (err) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                daoUser.update({
                                                    id: result.id
                                                }, {
                                                    img: dir
                                                }, (err, result) => {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        request.session.currentUser.set({
                                                            img: dir
                                                        });
                                                        response.cookie("messages", [{
                                                            type: Messages.types.SUCCESS,
                                                            text: Strings.transform(messages[config.locale].welcome, {
                                                                name: result.username
                                                            })
                                                        }]);
                                                        response.redirect("/home");
                                                    }
                                                })
                                            }
                                        });
                                    } else {
                                        response.cookie("messages", [{
                                            type: Messages.types.SUCCESS,
                                            text: Strings.transform(messages[config.locale].welcome, {
                                                name: result.username
                                            })
                                        }]);
                                        response.redirect("/home");
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        response.render("login-register", {
            messages: [{
                type: Messages.types.ERROR,
                text: Strings.transform(messages[config.locale].passwordNotSame)
            }]
        });
    }
});

router.get("/logout", (request, response) => {
    response.cookie("messages", [{
        type: Messages.types.SUCCESS,
        text: Strings.transform(messages[config.locale].goodBye, {
            name: request.session.currentUser.username
        })
    }]);
    // set currentuser to undefine, logout
    request.session.currentUser = undefined;
    response.redirect("/login");
});

module.exports = {
    rootRouter: router
};