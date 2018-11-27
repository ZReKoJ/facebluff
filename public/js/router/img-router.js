'use strict'

// private libs
const config = require("../../../config");
const {
    MiddleWares
} = require("../utils");

// public libs
const path = require("path");
const express = require("express");

const router = express.Router();

router.use(MiddleWares.checkUserLogged);

router.get("/avatar", (request, response) => {
    if (response.locals.user.img == null) {
        let dir = [config.root].concat(config.files.images);
        dir.push("avatar.png");
        response.sendFile(path.join.apply(this, dir));
    }
    else {
        response.sendFile(response.locals.user.img);
    }
});

module.exports = {
    imgRouter: router
};