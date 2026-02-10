import express from "express";

//creamos el ruteador

const router = express.Router();

//Definimos las rutas 
        
//Ejemplo de ENDPOINT GET 
router.get("/", (req, res) => {
    console.log("Bienvenid@ al sistema de Bienes Raices")
    console.log("Procesando una petición del tipo GET");
    res.json({
        status:200, 
        message: "Solicitud recibida através del metodo GET"
    })
})

//Ejemplo de ENDPOINT POST
router.post("/", (req, res) => {
    console.log("Se ha recibido una petición tipo POST")
    console.log("Procesando una petición del tipo POST");
    res.json({
        status:200, 
        message: "Lo sentimos, no se aceptan peticiones POST"
    })
})

//Ejemplo de un ENDPOINT POST - Simular la creacionde un nuevo usuario
router.post("/createUser", (req, res) => {
    console.log("Se ha solicitado crear un nuevo usuario.")
    console.log("Procesando una petición del tipo POSt");
    const nuevoUsuario = 
    {
        nombre: "Carlos Morales",
        correo:  "240221@utxicotepec.edu.mx"
    }
    res.json({
        status:200,
        message: `Se he solicitado la creación de un usuario de nombre: ${nuevoUsuario.nombre} y correo ${nuevoUsuario.correo}`,
    })
})

//Ejemplo de un ENPOINT PUT - Simular la actualización de los datos de un usuario creado 
router.put("/updateUser", (req, res) => {
    console.log("Se ha solicitado la actualización de los datos del usuario, siendo PUT una actualizacón completa")
    console.log("Procesando una petición del tipo PUT");
        const usuario = 
    {
        nombre: " Rene",
        correo:  "240221@utxicotepec.edu.mx"
    }
    const usuarioActualizado =
    {
        nombre: "Carlos",
        correo: "carlos@gmail.com"
    }
    res.json ({
        status: 200,
        message: `Se he solicitado la actualización completa delos datos de nombre: ${usuario.nombre} y correo ${usuario.correo} a ${usuarioActualizado.nombre} y correo ${usuarioActualizado.correo}`,
    })
})

//Ejemplo de un ENDPOINT PATCH - Simular la actualización de la contraseña del usuario
router.patch("/updatePassword/:nuevoPassword", (req, res) => {
    console.log("Se ha solicitado la actualización de la contraseña, siendo PATCH una actualización parcial")
    console.log("Procesando una petición del tipo PATCH");
    const usuario = 
    {
        nombre: "Carlos Rene Morales Santos",
        correo:  "240221@utxicotepec.edu.mx",
        password: "12345678"
    }
    const {nuevoPassword} = req.params
res.json({
    status: 200,
    message: `Se ha solicitado la actualización parcial de la contraseña del usuario de nombre ${usuario.nombre} y correo ${usuario.correo} de la contraseña ${usuario.password} a ${nuevoPassword}`
});

})


//Ejemplo de un ENDPOINT del tipo DELETE - Simular la eliminación de un usuario
router.delete("/deleteProperty/:id", (req,res)=>{
    console.log("Procesando una peticion de tipo delete")
    const {id}=req.params
    res.json({
        status:200,
        message:`Se realizara la eliminacion de la propiedad ${id}`
    })
})


router.get("/login", (req, res) => {
    res.render("auth/login")
    autenticado:true
})

router.get("/saludo/:nombre", (req, res)=>
    {
        const {nombre} = req.params;
        console.log(`El usuario: ${nombre}`)
        res.status(200).send(`<p>Bienvenido <b>${nombre}</b></p> </h1`)       
    })

export default router;