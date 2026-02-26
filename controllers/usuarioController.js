import { check, validationResult } from "express-validator";
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
    
    //Validacion de los datos del formulario previo a registro en la BD
    // Definir reglas de validacion
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacio").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electronico no puede ser vacio").isEmail().withMessage
    ("el correo electrónico no tiene un formato adecuado").run(req)
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacia").isLength({min:8, max:30}).withMessage
    ("La longitud de la contraseña debe ser entre 8 y 30 caracteres").run(req);
    await check('confirmacionUsuario').equals(req.body.passwordUsuario).withMessage("Ambas contraseñas deben ser iguales").run(req);

    // Aplicamos las reglas definidas
    let resultadoValidacion = validationResult(req);

    // Validar si hay errores en la recepción de datos, si mandar a BD

    if(resultadoValidacion.isEmpty())
    {
            const data =
    {
        name: req.body.nombreUsuario,
        email: req.body.emailUsuario,
        password: req.body.passwordUsuario
    }
    const usuario = await Usuario.create(data);
    res.json(usuario)
    }
    else
    res.render("auth/registro", {
        pagina: "Error al intentar crear una cuenta",
        errores: resultadoValidacion.array(),
        usuario: {nombreUsuario: req.body.nombreUsuario,
            emailUsuario: req.emailUsuario
        
        }});
}

export {
    formularioLogin, formularioRegistro,registrarUsuario, formulariorecuperacion}