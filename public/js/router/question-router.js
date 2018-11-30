'use strict'
//private libs
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
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);

router.use(MiddleWares.checkUserLogged);

//route managers
router.get("/", (request, response) => {
    response.status(200);
    new DAO.question(pool).selectAll((err, result) => {
        if (err) {
            throw err;
        } else {
            let questions = [];
            let maxQuestions = 5;
            while (result.length > 0 && questions.length < maxQuestions) {
                let number = Math.floor(Math.random() * result.length);
                questions.push(result[number]);
                result.splice(number, 1);
            }
            response.render("question", {
                questions: questions
            });
        }
    });

});

router.get("/create", (request, response) => {
    response.status(200);
    response.render("create-question");
});

router.post("/create", (request, response) => {
    response.status(200);
    let wrongAnswers = request.body['wrong-answer'].filter(element => element != '');
    let correctAnswer = request.body['correct-answer'];

    request.checkBody('correct-answer',
        Strings.transform(messages[config.locale].repeatCorrectAnswers)).notIn(wrongAnswers);
    request.checkBody('wrong-answer',
        Strings.transform(messages[config.locale].repeatWrongAnswers)).repeatItems(['']);

    request.getValidationResult().then((errors) => {
        if (errors.isEmpty()) {
            new DAO.question(pool).insert(new Entity.question({
                question: request.body.question,
                userid: request.session.currentUser.id
            }), (err, quest) => {
                if (err) {
                    throw err;
                } else {
                    wrongAnswers = wrongAnswers.map(element => new Entity.answer({
                        userid: request.session.currentUser.id,
                        questionid: quest.id,
                        answer: element
                    }));
                    new DAO.answer(pool).insertMany(wrongAnswers, (err, affectedRows) => {
                        if (err) {
                            throw err;
                        } else {
                            new DAO.answer(pool).insert(new Entity.answer({
                                userid: request.session.currentUser.id,
                                questionid: quest.id,
                                answer: correctAnswer
                            }), (err, ans) => {
                                if (err) {
                                    throw err;
                                } else {
                                    new DAO.questionanswered(pool).insert(new Entity.questionanswered({
                                        userid: request.session.currentUser.id,
                                        questionid: quest.id,
                                        answerid: ans.id,
                                        touserid: request.session.currentUser.id,
                                        correct: 1
                                    }), (err, result) => {
                                        if (err) {
                                            throw err;
                                        } else {
                                            response.setFlash([{
                                                type: Messages.types.SUCCESS,
                                                text: Strings.transform(messages[config.locale].insertQuestionCorrect)
                                            }]);
                                            response.redirect("/question/create");
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
            });
        } else {
            response.setFlash(errors.array().map(element => {
                return {
                    type: Messages.types.ERROR,
                    text: element.msg
                };
            }));
            response.render("create-question");
        }
    });
});

router.get("/choose/:id", (request, response) => {
    response.status(200);
    new DAO.question(pool).get(request.params.id, (err, result) => {
        if (err) {
            throw err;
        } else {
            response.render("choose-question", {
                question: result
            });
        }
    });
});

module.exports = {
    questionRouter: router
};