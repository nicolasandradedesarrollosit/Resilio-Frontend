export async function getBannerData() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/banner`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos del banner');
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('❌ Error en getBannerData:', err);
        throw err;
    }
}