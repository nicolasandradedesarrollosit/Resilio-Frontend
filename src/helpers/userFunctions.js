import { authGet } from '../services/api/apiClient';
import { extractUserData, handleAuthError } from './authHelpers';

/**
 * Obtiene los datos del usuario autenticado
 * @returns {Promise<Object|null>} 
 */
export async function fetchUserData() {
    try {
        const result = await authGet('/api/user-data');
        return extractUserData(result);
    } catch (error) {
        handleAuthError(error, 'fetchUserData');
        return null;
    }
}

/**
 * Obtiene los datos del usuario (alias para compatibilidad)
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
export async function getUserData() {
    try {
        const result = await authGet('/api/user-data');
        if (!result) {
            throw new Error('Error al obtener los datos del usuario');
        }
        return result;
    } catch (err) {
        console.error('Error fetching user data:', err);
        throw err;
    }
}

/**
 * Verifica si hay una sesión activa
 * @returns {Promise<boolean>}
 */
export async function hasActiveSession() {
    try {
        const userData = await fetchUserData();
        return userData !== null;
    } catch (error) {
        handleAuthError(error, 'hasActiveSession');
        return false;
    }
}