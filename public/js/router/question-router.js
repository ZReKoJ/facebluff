'use strict'
//private libs
const config = require("../../../config");
const messages = require("../messages");
const DAO = require("../database/dao");
const Entity = require("../database/entity");
const {
    Strings,
    Arrays,
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
            let questions = Arrays.getItems(result, 5);
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
        Strings.transform(messages[config.locale].repeatWrongAnswers)).allDifferent(['']);

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

router.get("/:id/choose", (request, response) => {
    response.status(200);
    new DAO.question(pool).get(request.params.id, (err, question) => {
        if (err) {
            throw err;
        } else {
            new DAO.questionanswered(pool).findByQuestionid(request.params.id, (err, questionsanswered) => {
                if (err) {
                    throw err;
                } else {
                    let myAnswers = questionsanswered.filter(element => element.userid == request.session.currentUser.id);
                    let selfAnswers = questionsanswered.filter(element => element.userid == element.touserid);
                    new DAO.friend(pool).findFriends(request.session.currentUser.id, (err, friends) => {
                        if (err) {
                            throw err;
                        } else {
                            friends = friends.filter(element => element.request == 0);
                            friends = friends.map(element => element.friendid != request.session.currentUser.id ? element.friendid : element.otherfriendid);
                            new DAO.user(pool).in({
                                id: friends
                            }, (err, users) => {
                                if (err) {
                                    throw err;
                                } else {
                                    friends.push(request.session.currentUser.id);
                                    selfAnswers = selfAnswers.filter(element => friends.indexOf(element.userid) > -1);
                                    new DAO.answer(pool).in({
                                        id: selfAnswers.map(element => element.answerid)
                                    }, (err, answers) => {
                                        if (err) {
                                            throw err;
                                        } else {
                                            let selfAnswer = undefined;
                                            let friendAnswers = [];

                                            myAnswers.forEach(myAnswer => {
                                                answers.forEach(answer => {
                                                    if (myAnswer.touserid == request.session.currentUser.id && answer.id == myAnswer.answerid) {
                                                        selfAnswer = answer;
                                                    }
                                                });
                                            });

                                            users.forEach(user => {
                                                let friendAnswer = {
                                                    userid: user.id,
                                                    username: user.username,
                                                    answer: "",
                                                    state: "guess"
                                                }

                                                myAnswers.forEach(myAnswer => {
                                                    if (friendAnswer.userid == myAnswer.touserid) {
                                                        friendAnswer.state = (myAnswer.correct ? "correct" : "wrong");
                                                    }
                                                });

                                                selfAnswers.forEach(myAnswer => {
                                                    if (friendAnswer.userid == myAnswer.touserid) {
                                                        answers.forEach(answer => {
                                                            if (answer.id == myAnswer.answerid) {
                                                                friendAnswer.answer = answer.answer;
                                                            }
                                                        });
                                                    }
                                                });

                                                if (friendAnswer.answer != '') {
                                                    friendAnswers.push(friendAnswer);
                                                }
                                            });

                                            response.render("choose-question", {
                                                question: question,
                                                selfAnswer: selfAnswer,
                                                friendAnswers: friendAnswers
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get("/:id/answer/:user", (request, response) => {
    response.status(200);
    new DAO.question(pool).get(request.params.id, (err, question) => {
        if (err) {
            throw err;
        } else {
            new DAO.answer(pool).findByQuestionid(request.params.id, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    let answers = Arrays.getItems(result, 4);
                    if (request.session.currentUser.id == request.params.user) {
                        response.render("personal-answer-question", {
                            touser: request.params.user,
                            question: question,
                            answers: answers
                        });
                    } else {
                        response.render("answer-question", {
                            touser: request.params.user,
                            question: question,
                            answers: answers
                        });
                    }
                }
            });
        }
    });
});

router.post("/:id/answer/:user", (request, response) => {
    response.status(200);
    new DAO.question(pool).get(request.params.id, (err, question) => {
        if (err) {
            throw err;
        } else {
            if (request.body.answer == 'new-answer') {
                if (request.body['new-answer'] == "") {
                    response.setFlash([{
                        type: Messages.types.ERROR,
                        text: Strings.transform(messages[config.locale].noNewAnswer)
                    }]);
                    response.redirect("/question/" + question.id + "/answer/" + request.params.user);
                } else {
                    new DAO.answer(pool).findOneBy({
                        questionid: question.id,
                        answer: request.body['new-answer']
                    }, (err, answer) => {
                        if (err) {
                            throw err;
                        } else {
                            if (answer) {
                                new DAO.questionanswered(pool).upsert({
                                    userid: request.session.currentUser.id,
                                    questionid: question.id,
                                    answerid: answer.id,
                                    touserid: request.params.user,
                                    correct: 1
                                }, (err, result) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        response.redirect("/question/" + question.id + "/choose");
                                    }
                                });
                            } else {
                                new DAO.answer(pool).insert(new Entity.answer({
                                    userid: request.session.currentUser.id,
                                    questionid: question.id,
                                    answer: request.body['new-answer']
                                }), (err, answer) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        new DAO.questionanswered(pool).upsert({
                                            userid: request.session.currentUser.id,
                                            questionid: question.id,
                                            answerid: answer.id,
                                            touserid: request.params.user,
                                            correct: 1
                                        }, (err, result) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                response.redirect("/question/" + question.id + "/choose");
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            } else {
                if (request.session.currentUser.id == request.params.user) {
                    new DAO.questionanswered(pool).upsert({
                        userid: request.session.currentUser.id,
                        questionid: question.id,
                        answerid: request.body.answer,
                        touserid: request.params.user,
                        correct: 1
                    }, (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            response.redirect("/question/" + question.id + "/choose");
                        }
                    });
                } else {
                    new DAO.questionanswered(pool).findOneBy({
                        userid: request.params.user,
                        questionid: question.id,
                        touserid: request.params.user,
                        correct: 1
                    }, (err, questionanswered) => {
                        if (err) {
                            throw err;
                        } else {
                            let correct = (questionanswered.answerid == request.body.answer ? 1 : 0);
                            if (correct) {
                                request.session.currentUser.score += 50;
                                new DAO.user(pool).upsert(request.session.currentUser, (err, success) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        new DAO.questionanswered(pool).upsert({
                                            userid: request.session.currentUser.id,
                                            questionid: question.id,
                                            answerid: request.body.answer,
                                            touserid: request.params.user,
                                            correct: correct
                                        }, (err, result) => {
                                            if (err) {
                                                throw err;
                                            } else {
                                                response.redirect("/question/" + question.id + "/choose");
                                            }
                                        });
                                    }
                                });
                            } else {
                                new DAO.questionanswered(pool).upsert({
                                    userid: request.session.currentUser.id,
                                    questionid: question.id,
                                    answerid: request.body.answer,
                                    touserid: request.params.user,
                                    correct: correct
                                }, (err, result) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        response.redirect("/question/" + question.id + "/choose");
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

module.exports = {
    questionRouter: router
};