import { authGet } from '../services/api/apiClient';

export async function getMyBenefits(userId) {
    try {
        const data = await authGet(`/api/my-benefits/${userId}`);
        return data || [];
    }
    catch (err) {
        throw err;
    }
}