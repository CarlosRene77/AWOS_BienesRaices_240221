// models/Usuario.js
import { DataTypes } from "sequelize";
import db from "../Config/db.js"
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const Usuario = db.define('Usuario', {
    // TODOS LOS CAMPOS VAN AQUÍ DENTRO
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre no puede estar vacío'
            }
        }
    },
    
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'El email ya está registrado'
        },
        validate: {
            isEmail: {
                msg: 'Debe proporcionar un email válido'
            },
            notEmpty: {
                msg: 'El email no puede estar vacío'
            }
        }
    },

    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            },
            len: {
                args: [8, 100],
                msg: 'La contraseña debe tener al menos 8 caracteres'
            }
        }
    },
    
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'confirmed'
    },

    // ✅ NUEVOS CAMPOS PARA REDES SOCIALES (DENTRO DE LA CONSTANTE)
    facebookId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        field: 'facebook_id'
    },

    googleId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        field: 'google_id'
    },

    provider: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'local',
        field: 'provider'
    },

    avatar: {
        type: DataTypes.TEXT,  // Cambiado de VARCHAR(500) a TEXT
        allowNull: true,
        field: 'avatar'
    },
    // ✅ FIN DE NUEVOS CAMPOS

    // ✅ CAMPOS PARA BLOQUEO Y SEGURIDAD
    intentos_fallidos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'intentos_fallidos'
    },

    bloqueado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'bloqueado'
    },

    fecha_bloqueo: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'fecha_bloqueo'
    },
        unlock_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'unlock_token'
    },

    unlock_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'unlock_token_expires_at'
    },

    ultimo_login: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'ultimo_login'
    },
    // ✅ FIN CAMPOS BLOQUEO

    token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'token'
    },
        token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'token_expires_at'
    },

    tokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'token_expiration'
    },

    regStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'reg_status'
    },

    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login'
    }
}, {  // ← ESTO CIERRA EL PRIMER OBJETO (CAMPOS) Y EMPIEZA LA CONFIGURACIÓN
    tableName: 'tb_users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'update_at',

    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

// Metodos de instancia 
Usuario.prototype.validarPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export default Usuario;