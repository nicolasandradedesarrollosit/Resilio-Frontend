/**
 * Maneja el cambio de input en un formulario
 * @param {Event} e - Evento del input
 * @param {Function} setFormData - Función para actualizar el estado del formulario
 */
export function handleFormInputChange(e, setFormData) {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
}

/**
 * Resetea un formulario a sus valores iniciales
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function} setFormData - Función para actualizar el estado del formulario
 */
export function resetForm(initialValues, setFormData) {
    setFormData(initialValues);
}

/**
 * Valida campos requeridos del formulario
 * @param {Object} formData - Datos del formulario
 * @param {Array} requiredFields - Campos requeridos
 * @returns {Object} - { valid: boolean, errors: Array }
 */
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
