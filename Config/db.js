import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_DIALECT,
    NODE_ENV
} = process.env;

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        port: DB_PORT,
        dialect: DB_DIALECT || "mysql",
        logging: NODE_ENV === "development" ? console.log : false,
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true
        }, 
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            charset: "utf8mb4"
        },
        timezone: "-06:00"
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión a MySQL establecida correctamente.");
        
        // ✅ CORREGIDO: Sincronización con alter:true
        await sequelize.sync();
        console.log("✅ Tablas sincronizadas correctamente (alter: true)");
        
    } catch (error) {
        console.error("❌ No se pudo conectar a MySQL:", error);
        process.exit(1);
    }
};
    
export default sequelize;