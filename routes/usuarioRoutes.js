import express from "express";
import { formularioLogin,formularioRegistro,formulariorecuperacion,registrarUsuario } from "../controllers/usuarioController.js";

//creamos el ruteador
const router = express.Router();

router.get("/login",formularioLogin);
router.get("/registro",formularioRegistro);
router.get("/recuperacionPassword",formulariorecuperacion);


//POST
router.post("/registro", registrarUsuario)
router.post("/createUser", (req, res) => {
    console.log("Se ha solicitado crear un nuevo usuario.")
    res.json({
        status: 200,
        message: "Se ha solicitado la creación de un nuevo usuario."
    })
})


//Definimos las rutas 
        
//Ejemplo de ENDPOINT GET 
router.get("/", (req, res) => {
    console.log("Bienvenid@ al sistema de Bienes Raices");
    console.log("Procesando una peticion GET");
    res.json({
        status: 200, 
        message: "Solicitud recibida através del metodo GET"
    });
});

//Ejemplo de ENDPOINT POST
router.post("/", (req, res) => {
    console.log("Se ha recibido una petición tipo POST");
    console.log("Procesando una peticion POST");
    res.json({
        status: 200, 
        message: "Lo sentimos, no se aceptan peticiones POST"
    });
});

//Ejemplo de un ENDPOINT POST - Simular la creacion de un nuevo usuario
router.post("/createUser", (req, res) => {
    console.log("Se ha solicitado crear un nuevo usuario.");
    console.log("Procesando una peticion POST");

    const nuevoUsuario = {
        nombre: "Adrian Rios Gomez",
        correo: "240165@utxicotepec.edu.mx"
    };

    res.json({
        status: 200,
        message: `Se ha solicitado la creación de un usuario de nombre: ${nuevoUsuario.nombre} y correo ${nuevoUsuario.correo}`,
    });
});

//Ejemplo de un ENDPOINT PUT - Simular la actualización completa
router.put("/updateUser", (req, res) => {
    console.log("Se ha solicitado la actualización completa de los datos del usuario.");
    console.log("Procesando una peticion PUT");

    const usuario = {
        nombre: "Adrian Rios Gomez",
        correo: "240165@utxicotepec.edu.mx"
    };

    const usuarioActualizado = {
        nombre: "Luis perez",
        correo: "luispancrasio@mail.com"
    };

    res.json({
        status: 200,
        message: `Se ha solicitado la actualización completa de los datos de nombre: ${usuario.nombre} y correo ${usuario.correo} a ${usuarioActualizado.nombre} y correo ${usuarioActualizado.correo}`,
    });
});

//Ejemplo de un ENDPOINT PATCH - Simular actualización parcial de contraseña
router.patch("/updatePassword/:nuevoPassword", (req, res) => {

    console.log("Se ha solicitado la actualización de la contraseña, siendo PATCH una actualización parcial.");
    console.log("Procesando una peticion PATCH");

    const usuario = {
        nombre: "Adrian Rios Gomez",
        correo: "240165@utxicotepec.edu.mx",
        password: "abcde"
    };

    const { nuevoPassword } = req.params;

    res.json({
        status: 200,
        message: `Se ha solicitado la actualización parcial de la contraseña del usuario nombre: ${usuario.nombre} y correo: ${usuario.correo} del password actual: ${usuario.password} a ${nuevoPassword}`,
    });

});

//Ejemplo de un ENDPOINT DELETE - Simular eliminación
router.delete("/deleteProperty/:id", (req, res) => {
    console.log("Procesando una peticion de tipo DELETE");

    const { id } = req.params;

    res.json({
        status: 200,
        message: `Se realizara la eliminacion de la propiedad ${id}`
    });
});



router.get("/saludo/:nombre", (req, res) => {
    const { nombre } = req.params;
    console.log(`El usuario: ${nombre}`);
    res.status(200).send(`<p>Bienvenido <b>${nombre}</b></p>`);
});

export default router;