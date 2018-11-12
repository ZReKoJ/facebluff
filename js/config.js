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
                  primaryKey: "id",
                  tableColumns: ["name", "surname", "email", "password", "gender", "img", "description", "score"]
            }
      }
}