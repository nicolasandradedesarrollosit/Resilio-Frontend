import { authenticatedFetch } from './tokenManager';
import { extractUserData, handleAuthError } from './authHelpers';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * @returns {Promise<Object|null>} 
 */
export async function fetchUserData() {
    try {
        const response = await authenticatedFetch(`${API_URL}/api/user-data`, {
            method: 'GET'
        });

        if (!response.ok) {
            return null;
        }

        const result = await response.json();
        return extractUserData(result);
        
    } catch (error) {
        handleAuthError(error, 'fetchUserData');
        return null;
    }
}

/**
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
export async function getUserData() {
    try {
        const response = await fetch(`${API_URL}/api/user-data`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        const data = await response.json();
        return data;
    }
    catch(err) {
        console.error('Error fetching user data:', err);
        throw err;
    }
}

/**
 * @returns {Promise<boolean>}
 */
export async function hasActiveSession() {
    try {
        const userData = await fetchUserData();
        return userData !== null;
    } catch (error) {
        handleAuthError(error, 'hasActiveSession');
        return false;
    }
}