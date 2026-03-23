// lib/tokens.js
const generarToken = () => Date.now().toString(32) + Math.random().toString(32).substring(2) + "CRms - 26";

const generarTokenConExpiracion = (horas = 24) => {
    const token = generarToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + horas);
    
    return {
        token,
        expiresAt
    };
};

const tokenExpirado = (fechaExpiracion) => {
    if (!fechaExpiracion) return true;
    return new Date() > new Date(fechaExpiracion);
};

export { 
    generarToken, 
    generarTokenConExpiracion, 
    tokenExpirado 
};