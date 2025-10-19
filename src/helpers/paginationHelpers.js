/**
 * Calcula el rango de elementos mostrados en la página actual
 * @param {number} currentPage - Página actual
 * @param {number} itemsPerPage - Items por página
 * @param {number} totalItems - Total de items en la página
 * @returns {Object} - { start, end }
 */
export function calculatePageRange(currentPage, itemsPerPage, totalItems) {
    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, start + totalItems - 1);
    return { start, end };
}

/**
 * Verifica si puede ir a la página anterior
 * @param {number} currentPage - Página actual
 * @returns {boolean}
 */
export function canGoPrevious(currentPage) {
    return currentPage > 1;
}

/**
 * Verifica si puede ir a la página siguiente
 * @param {number} itemsInPage - Items en la página actual
 * @param {number} itemsPerPage - Items por página
 * @returns {boolean}
 */
export function canGoNext(itemsInPage, itemsPerPage) {
    return itemsInPage === itemsPerPage;
}
