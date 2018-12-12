'use strict'

// private libs
const config = require("../../../config");
const messages = require("../messages");
const DAO = require("../database/dao");
const Entity = require("../database/entity");
const {
    Strings,
    Messages,
    MiddleWares
} = require("../utils");

// public libs
const fs = require("fs");
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const multer = require("multer");

const router = express.Router();
const multerFactory = multer();
const pool = mysql.createPool(config.mysqlConfig);

router.get("/", MiddleWares.checkUserLogged, (request, response) => {
    response.status(200);
    // Find any ejs files
    fs.readdir(path.join.apply(this, [config.root].concat(config.files.ejs)), (err, files) => {
        // Filters by ejs files starting with name home
        let homeFiles = files.filter(element => /home.+\.ejs/.test(element));
        // Choose one randomly
        let random = Math.floor(Math.random() * homeFiles.length);

        new DAO.message(pool).findBy({
            touserid: request.session.currentUser.id
        }, (err, messages) => {
            if (err) {
                throw err;
            } else {
                new DAO.message(pool).delete({
                    touserid: request.session.currentUser.id
                }, (err, success) => {
                    if (err) {
                        throw err;
                    } else {
                        response.setFlash(messages.map(message => {
                            return {
                                type: message.type,
                                text: message.message
                            }
                        }));
                        response.render("home", {
                            person: homeFiles[random]
                        });
                    }
                });
            }
        });
    });
});

router.get("/login", (request, response) => {
    response.status(200);
    response.render("login-register", {
        login: true
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
                response.setFlash([{
                    type: Messages.types.SUCCESS,
                    text: Strings.transform(messages[config.locale].welcome, {
                        name: result.username
                    })
                }]);
                response.redirect("/");
            } else {
                response.setFlash([{
                    type: Messages.types.ERROR,
                    text: Strings.transform(messages[config.locale].failedAuthentication)
                }]);
                response.render("login-register", {
                    login: true
                });
            }
        }
    });
});

router.post("/register", multerFactory.single("avatar"), (request, response) => {

    request.checkBody('password',
        Strings.transform(messages[config.locale].passwordNotSame)).allSame();

    request.getValidationResult().then((errors) => {
        if (errors.isEmpty()) {
            request.body.password = request.body.password[0];
            let daoUser = new DAO.user(pool);
            daoUser.findByEmail(request.body.email, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    if (result != null) {
                        response.setFlash([{
                            type: Messages.types.ERROR,
                            text: Strings.transform(messages[config.locale].emailExists)
                        }]);
                        response.render("login-register", {
                            register: true
                        });
                    } else {
                        daoUser.insert(new Entity.user({
                            username: request.body.username,
                            email: request.body.email,
                            password: request.body.password,
                            birthdate: request.body.birthdate,
                            gender: request.body.gender,
                            description: ""
                        }), (err, result) => {
                            if (err) {
                                throw err;
                            } else {
                                let dir = [config.root].concat(config.files.user);
                                fs.exists(path.join.apply(this, dir), (exists) => {
                                    if (exists) {
                                        dir.push(String(result.id));
                                        fs.mkdir(path.join.apply(this, dir), {
                                            recursive: true
                                        }, (err) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                request.session.currentUser = result;
                                                fs.mkdir(path.join.apply(this, dir.concat(["story"])), {
                                                    recursive: true
                                                }, (err) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                                if (request.file != undefined) {
                                                    dir.push("avatar");
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
                                                                    response.setFlash([{
                                                                        type: Messages.types.SUCCESS,
                                                                        text: Strings.transform(messages[config.locale].welcome, {
                                                                            name: result.username
                                                                        })
                                                                    }]);
                                                                    response.redirect("/");
                                                                }
                                                            })
                                                        }
                                                    });
                                                } else {
                                                    response.setFlash([{
                                                        type: Messages.types.SUCCESS,
                                                        text: Strings.transform(messages[config.locale].welcome, {
                                                            name: result.username
                                                        })
                                                    }]);
                                                    response.redirect("/");
                                                }
                                            }
                                        });
                                    } else {
                                        fs.mkdir(path.join.apply(this, dir), {
                                            recursive: true
                                        }, (err) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                dir.push(String(result.id));
                                                fs.mkdir(path.join.apply(this, dir), {
                                                    recursive: true
                                                }, (err) => {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        request.session.currentUser = result;
                                                        fs.mkdir(path.join.apply(this, dir.concat(["story"])), {
                                                            recursive: true
                                                        }, (err) => {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                        if (request.file != undefined) {
                                                            dir.push("avatar");
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
                                                                            response.setFlash([{
                                                                                type: Messages.types.SUCCESS,
                                                                                text: Strings.transform(messages[config.locale].welcome, {
                                                                                    name: result.username
                                                                                })
                                                                            }]);
                                                                            response.redirect("/");
                                                                        }
                                                                    })
                                                                }
                                                            });
                                                        } else {
                                                            response.setFlash([{
                                                                type: Messages.types.SUCCESS,
                                                                text: Strings.transform(messages[config.locale].welcome, {
                                                                    name: result.username
                                                                })
                                                            }]);
                                                            response.redirect("/");
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            response.setFlash(errors.array().map(element => {
                return {
                    type: Messages.types.ERROR,
                    text: element.msg
                };
            }));
            response.render("login-register", {
                register: true
            });
        }
    });
});

router.get("/logout", MiddleWares.checkUserLogged, (request, response) => {
    response.setFlash([{
        type: Messages.types.SUCCESS,
        text: Strings.transform(messages[config.locale].goodBye, {
            name: request.session.currentUser.username
        })
    }]);
    // logout
    delete request.session.currentUser;
    response.redirect("/login");
});

module.exports = {
    rootRouter: router
};