import dotenv from 'dotenv'
dotenv.config()
import { ExpressValidator } from 'express-validator';
import nodemailer from 'nodemailer'

const emailRegistro = async(datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })


const {email, nombre, token} = datos

await transport.sendMail({
        from: 'BienesRaices-240221.com',
        to: email,
        subject: 'Bienvenid@ a la plataforma de Bienes Raíces - Confirma tu cuenta',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Estilos de respaldo para clientes que no soportan inline */
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #4f46e5, #7e22ce); padding: 48px 32px; text-align: center; }
                .content { padding: 40px 32px; }
                .button { display: inline-block; background: linear-gradient(135deg, #4f46e5, #7e22ce); color: white; font-weight: 600; padding: 16px 40px; border-radius: 9999px; text-decoration: none; }
            </style>
        </head>
        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <!-- Contenedor principal -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
                <tr>
                    <td align="center" style="padding:20px;">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);">
                            
                            <!-- Header -->
                            <tr>
                                <td style="background:linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%); padding:48px 32px; text-align:center; border-radius:16px 16px 0 0;">
                                    <h1 style="color:#ffffff; margin:0; font-size:40px; font-weight:300; letter-spacing:-0.025em;">
                                        Bienes<span style="font-weight:700;">Raíces</span>
                                    </h1>
                                    <p style="color:#e0e7ff; margin:12px 0 0; font-size:18px;">Plataforma Inmobiliaria</p>
                                </td>
                            </tr>
                            
                            <!-- Contenido -->
                            <tr>
                                <td style="padding:40px 32px;">
                                    <h2 style="color:#111827; font-size:30px; font-weight:400; text-align:center; margin:0 0 8px;">
                                        ¡Hola <span style="font-weight:700; color:#4f46e5;">${nombre}</span>!
                                    </h2>
                                    
                                    <p style="color:#6b7280; text-align:center; margin:0 0 32px; font-size:16px;">
                                        Gracias por registrarte en nuestra plataforma
                                    </p>
                                    
                                    <div style="background-color:#eef2ff; border-radius:12px; padding:24px; margin-bottom:32px;">
                                        <p style="color:#374151; margin:0; font-size:16px; line-height:1.6;">
                                            <strong style="color:#4f46e5;">Tu cuenta está casi lista</strong>, solo necesitamos confirmar tu dirección de correo electrónico para activarla completamente.
                                        </p>
                                    </div>
                                    
                                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;">
                                    
                                    <p style="color:#4b5563; text-align:center; margin:0 0 24px; font-size:16px;">
                                        Para completar tu registro, haz clic en el siguiente botón:
                                    </p>
                                    
                                    <!-- Botón -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td align="center" style="padding:16px 0 24px;">
                                                <a href="http://localhost:${process.env.PORT}/auth/confirma/${token}" 
                                                   style="display:inline-block; background:linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%); color:#ffffff; font-weight:600; padding:16px 40px; border-radius:9999px; text-decoration:none; font-size:16px; box-shadow:0 4px 6px -1px rgba(79, 70, 229, 0.3);">
                                                    ✅ Confirmar mi cuenta
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Enlace de respaldo -->
                                    <div style="background-color:#f9fafb; border-radius:8px; padding:16px; margin:16px 0 32px;">
                                        <p style="color:#9ca3af; margin:0 0 8px; text-align:center; font-size:14px;">
                                            ¿Problemas con el botón?
                                        </p>
                                        <p style="color:#4f46e5; margin:0; text-align:center; font-size:12px; word-break:break-all; font-family:monospace;">
                                            http://localhost:${process.env.PORT}/auth/confirma/${token}
                                        </p>
                                    </div>
                                    
                                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;">
                                    
                                    <!-- Nota de seguridad -->
                                    <div style="background-color:#fffbeb; border-radius:8px; padding:16px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td width="30" valign="top" style="color:#d97706; font-size:20px;">⚠️</td>
                                                <td style="color:#92400e; font-size:14px;">
                                                    Si no creaste esta cuenta, puedes ignorar este mensaje y no se realizará ninguna acción en tu cuenta.
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color:#f9fafb; padding:32px; text-align:center; border-top:1px solid #e5e7eb; border-radius:0 0 16px 16px;">
                                    <p style="color:#9ca3af; margin:0 0 8px; font-size:14px;">
                                        © 2024 BienesRaíces-240221.com. Todos los derechos reservados.
                                    </p>
                                    <p style="color:#9ca3af; margin:0; font-size:12px;">
                                        Este es un correo automático, por favor no responder a esta dirección.
                                    </p>
                                    <div style="margin-top:16px;">
                                        <span style="color:#d1d5db; font-size:12px;">Términos y condiciones</span>
                                        <span style="color:#d1d5db; margin:0 8px;">•</span>
                                        <span style="color:#d1d5db; font-size:12px;">Política de privacidad</span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    });
}

const emailResetearPassword = async(datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

const {email, nombre, token} = datos

await transport.sendMail({
        from: 'BienesRaices-240221.com',
        to: email,
        subject: 'Confirma tu cuenta - BienesRaíces',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #4f46e5, #7e22ce); color: white; padding: 40px; text-align: center; }
                .content { padding: 40px; }
                .button { background: #4f46e5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; }
                .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0;">Bienes<span style="font-weight:bold;">Raíces</span></h1>
                    <p style="margin:10px 0 0; opacity:0.9;">Plataforma Inmobiliaria</p>
                </div>
                
                <div class="content">
                    <h2>¡Hola ${nombre}!</h2>
                    <p>Gracias por registrarte. Confirma tu cuenta para comenzar.</p>
                    
                    <div style="text-align:center; margin:30px 0;">
                        <a href="http://localhost:${process.env.PORT}/auth/confirma/${token}" class="button">
                            Confirmar cuenta
                        </a>
                    </div>
                    
                    <p style="color:#6b7280; font-size:14px;">
                        Si el botón no funciona, copia y pega este enlace:<br>
                        <span style="color:#4f46e5;">http://localhost:${process.env.PORT}/auth/confirma/${token}</span>
                    </p>
                    
                    <hr style="margin:30px 0;">
                    
                    <p style="color:#6b7280; font-size:14px;">
                        ⚠️ Si no creaste esta cuenta, ignora este mensaje.
                    </p>
                </div>
                
                <div class="footer">
                    <p>© 2024 BienesRaíces-240221.com</p>
                    <p style="font-size:12px;">Correo automático - No responder</p>
                </div>
            </div>
        </body>
        </html>
        `
    });
}

export {emailRegistro, emailResetearPassword}