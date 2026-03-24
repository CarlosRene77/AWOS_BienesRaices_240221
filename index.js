// index.js
import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import session from 'express-session';
import usuarioRoutes from "./routes/usuarioRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import propiedadRoutes from "./routes/propiedadRoutes.js";
import { connectDB } from "./Config/db.js";
import { Op } from 'sequelize';
import cookieParser from 'cookie-parser';
import csurf from '@dr.pogodin/csurf';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
// NUEVO: Configuración de sesiones
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




// MODIFICADO: Routing - Ahora usamos ambas rutas
app.use("/auth", usuarioRoutes);
app.use("/auth", socialRoutes); // Agregamos las rutas sociales
app.use("/propiedades", propiedadRoutes);

await connectDB();

// Cachear el error
app.use((err, req, res, next) => {
    if(err.code === "EBADCSRFTOKEN") {
        return res.status(403).render("templates/mensaje", {
            pagina: "Error de seguridad",
            title: "Error CSRF",
            msg: "El formulario expiró o fue manipulado. Recarga la pagina."
        });
    }
    next(err);
});



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
            return res.redirect("/propiedades/mis-propiedades");
        }
        res.redirect("/auth/login");
    });
});

// index.js - AGREGAR AL FINAL DEL ARCHIVO, DESPUÉS DE LAS RUTAS Y ANTES DE app.listen
import cron from 'node-cron';
import { cleanExpiredAccounts } from './jobs/cleanExpiredAccounts.js';

//  Configurar CRON para ejecutar cada hora (eliminar cuentas expiradas)
cron.schedule('0 * * * *', async () => {
    console.log('🕐 Ejecutando limpieza de cuentas expiradas...');
    try {
        const eliminadas = await cleanExpiredAccounts();
        if (eliminadas > 0) {
            console.log(`✅ ${new Date().toLocaleString()} - Eliminadas ${eliminadas} cuentas expiradas`);
        }
    } catch (error) {
        console.error('❌ Error en limpieza automática:', error);
    }
});

console.log('🕒 CRON job programado: Limpieza de cuentas expiradas cada hora');

// Ruta para la nueva página principal después del login
app.get("/main", (req, res) => {
    // Verificar que el usuario está autenticado
    if (!req.session.usuario) {
        return res.redirect("/auth/login");
    }
    
    res.render("main/mis-propiedades", {
        pagina: "Página Principal",
        usuario: req.session.usuario
    });
});

app.listen(process.env.PORT ?? 3000, ()=> {
    console.log(`El servidor está iniciado en el puerto ${process.env.PORT ?? 3000}`)
    console.log(`🔐 Facebook: http://localhost:${process.env.PORT ?? 3000}/auth/facebook`);
    console.log(`🔐 Google: http://localhost:${process.env.PORT ?? 3000}/auth/google`);
});