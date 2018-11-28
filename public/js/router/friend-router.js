'use strict'

//private libs
const {
    Strings,
    Messages,
    MiddleWares
} = require("../utils");
const DAO = require("../database/dao");
const config = require("../../../config");
const messages = require("../messages");
const Entity = require("../database/entity");
// public libs
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);

router.use(MiddleWares.checkUserLogged);

//route managers
router.get("/", (request, response) => {
    response.status(200);
    new DAO.friend(pool).findFriends(request.session.currentUser.id, (err, result) => {
        if (err) {
            throw err;
        } else if(result.length === 0) {
            response.render("friend", {friends: []});
        } else{
            let user_friends = result.map(element => {
                if (element.friendid === request.session.currentUser.id) {
                    return element.otherfriendid;
                } else {
                    return element.friendid;
                }
            });
            new DAO.user(pool).in({id: user_friends}, (err, result) => {
                if (err) {
                    throw err;
                }
                else{
                    response.render("friend", {friends: result});
                }
            })
        }
        
    })

});

module.exports = {
    friendRouter: router
};