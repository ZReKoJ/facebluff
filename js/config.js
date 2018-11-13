"use strict"

module.exports = {
      host: "localhost", // Ordenador que ejecuta el SGBD
      user: "root", // Usuario que accede a la BD
      password: "", // Contraseña con la que se accede a la BD
      database: "test", // Nombre de la base de datos
      language: "esES",
      tables: {
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