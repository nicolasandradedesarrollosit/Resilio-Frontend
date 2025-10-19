import { 
    getApiUrl, 
    createAuthFetchOptions, 
    handleApiResponse,
    handleAuthError,
    logAuthSuccess,
    logAuthFailure 
} from './authHelpers';

const API_URL = getApiUrl();

/**
 * @returns {Promise<{isAuthenticated: boolean, userId: string|null}>}
 */
export async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/api/user-data`, createAuthFetchOptions());

        if (response.ok) {
            const data = await response.json();
            return {
                isAuthenticated: true,
                userId: data.id || null
            };
        }

        return { isAuthenticated: false, userId: null };
    } catch (error) {
        handleAuthError(error, 'checkAuthStatus');
        return { isAuthenticated: false, userId: null };
    }
}

/**
 * @returns {Promise<boolean>} 
 */
export async function refreshAccessToken() {
    try {
        const response = await fetch(
            `${API_URL}/api/refresh`, 
            createAuthFetchOptions({ method: 'POST' })
        );

        if (response.ok) {
            logAuthSuccess('Token renovado');
            return true;
        }

        logAuthFailure('renovar token', response.status);
        return false;
    } catch (error) {
        handleAuthError(error, 'refreshAccessToken');
        return false;
    }
}

/**
 * @returns {Promise<boolean>} 
 */
export async function logout() {
    try {
        const response = await fetch(
            `${API_URL}/api/log-out`, 
            createAuthFetchOptions({ method: 'POST' })
        );

        if (response.ok) {
            logAuthSuccess('Sesión cerrada');
            return true;
        }

        logAuthFailure('cerrar sesión', response.status);
        return false;
    } catch (error) {
        handleAuthError(error, 'logout');
        return false;
    }
}

/**
 * @param {string} url 
 * @param {Object} options 
 * @returns {Promise<Response>} 
 */
export async function authenticatedFetch(url, options = {}) {
    const fetchOptions = createAuthFetchOptions(options);
    let response = await fetch(url, fetchOptions);

    if (response.status === 401) {
        logAuthFailure('Token expirado, intentando renovar', 401);
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

        return await handleApiResponse(response);
    } catch (error) {
        handleAuthError(error, 'authGet');
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

        return await handleApiResponse(response);
    } catch (error) {
        handleAuthError(error, 'authPost');
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

        return await handleApiResponse(response);
    } catch (error) {
        handleAuthError(error, 'authPatch');
        return null;
    }
}

