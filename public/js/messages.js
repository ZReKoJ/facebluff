"use strict"

module.exports = {
    esES : {
        databaseConnectionError: "No se pudo obtener la conexión a la base de datos: \n{errorMessage}",
        sqlQueryError: "No se pudo ejecutar '{sql}': \n{errorMessage}",
        parametersError: "Error al introducir los parámetros",
        serverInitiateError: "No se pudo inicializar el servidor: \n{errorMessage}",
        serverListening: "Servidor arrancado en el puerto {port}",
        pageNotFound: "Esta no es la página que estás buscando",
        stayAndPlay: "quédate y juega un poco",
        failedAuthentication: "Fallo en la autenticación",
        sorry: "Disculpe por las molestias",
        welcome: "Bienvenido, {name}",
        goodBye: "Hasta la próxima, {name}",
        passwordNotSame: "Las contraseñas no son iguales",
        emailExists: "El email existe ya",
        insertQuestionCorrect: "Se ha insertado correctamente la pregunta con {insertedAnswers} respuestas",
    },
    enUS : {
        databaseConnectionError: "Failed to connect to the database: \n{errorMessage}",
        sqlQueryError: "Could not execute '{sql}': \n{errorMessage}",
        parametersError: "Error at introducing the parameters",
        serverInitiateError: "Failed at initialize server: \n{errorMessage}",
        serverListening: "Server listen at port {port}",
        pageNotFound: "This is not the page you are looking for",
        stayAndPlay: "stay here and play for a while",
        failedAuthentication: "Authentication failed",
        sorry: "Sorry for bothering you",
        welcome: "Welcome, {name}",
        goodBye: "See you next time, {name}",
        passwordNotSame: "Passwords not the same",
        emailExists: "The email does already exist",
        insertQuestionCorrect: "The question was successfully inserted",
    }
}