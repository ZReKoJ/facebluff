'use strict'

// private libs
const {
    MiddleWares
} = require("../utils");
const DAO = require("../database/dao");
const config = require("../../../config");
const messages = require("../messages");
const Entity = require("../database/entity");


// public libs
const express = require("express");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const multer = require("multer");
const expressValidator = require("express-validator");

const router = express.Router();
const multerFactory = multer();

router.use(MiddleWares.checkUserLogged);
router.use(expressValidator());

router.get("/", (request, response) => {
    response.status(200);
    new DAO.friend(pool).findFriends(request.session.currentUser.id, (err, result) => {
        if (err) {
            throw err;
        } else {
            new DAO.question(pool).findBy({
                userid: request.session.currentUser.id
            }, (err, result2) => {
                if (err) {
                    throw err;
                } else {
                    new DAO.user(pool).findBy({
                        id: request.session.currentUser.id
                    }, (err, result3) => {
                        if (err) {
                            throw err;
                        } else {
                            let user = {
                                id: request.session.currentUser.id,
                                username: result3[0].username,
                                email: result3[0].email,
                                password: result3[0].password,
                                birthdate: result3[0].birthdate,
                                gender:result3[0].gender,
                                img: result3[0].img,
                                description: result3[0].description,
                                score: result3[0].score
                            };
                            new DAO.questionanswered(pool).findBy({userid: request.session.currentUser.id}, (err, result4) =>{
                                if(err){
                                    throw err;
                                }
                                else{
                                    console.log(result4.length);
                                    response.render("profile", {
                                        friends: result.length,
                                        questions: result2.length,
                                        user: user,
                                        questionsanswered: result4.length
                                    });
                                }
                            })
                            
                        }
                    })

                }
            })

        }
    })

});
router.get("/modify", (request, response) => {
    response.status(200);
    response.render("modify-profile");
});
router.post("/modify_profile", multerFactory.single("avatar"), (request, response) =>{
    request.checkBody('password',
    Strings.transform(messages[config.locale].passwordNotSame)).allSame();
    request.getValidationResult().then((errors) => {
        if(error.isEmpty()){
            console.log(request.body);
        }
        
    });
});


module.exports = {
    profileRouter: router
};