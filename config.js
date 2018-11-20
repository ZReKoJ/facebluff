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
            music: ["public", "resources", "music"]
      },
      mysqlConfig : {
            host: "localhost",
            user: "root",
            password: "",
            database: "test"
      },
      dbTables: {
            user: {
                  name: "user",
                  primaryKey: ["id"],
                  tableColumns: ["id", "name", "surname", "email", "password", "gender", "img", "description", "score"]
            },
            friend: {
                  name: "friend",
                  primaryKey: [],
                  tableColumns: ["friendid", "otherfriendid"]
            },
            question: {
                  name: "question",
                  primaryKey: ["id"],
                  tableColumns: ["id", "userid", "question"]
            },
            answer: {
                  name: "answer",
                  primaryKey: ["id"],
                  tableColumns: ["id", "userid", "questionid", "answer", "correct"]
            }
      }
}