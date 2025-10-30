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
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const base64Image = reader.result;

                    const data = await authPost('/api/admin/business/upload-image', {
                        image: base64Image,
                        fileName: imageFile.name,
                        mimeType: imageFile.type
                    });

                    if (!data) {
                        throw new Error('Error al subir la imagen del negocio');
                    }

                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            };

            reader.onerror = () => {
                reject(new Error('Error al leer el archivo'));
            };

            reader.readAsDataURL(imageFile);
        });
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