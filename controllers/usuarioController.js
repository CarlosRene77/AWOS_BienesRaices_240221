import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarToken, generarTokenConExpiracion, tokenExpirado } from "../lib/tokens.js";
import { emailRegistro, emailResetearPassword,emailBloqueoCuenta, emailDesbloqueoCuenta } from "../lib/emails.js";
import { error } from "console";
import { where } from "sequelize";

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
    
    const {nombreUsuario: name, emailUsuario: email, passwordUsuario: password} = req.body
    
    // Validaciones
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacio").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electronico no puede ser vacio").isEmail().withMessage
    ("el correo electrónico no tiene un formato adecuado").run(req)
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacia").isLength({min:8, max:30}).withMessage
    ("La longitud de la contraseña debe ser entre 8 y 30 caracteres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Ambas contraseñas deben ser iguales").run(req);

    let resultadoValidacion = validationResult(req);

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({where: {email}})

    if(existeUsuario)
    {
        return res.render("auth/registro", {
            pagina: "Registrate con nosotros :)",
            errores: [{msg: `Ya existe un usuario asociado al correo: ${email}`}],
            usuario: {nombreUsuario: name}
        });
    }

    if(resultadoValidacion.isEmpty())
    {
        // ✅ MODIFICADO: Generar token con expiración de 24 horas
        const { token, expiresAt } = generarTokenConExpiracion(24);
        
        const data = {
            name,
            email,
            password,
            token: token,
            token_expires_at: expiresAt  // Guardamos fecha de expiración
        }
        
        const usuario = await Usuario.create(data);

        // Enviar el correo electrónico
        emailRegistro({
            nombre: usuario.name,
            email: usuario.email,
            token: usuario.token
        })

        // Mensaje de éxito
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
                        
                        <div class="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-700 flex items-center justify-center gap-2">
                            <span class="text-yellow-500">⏰</span> El enlace expirará en 24 horas
                        </div>
                        
                        <div class="bg-red-50 p-2 rounded-lg text-xs text-red-600 mt-2">
                            <span class="font-bold">⚠️ Importante:</span> Si no confirmas en 24 horas, tu cuenta será eliminada automáticamente.
                        </div>
                    </div>
                </div>
            `
        })
    }
    else
    {
        res.render("auth/registro", {
            pagina: "Error al intentar crear una cuenta",
            errores: resultadoValidacion.array(),
            usuario:{nombreUsuario: req.body.nombreUsuario, emailUsuario: req.body.emailUsuario}
        });
    }
}



const paginaConfirmacion = async (req, res) => {
    const { token: tokenCuenta } = req.params;
    console.log("Confirmando la cuenta asociada al token: ", tokenCuenta);

    // Buscar el usuario por token
    const usuarioToken = await Usuario.findOne({ where: { token: tokenCuenta } });
    console.log(usuarioToken);

    if (!usuarioToken) {
        return res.render("templates/mensaje", {
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
            `,
            buttonVisibility: true,
            buttonText: "Solicitar nuevo enlace",
            buttonURL: "/auth/registro"
        });
    }

    // ✅ NUEVO: Validar si el token ha expirado
    if (usuarioToken.token_expires_at && new Date() > new Date(usuarioToken.token_expires_at)) {
        // Eliminar la cuenta expirada
        await usuarioToken.destroy();
        return res.render("templates/mensaje", {
            title: "⏰ Enlace Expirado",
            msg: `
                <div class="max-w-lg mx-auto p-4 rounded-xl shadow-lg bg-linear-to-br from-orange-500 to-red-500">
                    <div class="bg-white p-6 rounded-lg text-center">
                        <div class="text-5xl mb-3">⏰</div>
                        <h2 class="text-gray-800 text-2xl font-bold mb-3">Enlace Expirado</h2>
                        
                        <div class="bg-orange-50 p-3 rounded-lg my-3 border-l-4 border-orange-500">
                            <p class="text-orange-700 text-sm">
                                El enlace de confirmación expiró después de 24 horas.
                            </p>
                        </div>
                        
                        <p class="text-gray-600 text-sm leading-relaxed mb-4">
                            Por seguridad, tu cuenta ha sido eliminada automáticamente.<br>
                            Puedes registrarte nuevamente para crear una nueva cuenta.
                        </p>
                        
                        <div class="mt-4">
                            <a href="/auth/registro" class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                                Registrarme nuevamente
                            </a>
                        </div>
                    </div>
                </div>
            `,
            buttonVisibility: false
        });
    }

    // Actualizar los datos del usuario (confirmado)
    usuarioToken.token = null;
    usuarioToken.token_expires_at = null;  // Limpiar fecha de expiración
    usuarioToken.confirmed = true;
    await usuarioToken.save();

    // Mensaje de confirmación exitosa
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
                    
                    <div class="mt-4">
                        <a href="/auth/login" class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                            Iniciar Sesión
                        </a>
                    </div>
                    
                    <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p class="text-gray-500 text-xs">
                            🚀 Explora nuestras propiedades<br>
                            <span class="text-gray-400">Bienes Raíces - Tu hogar, nuestra prioridad</span>
                        </p>
                    </div>
                </div>
            </div>
        `
    });
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
    const { token } = req.params;
    const { passwordUsuario, confirmacionUsuario } = req.body;
    
    console.log(`Actualizando contraseña para token: ${token}`);

    // Validaciones
    await check('passwordUsuario').notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 8, max: 30 }).withMessage("La contraseña debe tener entre 8 y 30 caracteres").run(req);
    await check('confirmacionUsuario').equals(passwordUsuario).withMessage("Ambas contraseñas deben ser iguales").run(req);

    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/resetearPassword", {
            pagina: "Error al intentar actualizar la contraseña",
            errores: resultadoValidacion.array(),
            token: token,
            csrfToken: req.csrfToken ? req.csrfToken() : ''
        });
    }

    // Buscar usuario por token
    const usuario = await Usuario.findOne({ where: { token } });
    
    if (!usuario) {
        return res.render("templates/mensaje", {
            title: "Error",
            msg: "El enlace no es válido o ha expirado",
            buttonVisibility: true,
            buttonText: "Solicitar nuevamente",
            buttonURL: "/auth/recuperacionPassword"
        });
    }

    // Validar expiración del token
    if (usuario.token_expires_at && new Date() > new Date(usuario.token_expires_at)) {
        usuario.token = null;
        usuario.token_expires_at = null;
        await usuario.save();
        
        return res.render("templates/mensaje", {
            title: "Enlace Expirado",
            msg: "El enlace para restablecer la contraseña ha expirado. Solicita uno nuevo.",
            buttonVisibility: true,
            buttonText: "Solicitar nuevo enlace",
            buttonURL: "/auth/recuperacionPassword"
        });
    }

    // Actualizar contraseña
    usuario.password = passwordUsuario;
    usuario.token = null;
    usuario.token_expires_at = null;
    await usuario.save();

    // ✅ Pantalla de éxito con botón para volver al login
    res.render("templates/mensaje", {
        title: "✅ ¡Contraseña Actualizada!",
        msg: `
            <div class="text-center">
                <div class="mb-4">
                    <svg class="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <p class="text-lg mb-4">Tu contraseña ha sido actualizada correctamente.</p>
                <p class="text-gray-600 mb-6">Ya puedes iniciar sesión con tu nueva contraseña.</p>
            </div>
        `,
        buttonVisibility: true,
        buttonText: "Iniciar Sesión",
        buttonURL: "/auth/login"
    });
};

const autenticarUsuario = async(req, res) => {
    console.log("El usuario desea autenticarse en la plataforma...");
    const { correoUsuario: email, passwordUsuario: password } = req.body;

    // Validación básica: que los campos no estén vacíos
    if (!email || !password) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{ "msg": "Todos los campos son obligatorios" }],
            usuario: { correoUsuario: email }
        });
    }

    // 1. PRIMERO: Buscar al usuario en la BD
    const usuario = await Usuario.findOne({ where: { email } });

    // Si NO existe el usuario
    if (!usuario) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{ "msg": `No existe un usuario asociado a: ${email}` }],
            usuario: { correoUsuario: email }
        });
    }

    // 2. Validar si la cuenta está bloqueada
    if (usuario.bloqueado) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{ "msg": `🔒 Cuenta bloqueada por múltiples intentos fallidos. Contacta a soporte.` }],
            usuario: { correoUsuario: email }
        });
    }

    // 3. Validar si la cuenta está confirmada
    if (!usuario.confirmed) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{ "msg": `La cuenta asociada a: ${email} no esta confirmada. Revisa tu correo.` }],
            usuario: { correoUsuario: email }
        });
    }

    // 4. AHORA validaciones de formato de contraseña
    // Validar longitud mínima
    if (password.length < 8) {
        // Contar como intento fallido
        usuario.intentos_fallidos = (usuario.intentos_fallidos || 0) + 1;
        
        // Verificar si alcanzó 5 intentos fallidos
        if (usuario.intentos_fallidos >= 5) {
            usuario.bloqueado = true;
            usuario.fecha_bloqueo = new Date();
            await usuario.save();
            
            return res.render("auth/login", {
                pagina: "Error al intentar ingresar a la plataforma",
                errores: [{ "msg": `⚠️ Cuenta bloqueada por 5 intentos fallidos.` }],
                usuario: { correoUsuario: email }
            });
        }
        
        await usuario.save();
        
        const intentosRestantes = 5 - usuario.intentos_fallidos;
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{ "msg": `Contraseña incorrecta. La contraseña debe tener mínimo 8 caracteres. Te quedan ${intentosRestantes} intentos.` }],
            usuario: { correoUsuario: email }
        });
    }
    
    // Validar longitud máxima
    if (password.length > 30) {
        usuario.intentos_fallidos = (usuario.intentos_fallidos || 0) + 1;
        
        if (usuario.intentos_fallidos >= 5) {
            usuario.bloqueado = true;
            usuario.fecha_bloqueo = new Date();
            await usuario.save();
            
            return res.render("auth/login", {
                pagina: "Error al intentar ingresar a la plataforma",
                errores: [{ "msg": `⚠️ Cuenta bloqueada por 5 intentos fallidos.` }],
                usuario: { correoUsuario: email }
            });
        }
        
        await usuario.save();
        
        const intentosRestantes = 5 - usuario.intentos_fallidos;
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{ "msg": `Contraseña incorrecta. La contraseña no puede exceder 30 caracteres. Te quedan ${intentosRestantes} intentos.` }],
            usuario: { correoUsuario: email }
        });
    }

    // 5. Validar la contraseña contra la BD
    const passwordValida = await usuario.validarPassword(password);
    
    if (!passwordValida) {
        // Incrementar intentos fallidos
        usuario.intentos_fallidos = (usuario.intentos_fallidos || 0) + 1;
        
        // Verificar si alcanzó 5 intentos fallidos
        if (usuario.intentos_fallidos >= 5) {
            usuario.bloqueado = true;
            usuario.fecha_bloqueo = new Date();
            
            // ✅ Generar token de desbloqueo (expira en 24 horas)
            const { token: unlockToken, expiresAt: unlockExpiresAt } = generarTokenConExpiracion(24);
            usuario.unlock_token = unlockToken;
            usuario.unlock_token_expires_at = unlockExpiresAt;

            await usuario.save();

            // ✅ Enviar email de desbloqueo
            await emailBloqueoCuenta({
                nombre: usuario.name,
                email: usuario.email,
                intentos: usuario.intentos_fallidos,
                token: unlockToken
            });
            
            return res.render("auth/login", {
                pagina: "Error al intentar ingresar a la plataforma",
                errores: [{ "msg": `⚠️ Cuenta bloqueada por 5 intentos fallidos.` }],
                usuario: { correoUsuario: email }
            });
        }
        
        await usuario.save();
        
        const intentosRestantes = 5 - usuario.intentos_fallidos;
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{ "msg": `Contraseña incorrecta. Te quedan ${intentosRestantes} intentos.` }],
            usuario: { correoUsuario: email }
        });
    }

    // Login exitoso - Resetear intentos fallidos
    usuario.intentos_fallidos = 0;
    usuario.ultimo_login = new Date();
    await usuario.save();

    // Crear sesión
    req.session.usuario = {
        id: usuario.id,
        nombre: usuario.name,
        email: usuario.email,
        avatar: usuario.avatar
    };

    // Redirigir a Mis Propiedades
    res.redirect('/propiedades/mis-propiedades');
};

// Desbloquear cuenta mediante token
const desbloquearCuenta = async (req, res) => {
    const { token } = req.params;
    console.log(`Intentando desbloquear cuenta con token: ${token}`);

    // Buscar usuario por token de desbloqueo
    const usuario = await Usuario.findOne({ 
        where: { 
            unlock_token: token,
            bloqueado: true
        } 
    });

    if (!usuario) {
        return res.render("templates/mensaje", {
            title: "Error",
            msg: "El enlace de desbloqueo no es válido o ha expirado",
            buttonVisibility: true,
            buttonText: "Solicitar nuevo desbloqueo",
            buttonURL: "/auth/recuperacionPassword"
        });
    }

    // Validar expiración del token
    if (usuario.unlock_token_expires_at && new Date() > new Date(usuario.unlock_token_expires_at)) {
        usuario.unlock_token = null;
        usuario.unlock_token_expires_at = null;
        await usuario.save();
        
        return res.render("templates/mensaje", {
            title: "Enlace Expirado",
            msg: "El enlace de desbloqueo ha expirado. Por favor, intenta iniciar sesión nuevamente para recibir un nuevo enlace.",
            buttonVisibility: true,
            buttonText: "Volver al inicio",
            buttonURL: "/auth/login"
        });
    }

    // Desbloquear cuenta
    usuario.bloqueado = false;
    usuario.intentos_fallidos = 0;
    usuario.unlock_token = null;
    usuario.unlock_token_expires_at = null;
    await usuario.save();

    // Enviar email de confirmación de desbloqueo
    await emailDesbloqueoCuenta({
        nombre: usuario.name,
        email: usuario.email,
        token: null
    });

    res.render("templates/mensaje", {
        title: "✅ Cuenta Desbloqueada",
        msg: "Tu cuenta ha sido desbloqueada exitosamente. Ya puedes iniciar sesión.",
        buttonVisibility: true,
        buttonText: "Iniciar Sesión",
        buttonURL: "/auth/login"
    });
};

// Completar registro con red social (crear contraseña)
const completarRegistroSocial = async (req, res) => {
    // Verificar que hay datos temporales en sesión
    if (!req.session.tempSocialUser) {
        return res.redirect('/auth/registro');
    }

    const { password, confirmPassword } = req.body;
    const tempUser = req.session.tempSocialUser;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        return res.render('auth/completarRegistro', {
            pagina: 'Completa tu registro',
            usuarioTemp: tempUser,
            errores: [{ msg: 'Las contraseñas no coinciden' }]
        });
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
        return res.render('auth/completarRegistro', {
            pagina: 'Completa tu registro',
            usuarioTemp: tempUser,
            errores: [{ msg: 'La contraseña debe tener al menos 8 caracteres' }]
        });
    }

    try {
        // Crear el nuevo usuario con los datos de la red social
        const nuevoUsuario = await Usuario.create({
            name: tempUser.name,
            email: tempUser.email,
            password: password,
            provider: tempUser.provider,
            avatar: tempUser.avatar,
            confirmed: true,  // Los usuarios de redes sociales se confirman automáticamente
            regStatus: true
        });

        // Agregar el ID de la red social según corresponda
        if (tempUser.provider === 'facebook') {
            nuevoUsuario.facebookId = tempUser.socialId;
        } else if (tempUser.provider === 'google') {
            nuevoUsuario.googleId = tempUser.socialId;
        }
        await nuevoUsuario.save();

        // Limpiar datos temporales de sesión
        delete req.session.tempSocialUser;

        // Crear sesión para el nuevo usuario
        req.session.usuario = {
            id: nuevoUsuario.id,
            name: nuevoUsuario.name,
            email: nuevoUsuario.email,
            avatar: nuevoUsuario.avatar,
            provider: nuevoUsuario.provider
        };

        // Redirigir a Mis Propiedades
        res.redirect('/propiedades/mis-propiedades');

    } catch (error) {
        console.error('Error al completar registro social:', error);
        
        // Verificar si el error es por email duplicado
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.render('auth/completarRegistro', {
                pagina: 'Completa tu registro',
                usuarioTemp: tempUser,
                errores: [{ msg: 'Ya existe una cuenta con este correo electrónico' }]
            });
        }

        res.render('auth/completarRegistro', {
            pagina: 'Completa tu registro',
            usuarioTemp: tempUser,
            errores: [{ msg: 'Error al crear la cuenta. Intenta nuevamente.' }]
        });
    }
};

export {
    formularioLogin, formularioRegistro,registrarUsuario, formulariorecuperacion, paginaConfirmacion, resetearPassword, formularioActualizacionPassword, actualizarPassword, autenticarUsuario, desbloquearCuenta, completarRegistroSocial}