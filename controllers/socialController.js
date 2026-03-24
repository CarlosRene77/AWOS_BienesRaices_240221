// controllers/socialController.js
import axios from "axios";
import Usuario from "../models/Usuario.js";
import { generarToken } from "../lib/tokens.js";
import { Op } from "sequelize";

// CONFIGURACIÓN FACEBOOK
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:40221/auth/facebook/callback';

// CONFIGURACIÓN GOOGLE
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:40221/auth/google/callback';

// ============================================
// FACEBOOK
// ============================================
export const facebookAuth = (req, res) => {
    const facebookAuthURL = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=email,public_profile`;
    console.log('Redirigiendo a Facebook con URL:', facebookAuthURL);
    res.redirect(facebookAuthURL);
};

export const facebookCallback = async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.render("templates/mensaje", {
            title: "❌ Error de Autenticación",
            msg: "No se pudo autenticar con Facebook"
        });
    }

    try {
        // Intercambiar código por token de acceso
        const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: FACEBOOK_APP_ID,
                client_secret: FACEBOOK_APP_SECRET,
                redirect_uri: FACEBOOK_REDIRECT_URI,
                code
            }
        });

        const { access_token } = tokenResponse.data;

        // Obtener datos del usuario
        const userResponse = await axios.get('https://graph.facebook.com/me', {
            params: {
                fields: 'id,name,email,picture',
                access_token
            }
        });

        const facebookData = userResponse.data;
        console.log('📊 Datos recibidos de Facebook:', facebookData);

        const userEmail = facebookData.email || `${facebookData.id}@facebook.com`;

        // Verificar si el usuario ya existe por facebookId o email
        let usuarioExistente = await Usuario.findOne({ 
            where: { 
                [Op.or]: [
                    { facebookId: facebookData.id },
                    { email: userEmail }
                ]
            } 
        });

        if (usuarioExistente) {
            // Si ya existe, actualizar y hacer login directo
            usuarioExistente.facebookId = facebookData.id;
            usuarioExistente.provider = 'facebook';
            usuarioExistente.avatar = facebookData.picture?.data?.url || null;
            usuarioExistente.last_login = new Date();
            await usuarioExistente.save();

            req.session.usuario = {
                id: usuarioExistente.id,
                name: usuarioExistente.name,
                email: usuarioExistente.email,
                avatar: usuarioExistente.avatar,
                provider: usuarioExistente.provider
            };

            return res.redirect('/propiedades/mis-propiedades');
        }

        // Si NO existe, guardar datos temporales en sesión y pedir contraseña
        req.session.tempSocialUser = {
            name: facebookData.name,
            email: userEmail,
            provider: 'facebook',
            socialId: facebookData.id,
            avatar: facebookData.picture?.data?.url || null
        };

        // Redirigir al formulario para completar registro con contraseña
        res.redirect('/auth/completar-registro-social');

    } catch (error) {
        console.error('❌ Error en Facebook callback:', error);
        res.render("templates/mensaje", {
            title: "❌ Error",
            msg: "Ocurrió un error al procesar la autenticación con Facebook"
        });
    }
};

// ============================================
// GOOGLE
// ============================================
export const googleAuth = (req, res) => {
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile%20openid&access_type=offline`;
    console.log('Redirigiendo a Google con URL:', googleAuthURL);
    res.redirect(googleAuthURL);
};

export const googleCallback = async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.render("templates/mensaje", {
            title: "❌ Error de Autenticación",
            msg: "No se pudo autenticar con Google"
        });
    }

    try {
        // Intercambiar código por token
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
            code
        });

        const { access_token } = tokenResponse.data;

        // Obtener datos del usuario
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const googleData = userResponse.data;
        console.log('📊 Datos recibidos de Google:', googleData);

        const userEmail = googleData.email || `${googleData.id}@google.com`;

        // Verificar si el usuario ya existe por googleId o email
        let usuarioExistente = await Usuario.findOne({ 
            where: { 
                [Op.or]: [
                    { googleId: googleData.id },
                    { email: userEmail }
                ]
            } 
        });

        if (usuarioExistente) {
            // Si ya existe, actualizar y hacer login directo
            usuarioExistente.googleId = googleData.id;
            usuarioExistente.provider = 'google';
            usuarioExistente.avatar = googleData.picture || null;
            usuarioExistente.last_login = new Date();
            await usuarioExistente.save();

            req.session.usuario = {
                id: usuarioExistente.id,
                name: usuarioExistente.name,
                email: usuarioExistente.email,
                avatar: usuarioExistente.avatar,
                provider: usuarioExistente.provider
            };

            return res.redirect('/propiedades/mis-propiedades');
        }

        // Si NO existe, guardar datos temporales en sesión y pedir contraseña
        req.session.tempSocialUser = {
            name: googleData.name,
            email: userEmail,
            provider: 'google',
            socialId: googleData.id,
            avatar: googleData.picture || null
        };

        // Redirigir al formulario para completar registro con contraseña
        res.redirect('/auth/completar-registro-social');

    } catch (error) {
        console.error('❌ Error en Google callback:', error);
        res.render("templates/mensaje", {
            title: "❌ Error",
            msg: "Ocurrió un error al procesar la autenticación con Google"
        });
    }
};
