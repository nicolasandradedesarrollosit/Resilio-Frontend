import { jwtDecode } from 'jwt-decode';

/**
 * Verifica si el token es válido y no ha expirado
 * @param {string} token - Token JWT
 * @returns {boolean} - True si es válido, false si no
 */
export function isTokenValid(token) {
    if (!token) return false;
    
    try {
        const decoded = jwtDecode(token);
        
        // Si no tiene exp, el token es inválido
        if (!decoded.exp) {
            console.warn('Token sin fecha de expiración');
            return false;
        }
        
        const currentTime = Date.now() / 1000;
        const isValid = decoded.exp > currentTime;
        
        if (!isValid) {
            console.log('Token expirado');
        }
        
        return isValid;
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return false;
    }
}

/**
 * Obtiene el userId del token
 * @param {string} token - Token JWT
 * @returns {string|null} - userId o null
 */
export function getUserIdFromToken(token) {
    if (!token) return null;
    
    try {
        const decoded = jwtDecode(token);
        return decoded.sub || null;
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
}

/**
 * Intenta renovar el token usando el refresh token
 * @returns {Promise<string|null>} - Nuevo access token o null
 */
export async function refreshAccessToken() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/refresh`, {
            method: 'POST',
            credentials: 'include', // Importante: envía las cookies
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error al renovar token:', response.status);
            return null;
        }

        const result = await response.json();
        
        if (result.ok && result.data?.accessToken) {
            const newToken = result.data.accessToken;
            localStorage.setItem('access_token', newToken);
            console.log('Token renovado exitosamente');
            return newToken;
        }

        return null;
    } catch (error) {
        console.error('Error en refreshAccessToken:', error);
        return null;
    }
}

/**
 * Obtiene un token válido, renovándolo si es necesario
 * @returns {Promise<string|null>} - Token válido o null
 */
export async function getValidToken() {
    let token = localStorage.getItem('access_token');
    
    // Si no hay token, intentar renovar
    if (!token) {
        console.log('No hay token, intentando renovar...');
        token = await refreshAccessToken();
        return token;
    }
    
    // Si el token es válido, retornarlo
    if (isTokenValid(token)) {
        return token;
    }
    
    // Si el token expiró o es inválido, intentar renovar
    console.log('Token inválido o expirado, intentando renovar...');
    token = await refreshAccessToken();
    
    return token;
}

/**
 * Limpia el token del localStorage
 */
export function clearToken() {
    localStorage.removeItem('access_token');
}

/**
 * Verifica si el token expirará pronto (en los próximos 2 minutos)
 * @param {string} token - Token JWT
 * @returns {boolean} - True si expira pronto
 */
export function willExpireSoon(token) {
    if (!token) return true;
    
    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) return true;
        
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = decoded.exp - currentTime;
        
        // Si expira en menos de 2 minutos (120 segundos)
        return timeUntilExpiry < 120;
    } catch (error) {
        return true;
    }
}
