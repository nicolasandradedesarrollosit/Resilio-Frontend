const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene todos los usuarios (paginado)
 * @param {number} limit - Límite de usuarios por página
 * @param {number} offset - Offset para paginación
 * @returns {Promise<Object>} 
 */
export async function getUsers(limit = 10, offset = 0) {
    try {
        const response = await fetch(
            `${API_URL}/api/admin/user?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        const data = await response.json();
        return data;
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
        const response = await fetch(
            `${API_URL}/api/admin/user?limit=10000&offset=0`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error('Error al obtener todos los usuarios');
        }

        const data = await response.json();
        return data.users || [];
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
        const response = await fetch(
            `${API_URL}/api/admin/ban-user/${userId}`,
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error('Error al cambiar estado de ban del usuario');
        }

        const data = await response.json();
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
        const response = await fetch(
            `${API_URL}/api/admin/user-update/${userId}`,
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            }
        );

        if (!response.ok) {
            throw new Error('Error al actualizar usuario');
        }

        const data = await response.json();
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
