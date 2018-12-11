'use strict'

module.exports = {
      locale: "esES",
      port: 8080,
      root: __dirname,
      files: {
            baseFile: "public",
            css: ["public", "css"],
            ejs: ["public", "ejs"],
            html: ["public", "html"],
            js: ["public", "js"],
            images: ["public", "resources", "img"],
            music: ["public", "resources", "music"],
            user: ["public", "resources", "user"]
      },
      mysqlConfig: {
            host: "localhost",
            user: "root",
            password: "",
            database: "facebluff"
      },
      dbTables: {
            user: {
                  name: "user",
                  primaryKey: ["id"],
                  tableColumns: ["id", "username", "email", "password", "birthdate", "gender", "img", "description", "score"]
            },
            friend: {
                  name: "friend",
                  primaryKey: [],
                  tableColumns: ["friendid", "otherfriendid", "request"]
            },
            question: {
                  name: "question",
                  primaryKey: ["id"],
                  tableColumns: ["id", "userid", "question"]
            },
            answer: {
                  name: "answer",
                  primaryKey: ["id"],
                  tableColumns: ["id", "userid", "questionid", "answer"]
            },
            questionanswered: {
                  name: "questionanswered",
                  primaryKey: [],
                  tableColumns: ["userid", "questionid", "answerid", "touserid", "correct"]
            },
            message: {
                  name: "message",
                  primaryKey: ["id"],
                  tableColumns: ["id", "type", "message", "touserid"]
            },
            story: {
                  name: "story",
                  primaryKey: ["id"],
                  tableColumns: ["id", "userid", "image", "description"]
            }
      },
      exceptRoutes: ["/login", "/register"]
}