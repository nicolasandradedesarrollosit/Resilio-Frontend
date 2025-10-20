import { authGet, authPost, authPatch, authDelete } from '../services/api/apiClient';
import { getApiUrl, createAuthFetchOptions } from './authHelpers';

const API_URL = getApiUrl();

/**
 * Obtiene los datos de negocios con paginación
 * @param {number} limit - Límite de resultados
 * @param {number} offset - Offset para paginación
 * @returns {Promise<Array>}
 */
export async function getAdminBusiness(limit = 10, offset = 0) {
    try {
        const data = await authGet(`/api/admin/business?limit=${limit}&offset=${offset}`);
        return data || [];
    } catch (err) {
        console.error('Error fetching business data:', err);
        throw err;
    }
}

/**
 * Obtiene los datos del negocio
 * @returns {Promise<Array>}
 */
export async function getBusiness() {
    try {
        const data = await authGet('/api/admin/business');
        return data || [];
    } catch (err) {
        console.error('Error fetching business data:', err);
        throw err;
    }
}

/**
 * Filtra negocios por término de búsqueda
 * @param {Array} businesses - Lista de negocios
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array}
 */
export function filterBusiness(businesses, searchTerm) {
    if (!searchTerm.trim()) return businesses;
    
    const term = searchTerm.toLowerCase().trim();
    return businesses.filter(business =>
        business.name?.toLowerCase().includes(term) ||
        business.location?.toLowerCase().includes(term)
    );
}

/**
 * Crea un nuevo negocio
 * @param {Object} businessData - Datos del negocio
 * @returns {Promise<Object>}
 */
export async function createBusiness(businessData) {
    try {
        const data = await authPost('/api/admin/business', businessData);
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

        const response = await fetch(`${API_URL}/api/admin/business/upload-image`, {
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
 * @param {string} businessId - ID del negocio
 * @param {Object} businessData - Datos del negocio
 * @returns {Promise<Object>}
 */
export async function updateBusiness(businessId, businessData) {
    try {
        const data = await authPatch(`/api/admin/business/${businessId}`, businessData);
        return data;
    } catch (err) {
        console.error('Error updating business data:', err);
        throw err;
    }
}

/**
 * Elimina un negocio
 * @param {string} businessId - ID del negocio
 * @returns {Promise<Object>}
 */
export async function deleteBusiness(businessId) {
    try {
        const data = await authDelete(`/api/admin/business/${businessId}`);
        return data;
    } catch (err) {
        console.error('Error deleting business data:', err);
        throw err;
    }
}