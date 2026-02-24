import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {  //constante que hace referencia a nuestras credenciiales de la base de datos, las cuales se encuentran en el archivo .env
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_DIALECT,
    NODE_ENV
} = process.env;

const sequelize = new Sequelize( //Instancia de Sequelize, la cual se encarga de establecer la conexión con la base de datos y de gestionar las operaciones de esta
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        port: DB_PORT,
        dialect: DB_DIALECT || "mysql",

        //Buenas practicas actuales 
        logging: NODE_ENV === "development" ? console.log : false,

        define: {
            timestamps: true, //Agrega los campos de createdAt y updatedAt a todas las tablas
            underscored: false, //Va a congelar el nombre de las tablas, es decir, no va a pluralizar los nombres de las tablas y va a respetar el nombre que le asignemos a cada modelo
            freezeTableName: true //Evita que Sequelize pluralice los nombres de las tablas   
        }, 
        
        pool: {
            max: 10, //Número máximo de conexiones en el pool
            min: 0, //Número mínimo de conexiones en el pool
            acquire: 30000, //Tiempo máximo que el pool va a esperar para obtener una conexión antes de lanzar un error
            idle: 10000 //Tiempo máximo que una conexión puede estar inactiva antes de ser liberada
        },

        dialectOptions: {
            // Configuración específica para MySQL
            charset: "utf8mb4" // Configura el conjunto de caracteres a utf8mb4 para soportar emojis y caracteres especiales
        },

        timezone: "-06:00" // Configura la zona horaria a UTC-6 (ajusta según tu ubicación)
    }
);

export const connectDB = async () => {
    try { //Intentamos establecer la conexión con la base de datos
        await sequelize.authenticate(); //Autentica la conexión con la base de datos, si las credenciales son correctas y la base de datos está disponible, se establece la conexión
        console.log("✅ Conexión a MySQL establecida correctamente."); //Si la conexión se establece correctamente, se muestra un mensaje en la consola
        sequelize.sync();
    } catch (error) { //Si ocurre un error al intentar establecer la conexión, se captura el error y se muestra un mensaje en la consola
        console.error("❌ No se pudo conectar a MySQL:", error); //Si ocurre un error, se muestra un mensaje en la consola con el error específico
        process.exit(1); // Salir del proceso con un código de error
    }
};
    
export default sequelize; //Exportamos la instancia de Sequelize para que pueda ser utilizada en otras partes de la aplicación, como en los modelos para definir las tablas y sus relaciones