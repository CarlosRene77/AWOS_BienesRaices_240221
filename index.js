// index.js
import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import session from 'express-session'; // ✅ NUEVA IMPORTACIÓN
import usuarioRoutes from "./routes/usuarioRoutes.js";
import socialRoutes from "./routes/socialRoutes.js"; // ✅ NUEVA IMPORTACIÓN
import { connectDB } from "./Config/db.js";
import { Op } from 'sequelize'; // ✅ NUEVA IMPORTACIÓN (para el controlador)
import cookieParser from 'cookie-parser';
import csurf from '@dr.pogodin/csurf';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
// ✅ NUEVO: Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_bienes_raices_2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Cambiar a true si usas HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));
*/

// Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

// Definimos la carpeta pública
app.use(express.static('public'))

// Habilitar lectura de datos a través de las peticiones
app.use(express.urlencoded({extended: true}))

// Activamos la opción para poder manipular Cookies - Almacenamiento en el cliente (navegador)
app.use(cookieParser());
app.use(express.json());


// Definimos el Middleware - 
app.use(session({
    secret: process.env.SESSION_SECRET||"PC-BienesRaices_240221_csrf_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
}));

// Habilitamos el mecanismo para proteccion de CSRF
app.use(csurf())

// Habilitar los tokens de CSRF para cualquier formulario
app.use((req, res, next) => 
{
    res.locals.csrfToken = req.csrfToken();
    next();
});




// ✅ MODIFICADO: Routing - Ahora usamos ambas rutas
app.use("/auth", usuarioRoutes);
app.use("/auth", socialRoutes); // Agregamos las rutas sociales

await connectDB();



// Ruta de prueba para dashboard (opcional)
app.get("/dashboard", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/auth/login");
    }
    res.render("dashboard", { 
        pagina: "Dashboard",
        usuario: req.session.usuario 
    });
});

// Ruta para cerrar sesión
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect("/dashboard");
        }
        res.redirect("/auth/login");
    });
});

app.listen(process.env.PORT ?? 3000, ()=> {
    console.log(`El servidor está iniciado en el puerto ${process.env.PORT ?? 3000}`)
    console.log(`🔐 Facebook: http://localhost:${process.env.PORT ?? 3000}/auth/facebook`);
    console.log(`🔐 Google: http://localhost:${process.env.PORT ?? 3000}/auth/google`);
});