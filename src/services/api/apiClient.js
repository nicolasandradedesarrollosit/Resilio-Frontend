import { 
    getApiUrl, 
    createAuthFetchOptions, 
    handleApiResponse,
    handleAuthError,
    logAuthSuccess,
    logAuthFailure 
} from '../../helpers/authHelpers';

const API_URL = getApiUrl();

// Timeout por defecto para las peticiones (15 segundos)
const DEFAULT_TIMEOUT = 15000;

// Helper para agregar timeout a fetch
async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('La solicitud tardó demasiado tiempo. Verifica tu conexión a internet.');
        }
        throw error;
    }
}

// Helper para verificar la conectividad con el servidor
async function checkServerConnection() {
    try {
        const response = await fetchWithTimeout(`${API_URL}/api/health`, {
            method: 'GET'
        }, 5000);
        return response.ok;
    } catch (error) {
        console.error('Error al verificar conexión con el servidor:', error);
        return false;
    }
}

export async function checkAuthStatus() {
    try {
        const response = await fetchWithTimeout(
            `${API_URL}/api/user-data`, 
            createAuthFetchOptions()
        );

        if (response.ok) {
            const data = await response.json();
            return {
                isAuthenticated: true,
                userId: data.id || null
            };
        }

        return { isAuthenticated: false, userId: null };
    } catch (error) {
        console.error('Error al verificar estado de autenticación:', error);
        handleAuthError(error, 'checkAuthStatus');
        
        // Verificar si es un error de red
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.error('❌ Error de conexión: No se pudo conectar con el servidor');
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        }
        
        return { isAuthenticated: false, userId: null };
    }
}

export async function refreshAccessToken() {
    try {
        const response = await fetchWithTimeout(
            `${API_URL}/api/refresh`, 
            createAuthFetchOptions({ method: 'POST' }),
            10000 // 10 segundos para refresh
        );

        if (response.ok) {
            logAuthSuccess('Token renovado');
            return true;
        }

        logAuthFailure('renovar token', response.status);
        return false;
    } catch (error) {
        console.error('Error al renovar token:', error);
        handleAuthError(error, 'refreshAccessToken');
        return false;
    }
}


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

export async function authenticatedFetch(url, options = {}) {
    try {
        const fetchOptions = createAuthFetchOptions(options);
        let response = await fetchWithTimeout(url, fetchOptions);

        if (response.status === 401) {
            logAuthFailure('Token expirado, intentando renovar', 401);
            const refreshed = await refreshAccessToken();

            if (refreshed) {
                response = await fetchWithTimeout(url, fetchOptions);
            } else {
                throw new Error('No se pudo renovar la sesión. Por favor, inicia sesión nuevamente.');
            }
        }

        return response;
    } catch (error) {
        // Manejo específico de errores de red
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('ECONNREFUSED')) {
            console.error('❌ Error de red:', error);
            throw new Error('No se pudo conectar con el servidor. Verifica:\n1. Tu conexión a internet\n2. Que el servidor esté ejecutándose\n3. La URL del API en las variables de entorno');
        }
        
        throw error;
    }
}

export async function authGet(endpoint) {
    try {
        const response = await authenticatedFetch(`${API_URL}${endpoint}`, {
            method: 'GET'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        return await handleApiResponse(response);
    } catch (error) {
        console.error(`❌ Error en GET ${endpoint}:`, error.message);
        handleAuthError(error, 'authGet');
        throw error;
    }
}


export async function authPost(endpoint, body = {}) {
    try {
        const response = await authenticatedFetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        return await handleApiResponse(response);
    } catch (error) {
        console.error(`❌ Error en POST ${endpoint}:`, error.message);
        handleAuthError(error, 'authPost');
        throw error;
    }
}


export async function authPatch(endpoint, body = {}) {
    try {
        const response = await authenticatedFetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        return await handleApiResponse(response);
    } catch (error) {
        console.error(`❌ Error en PATCH ${endpoint}:`, error.message);
        handleAuthError(error, 'authPatch');
        throw error;
    }
}


export async function authDelete(endpoint) {
    try {
        const response = await authenticatedFetch(`${API_URL}${endpoint}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        return await handleApiResponse(response);
    } catch (error) {
        console.error(`❌ Error en DELETE ${endpoint}:`, error.message);
        handleAuthError(error, 'authDelete');
        throw error;
    }
}

// Exportar helper para verificar conexión
export { checkServerConnection };
