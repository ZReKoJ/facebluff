'use strict'

const mysql = require("mysql");
const config = require("../../../config");
const DAO = require("./dao");
const Entity = require("./entity");

const pool = mysql.createPool(config.mysqlConfig);

let userDAO = new DAO.user(pool);
let friendDAO = new DAO.friend(pool);
let questionDAO = new DAO.question(pool);
let answerDAO = new DAO.answer(pool);

/*
userDAO.insert(new Entity.user({
    name: "Luffy",
    surname: "D. Monkey",
    email: "op@gmail.com",
    password: "op",
    gender: "M",
    img: "luffy.png",
    description: "Future pirate king",
    score: 1
}), (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
/**/
/*
userDAO.update({name: "Luffy"}, {score: 8}, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
/**/
/*
userDAO.get(1, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
/**/
/*
userDAO.selectAll((err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
/**/
/*
userDAO.delete({id:1}, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
/**/