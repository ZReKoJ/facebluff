'use strict'

const express = require("express");
const config = require("../../../config");
const path = require("path");
const router = express.Router();

router.get("/create", (request, response) => {
    response.status(200);
    response.render("create-question");
});

module.exports = {
    questionRouter: router
};