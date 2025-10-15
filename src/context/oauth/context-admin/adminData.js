export function getAdminData(){
    const adminData = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/admin-data`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if(data.ok && data.data){
                return data.data;
            } else {
                throw new Error('Datos de administrador no disponibles');
            }
        })
        .catch(err => {
            console.error('Error cargando datos de administrador:', err);
            throw err;
        }); 
    } 
}