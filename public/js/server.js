"use strict"

const express = require("express");
const config = require("./config");
const messages = require("./messages");
const {
    Strings
} = require("./utils");
const fs = require("fs");

const app = express();

app.get("/", (request, response) => {
    fs.readFile("../html/login-register.html", (err, content) => {
        if (err) {
            response.status = 404;
            response.setHeader("Content-Type", "text/html");
            response.end();
        }
        else {
            response.status = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(content);
            response.end();
        }
    });
})

app.listen(config.port, (err) => {
    if (err) {
        console.log(
            Strings.transform(
                messages[config.language].serverInitiateError, {
                    errorMessage: err.message
                }
            )
        );
    } else {
        console.log(
            Strings.transform(
                messages[config.language].serverListening, {
                    port: config.port
                }
            )
        );
    }
});