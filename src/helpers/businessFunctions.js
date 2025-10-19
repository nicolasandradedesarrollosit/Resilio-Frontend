import { authGet, authPost, authPatch, authDelete } from '../services/api/apiClient';
import { getApiUrl, createAuthFetchOptions } from './authHelpers';

const API_URL = getApiUrl();

/**
 * Obtiene los datos del negocio
 * @returns {Promise<Array>}
 */
export async function getBusiness() {
    try {
        const data = await authGet('/api/business');
        return data || [];
    } catch (err) {
        console.error('Error fetching business data:', err);
        throw err;
    }
}

/**
 * Crea un nuevo negocio
 * @param {Object} businessData - Datos del negocio
 * @returns {Promise<Object>}
 */
export async function createBusiness(businessData) {
    try {
        const data = await authPost('/api/business', businessData);
        return data;
    } catch (err) {
        console.error('Error creating business data:', err);
        throw err;
    }
}

/**
 * Sube una imagen del negocio
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise<Object>}
 */
export async function uploadBusinessImage(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${API_URL}/api/business/image`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen del negocio');
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error uploading business image:', err);
        throw err;
    }
}

/**
 * Actualiza los datos del negocio
 * @param {Object} businessData - Datos del negocio
 * @returns {Promise<Object>}
 */
export async function updateBusiness(businessData) {
    try {
        const formData = new FormData();
        for (const key in businessData) {
            formData.append(key, businessData[key]);
        }

        const response = await fetch(`${API_URL}/api/business`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del negocio');
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error updating business data:', err);
        throw err;
    }
}

/**
 * Elimina un negocio
 * @returns {Promise<Object>}
 */
export async function deleteBusiness() {
    try {
        const data = await authDelete('/api/business');
        return data;
    } catch (err) {
        console.error('Error deleting business data:', err);
        throw err;
    }
}