export async function getBenefits(){
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/benefits`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener los beneficios');
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error('Error fetching benefits:', err);
        throw err;
    }
}

export async function createBenefit(benefitData) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/benefits`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(benefitData)
        });

        if (!response.ok) {
            throw new Error('Error al crear el beneficio');
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error('Error creating benefit:', err);
        throw err;
    }
}

export async function updateBenefit(benefitId, updatedData) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/benefits/${benefitId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el beneficio');
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error('Error updating benefit:', err);
        throw err;
    }
}

export async function deleteBenefit(benefitId) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/benefits/${benefitId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el beneficio');
        }
    }
    catch (err){
        console.error('Error deleting benefit:', err);
        throw err;
    }
}