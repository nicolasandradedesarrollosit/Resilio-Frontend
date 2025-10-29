import { authGet, authPost, authPatch, authDelete } from '../services/api/apiClient';


export async function getAdminBenefits(limit = 10, offset = 0) {
    try {
        const data = await authGet(`/api/admin/benefits?limit=${limit}&offset=${offset}`);
        return data || [];
    } catch (err) {
        throw err;
    }
}


export async function getBenefits() {
    try {
        const data = await authGet('/api/partners');
        return data || [];
    } catch (err) {
        throw err;
    }
}


export function filterBenefits(benefits, searchTerm) {
    if (!searchTerm.trim()) return benefits;
    
    const term = searchTerm.toLowerCase().trim();
    return benefits.filter(benefit =>
        benefit.name?.toLowerCase().includes(term) ||
        benefit.discount?.toString().includes(term) ||
        benefit.q_of_codes?.toString().includes(term)
    );
}


export async function createBenefit(benefitData) {
    try {
        const data = await authPost('/api/admin/benefits', benefitData);
        return data;
    } catch (err) {
        throw err;
    }
}


export async function updateBenefit(benefitId, updatedData) {
    try {
        const data = await authPatch(`/api/admin/benefits/${benefitId}`, updatedData);
        return data;
    } catch (err) {
        throw err;
    }
}


export async function deleteBenefit(benefitId) {
    try {
        await authDelete(`/api/admin/benefits/${benefitId}`);
    } catch (err) {
        throw err;
    }
}