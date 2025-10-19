export async function getBusiness() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del negocio');
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error('Error fetching business data:', err);
        throw err;
    }
}

export async function createBusiness(businessData) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(businessData)
        });

        if (!response.ok) {
            throw new Error('Error al crear los datos del negocio');
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error('Error creating business data:', err);
        throw err;
    }
}

export async function uploadBusinessImage(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business/image`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen del negocio');
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error('Error uploading business image:', err);
        throw err;
    }
}

export async function updateBusiness(businessData) {
    try {
        const formData = new FormData();
        for (const key in businessData) {
            formData.append(key, businessData[key]);
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del negocio');
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error('Error updating business data:', err);
        throw err;
    }
}

export async function deleteBusiness() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar los datos del negocio');
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error('Error deleting business data:', err);
        throw err;
    }
}