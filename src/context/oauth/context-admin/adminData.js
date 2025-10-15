async function refreshAccessToken() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            console.log('✅ Token renovado exitosamente');
            return true;
        }

        console.error('❌ Error al renovar token:', response.status);
        return false;
    } catch (error) {
        console.error('❌ Error en refreshAccessToken:', error);
        return false;
    }
}

export async function getAdminData() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        // Si el token expiró, intentar renovarlo
        if (response.status === 401) {
            console.log('🔄 Token expirado, intentando renovar...');
            const refreshed = await refreshAccessToken();
            
            if (refreshed) {
                // Reintentar la petición con el nuevo token
                const retryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (retryResponse.ok) {
                    const data = await retryResponse.json();
                    if (data.ok && data.data) {
                        return data.data;
                    }
                }
            }
            
            // Si no se pudo renovar el token
            throw new Error('Sesión expirada - 401');
        }

        if (!response.ok) {
            throw new Error('Error al cargar los datos del administrador');
        }

        const data = await response.json();
        
        if (data.ok && data.data) {
            return data.data;
        } else {
            throw new Error('Datos de administrador no disponibles');
        }
    } catch (err) {
        console.error('Error cargando datos de administrador:', err);
        throw err;
    }
}