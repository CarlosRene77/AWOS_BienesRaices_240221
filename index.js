import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000

app.get("/",  (req, res) => {
    console.log("Saludos desde la Web")
    res.json({
        status:200,
        message: "Solicitud recibida."
    })
})

app.get("/login",  (req, res) => {
    console.log("El usuario desea acceder al sistema")
    res.status(200).send(`<h1> Por favor introduce tus credenciales de acceso </h1>
        <form>
            <input type="text"></input><br>
            <input type="password"></input><br>
            <button>Enviar</button>
        </form>`);
    })

    // Se agregó la "/" al inicio de la ruta
    app.get("/saludo/:nombre", (req, res) =>
    {
        const {nombre} = req.params;
        console.log(`El usuario ${nombre}`)
        res.status(200).send(`<p> Bienvenido <b>${nombre}</b></p>`);
    })

app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
})