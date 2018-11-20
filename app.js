"use strict"

const fs = require("fs");
const express = require("express");
const logger = require("morgan");
const config = require("./config");
const messages = require("./public/js/messages");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
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

function error(error, request, response, next) {
    fs.readdir(path.join.apply(this, [config.root].concat(config.files.ejs)), (err, files) => {
        let errorFiles = files.filter(element => /error.+\.ejs/.test(element));
        let random = Math.floor(Math.random() * errorFiles.length);
        response.render(errorFiles[random], {
            url: request.url,
            status: response.statusCode,
            text: {
                error: error.message,
                stayAndPlay: Strings.transform(messages[config.locale].stayAndPlay)
            },
            redirection: {
                name: "Inicio",
                url: "/home"
            }
        });
    });
}

app.set("view engine", "ejs"); // for ejs files
app.set("views", path.join.apply(this, [config.root].concat(config.files.ejs))); // ejs files location

app.use(logger('dev')); // logger
app.use(bodyParser.urlencoded({ extended: false })); // body parser
app.use(cookieParser()); // cookie parser

app.use(express.static(path.join.apply(this, [config.root].concat(config.files.baseFile)))); // express static

//app.use(checkUserLogged); // check if user is logged

// routers
app.use("/question", require("./public/js/router/question-router").questionRouter);

app.get("/", (request, response) => {
    response.status(200);
    fs.readdir(path.join.apply(this, [config.root].concat(config.files.ejs)), (err, files) => {
        let homeFiles = files.filter(element => /home.+\.ejs/.test(element));
        let random = Math.floor(Math.random() * homeFiles.length);
        response.render(homeFiles[random]);
    });
});

app.get("/home", (request, response) => {
    response.redirect("/");
});

app.get("/login", (request, response) => {
    response.status(200);
    let dir = [config.root].concat(config.files.html);
    dir.push("login-register.html");
    response.sendFile(path.join.apply(this, dir));
});

app.get("/profile", (request, response) => {
    response.status(200);
    response.render("profile");
});

app.get("/friend", (request, response) => {
    response.status(200);
    response.render("friend");
});

app.get("/question", (request, response) => {
    response.status(200);
    response.render("question");
});

// page is not found
app.use((request, response, next) => {
    response.status(404);
    next(new Error(Strings.transform(messages[config.locale].pageNotFound)));
});

app.use(error);

app.listen(config.port, (err) => {
    if (err) {
        console.log(
            Strings.transform(
                messages[config.locale].serverInitiateError, {
                    errorMessage: err.message
                }
            )
        );
    } else {
        console.log(
            Strings.transform(
                messages[config.locale].serverListening, {
                    port: config.port
                }
            )
        );
    }
});