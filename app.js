"use strict"

const fs = require("fs");
const express = require("express");
const expressLogging = require("express-logging");
const logger = require("logops");
const config = require("./public/js/config");
const messages = require("./public/js/messages");
const {
    Strings
} = require("./public/js/utils");

const app = express();

logger.format = logger.formatters.dev;
app.use(expressLogging(logger));

app.get("/css/utils.css", (request, response) => {
    fs.readFile("./public/css/utils.css", (err, content) => {
        if (err) {
            response.status = 404;
            response.setHeader("Content-Type", "text/css");
            response.end();
        }
        else {
            response.status = 200;
            response.setHeader("Content-Type", "text/css");
            response.write(content);
            response.end();
        }
    });
});

app.get("/", (request, response) => {
    fs.readFile("./public/html/login-register.html", (err, content) => {
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
});

app.get("/css/login-register.css", (request, response) => {
    fs.readFile("./public/css/login-register.css", (err, content) => {
        if (err) {
            response.status = 404;
            response.setHeader("Content-Type", "text/css");
            response.end();
        }
        else {
            response.status = 200;
            response.setHeader("Content-Type", "text/css");
            response.write(content);
            response.end();
        }
    });
});

app.listen(config.port, (err) => {
    if (err) {
        logger.error(
            Strings.transform(
                messages[config.language].serverInitiateError, {
                    errorMessage: err.message
                }
            )
        );
    } else {
        logger.info(
            Strings.transform(
                messages[config.language].serverListening, {
                    port: config.port
                }
            )
        );
    }
});