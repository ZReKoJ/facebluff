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
let questionansweredDAO = new DAO.questionanswered(pool);

/*
userDAO.insert(new Entity.user({
    name: "Zihao",
    surname: "Hong",
    email: "zhong@ucm.es",
    password: "op",
    gender: "M",
    img: "luffy.png",
    description: "one piece",
    score: 100
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
userDAO.delete({id:2}, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
/**/
/*
userDAO.findBy({
    email: "zhong@ucm.es"
}, (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
});
/**/
/*
userDAO.in({id: [1,3]}, (err, result) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(result);
    }
})
/**/

questionansweredDAO.upsert({
    userid: 3,
    questionid: 12,
    answerid: 24, 
    touserid: 3,
    correct: 0
}, (err, result) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(result);
    }
});
/**/