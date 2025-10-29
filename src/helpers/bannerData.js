import { authGet } from '../services/api/apiClient';


export async function getBannerData() {
    try {
        const data = await authGet('/api/banner');
        return data;
    } catch (err) {
        throw err;
    }
}