import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

// Configuración del transportador de correo
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Template base para emails
const getBaseEmailTemplate = (content, footerNote = '') => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BienesRaíces</title>
        <style>
            body, table, td, p, a {
                margin: 0;
                padding: 0;
            }
            body {
                background-color: #f3f4f6;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.5;
            }
            
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
                .content { padding: 32px 24px !important; }
                .header { padding: 32px 24px !important; }
                .button { padding: 14px 32px !important; font-size: 14px !important; }
                h1 { font-size: 28px !important; }
                h2 { font-size: 24px !important; }
            }
        </style>
    </head>
    <body style="margin:0; padding:20px 0; background-color:#f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
             <tr>
                <td align="center" style="padding:20px;">
                    <table width="600" class="container" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:24px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.05);">
                        
                        <tr>
                            <td class="header" style="background:linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding:48px 32px; text-align:center; border-radius:24px 24px 0 0;">
                                <h1 style="color:#ffffff; margin:0; font-size:36px; font-weight:300;">
                                    Bienes<span style="font-weight:700;">Raíces</span>
                                </h1>
                                <p style="color:#e0e7ff; margin:12px 0 0; font-size:16px;">Plataforma Inmobiliaria Profesional</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td class="content" style="padding:48px 40px;">
                                ${content}
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="background-color:#f8fafc; padding:32px; text-align:center; border-top:1px solid #e2e8f0; border-radius:0 0 24px 24px;">
                                <p style="color:#64748b; margin:0 0 8px; font-size:13px;">
                                    © ${new Date().getFullYear()} BienesRaíces. Todos los derechos reservados.
                                </p>
                                <p style="color:#94a3b8; margin:0; font-size:12px;">
                                    Este es un mensaje automático, por favor no responder a esta dirección.
                                </p>
                                ${footerNote ? `<p style="color:#94a3b8; margin-top:16px; font-size:11px;">${footerNote}</p>` : ''}
                                <div style="margin-top:20px;">
                                    <a href="#" style="color:#64748b; text-decoration:none; font-size:12px; margin:0 8px;">Términos</a>
                                    <span style="color:#cbd5e1;">•</span>
                                    <a href="#" style="color:#64748b; text-decoration:none; font-size:12px; margin:0 8px;">Privacidad</a>
                                    <span style="color:#cbd5e1;">•</span>
                                    <a href="#" style="color:#64748b; text-decoration:none; font-size:12px; margin:0 8px;">Ayuda</a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

// Generador de contenido para email de registro
const generateRegistrationContent = (nombre, token) => {
    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const confirmUrl = `${baseUrl}/auth/confirma/${token}`;
    
    return `
        <h2 style="color:#0f172a; font-size:28px; font-weight:500; margin:0 0 12px; text-align:center;">
            ¡Hola, <span style="color:#1e3c72; font-weight:700;">${nombre}</span>!
        </h2>
        
        <p style="color:#334155; text-align:center; margin:0 0 32px; font-size:16px;">
            Bienvenido a la plataforma inmobiliaria líder
        </p>
        
        <div style="background:linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%); border-left:4px solid #1e3c72; border-radius:12px; padding:24px; margin-bottom:32px;">
            <p style="color:#1e293b; margin:0; font-size:15px; line-height:1.6;">
                <strong style="color:#1e3c72;">¡Tu cuenta está casi lista!</strong><br>
                Solo necesitamos confirmar tu dirección de correo electrónico para activar todos los servicios.
            </p>
        </div>
        
        <div style="text-align:center; margin:32px 0;">
            <a href="${confirmUrl}" 
               style="display:inline-block; background:linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color:#ffffff; font-weight:600; padding:14px 36px; border-radius:50px; text-decoration:none; font-size:15px;">
                ✓ Confirmar mi cuenta
            </a>
        </div>
        
        <div style="background-color:#f8fafc; border-radius:12px; padding:16px; margin:24px 0;">
            <p style="color:#475569; margin:0 0 8px; text-align:center; font-size:13px;">
                ¿Problemas con el botón? Copia y pega este enlace:
            </p>
            <p style="color:#1e3c72; margin:0; text-align:center; font-size:12px; word-break:break-all;">
                ${confirmUrl}
            </p>
        </div>
        
        <div style="background-color:#fef9e7; border-radius:12px; padding:16px; margin-top:32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                 <tr>
                    <td width="32" valign="top" style="color:#d97706; font-size:18px;">ℹ️</td>
                    <td style="color:#92400e; font-size:13px;">
                        <strong>¿No solicitaste este registro?</strong><br>
                        Puedes ignorar este mensaje de forma segura.
                    </td>
                </tr>
            </table>
        </div>
    `;
};

// Generador de contenido para email de reseteo de password
const generatePasswordResetContent = (nombre, token) => {
    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    // Ruta CORRECTA según tu formulario en resetearPassword.pug
    const resetUrl = `${baseUrl}/auth/actualizacionPassword/${token}`;
    
    return `
        <h2 style="color:#0f172a; font-size:28px; font-weight:500; margin:0 0 12px; text-align:center;">
            Hola, <span style="color:#1e3c72; font-weight:700;">${nombre}</span>
        </h2>
        
        <p style="color:#334155; text-align:center; margin:0 0 32px; font-size:16px;">
            ¿Olvidaste tu contraseña? No te preocupes
        </p>
        
        <div style="background:linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%); border-left:4px solid #dc2626; border-radius:12px; padding:24px; margin-bottom:32px;">
            <p style="color:#1e293b; margin:0; font-size:15px; line-height:1.6;">
                Hemos recibido una solicitud para restablecer tu contraseña. 
                Haz clic en el botón de abajo para crear una nueva contraseña segura.
            </p>
        </div>
        
        <div style="text-align:center; margin:32px 0;">
            <a href="${resetUrl}" 
               style="display:inline-block; background:linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color:#ffffff; font-weight:600; padding:14px 36px; border-radius:50px; text-decoration:none; font-size:15px;">
                🔐 Restablecer contraseña
            </a>
        </div>
        
        <div style="background-color:#f8fafc; border-radius:12px; padding:16px; margin:24px 0;">
            <p style="color:#475569; margin:0 0 8px; text-align:center; font-size:13px;">
                ¿Problemas con el botón? Copia y pega este enlace:
            </p>
            <p style="color:#dc2626; margin:0; text-align:center; font-size:12px; word-break:break-all;">
                ${resetUrl}
            </p>
        </div>
        
        <div style="background-color:#f1f5f9; border-radius:12px; padding:16px; margin-top:32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                 <tr>
                    <td width="32" valign="top" style="color:#475569; font-size:18px;">⏰</td>
                    <td style="color:#334155; font-size:13px;">
                        <strong>Este enlace expirará en 1 hora</strong><br>
                        Por razones de seguridad, si no solicitaste este cambio, ignora este mensaje.
                    </td>
                </tr>
            </table>
        </div>
        
        <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e5e7eb;">
            <p style="color:#6b7280; font-size:12px; text-align:center;">
                ¿Necesitas ayuda? Contacta con nuestro equipo de soporte
            </p>
        </div>
    `;
};

// Función auxiliar para enviar emails
const sendEmail = async (emailConfig) => {
    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail(emailConfig);
        console.log(`✅ Email enviado exitosamente a: ${emailConfig.to}`);
        return info;
    } catch (error) {
        console.error(`❌ Error al enviar email a ${emailConfig.to}:`, error);
        throw new Error(`Error en envío de correo: ${error.message}`);
    }
};

// Email de desbloqueo de cuenta
export const emailDesbloqueoCuenta = async (datos) => {
    const { email, nombre, token } = datos;
    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const unlockUrl = `${baseUrl}/auth/desbloquear/${token}`;
    
    const content = `
        <h2 style="color:#0f172a; font-size:28px; font-weight:500; margin:0 0 12px; text-align:center;">
            ¡Hola, <span style="color:#1e3c72; font-weight:700;">${nombre}</span>!
        </h2>
        
        <p style="color:#334155; text-align:center; margin:0 0 32px; font-size:16px;">
            Tu cuenta ha sido desbloqueada exitosamente
        </p>
        
        <div style="background:linear-gradient(135deg, #e6f7e6 0%, #d4f0d4 100%); border-left:4px solid #22c55e; border-radius:12px; padding:24px; margin-bottom:32px;">
            <p style="color:#1e293b; margin:0; font-size:15px; line-height:1.6;">
                <strong style="color:#22c55e;">✅ ¡Cuenta desbloqueada!</strong><br>
                Tu cuenta ha sido desbloqueada exitosamente. Ya puedes volver a intentar iniciar sesión.
            </p>
        </div>
        
        <div style="text-align:center; margin:32px 0;">
            <a href="${baseUrl}/auth/login" 
               style="display:inline-block; background:linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color:#ffffff; font-weight:600; padding:14px 36px; border-radius:50px; text-decoration:none; font-size:15px;">
                🔓 Iniciar Sesión
            </a>
        </div>
        
        <div style="background-color:#f1f5f9; border-radius:12px; padding:16px; margin-top:32px;">
            <p style="color:#334155; font-size:13px;">
                <strong>Recomendación de seguridad:</strong><br>
                Te sugerimos cambiar tu contraseña por una nueva y segura.
            </p>
        </div>
    `;
    
    const html = getBaseEmailTemplate(content, 'Si no solicitaste el desbloqueo, ignora este mensaje');
    
    const mailOptions = {
        from: `"BienesRaíces - Seguridad" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔓 Tu cuenta ha sido desbloqueada - BienesRaíces',
        html
    };
    
    await sendEmail(mailOptions);
};

// Email de registro
export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos;
    
    if (!email || !nombre || !token) {
        throw new Error('Datos incompletos para enviar email de registro');
    }
    
    const content = generateRegistrationContent(nombre, token);
    const html = getBaseEmailTemplate(content, 'Verifica tu cuenta en las próximas 24 horas');
    
    const mailOptions = {
        from: `"BienesRaíces" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✨ Bienvenido a BienesRaíces - Confirma tu cuenta',
        html
    };
    
    await sendEmail(mailOptions);
};

// Email de reseteo de contraseña
export const emailResetearPassword = async (datos) => {
    const { email, nombre, token } = datos;
    
    if (!email || !nombre || !token) {
        throw new Error('Datos incompletos para enviar email de reseteo');
    }
    
    const content = generatePasswordResetContent(nombre, token);
    const html = getBaseEmailTemplate(content, 'Este enlace expirará en 1 hora por seguridad');
    
    const mailOptions = {
        from: `"BienesRaíces - Seguridad" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Restablece tu contraseña - BienesRaíces',
        html
    };
    
    await sendEmail(mailOptions);
};

// Email de notificación de bloqueo
export const emailBloqueoCuenta = async (datos) => {
    const { email, nombre, intentos, token } = datos;
    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const unlockUrl = `${baseUrl}/auth/desbloquear/${token}`;
    
    const content = `
        <h2 style="color:#0f172a; font-size:28px; font-weight:500; margin:0 0 12px; text-align:center;">
            ¡Hola, <span style="color:#dc2626; font-weight:700;">${nombre}</span>!
        </h2>
        
        <p style="color:#334155; text-align:center; margin:0 0 32px; font-size:16px;">
            Tu cuenta ha sido bloqueada por seguridad
        </p>
        
        <div style="background:linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%); border-left:4px solid #dc2626; border-radius:12px; padding:24px; margin-bottom:32px;">
            <p style="color:#1e293b; margin:0; font-size:15px; line-height:1.6;">
                <strong style="color:#dc2626;">⚠️ Alerta de Seguridad</strong><br>
                Hemos detectado ${intentos} intentos fallidos de inicio de sesión en tu cuenta.
                Por tu seguridad, hemos bloqueado temporalmente el acceso.
            </p>
        </div>
        
        <div style="text-align:center; margin:32px 0;">
            <a href="${unlockUrl}" 
               style="display:inline-block; background:linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color:#ffffff; font-weight:600; padding:14px 36px; border-radius:50px; text-decoration:none; font-size:15px;">
                🔓 Desbloquear mi cuenta
            </a>
        </div>
        
        <div style="background-color:#f1f5f9; border-radius:12px; padding:16px; margin-top:32px;">
            <p style="color:#334155; font-size:13px;">
                <strong>¿No fuiste tú?</strong><br>
                Si no reconoces estos intentos, te recomendamos cambiar tu contraseña inmediatamente.
            </p>
        </div>
    `;
    
    const html = getBaseEmailTemplate(content, 'El enlace de desbloqueo expirará en 24 horas');
    
    const mailOptions = {
        from: `"BienesRaíces - Seguridad" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '⚠️ Alerta: Tu cuenta ha sido bloqueada - BienesRaíces',
        html
    };
    
    await sendEmail(mailOptions);
};