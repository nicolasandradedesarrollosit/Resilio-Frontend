import { authGet, authPatch } from '../services/api/apiClient';

/**
 * Obtiene todos los usuarios (paginado)
 * @param {number} limit - Límite de usuarios por página
 * @param {number} offset - Offset para paginación
 * @returns {Promise<Object>} 
 */
export async function getUsers(limit = 10, offset = 0) {
    try {
        const data = await authGet(`/api/admin/user?limit=${limit}&offset=${offset}`);
        return data || { users: [] };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

/**
 * Obtiene todos los usuarios (sin paginación)
 * @returns {Promise<Array>} 
 */
export async function getAllUsers() {
    try {
        const data = await authGet('/api/admin/user?limit=10000&offset=0');
        return data?.users || [];
    } catch (error) {
        console.error('Error fetching all users:', error);
        return [];
    }
}

/**
 * Banea o desbanea un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>}
 */
export async function toggleBanUser(userId) {
    try {
        const data = await authPatch(`/api/admin/ban-user/${userId}`, {});
        return data;
    } catch (error) {
        console.error('Error toggling ban user:', error);
        throw error;
    }
}

/**
 * Actualiza los datos de un usuario
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise<Object>}
 */
export async function updateUser(userId, userData) {
    try {
        const data = await authPatch(`/api/admin/user-update/${userId}`, userData);
        return data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

/**
 * Filtra usuarios por término de búsqueda
 * @param {Array} users - Lista de usuarios
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} - Usuarios filtrados
 */
export function filterUsers(users, searchTerm) {
    if (!searchTerm) return users;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter(user => 
        (user.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (user.email?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (user.city?.toLowerCase() || '').includes(lowerSearchTerm)
    );
}
