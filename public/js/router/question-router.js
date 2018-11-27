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
    console.log(request.session.currentUser.id);
    new DAO.question(pool).findBy({userid: request.session.currentUser.id}, (err, result) => {
        if(err){
            throw err;
        }
        else {
            let questions = result.map(element => element.question);
            response.render("question", {
                questionTexts : questions
            });
        }
    })
    
});

router.get("/create", (request, response) => {
    response.status(200);
    response.render("create-question");
});

router.post("/create", (request, response) => {
    new DAO.question(pool).insert(new Entity.question({
        question: request.body.question,
        userid: request.session.currentUser.id
    }), (err, result) => {
        if (err) {
            throw err;
        } else {
            let daoAnswer = new DAO.answer(pool);
            request.body['wrong-answer'] = request.body['wrong-answer'].filter(element => element != '');
            let data = [];
            request.body['wrong-answer'].map(element => {
                data.push(new Entity.answer({
                    userid: request.session.currentUser.id,
                    questionid: result.id,
                    answer: element,
                    correct: false
                }));
                return data;
            });
            data.push(new Entity.answer({
                userid: request.session.currentUser.id,
                questionid: result.id,
                answer: request.body['correct-answer'],
                correct: true
            }));
            daoAnswer.insertMany(data, (err, affectedRows) => {
                if (err) {
                    throw err;
                } else {
                    response.setFlash([{
                        type: Messages.types.SUCCESS,
                        text: Strings.transform(messages[config.locale].insertQuestionCorrect, {
                            insertedAnswers: affectedRows
                        })
                    }]);
                    response.redirect("/question/create");
                }
            });
        }
    });
});
module.exports = {
    questionRouter: router
};