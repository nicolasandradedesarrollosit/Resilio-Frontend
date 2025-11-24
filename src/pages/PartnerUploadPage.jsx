import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingScreen from '../components/others/LoadingScreen';
import '../styles/others/partnerUpload.css';

const PartnerUploadPage = () => {
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [showBusinessForm, setShowBusinessForm] = useState(false);
    const [businesses, setBusinesses] = useState([]);

    // Estados del formulario de beneficio
    const [formData, setFormData] = useState({
        name: '',
        q_of_codes: 0,
        discount: 0,
        id_business_discount: ''
    });

    // Estados del formulario de negocio
    const [businessFormData, setBusinessFormData] = useState({
        name: '',
        location: '',
        url_image_business: ''
    });

    useEffect(() => {
        validateToken();
        loadBusinesses();
    }, [token]);

    const validateToken = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/partner/upload/${token}/validate`
            );

            const data = await response.json();

            if (!data.ok) {
                setError(data.message);
            }

        } catch (err) {
            setError('Error al validar el enlace');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadBusinesses = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/partner/upload/${token}/businesses`
            );
            const data = await response.json();
            
            if (data.ok) {
                setBusinesses(Array.isArray(data.data) ? data.data : []);
            } else {
                setBusinesses([]);
            }
        } catch (err) {
            console.error('Error al cargar negocios:', err);
            setBusinesses([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBusinessInputChange = (e) => {
        const { name, value } = e.target;
        setBusinessFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitBenefit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/partner/upload/${token}/benefit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        q_of_codes: parseInt(formData.q_of_codes) || 0,
                        discount: parseInt(formData.discount) || 0,
                        id_business_discount: parseInt(formData.id_business_discount)
                    })
                }
            );

            const data = await response.json();

            if (data.ok) {
                setUploadSuccess(true);
                
                // Resetear formulario
                setFormData({
                    name: '',
                    q_of_codes: 0,
                    discount: 0,
                    id_business_discount: ''
                });

                // Ocultar mensaje de éxito después de 3 segundos
                setTimeout(() => setUploadSuccess(false), 3000);

            } else {
                setError(data.message);
            }

        } catch (err) {
            setError('Error al subir el beneficio');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitBusiness = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/partner/upload/${token}/business`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(businessFormData)
                }
            );

            const data = await response.json();

            if (data.ok) {
                setUploadSuccess(true);
                
                // Agregar el nuevo negocio a la lista
                await loadBusinesses();
                
                // Seleccionar automáticamente el negocio creado
                setFormData(prev => ({
                    ...prev,
                    id_business_discount: data.data.id
                }));
                
                // Volver al formulario de beneficio
                setShowBusinessForm(false);
                
                // Resetear formulario de negocio
                setBusinessFormData({
                    name: '',
                    location: '',
                    url_image_business: ''
                });

                setTimeout(() => setUploadSuccess(false), 3000);

            } else {
                setError(data.message);
            }

        } catch (err) {
            setError('Error al crear el negocio');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <LoadingScreen message="Validando enlace..." />;
    }

    if (error && !businesses.length) {
        return (
            <div className="partner-upload-container">
                <div className="upload-error">
                    <div className="error-icon">⚠️</div>
                    <h2>Enlace no válido</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="partner-upload-container">
            <div className="upload-card">
                <div className="business-header">
                    <h1>🎁 Subir Beneficio</h1>
                    <p className="business-location">Resilio Admin Portal</p>
                </div>

                {uploadSuccess && (
                    <div className="success-banner">
                        ✅ ¡{showBusinessForm ? 'Negocio creado' : 'Beneficio subido'} exitosamente!
                    </div>
                )}

                {!showBusinessForm ? (
                    <form onSubmit={handleSubmitBenefit} className="upload-form">
                        <h2>Información del Beneficio</h2>

                        <div className="form-group">
                            <label>Nombre del beneficio: *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                                placeholder="Ej: 20% de descuento en menú completo"
                            />
                        </div>

                        <div className="form-group">
                            <label>Porcentaje de descuento:</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                max="100"
                                placeholder="Ej: 20"
                            />
                        </div>

                        <div className="form-group">
                            <label>Cantidad de códigos disponibles:</label>
                            <input
                                type="number"
                                name="q_of_codes"
                                value={formData.q_of_codes}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                placeholder="Ej: 100"
                            />
                        </div>

                        <div className="form-group">
                            <label>Negocio: *</label>
                            <select
                                name="id_business_discount"
                                value={formData.id_business_discount}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Selecciona un negocio</option>
                                {Array.isArray(businesses) && businesses.map(business => (
                                    <option key={business.id} value={business.id}>
                                        {business.name}
                                    </option>
                                ))}
                            </select>
                            <button 
                                type="button"
                                className="link-button"
                                onClick={() => setShowBusinessForm(true)}
                            >
                                ¿No está tu negocio? Créalo aquí
                            </button>
                        </div>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Subiendo...' : '📤 Subir Beneficio'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmitBusiness} className="upload-form">
                        <h2>Crear Nuevo Negocio</h2>

                        <div className="form-group">
                            <label>Nombre del negocio: *</label>
                            <input
                                type="text"
                                name="name"
                                value={businessFormData.name}
                                onChange={handleBusinessInputChange}
                                required
                                disabled={isSubmitting}
                                placeholder="Ej: Restaurante El Buen Sabor"
                            />
                        </div>

                        <div className="form-group">
                            <label>Ubicación:</label>
                            <input
                                type="text"
                                name="location"
                                value={businessFormData.location}
                                onChange={handleBusinessInputChange}
                                disabled={isSubmitting}
                                placeholder="Ej: Av. Principal 123, Ciudad"
                            />
                        </div>

                        <div className="form-group">
                            <label>URL de imagen (opcional):</label>
                            <input
                                type="url"
                                name="url_image_business"
                                value={businessFormData.url_image_business}
                                onChange={handleBusinessInputChange}
                                disabled={isSubmitting}
                                placeholder="https://ejemplo.com/logo.jpg"
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowBusinessForm(false)}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creando...' : '🏢 Crear Negocio'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PartnerUploadPage;
