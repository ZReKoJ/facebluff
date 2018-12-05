'use strict'

// private libs
const {
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

const router = express.Router();
const multerFactory = multer();

router.use(MiddleWares.checkUserLogged);
router.use(expressValidator());

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
        if (error.isEmpty()) {
            console.log(request.body);
        }

    });
});


module.exports = {
    profileRouter: router
};