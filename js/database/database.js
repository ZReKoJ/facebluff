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

/*
userDAO.get(1, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});

friendDAO.get([1, 2], (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});

questionDAO.get(1, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});

answerDAO.get(1, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
*/
/*
userDAO.selectAll((err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});

friendDAO.selectAll((err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});

questionDAO.selectAll((err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});

answerDAO.selectAll((err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
*/