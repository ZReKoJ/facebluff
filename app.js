"use strict"

// private libs
const {
    Strings,
    MiddleWares
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
// show messages
app.use(MiddleWares.showMessages);

// routers
app.use("/", require("./public/js/router/root-router").rootRouter);
app.use("/question", require("./public/js/router/question-router").questionRouter);
app.use("/img", require("./public/js/router/img-router").imgRouter);
app.use("/profile", require("./public/js/router/profile-router").profileRouter);
app.use("/friend", require("./public/js/router/friend-router").friendRouter);

// page is not found
app.use((request, response, next) => {
    response.status(404);
    next(new Error(Strings.transform(messages[config.locale].pageNotFound)));
});

app.use(MiddleWares.error);

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