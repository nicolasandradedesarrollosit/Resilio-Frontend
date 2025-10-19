import { authGet } from '../services/api/apiClient';
import { handleAuthError } from './authHelpers';

/**
 * Obtiene los datos del administrador
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export async function getAdminData() {
    try {
        const result = await authGet('/api/user-data');
        
        if (!result) {
            throw new Error('Error al cargar los datos del administrador');
        }

        if (result.ok && result.data) {
            return result.data;
        } else if (result.data) {
            return result.data;
        } else {
            throw new Error('Datos de administrador no disponibles');
        }
    } catch (err) {
        handleAuthError(err, 'getAdminData');
        throw err;
    }
}