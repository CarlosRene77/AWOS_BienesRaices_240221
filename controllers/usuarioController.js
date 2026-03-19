import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarToken} from "../lib/tokens.js";
import { emailRegistro, emailResetearPassword } from "../lib/emails.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {pagina: "Inicia Sesión"});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',  {pagina: "Registrate con nosotros"});
}

const formulariorecuperacion = (req, res) =>{
    res.render('auth/recuperacionPassword',  {pagina: "Recupera tu Contraseña"});
}

const formularioActualizacionPassword = async (req, res) =>{
    console.log(req.params); // Para ver qué llega
    const { token } = req.params;
    console.log(`El usuario con token: ${token} esta intentando actualizar su contraseña`);

    // Buscar el usuario por token
    const usuarioSolicitante = await Usuario.findOne({ where: { token } });
    
    // Validar si el token existe
    if (!usuarioSolicitante) {
        return res.render("templates/mensaje", {
            title: "Error",
            msg: "El enlace no es válido o ha expirado",
            buttonVisibility: true,
            buttonText: "Solicitar nuevamente",
            buttonURL: "/auth/recuperacionPassword"
        });
    }
    
    console.log(`El usuario dueño del token es: ${usuarioSolicitante.email}`);
    
    // Renderizar el formulario con el token
    res.render('auth/resetearPassword',  {
        pagina: "Ingresa tu nueva contraseña",
        token: token  // ← Pasa el token a la vista
    });
}

const registrarUsuario = async(req,res) =>
{
    console.log("Intentando registrar a un usuario nuevo con los datos del formulario:");
    
    const {nombreUsuario: name,emailUsuario:email,passwordUsuario:password} = req.body
    
    //Validacion de los datos del formulario previo a registro en la BD
    // Definir reglas de validacion
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacio").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electronico no puede ser vacio").isEmail().withMessage
    ("el correo electrónico no tiene un formato adecuado").run(req)
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacia").isLength({min:8, max:30}).withMessage
    ("La longitud de la contraseña debe ser entre 8 y 30 caracteres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Ambas contraseñas deben ser iguales").run(req);

    // Aplicamos las reglas definidas
    let resultadoValidacion = validationResult(req);

    // Verificar si el usuario no esta previamente registrado en la bd
    const existeUsuario = await Usuario.findOne({where: {email}})

    if(existeUsuario)
    {
        res.render("auth/registro", {
            pagina: "Registrate con nosotros :)",
            errores: [{msg: `Ya existe un usuario asociado al correo: ${email}`}],
            usuario: {nombreUsuario: name,
            }});
    }

    // Validar si hay errores en la recepción de datos, si mandar a BD

    if(resultadoValidacion.isEmpty())
    {
            const data =
    {
        name,
        email,
        password,
        token: generarToken()
    }
    const usuario = await Usuario.create(data);

    // Enviar el correo electrónico
    emailRegistro({
        nombre: usuario.name,
        email: usuario.email,
        token: usuario.token
    })


    // 1. Creación de cuenta exitosa - MÁS COMPACTO
    res.render("templates/mensaje", {
        title: "✨ ¡Bienvenido a Bienes Raíces!",
        msg: `
            <div class="max-w-lg mx-auto p-4 rounded-xl shadow-lg bg-linear-to-br from-blue-500 to-purple-600">
                <div class="bg-white p-6 rounded-lg text-center">
                    <div class="text-5xl mb-3">🏠</div>
                    <h2 class="text-gray-800 text-2xl font-bold mb-3">¡Cuenta Creada Exitosamente!</h2>
                    
                    <div class="bg-blue-50 p-3 rounded-lg my-3 border-l-4 border-blue-500">
                        <p class="text-gray-700 text-base">
                            <span class="text-blue-600 font-semibold">${email}</span>
                        </p>
                    </div>
                    
                    <p class="text-gray-600 text-sm leading-relaxed mb-4">
                        Hemos enviado un correo de confirmación a tu dirección.<br>
                        <span class="font-medium text-gray-700">Por favor, verifica tu bandeja de entrada</span> para activar tu cuenta.
                    </p>
                    
                    <div class="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 flex items-center justify-center gap-2">
                        <span class="text-yellow-500">⚡</span> El enlace expirará en 24 horas
                    </div>
                </div>
            </div>
        `
    })
    }
    else
    res.render("auth/registro", {
        pagina: "Error al intentar crear una cuenta",
        errores: resultadoValidacion.array(),
        usuario:{nombreUsuario: req.body.nombreUsuario, emailUsuario:req.body.emailUsuario}
    });
}
const paginaConfirmacion = async (req,res) =>
{
    const {token: tokenCuenta} = req.params
    console.log("Confirmando la cuenta asociada al token: ", tokenCuenta)

    //Confirmar soi el token existe
    const usuarioToken = await(Usuario.findOne({where:{token:tokenCuenta}}))
    console.log(usuarioToken);

    if(!usuarioToken)
    {
    // 2. Error en verificación - MÁS COMPACTO
    res.render("templates/mensaje", {
        title: "⚠️ Error en la Verificación",
        msg: `
            <div class="max-w-lg mx-auto p-4 rounded-xl shadow-lg bg-linear-to-br from-pink-500 to-red-500">
                <div class="bg-white p-6 rounded-lg text-center">
                    <div class="text-5xl mb-3">🔐</div>
                    <h2 class="text-gray-800 text-2xl font-bold mb-3">Código no Válido</h2>
                    
                    <div class="bg-red-50 p-3 rounded-lg my-3 border-l-4 border-red-500">
                        <p class="text-red-600 text-sm">
                            El código ingresado no es válido o ha expirado
                        </p>
                    </div>
                    
                    <p class="text-gray-600 text-sm leading-relaxed mb-4">
                        No te preocupes, esto puede suceder. Por favor, 
                        <span class="font-medium text-gray-700">solicita un nuevo código</span><br>
                        para continuar con el proceso.
                    </p>
                    
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <p class="text-gray-600 text-xs flex items-center justify-center gap-2">
                            <span>📧</span> ¿Necesitas ayuda? Contacta a soporte
                        </p>
                    </div>
                </div>
            </div>
        `
    })
}
    //Actualizar los datos del usuario.
    usuarioToken.token=null;
    usuarioToken.confirmed=true;
    usuarioToken.save();

        // 3. Confirmación exitosa - MÁS COMPACTO
    res.render("templates/mensaje", {
        title: "✅ ¡Confirmación Exitosa!",
        msg: `
            <div class="max-w-lg mx-auto p-4 rounded-xl shadow-lg bg-linear-to-br from-green-400 to-blue-500">
                <div class="bg-white p-6 rounded-lg text-center">
                    <div class="text-5xl mb-3">🎉</div>
                    <h2 class="text-gray-800 text-2xl font-bold mb-3">¡Cuenta Confirmada!</h2>
                    
                    <div class="bg-linear-to-r from-blue-500 to-purple-600 p-0.5 rounded-lg my-4">
                        <div class="bg-white p-4 rounded-lg">
                            <p class="text-gray-800 text-lg font-bold mb-1">
                                ${usuarioToken.name}
                            </p>
                            <p class="text-blue-600 text-sm">
                                ${usuarioToken.email}
                            </p>
                        </div>
                    </div>
                    
                    <p class="text-gray-700 text-base mb-4">
                        ¡Cuenta verificada correctamente!<br>
                        <span class="text-green-600 font-bold text-lg">Ya puedes acceder</span>
                    </p>
                    
                    <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p class="text-gray-500 text-xs">
                            🚀 Explora nuestras propiedades<br>
                            <span class="text-gray-400">Bienes Raíces - Tu hogar, nuestra prioridad</span>
                        </p>
                    </div>
                </div>
            </div>
        `
    })

}

const resetearPassword = async (req, res) => {
    const { correoUsuario } = req.body;
    console.log(`El usuario con correo: ${correoUsuario} esta solicitando un reseteo de contraseña.`)

    // Validaciones del Frontend 
    await check('correoUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío")
        .isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)
    
    let resultadoValidacion = validationResult(req);

    if(!resultadoValidacion.isEmpty())
    {
        return res.render("auth/recuperacionPassword", {  // ← AGREGAR return
            pagina: "Error, correo inválido", 
            errores: resultadoValidacion.array(), 
            usuario: { emailUsuario: correoUsuario }
        });
    }

    // Validacion 1
    const usuario = await Usuario.findOne({where: {email: correoUsuario}});
    
    if(!usuario)
    {
        return res.render("templates/mensaje",{  // ← AGREGAR return
            title: "Error, buscando la cuenta",
            msg: `No se ha encontrado ninguna cuenta asociada al correo ${correoUsuario}`,
            buttonVisibility: true,
            buttonText: "Intentalo de nuevo",
            buttonURL: "/auth/recuperacionPassword"
        });
    }
    else{
        if(!usuario.confirmed)
        {
            return res.render("templates/mensaje",{  // ← AGREGAR return
                title: "Error, la cuenta no esta confirmada",
                msg: `La cuenta asociada al correo: ${correoUsuario}, no ha sido validada`,
                buttonVisibility: true,
                buttonText: "Intentalo de nuevo",
                buttonURL: "/auth/recuperacionPassword"
            });
        }
        else{
            usuario.token = generarToken();
            await usuario.save();
            await emailResetearPassword({
                nombre: usuario.name,
                email: usuario.email,
                token: usuario.token
            })
            
            return res.render("templates/mensaje", {  // ← AGREGAR return
                title: "Correo para la restauración de contraseñas",
                msg: `Un paso mas, te hemos enviado un correo electrónico con la liga segura`,
                buttonVisibility: false
            });
        }
    }
}

const actualizarPassword = async(req, res) => {
    const { token } = req.params;  // ← Token de la URL
    const { passwordUsuario, confirmacionUsuario } = req.body;  // ← Campos del formulario
    
    console.log(`Actualizando contraseña para token: ${token}`);

    // Validaciones
    await check('passwordUsuario').notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 8, max: 30 }).withMessage("La contraseña debe tener entre 8 y 30 caracteres").run(req);
    await check('confirmacionUsuario').equals(passwordUsuario).withMessage("Ambas contraseñas deben ser iguales").run(req);

    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/resetearPassword", {  // ← Sin slash al final
            pagina: "Error al intentar actualizar la contraseña",
            errores: resultadoValidacion.array(),
            token: token  // ← Pasa el token de vuelta
        });
    }

    // Aquí va la lógica para actualizar en la BD
    // Buscar usuario por token, actualizar password, limpiar token
}


export {
    formularioLogin, formularioRegistro,registrarUsuario, formulariorecuperacion, paginaConfirmacion, resetearPassword, formularioActualizacionPassword, actualizarPassword}