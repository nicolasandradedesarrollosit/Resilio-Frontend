import { authGet, authPost, authPatch, authDelete } from '../services/api/apiClient';

/**
 * Obtiene todos los beneficios con paginación
 * @param {number} limit - Límite de resultados
 * @param {number} offset - Offset para paginación
 * @returns {Promise<Array>}
 */
export async function getAdminBenefits(limit = 10, offset = 0) {
    try {
        const data = await authGet(`/api/admin/benefits?limit=${limit}&offset=${offset}`);
        return data || [];
    } catch (err) {
        console.error('Error fetching benefits:', err);
        throw err;
    }
}

/**
 * Obtiene todos los beneficios
 * @returns {Promise<Array>}
 */
export async function getBenefits() {
    try {
        const data = await authGet('/api/partners');
        return data || [];
    } catch (err) {
        console.error('Error fetching benefits:', err);
        throw err;
    }
}

/**
 * Filtra beneficios por término de búsqueda
 * @param {Array} benefits - Lista de beneficios
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array}
 */
export function filterBenefits(benefits, searchTerm) {
    if (!searchTerm.trim()) return benefits;
    
    const term = searchTerm.toLowerCase().trim();
    return benefits.filter(benefit =>
        benefit.name?.toLowerCase().includes(term) ||
        benefit.discount?.toString().includes(term) ||
        benefit.q_of_codes?.toString().includes(term)
    );
}

/**
 * Crea un nuevo beneficio
 * @param {Object} benefitData - Datos del beneficio
 * @returns {Promise<Object>}
 */
export async function createBenefit(benefitData) {
    try {
        const data = await authPost('/api/admin/benefits', benefitData);
        return data;
    } catch (err) {
        console.error('Error creating benefit:', err);
        throw err;
    }
}

/**
 * Actualiza un beneficio existente
 * @param {string} benefitId - ID del beneficio
 * @param {Object} updatedData - Datos actualizados
 * @returns {Promise<Object>}
 */
export async function updateBenefit(benefitId, updatedData) {
    try {
        const data = await authPatch(`/api/admin/benefits/${benefitId}`, updatedData);
        return data;
    } catch (err) {
        console.error('Error updating benefit:', err);
        throw err;
    }
}

/**
 * Elimina un beneficio
 * @param {string} benefitId - ID del beneficio
 * @returns {Promise<void>}
 */
export async function deleteBenefit(benefitId) {
    try {
        await authDelete(`/api/admin/benefits/${benefitId}`);
    } catch (err) {
        console.error('Error deleting benefit:', err);
        throw err;
    }
}