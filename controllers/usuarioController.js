const formularioLogin = (req, res) => {
    res.render('auth/login', {pagina: "Inicia Sesión"});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',  {pagina: "Registrate con nosotros"});
}

export {
    formularioLogin, formularioRegistro
}