// controllers/propiedadController.js

// Página de Mis Propiedades (después del login)
export const misPropiedades = async (req, res) => {
    // Verificar que el usuario está autenticado
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }

    try {
        // Por ahora solo renderizamos la vista sin propiedades reales
        res.render('propiedades/misPropiedades', {
            pagina: 'Mis Propiedades',
            usuario: req.session.usuario,
            propiedades: [], // Temporal: array vacío
            csrfToken: req.csrfToken ? req.csrfToken() : ''
        });
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
        res.render('propiedades/misPropiedades', {
            pagina: 'Mis Propiedades',
            usuario: req.session.usuario,
            propiedades: [],
            errores: [{ msg: 'Error al cargar tus propiedades' }]
        });
    }
};