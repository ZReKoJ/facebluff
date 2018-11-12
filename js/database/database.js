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
let friendDAO = new DAO.friend(pool);
let questionDAO = new DAO.question(pool);
let answerDAO = new DAO.answer(pool);

userDAO.get(1, (err, entity) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(entity);
    }
});

friendDAO.get([1, 2], (err, entity) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(entity);
    }
});

questionDAO.get(1, (err, entity) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(entity);
    }
});

answerDAO.get(1, (err, entity) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(entity);
    }
});