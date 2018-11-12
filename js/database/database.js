'use strict'

const mysql = require("mysql");
const config = require("./../config");
const DAO = require("./dao");

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let userDAO = new DAO.user(pool);

userDAO.get(1, (err, entity) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log(entity);
    }
});

let friendDAO = new DAO.friend(pool);

friendDAO.get([1, 2], (err, entity) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log(entity);
    }
});

let questionDAO = new DAO.question(pool);

questionDAO.get(1, (err, entity) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log(entity);
    }
});

let answerDAO = new DAO.answer(pool);

answerDAO.get(1, (err, entity) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log(entity);
    }
});