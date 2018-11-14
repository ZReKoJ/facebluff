"use strict"

const fs = require("fs");
const express = require("express");
const logger = require("morgan");
const config = require("./public/js/config");
const messages = require("./public/js/messages");
const path = require("path");
const {
    Strings
} = require("./public/js/utils");

const app = express();

function checkUserLogged(request, response, next) {
    if (request.url != "/login") {
        response.redirect("/login");
    } else {
        next();
    }
}

function notFound(request, response, next) {
    response.status(404);
    response.render("error", {
        url: request.url
    });
}

app.use(logger('dev'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, config.baseFile)));
app.set("views", path.join(__dirname, config.baseFile, config.routes.ejs));
app.use(checkUserLogged);

app.get("/login", (request, response) => {
    response.sendFile(path.join(__dirname, config.baseFile, config.routes.html, "login-register.html"));
});

app.use(notFound);

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