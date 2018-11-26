'use strict'

// public libs
const express = require("express");

const router = express.Router();

router.get("/", (request, response) => {
    response.status(200);
    response.render("profile");
});

module.exports = {
    profileRouter: router
};