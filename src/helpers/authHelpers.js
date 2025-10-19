/**
 * @returns {string} URL completa de callback
 */
export const getOAuthRedirectUrl = () => {
    return `${window.location.origin}/auth/callback`;
};

/**
 * Valida si existe una sesión válida
 * @param {Object} session - Objeto de sesión
 * @returns {boolean} True si la sesión es válida
 */
export const isValidSession = (session) => {
    return session && session.user && session.access_token;
};

/**
 * @param {Object} result - Respuesta del servidor
 * @returns {Object|null} Datos del usuario o null
 */
export const extractUserData = (result) => {
    if (result?.ok && result?.data) {
        return result.data;
    }
    return null;
};

/**
 * @param {Error} error - Error capturado
 * @param {string} context - Contexto donde ocurrió el error
 */
export const handleAuthError = (error, context = 'Authentication') => {
    if (import.meta.env.DEV) {
        console.error(`❌ Error en ${context}:`, error);
    }

};

export const getGoogleOAuthOptions = () => {
    return {
        redirectTo: getOAuthRedirectUrl(),
        queryParams: {
            access_type: 'offline',
            prompt: 'consent',
        }
    };
};

/**
 * Obtiene la URL base de la API
 * @returns {string} URL de la API
 */
export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

/**
 * Crea opciones de fetch autenticadas con cookies
 * @param {Object} options - Opciones adicionales de fetch
 * @returns {Object} Opciones de fetch configuradas
 */
export const createAuthFetchOptions = (options = {}) => {
    return {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
};

/**
 * Maneja respuestas del servidor y extrae JSON
 * @param {Response} response - Respuesta del servidor
 * @returns {Promise<any|null>} Datos JSON o null
 */
export const handleApiResponse = async (response) => {
    if (response.ok) {
        try {
            return await response.json();
        } catch (error) {
            handleAuthError(error, 'Parsing JSON response');
            return null;
        }
    }
    
    console.error('Error en respuesta de API:', response.status);
    return null;
};

/**
 * Registra el éxito de una operación de autenticación
 * @param {string} operation - Nombre de la operación
 */
export const logAuthSuccess = (operation) => {
    if (import.meta.env.DEV) {
        console.log(`✅ ${operation} exitoso`);
    }
};

/**
 * Registra el fallo de una operación de autenticación
 * @param {string} operation - Nombre de la operación
 * @param {number} status - Código de estado HTTP
 */
export const logAuthFailure = (operation, status) => {
    if (import.meta.env.DEV) {
        console.error(`❌ Error en ${operation}:`, status);
    }
};
