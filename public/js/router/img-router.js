'use strict'

// private libs
const config = require("../../../config");
const {
    MiddleWares,
    Messages,
    Strings
} = require("../utils");
const DAO = require("../database/dao");
// public libs
const fs = require("fs");
const path = require("path");
const express = require("express");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const multer = require("multer");
const messages = require("../messages");

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
    if (request.session.currentUser.score >= 100) {
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
                            }, (err, result2) => {
                                if (err) {
                                    throw err;
                                } else {
                                    counter--;
                                    request.session.currentUser.score = request.session.currentUser.score - 100;
                                    if (counter == 0) {
                                        new DAO.user(pool).update({
                                            id: result.userid
                                        }, {
                                            score: request.session.currentUser.score
                                        }, (err, result) => {
                                            if(err){
                                                throw err;
                                            } else{
                                                response.setFlash([{
                                                    type: Messages.types.SUCCESS,
                                                    text: Strings.transform(messages[config.locale].imageUpload)
                                                }]);
                                                response.redirect("/profile");
                                            }
                                        });
                                       
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
    } else{
        response.setFlash([{
            type: Messages.types.ERROR,
            text: Strings.transform(messages[config.locale].notEnoughPoints)
        }]);
        response.redirect("/profile");
    }
});

module.exports = {
    imgRouter: router
};