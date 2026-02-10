import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";


const app = express();
const PORT = process.env.PORT ?? 3000;

//Importamos sus rutas (ruteo)
app.use("/", usuarioRoutes);

app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
})