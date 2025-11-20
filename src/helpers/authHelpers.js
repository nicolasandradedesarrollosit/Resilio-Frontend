
export const getOAuthRedirectUrl = () => {
    return `${window.location.origin}/auth/callback`;
};


export const isValidSession = (session) => {
    return session && session.user && session.access_token;
};


export const extractUserData = (result) => {
    if (result?.ok && result?.data) {
        return result.data;
    }
    return null;
};


export const handleAuthError = (error, context = 'Authentication') => {
    if (import.meta.env.DEV) {
        console.error(`[${context}] Error:`, {
            message: error.message,
            stack: error.stack,
            context
        });
    } else {
        // En producción, solo loguear el mensaje
        console.error(`[${context}] Error:`, error.message);
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


export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};


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


export const handleApiResponse = async (response) => {
    if (response.ok) {
        try {
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error parseando respuesta JSON:', error);
            handleAuthError(error, 'Parsing JSON response');
            return null;
        }
    }
    
    // Intentar obtener mensaje de error del servidor
    try {
        const errorData = await response.json();
        console.error(`API Error (${response.status}):`, errorData.message || errorData);
        return null;
    } catch (e) {
        console.error(`API Error (${response.status}):`, response.statusText);
        return null;
    }
};


export const logAuthSuccess = (operation) => {
    if (import.meta.env.DEV) {
        console.log(`✅ [Auth Success] ${operation}`);
    }
};


export const logAuthFailure = (operation, status) => {
    if (import.meta.env.DEV) {
        console.warn(`❌ [Auth Failure] ${operation} - Status: ${status}`);
    }
};
