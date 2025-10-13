const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * @returns {Promise<{isAuthenticated: boolean, userId: string|null}>}
 */
export async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/api/user-data`, {
            method: 'GET',
            credentials: 'include', 
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
 * @returns {Promise<boolean>} 
 */
export async function refreshAccessToken() {
    try {
        const response = await fetch(`${API_URL}/api/refresh`, {
            method: 'POST',
            credentials: 'include', 
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
 * @returns {Promise<boolean>} 
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
 * @param {string} url 
 * @param {Object} options 
 * @returns {Promise<Response>} 
 */
export async function authenticatedFetch(url, options = {}) {
    const fetchOptions = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    let response = await fetch(url, fetchOptions);

    if (response.status === 401) {
        console.log('Token expirado, intentando renovar...');
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            response = await fetch(url, fetchOptions);
        }
    }

    return response;
}

/**
 * @param {string} endpoint
 * @returns {Promise<any>} 
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
 * @param {string} endpoint
 * @param {Object} body 
 * @returns {Promise<any>} 
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
 * @param {string} endpoint 
 * @param {Object} body 
 * @returns {Promise<any>} 
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

