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

    token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'token'
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

export default Usuario;