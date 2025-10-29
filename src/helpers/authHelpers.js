
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
            return await response.json();
        } catch (error) {
            handleAuthError(error, 'Parsing JSON response');
            return null;
        }
    }
    
    return null;
};


export const logAuthSuccess = (operation) => {
    if (import.meta.env.DEV) {
    }
};


export const logAuthFailure = (operation, status) => {
    if (import.meta.env.DEV) {
    }
};
