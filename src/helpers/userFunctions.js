import { authGet } from '../services/api/apiClient';
import { extractUserData, handleAuthError } from './authHelpers';


export async function fetchUserData() {
    try {
        const result = await authGet('/api/user-data');
        return extractUserData(result);
    } catch (error) {
        handleAuthError(error, 'fetchUserData');
        return null;
    }
}


export async function getUserData() {
    try {
        const result = await authGet('/api/user-data');
        if (!result) {
            throw new Error('Error al obtener los datos del usuario');
        }
        return result;
    } catch (err) {
        throw err;
    }
}


export async function hasActiveSession() {
    try {
        const userData = await fetchUserData();
        return userData !== null;
    } catch (error) {
        handleAuthError(error, 'hasActiveSession');
        return false;
    }
}