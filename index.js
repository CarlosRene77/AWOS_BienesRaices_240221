import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";


const app = express();
const PORT = process.env.PORT ?? 3000;

// Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

// Definimos la carpeta pública
app.use(express.static('public'))


//Importamos sus rutas (ruteo)
app.use("/auth", usuarioRoutes);

app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
})

