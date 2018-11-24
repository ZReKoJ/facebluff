"use strict"

// private libs
const {
    Strings
} = require("./public/js/utils");
const config = require("./config");
const messages = require("./public/js/messages");

// public libs
const fs = require("fs");

const express = require("express");

const logger = require("morgan");

const path = require("path");

const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");

const session = require("express-session");
const mysqlSession = require("express-mysql-session");

// constants
const app = express();
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);

// express configs
app.set("view engine", "ejs"); // for ejs files
app.set("views", path.join.apply(this, [config.root].concat(config.files.ejs))); // ejs files location

// express middlewares
// logger
app.use(logger('dev'));
// body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
// cookie parser
app.use(cookieParser());
// session
app.use(session({
    saveUninitialized: false,
    secret: "facebluff",
    resave: false,
    store: sessionStore
}));
// express static
app.use(express.static(path.join.apply(this, [config.root].concat(config.files.baseFile))));
// check if user is logged
app.use(checkUserLogged);

// routers
app.use("/", require("./public/js/router/root-router").rootRouter);
app.use("/question", require("./public/js/router/question-router").questionRouter);
app.use("/img", require("./public/js/router/img-router").imgRouter);

app.get("/profile", (request, response) => {
    response.status(200);
    response.render("profile");
});

app.get("/friend", (request, response) => {
    response.status(200);
    response.render("friend");
});

// page is not found
app.use((request, response, next) => {
    response.status(404);
    next(new Error(Strings.transform(messages[config.locale].pageNotFound)));
});

app.use(error);

// Initialize server
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

// middleware functions

/**
 * Checks if the user is logged, if not redirects to login page
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function checkUserLogged(request, response, next) {
    if (config.exceptRoutes.indexOf(request.url) == -1 && request.session.currentUser == undefined) {
        response.redirect("/login");
    } else {
        response.locals.user = request.session.currentUser;
        next();
    }
}

/**
 * Error pages
 * @param {*} error 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function error(error, request, response, next) {
    // Searching all ejs
    fs.readdir(path.join.apply(this, [config.root].concat(config.files.ejs)), (err, files) => {
        // Filters by all ejs files starting with names game
        let errorFiles = files.filter(element => /game.+\.ejs/.test(element));
        // Choose one random file
        let random = Math.floor(Math.random() * errorFiles.length);
        response.render("error", {
            url: request.url,
            status: response.statusCode,
            text: {
                error: error.message,
                stayAndPlay: Strings.transform(messages[config.locale].stayAndPlay)
            },
            redirection: {
                name: "Inicio",
                url: "/home"
            },
            game: errorFiles[random]
        });
    });
}