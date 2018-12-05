'use strict'

// private libs
const {
    Strings,
    Messages,
    MiddleWares
} = require("../utils");
const DAO = require("../database/dao");
const config = require("../../../config");
const messages = require("../messages");
const Entity = require("../database/entity");


// public libs
const express = require("express");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const multer = require("multer");
const expressValidator = require("express-validator");
const fs = require("fs");

const router = express.Router();
const multerFactory = multer();

router.use(MiddleWares.checkUserLogged);
router.use(expressValidator());

router.get("/", (request, response) => {
    response.status(200);
    console.log(request.session.currentUser);
    new DAO.friend(pool).findFriends(request.session.currentUser.id, (err, friends) => {
        if (err) {
            throw err;
        } else {
            new DAO.question(pool).findBy({
                userid: request.session.currentUser.id
            }, (err, questions) => {
                if (err) {
                    throw err;
                } else {
                    new DAO.questionanswered(pool).findBy({
                        userid: request.session.currentUser.id
                    }, (err, questionsanswered) => {
                        if (err) {
                            throw err;
                        } else {
                            response.render("profile", {
                                friends: friends.length,
                                questions: questions.length,
                                questionsanswered: questionsanswered.length
                            });
                        }
                    });
                }
            });
        }
    });
});
router.get("/modify", (request, response) => {
    response.status(200);
    response.render("modify-profile");
});
router.post("/modify_profile", multerFactory.single("avatar"), (request, response) => {
    request.checkBody('password',
        Strings.transform(messages[config.locale].passwordNotSame)).allSame();
    request.getValidationResult().then((errors) => {
        if (errors.isEmpty()) {
            let daoUser = new DAO.user(pool);
            daoUser.findByEmail(request.body.email, (err, users) => {
                if (err) {
                    throw err;
                } else {
                    if (users) {
                        response.setFlash([{
                            type: Messages.types.ERROR,
                            text: Strings.transform(messages[config.locale].emailExists)
                        }]);
                        response.redirect("/profile");
                    } else {
                        let new_user = {
                            username: request.body.username,
                            email: request.body.email,
                            password: request.body.password,
                            birthdate: request.body.birthdate,
                            gender: request.body.gender,
                            description: request.body.description
                        };
                        if (request.file != undefined) {
                            let dir = [config.root].concat(config.files.user);
                            dir.push(String(request.session.currentUser.id));
                            fs.writeFile(dir, request.file.buffer, "binary", (err) => {
                                if (err) {
                                    throw err;
                                } else {
                                    new_user.img = dir;
                                    daoUser.update({
                                        id: request.session.currentUser.id
                                    }, new_user, (err, result) => {
                                        if (err) {
                                            throw err;
                                        } else {
                                            request.session.currentUser.set({
                                                img: new_user.img
                                            });
                                            response.setFlash([{
                                                type: Messages.types.SUCCESS,
                                                text: Strings.transform(messages[config.locale].welcome, {
                                                    name: result.username
                                                })
                                            }]);
                                            response.redirect("/profile");
                                        }
                                    })
                                }
                            });
                        }
                    }
                }
            })

        } else {
            response.setFlash(errors.array().map(element => {
                return {
                    type: Messages.types.ERROR,
                    text: element.msg
                };
            }));
            response.redirect("/profile");
        }

    });
});


module.exports = {
    profileRouter: router
};