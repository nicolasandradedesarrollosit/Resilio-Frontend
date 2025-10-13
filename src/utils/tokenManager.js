/**
 * Utilidades para manejo de autenticación basada en cookies HTTP-only
 * 
 * IMPORTANTE: Los tokens ahora se almacenan en cookies HTTP-only en el servidor,
 * lo que significa que JavaScript no puede acceder a ellos directamente.
 * Esto mejora la seguridad al prevenir ataques XSS.
 * 
 * Todas las peticiones autenticadas deben incluir: credentials: 'include'
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Verifica si el usuario está autenticado consultando al servidor
 * @returns {Promise<{isAuthenticated: boolean, userId: string|null}>}
 */
export async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/api/user-data`, {
            method: 'GET',
            credentials: 'include', // Envía las cookies automáticamente
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                isAuthenticated: true,
                userId: data.id || null
            };
        }

        return { isAuthenticated: false, userId: null };
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return { isAuthenticated: false, userId: null };
    }
}

/**
 * Intenta renovar el token usando el refresh token almacenado en cookies
 * El servidor automáticamente leerá la cookie refresh_token
 * @returns {Promise<boolean>} - True si se renovó exitosamente
 */
export async function refreshAccessToken() {
    try {
        const response = await fetch(`${API_URL}/api/refresh`, {
            method: 'POST',
            credentials: 'include', // Envía las cookies (incluido refresh_token)
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Token renovado exitosamente');
            return true;
        }

        console.error('Error al renovar token:', response.status);
        return false;
    } catch (error) {
        console.error('Error en refreshAccessToken:', error);
        return false;
    }
}

/**
 * Cierra la sesión del usuario, limpiando las cookies en el servidor
 * @returns {Promise<boolean>} - True si se cerró sesión exitosamente
 */
export async function logout() {
    try {
        const response = await fetch(`${API_URL}/api/log-out`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Sesión cerrada exitosamente');
            return true;
        }

        console.error('Error al cerrar sesión:', response.status);
        return false;
    } catch (error) {
        console.error('Error en logout:', error);
        return false;
    }
}

/**
 * Realiza una petición autenticada con manejo automático de refresh
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones de fetch
 * @returns {Promise<Response>} - Respuesta de la petición
 */
export async function authenticatedFetch(url, options = {}) {
    // Asegurar que se envíen las cookies
    const fetchOptions = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    let response = await fetch(url, fetchOptions);

    // Si recibimos 401 (no autorizado), intentar renovar el token
    if (response.status === 401) {
        console.log('Token expirado, intentando renovar...');
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            // Reintentar la petición original con el nuevo token
            response = await fetch(url, fetchOptions);
        }
    }

    return response;
}

/**
 * Helper para hacer peticiones GET autenticadas
 * @param {string} endpoint - Endpoint relativo (ej: '/api/user-data')
 * @returns {Promise<any>} - Datos de la respuesta o null
 */
export async function authGet(endpoint) {
    try {
        const response = await authenticatedFetch(`${API_URL}${endpoint}`, {
            method: 'GET'
        });

        if (response.ok) {
            return await response.json();
        }

        console.error('Error en GET:', response.status);
        return null;
    } catch (error) {
        console.error('Error en authGet:', error);
        return null;
    }
}

/**
 * Helper para hacer peticiones POST autenticadas
 * @param {string} endpoint - Endpoint relativo
 * @param {Object} body - Datos a enviar
 * @returns {Promise<any>} - Datos de la respuesta o null
 */
export async function authPost(endpoint, body = {}) {
    try {
        const response = await authenticatedFetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(body)
        });

        if (response.ok) {
            return await response.json();
        }

        console.error('Error en POST:', response.status);
        return null;
    } catch (error) {
        console.error('Error en authPost:', error);
        return null;
    }
}

/**
 * Helper para hacer peticiones PATCH autenticadas
 * @param {string} endpoint - Endpoint relativo
 * @param {Object} body - Datos a actualizar
 * @returns {Promise<any>} - Datos de la respuesta o null
 */
export async function authPatch(endpoint, body = {}) {
    try {
        const response = await authenticatedFetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });

        if (response.ok) {
            return await response.json();
        }

        console.error('Error en PATCH:', response.status);
        return null;
    } catch (error) {
        console.error('Error en authPatch:', error);
        return null;
    }
}

