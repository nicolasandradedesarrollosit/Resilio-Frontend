
export function handleFormInputChange(e, setFormData) {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
}


export function resetForm(initialValues, setFormData) {
    setFormData(initialValues);
}


export function validateRequiredFields(formData, requiredFields) {
    const errors = [];
    
    for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`El campo ${field} es requerido`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}
