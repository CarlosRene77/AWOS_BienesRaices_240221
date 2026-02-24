import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {pagina: "Inicia Sesión"});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',  {pagina: "Registrate con nosotros"});
}

const formulariorecuperacion = (req, res) =>{
    res.render('auth/recuperacionPassword',  {pagina: "Recupera tu Contraseña"});
}

const registrarUsuario = async(req,res) =>
{
    console.log("Intentando registrar a un usuario nuevo con los datos del formulario:");
    console.log(req.body);
    const data =
    {
        name: req.body.nombreUsuario,
        email: req.body.emailUsuario,
        password: req.body.passwordUsuario
    }
    const usuario = await Usuario.create(data);
    res.json(usuario)
}
export {
    formularioLogin, formularioRegistro,registrarUsuario, formulariorecuperacion}