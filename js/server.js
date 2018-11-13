"use strict"

const http = require("http");

const servidor = http.createServer((request, response) => {
    console.log(`Método ${request.method}`);
    console.log(`URL ${request.url}`);
    console.log(request.headers);
});

servidor.listen(3000, function (err) {
    if (err) {
        console.log("Error al iniciar el servidor");
    } else {
        console.log("Servidor escuchando en el puerto 3000")
    }
});