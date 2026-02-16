const formularioLogin = (req, res) => {
    res.render("auth/Login");
}

const formularioRegistro = (req, res) =>
{
    res.render("auth/registro");
}


export {formularioLogin, formularioRegistro}
