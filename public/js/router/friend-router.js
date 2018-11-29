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
        } else if (result.length === 0) {
            response.render("friend", {
                friends: [],
                requests: []
            });
        } else {
            let user_friends = result.filter(element => element.request === 0)
                .map(element => element.friendid != request.session.currentUser.id ? element.friendid : element.otherfriendid);
            let request_friends = result.filter(element => element.request === 1)
                .map(element => element.friendid != request.session.currentUser.id ? element.friendid : element.otherfriendid);
            console.log(request_friends);
            if (user_friends.length > 0) {
                new DAO.user(pool).in({
                    id: user_friends
                }, (err, friends) => {
                    if (err) {
                        throw err;
                    } else {
                        if (request_friends.length > 0) {
                            new DAO.user(pool).in({
                                id: request_friends
                            }, (err, requests) => {
                                if (err) {
                                    throw err;
                                } else {
                                    response.render("friend", {
                                        friends: friends,
                                        requests: requests
                                    });
                                }
                            });
                        } else {
                            response.render("friend", {
                                friends: friends,
                                requests: []
                            });
                        }
                    }
                });
            } else {
                new DAO.user(pool).in({
                    id: request_friends
                }, (err, requests) => {
                    if (err) {
                        throw err;
                    } else {
                        response.render("friend", {
                            friends: [],
                            requests: requests
                        });
                    }
                });
            }
        }

    })

});

router.post("/search", (request, response) => {
    new DAO.user(pool).findLike({
        username: request.body.friend_to_search
    }, (err, result) => {
        if (err) {
            throw err;
        } else {
            response.render("friend-search", {
                friends: result
            });
        }
    });
});

router.get("/accept/:id", (request, response) => {
    let min = Math.min(request.params.id, request.session.currentUser.id);
    let max = Math.max(request.params.id, request.session.currentUser.id);
    new DAO.friend(pool).update({
        friendid: min,
        otherfriendid: max
    }, {
        request: 0
    }, (err, result) => {
        if (err) {
            throw err;
        } else {
            response.setFlash([{
                type: Messages.types.SUCCESS,
                text: Strings.transform(messages[config.locale].acceptedRequest)
            }]);
            response.redirect("/friend");
        }
    });
});
module.exports = {
    friendRouter: router
};