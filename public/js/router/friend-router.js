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

function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

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
            let request_friends = result.filter(element => element.request > 0)
                .map(element => element.request === request.session.currentUser.id ? null : element.request);
            new DAO.user(pool).in({
                id: user_friends
            }, (err, friends) => {
                if (err) {
                    throw err;
                } else {
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
                }
            });
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
            let users = result.map(element => element.id);
            users = users.filter(element => element != request.session.currentUser.id);
            new DAO.friend(pool).findFriends(request.session.currentUser.id, (err, friends) => {
                friends = friends.map(element => element.friendid === request.session.currentUser.id ? element.otherfriendid : element.friendid);
                users = users.filter(element => friends.indexOf(element) === -1);
                result = result.filter(element => users.indexOf(element.id) != -1);
                response.render("friend-search", {
                    not_friends: result
                });
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
router.get("/decline/:id", (request, response) => {
    let min = Math.min(request.params.id, request.session.currentUser.id);
    let max = Math.max(request.params.id, request.session.currentUser.id);
    new DAO.friend(pool).delete({
        friendid: min,
        otherfriendid: max
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

router.get("/request/:id", (request, response) => {
    let min = Math.min(request.params.id, request.session.currentUser.id);
    let max = Math.max(request.params.id, request.session.currentUser.id);
    new DAO.friend(pool).insert({
        friendid: min,
        otherfriendid: max,
        request: request.session.currentUser.id
    }, (err, result) => {
        if (err) {
            throw err;
        } else {
            response.setFlash([{
                type: Messages.types.SUCCESS,
                text: Strings.transform(messages[config.locale].requestSent)
            }]);
            response.redirect("/friend");
        }
    });
});

router.get("/:id", (request, response) => {
    response.status(200);
    new DAO.friend(pool).findFriends(request.params.id, (err, friends) => {
        if (err) {
            throw err;
        } else {
            new DAO.question(pool).findBy({
                userid: request.params.id
            }, (err, questions) => {
                if (err) {
                    throw err;
                } else {
                    new DAO.questionanswered(pool).findBy({
                        userid: request.params.id
                    }, (err, questionsanswered) => {
                        if (err) {
                            throw err;
                        } else {
                            new DAO.user(pool).findBy({
                                id: request.params.id
                            }, (err, currentuser) => {
                                if (err) {
                                    throw err;
                                } else {
                                    currentuser[0].birthdate = calculateAge(currentuser[0].birthdate);
                                    console.log(currentuser[0]);
                                    response.render("profile", {
                                        friends: friends.length,
                                        questions: questions.length,
                                        questionsanswered: questionsanswered.length,
                                        currentUser: currentuser[0]
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
module.exports = {
    friendRouter: router
};