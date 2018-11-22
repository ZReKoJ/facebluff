'use strict'

const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    response.status(200);
    response.render("question");
});

router.get("/create", (request, response) => {
    response.status(200);
    response.render("create-question");
});

module.exports = {
    questionRouter: router
};