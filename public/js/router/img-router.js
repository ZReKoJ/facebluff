'use strict'

// private libs
const config = require("../../../config");
const {
    MiddleWares
} = require("../utils");
const DAO = require("../database/dao");
// public libs
const fs = require("fs");
const path = require("path");
const express = require("express");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const multer = require("multer");

const router = express.Router();
const multerFactory = multer();

router.use(MiddleWares.checkUserLogged);

router.get("/avatar", (request, response) => {
    if (response.locals.user.img == null) {
        let dir = [config.root].concat(config.files.images);
        dir.push("avatar.png");
        response.sendFile(path.join.apply(this, dir));
    } else {
        response.sendFile(response.locals.user.img);
    }
});

router.get("/user/:id/avatar", (request, response) => {
    new DAO.user(pool).get(request.params.id, (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result.img != null) {
                response.sendFile(result.img);
            } else {
                let dir = [config.root].concat(config.files.images);
                dir.push("avatar.png");
                response.sendFile(path.join.apply(this, dir));
            }
        }
    });
});

router.get("/user/:id/story/:image", (request, response) => {
    new DAO.story(pool).findOneBy({
        id: request.params.image,
        userid: request.params.id
    }, (err, result) => {
        if (err) {
            throw err;
        } else {
            response.sendFile(result.image);
        }
    });
});

router.post("/story", multerFactory.array("story"), (request, response) => {
    let counter = 0;
    let dir = [config.root].concat(config.files.user);
    dir.push(String(request.session.currentUser.id));
    dir.push("story");
    request.files.forEach(element => {
        counter++;
        new DAO.story(pool).insert({
            userid: request.session.currentUser.id,
            image: path.join.apply(this, dir.concat([String(element.originalname)])),
            description: request.body.description
        }, (err, result) => {
            if (err) {
                throw err;
            } else {
                fs.writeFile(path.join.apply(this, dir.concat([String(result.id)])), element.buffer, "binary", (err) => {
                    if (err) {
                        throw err;
                    } else {
                        new DAO.story(pool).update({
                            id: result.id
                        }, {
                            image: path.join.apply(this, dir.concat([String(result.id)]))
                        }, (err, result) => {
                            if (err) {
                                throw err;
                            } else {
                                counter--;
                                if (counter == 0) {
                                    response.redirect("/profile");
                                }
                            }
                        });
                    }
                });
            }
        });
    });
});

module.exports = {
    imgRouter: router
};