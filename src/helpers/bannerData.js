import { authGet } from '../services/api/apiClient';

/**
 * Obtiene los datos del banner
 * @returns {Promise<Object>}
 */
export async function getBannerData() {
    try {
        const data = await authGet('/api/banner');
        return data;
    } catch (err) {
        console.error('❌ Error en getBannerData:', err);
        throw err;
    }
}