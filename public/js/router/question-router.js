'use strict'
//private libs
const config = require("../../../config");
const DAO = require("../database/dao");
const Entity = require("../database/entity");
const {
    Strings,
    Messages
} = require("../utils");
// public libs
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);

//route managers
router.get("/", (request, response) => {
    response.status(200);
    response.render("question");
});

router.get("/create", (request, response) => {
    response.status(200);
    response.render("create-question");
});

router.post("/create", (request, response) => {
    console.log(request.body);
    new DAO.question(pool).insert(new Entity.question({
        question: request.body.question,
        userid: request.session.currentUser.id
    }), (err, result) => {
        if (err) {
            throw err;
        } else {
            new DAO.answer(pool).insertMany(request.body['wrong-answer'], (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log("sale bien");
                }
            });
        }
    });
});
module.exports = {
    questionRouter: router
};