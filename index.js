import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { connectDB } from "./Config/db.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

// Definimos la carpeta pública
app.use(express.static('public'))

//Routing 
app.use("/auth",usuarioRoutes)
await connectDB();

// Habilitarc lectura de datos a traves de las peticiones (REQUEST)
app.use(express.urlencoded({extended: true}))

//Importamos sus rutas (ruteo)
app.use("/auth", usuarioRoutes);

app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
})
