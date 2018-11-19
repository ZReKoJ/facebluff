"use strict"

const fs = require("fs");
const express = require("express");
const logger = require("morgan");
const config = require("./config.json");
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
    fs.readdir(path.join.apply(this, [__dirname].concat(config.files.ejs)), (err, files) => {
        let errorFiles = files.filter(element => /error.+\.ejs/.test(element));
        let random = Math.floor(Math.random() * errorFiles.length);
        response.render(errorFiles[random], {
            url: request.url,
            text: {
                pageNotFound: Strings.transform(messages[config.locale].pageNotFound),
                stayAndPlay: Strings.transform(messages[config.locale].stayAndPlay)
            },
            redirection: {
                name: "Inicio",
                url: "/home"
            }
        });
    });
}

// logger
app.use(logger('dev'));

// for ejs files
app.set("view engine", "ejs");
// ejs files location
app.set("views", path.join.apply(this, [__dirname].concat(config.files.ejs)));

// express static
app.use(express.static(path.join.apply(this, [__dirname].concat(config.files.baseFile))));

// check if user is logged
//app.use(checkUserLogged);

app.get("/", (request, response) => {
    fs.readdir(path.join.apply(this, [__dirname].concat(config.files.html)), (err, files) => {
        let homeFiles = files.filter(element => /home.+\.html/.test(element));
        let random = Math.floor(Math.random() * homeFiles.length);
        let dir = [__dirname].concat(config.files.html);
        dir.push(homeFiles[random]);
        response.sendFile(path.join.apply(this, dir));
    });
});

app.get("/home", (request, response) => {
    response.redirect("/");
});

app.get("/login", (request, response) => {
    let dir = [__dirname].concat(config.files.html);
    dir.push("login-register.html");
    response.sendFile(path.join.apply(this, dir));
});

app.get("/profile", (request, response) => {
    let dir = [__dirname].concat(config.files.html);
    dir.push("profile.html");
    response.sendFile(path.join.apply(this, dir));
});

app.get("/friend", (request, response) => {
    let dir = [__dirname].concat(config.files.html);
    dir.push("friend.html");
    response.sendFile(path.join.apply(this, dir));
});

app.get("/question", (request, response) => {
    let dir = [__dirname].concat(config.files.html);
    dir.push("question.html");
    response.sendFile(path.join.apply(this, dir));
});

app.get("/create-question", (request, response) => {
    let dir = [__dirname].concat(config.files.html);
    dir.push("create-question.html");
    response.sendFile(path.join.apply(this, dir));
});

// page is not found
app.use(notFound);

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