'use strict'

const mysql = require("mysql");
const config = require("./config");
const UserDAO = require("./userDAO");

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let userDAO = new UserDAO(pool);
userDAO.get(1, (err, entity) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(entity);
    }
});