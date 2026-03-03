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
    to:email,
    subject: 'Bienvenid@ a la plataforma de Bienes Raíces - Confirma tu cuenta',

    html: `
        <p>Hola! ${nombre}, comprueba tu cuenta en bienes_raices_240221.com</p>
        <hr>
        <p> Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
        <a href="localhost:${process.env.PORT}/auth/confirma/${token}">Confirmar Cuenta</a></p>
        <p> En caso de que no seas tú, quien creo la cuenta ignora este correo electrónico.
        </p>`
});
}

export {emailRegistro}