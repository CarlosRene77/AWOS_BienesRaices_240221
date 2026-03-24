// middleware/auth.js

// Middleware para verificar si el usuario está autenticado
export const verificarAuth = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next();
    }
    // Si no está autenticado, redirigir al login
    res.redirect('/auth/login');
};

// Middleware para redirigir si ya está autenticado (para páginas de auth como login/registro)
export const verificarNoAuth = (req, res, next) => {
    if (!req.session || !req.session.usuario) {
        return next();
    }
    // Si ya está autenticado, redirigir a mis propiedades
    res.redirect('/propiedades/mis-propiedades');
};