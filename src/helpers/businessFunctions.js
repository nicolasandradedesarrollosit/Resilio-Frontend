import { authGet, authPost, authPatch, authDelete } from '../services/api/apiClient';
import { getApiUrl, createAuthFetchOptions } from './authHelpers';

const API_URL = getApiUrl();


export async function getAdminBusiness(limit = 10, offset = 0) {
    try {
        const data = await authGet(`/api/admin/business?limit=${limit}&offset=${offset}`);
        return data || [];
    } catch (err) {
        throw err;
    }
}


export async function getBusiness() {
    try {
        const data = await authGet('/api/admin/business');
        return data || [];
    } catch (err) {
        throw err;
    }
}


export function filterBusiness(businesses, searchTerm) {
    if (!searchTerm.trim()) return businesses;
    
    const term = searchTerm.toLowerCase().trim();
    return businesses.filter(business =>
        business.name?.toLowerCase().includes(term) ||
        business.location?.toLowerCase().includes(term)
    );
}


export async function createBusiness(businessData) {
    try {
        const data = await authPost('/api/admin/business', businessData);
        return data;
    } catch (err) {
        throw err;
    }
}


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
        throw err;
    }
}


export async function updateBusiness(businessId, businessData) {
    try {
        const data = await authPatch(`/api/admin/business/${businessId}`, businessData);
        return data;
    } catch (err) {
        throw err;
    }
}


export async function deleteBusiness(businessId) {
    try {
        const data = await authDelete(`/api/admin/business/${businessId}`);
        return data;
    } catch (err) {
        throw err;
    }
}