
export function calculatePageRange(currentPage, itemsPerPage, totalItems) {
    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, start + totalItems - 1);
    return { start, end };
}


export function canGoPrevious(currentPage) {
    return currentPage > 1;
}


export function canGoNext(itemsInPage, itemsPerPage) {
    return itemsInPage === itemsPerPage;
}
