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

const multer = require("multer");
const expressValidator = require("express-validator");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const multerFactory = multer();
const pool = mysql.createPool(config.mysqlConfig);

router.use(MiddleWares.checkUserLogged);
router.use(expressValidator());

function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
router.get("/", (request, response) => {
    response.status(200);
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
                            new DAO.user(pool).findBy({
                                id: request.session.currentUser.id
                            }, (err, currentuser) => {
                                if (err) {
                                    throw err;
                                } else {
                                    currentuser[0].birthdate = calculateAge(currentuser[0].birthdate);
                                    response.render("profile", {
                                        friends: friends.length,
                                        questions: questions.length,
                                        questionsanswered: questionsanswered.length,
                                        currentUser: currentuser[0]
                                    });
                                }

                            })

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

router.post("/modify_profile", multerFactory.single("avatar"), (request, response) => {;
    request.checkBody('password',
        Strings.transform(messages[config.locale].passwordNotSame)).allSame();
    request.getValidationResult().then((errors) => {
        if (errors.isEmpty()) {
            let daoUser = new DAO.user(pool);
            daoUser.findByEmail(request.body.email, (err, users) => {
                if (err) {
                    throw err;
                } else {
                    if (users && users.email != request.session.currentUser.email) {
                        response.setFlash([{
                            type: Messages.types.ERROR,
                            text: Strings.transform(messages[config.locale].emailExists)
                        }]);
                        response.redirect("/profile");
                    } else {
                        let new_user = {
                            username: request.body.username ? request.body.username : request.session.currentUser.username,
                            email: request.body.email ? request.body.email : request.session.currentUser.email,
                            password: request.body.password[0] ? request.body.password[0] : request.session.currentUser.password,
                            birthdate: request.body.birthdate ? request.body.birthdate : request.session.currentUser.birthdate,
                            gender: request.body.gender ? request.body.gender : request.session.currentUser.gender,
                            description: request.body.description ? request.body.description : request.session.currentUser.description,
                            score: request.session.currentUser.score,
                            img: request.session.currentUser.img
                        };
                        let id = request.session.currentUser.id;
                        request.session.currentUser = new_user;
                        request.session.currentUser.id = id;
                        if (request.file != undefined) {
                            if (new_user.score < 100) {
                                daoUser.update({
                                    id: request.session.currentUser.id
                                }, new_user, (err, result) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        response.setFlash([{
                                            type: Messages.types.ERROR,
                                            text: Strings.transform(messages[config.locale].notEnoughPoints)
                                        }]);
                                        response.redirect("/profile");
                                    }
                                });
                            } else {
                                let dir = [config.root].concat(config.files.user);
                                dir.push(String(request.session.currentUser.id));
                                dir.push("avatar");
                                dir = path.join.apply(this, dir);
                                fs.writeFile(dir, request.file.buffer, "binary", (err) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        new_user.img = dir;
                                        request.session.currentUser.img = dir;
                                        new_user.score = new_user.score - 100;
                                        request.session.currentUser.score = new_user.score;
                                        daoUser.update({
                                            id: request.session.currentUser.id
                                        }, new_user, (err, result) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                response.setFlash([{
                                                    type: Messages.types.SUCCESS,
                                                    text: Strings.transform(messages[config.locale].modifiedCorrect, {
                                                        name: result.username
                                                    })
                                                }]);
                                                response.redirect("/profile");
                                            }
                                        });
                                    }
                                });
                            }
                        } else {
                            daoUser.update({
                                id: request.session.currentUser.id
                            }, new_user, (err, result) => {
                                if (err) {
                                    throw err;
                                } else {
                                    response.setFlash([{
                                        type: Messages.types.SUCCESS,
                                        text: Strings.transform(messages[config.locale].modifiedCorrect, {
                                            name: result.username
                                        })
                                    }]);
                                    response.redirect("/profile");
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