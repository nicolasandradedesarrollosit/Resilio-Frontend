import { authGet, authPost, authPatch, authDelete } from '../services/api/apiClient';


export async function getEvents() {
    try {
        const data = await authGet('/api/events');
        return data || [];
    } catch (err) {
        throw err;
    }
}


export async function getAdminEvents(limit = 10, offset = 0) {
    try {
        const data = await authGet(`/api/admin/events?limit=${limit}&offset=${offset}`);
        return Array.isArray(data) ? data : [];
    } catch (err) {
        throw err;
    }
}


export async function createEvent(eventData) {
    try {
        const data = await authPost('/api/admin/events', eventData);
        return data;
    } catch (err) {
        throw err;
    }
}


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
        throw err;
    }
}


export async function updateEvent(eventId, updatedData) {
    try {
        const data = await authPatch(`/api/admin/events/${eventId}`, updatedData);
        return data;
    } catch (err) {
        throw err;
    }
}


export async function deleteEvent(eventId) {
    try {
        await authDelete(`/api/admin/events/${eventId}`);
    } catch (err) {
        throw err;
    }
}


export function filterEvents(events, searchTerm) {
    if (!searchTerm) return events;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return events.filter(event => 
        (event.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (event.description?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (event.location?.toLowerCase() || '').includes(lowerSearchTerm)
    );
}


export function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}


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


export function createImagePreview(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}