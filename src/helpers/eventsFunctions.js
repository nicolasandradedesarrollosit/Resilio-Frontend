import { authGet, authPost, authPatch, authDelete } from '../services/api/apiClient';

/**
 * Obtiene todos los eventos
 * @returns {Promise<Array>} 
 */
export async function getEvents() {
    try {
        const data = await authGet('/api/events');
        return data || [];
    } catch (err) {
        console.error('Error fetching events:', err);
        throw err;
    }
}

/**
 * Obtiene eventos paginados (admin)
 * @param {number} limit - Límite de eventos por página
 * @param {number} offset - Offset para paginación
 * @returns {Promise<Array>} 
 */
export async function getAdminEvents(limit = 10, offset = 0) {
    try {
        const data = await authGet(`/api/admin/events?limit=${limit}&offset=${offset}`);
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error('Error fetching admin events:', err);
        throw err;
    }
}

/**
 * Crea un nuevo evento
 * @param {Object} eventData - Datos del evento
 * @returns {Promise<Object>}
 */
export async function createEvent(eventData) {
    try {
        const data = await authPost('/api/admin/events', eventData);
        return data;
    } catch (err) {
        console.error('Error creating event:', err);
        throw err;
    }
}

/**
 * Sube una imagen para un evento
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise<Object>} - URL de la imagen subida
 */
export async function uploadEventImage(imageFile) {
    try {
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const base64Image = reader.result;
                    
                    const data = await authPost('/api/admin/events/upload-image', {
                        image: base64Image,
                        fileName: imageFile.name,
                        mimeType: imageFile.type
                    });

                    if (!data) {
                        throw new Error('Error al subir la imagen');
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
        console.error('Error uploading event image:', err);
        throw err;
    }
}

/**
 * Actualiza un evento existente
 * @param {string} eventId - ID del evento
 * @param {Object} updatedData - Datos actualizados
 * @returns {Promise<Object>}
 */
export async function updateEvent(eventId, updatedData) {
    try {
        const data = await authPatch(`/api/admin/events/${eventId}`, updatedData);
        return data;
    } catch (err) {
        console.error('Error updating event:', err);
        throw err;
    }
}

/**
 * Elimina un evento
 * @param {string} eventId - ID del evento
 * @returns {Promise<void>}
 */
export async function deleteEvent(eventId) {
    try {
        await authDelete(`/api/admin/events/${eventId}`);
    } catch (err) {
        console.error('Error deleting event:', err);
        throw err;
    }
}

/**
 * Filtra eventos por término de búsqueda
 * @param {Array} events - Lista de eventos
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} - Eventos filtrados
 */
export function filterEvents(events, searchTerm) {
    if (!searchTerm) return events;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return events.filter(event => 
        (event.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (event.description?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (event.location?.toLowerCase() || '').includes(lowerSearchTerm)
    );
}

/**
 * Formatea una fecha para input datetime-local
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

/**
 * Valida un archivo de imagen
 * @param {File} file - Archivo a validar
 * @returns {Object} - { valid: boolean, error: string }
 */
export function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Solo se permiten archivos JPG, JPEG y WEBP' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'El archivo no debe superar los 5MB' };
    }

    return { valid: true, error: null };
}

/**
 * Crea una vista previa de imagen desde un archivo
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL de vista previa
 */
export function createImagePreview(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}