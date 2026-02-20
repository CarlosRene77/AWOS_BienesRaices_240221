const formularioLogin = (req, res) => {
    res.render('auth/login', {pagina: "Inicia Sesión"});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',  {pagina: "Registrate con nosotros"});
}

const formulariorecuperacion = (req, res) =>{
    res.render('auth/recuperacionPassword',  {pagina: "Recupera tu Contraseña"});
}
export {
    formularioLogin, formularioRegistro, formulariorecuperacion
}