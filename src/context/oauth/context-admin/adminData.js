export async function getAdminData() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-data`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

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