'use strict'

// private libs
const config = require("../../../config");
const {
    MiddleWares
} = require("../utils");
const DAO = require("../database/dao");
// public libs
const path = require("path");
const express = require("express");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);

const router = express.Router();

router.use(MiddleWares.checkUserLogged);

router.get("/avatar", (request, response) => {
    if (response.locals.user.img == null) {
        let dir = [config.root].concat(config.files.images);
        dir.push("avatar.png");
        response.sendFile(path.join.apply(this, dir));
    } else {
        response.sendFile(response.locals.user.img);
    }
});

router.get("/user/:id/avatar", (request, response) => {
    new DAO.user(pool).get(request.params.id, (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result.img != null) {
                response.sendFile(result.img);
            } else {
                let dir = [config.root].concat(config.files.images);
                dir.push("avatar.png");
                response.sendFile(path.join.apply(this, dir));
            }
        }
    });
});

module.exports = {
    imgRouter: router
};