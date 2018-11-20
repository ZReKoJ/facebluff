'use strict'

const express = require("express");
const config = require("../../../config");
const path = require("path");
const router = express.Router();

router.get("/create", (request, response) => {
    let dir = [config.root].concat(config.files.html);
    dir.push("create-question.html");
    response.sendFile(path.join.apply(this, dir));
});

module.exports = {
    questionRouter: router
};