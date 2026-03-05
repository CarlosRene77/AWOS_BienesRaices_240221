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

        // Crear email seguro (nunca undefined)
        const userEmail = facebookData.email || `${facebookData.id}@facebook.com`;

        // Buscar usuario de forma segura
        let usuario = null;

        // 1. Primero buscar por facebookId
        if (facebookData.id) {
            usuario = await Usuario.findOne({ 
                where: { facebookId: facebookData.id }
            });
        }

        // 2. Si no, buscar por email (solo si existe)
        if (!usuario && facebookData.email) {
            usuario = await Usuario.findOne({ 
                where: { email: facebookData.email }
            });
        }

        // 3. Si no, buscar por el email genérico que creamos
        if (!usuario) {
            usuario = await Usuario.findOne({ 
                where: { email: userEmail }
            });
        }

        if (usuario) {
            // Actualizar usuario existente
            console.log('🔄 Usuario existente encontrado. ID:', usuario.id);
            
            usuario.facebookId = facebookData.id;
            usuario.provider = 'facebook';
            usuario.avatar = facebookData.picture?.data?.url || null;
            usuario.confirmed = true;
            usuario.last_login = new Date();
            
            // Actualizar email si no tenía y ahora viene
            if (!usuario.email && facebookData.email) {
                usuario.email = facebookData.email;
            }
            
            await usuario.save();
            
        } else {
            // Crear nuevo usuario
            console.log('🆕 Creando nuevo usuario con email:', userEmail);
            
            usuario = await Usuario.create({
                name: facebookData.name,
                email: userEmail,
                facebookId: facebookData.id,
                provider: 'facebook',
                avatar: facebookData.picture?.data?.url || null,
                confirmed: true,
                password: generarToken(),
                regStatus: true
            });
        }

        // Guardar usuario en sesión
        req.session.usuario = {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            avatar: usuario.avatar,
            provider: usuario.provider
        };

        // Redirigir al dashboard
        res.render("templates/mensaje", {
            title: "✅ ¡Bienvenido!",
            msg: `
                <div class="text-center">
                    <div class="mb-4">
                        <img src="${usuario.avatar || '/img/default-avatar.png'}" 
                             class="w-20 h-20 rounded-full mx-auto border-4 border-indigo-200">
                    </div>
                    <p class="text-xl mb-2">¡Hola ${usuario.name}!</p>
                    <p class="text-gray-600 mb-4">Has iniciado sesión correctamente con Facebook</p>
                    <div class="flex gap-4 justify-center">
                        <a href="/dashboard" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                            Ir al Dashboard
                        </a>
                        <a href="/" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
                            Página Principal
                        </a>
                    </div>
                </div>
            `
        });

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

        // Crear email seguro (nunca undefined)
        const userEmail = googleData.email || `${googleData.id}@google.com`;

        // Buscar usuario de forma segura
        let usuario = null;

        // 1. Primero buscar por googleId
        if (googleData.id) {
            usuario = await Usuario.findOne({ 
                where: { googleId: googleData.id }
            });
        }

        // 2. Si no, buscar por email (solo si existe)
        if (!usuario && googleData.email) {
            usuario = await Usuario.findOne({ 
                where: { email: googleData.email }
            });
        }

        // 3. Si no, buscar por el email genérico que creamos
        if (!usuario) {
            usuario = await Usuario.findOne({ 
                where: { email: userEmail }
            });
        }

        if (usuario) {
            // Actualizar usuario existente
            console.log('🔄 Usuario existente encontrado. ID:', usuario.id);
            
            usuario.googleId = googleData.id;
            usuario.provider = 'google';
            usuario.avatar = googleData.picture || null;
            usuario.confirmed = true;
            usuario.last_login = new Date();
            
            // Actualizar email si no tenía y ahora viene
            if (!usuario.email && googleData.email) {
                usuario.email = googleData.email;
            }
            
            await usuario.save();
            
        } else {
            // Crear nuevo usuario
            console.log('🆕 Creando nuevo usuario con email:', userEmail);
            
            usuario = await Usuario.create({
                name: googleData.name,
                email: userEmail,
                googleId: googleData.id,
                provider: 'google',
                avatar: googleData.picture || null,
                confirmed: true,
                password: generarToken(),
                regStatus: true
            });
        }

        // Guardar usuario en sesión
        req.session.usuario = {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            avatar: usuario.avatar,
            provider: usuario.provider
        };

        // Redirigir al dashboard
        res.render("templates/mensaje", {
            title: "✅ ¡Bienvenido!",
            msg: `
                <div class="text-center">
                    <div class="mb-4">
                        <img src="${usuario.avatar || '/img/default-avatar.png'}" 
                             class="w-20 h-20 rounded-full mx-auto border-4 border-indigo-200">
                    </div>
                    <p class="text-xl mb-2">¡Hola ${usuario.name}!</p>
                    <p class="text-gray-600 mb-4">Has iniciado sesión correctamente con Google</p>
                    <div class="flex gap-4 justify-center">
                        <a href="/dashboard" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                            Ir al Dashboard
                        </a>
                        <a href="/" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
                            Página Principal
                        </a>
                    </div>
                </div>
            `
        });

    } catch (error) {
        console.error('❌ Error en Google callback:', error);
        res.render("templates/mensaje", {
            title: "❌ Error",
            msg: "Ocurrió un error al procesar la autenticación con Google"
        });
    }
};