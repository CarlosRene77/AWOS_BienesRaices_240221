// jobs/cleanExpiredAccounts.js
import { Op } from 'sequelize';
import Usuario from '../models/Usuario.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Script para eliminar cuentas no confirmadas con token expirado
 * Debe ejecutarse cada hora mediante un CRON job
 */
export const cleanExpiredAccounts = async () => {
    try {
        const now = new Date();
        
        // Buscar cuentas no confirmadas con token expirado
        const expiredAccounts = await Usuario.findAll({
            where: {
                confirmed: false,
                token_expires_at: {
                    [Op.lt]: now  // Fecha de expiración menor a la actual
                },
                token: {
                    [Op.ne]: null  // Que tengan token (no confirmadas)
                }
            }
        });

        if (expiredAccounts.length > 0) {
            console.log(`🔍 Encontradas ${expiredAccounts.length} cuentas expiradas para eliminar`);
            
            for (const account of expiredAccounts) {
                console.log(`🗑️ Eliminando cuenta: ${account.email} (creada: ${account.created_at})`);
                await account.destroy();
            }
            
            console.log(`✅ Eliminadas ${expiredAccounts.length} cuentas expiradas`);
        } else {
            console.log('✅ No hay cuentas expiradas para eliminar');
        }
        
        return expiredAccounts.length;
    } catch (error) {
        console.error('❌ Error al limpiar cuentas expiradas:', error);
        throw error;
    }
};

// Ejecutar directamente si se llama como script
if (import.meta.url === `file://${process.argv[1]}`) {
    cleanExpiredAccounts()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}