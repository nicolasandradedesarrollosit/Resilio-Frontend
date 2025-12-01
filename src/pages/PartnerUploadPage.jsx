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

    const [formData, setFormData] = useState({
        name: '',
        q_of_codes: 0,
        discount: 0,
        id_business_discount: ''
    });

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
                
                setFormData({
                    name: '',
                    q_of_codes: 0,
                    discount: 0,
                    id_business_discount: ''
                });

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
                
                await loadBusinesses();
                
                setFormData(prev => ({
                    ...prev,
                    id_business_discount: data.data.id
                }));
                
                setShowBusinessForm(false);
                
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
                    <h1><svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 1024 1024"><path fill="#FFFFFF" d="M992 448H576V320h416q13 0 22.5 9t9.5 23v64q0 13-9.5 22.5T992 448zM640 256H320q-53 0-90.5-37.5T192 128t37.5-90.5T320 0q54 0 80.5 13.5t33.5 40t9.5 56T462 180t50 76v-43.5l1-40.5l3.5-40l6.5-35.5l10.5-33l16-25.5L572 17l30-12l38-5q53 0 90.5 37.5T768 128t-37.5 90.5T640 256zM319.5 64q-26.5 0-45 18.5t-18.5 45t18.5 45.5t45 19t45.5-19t19-45.5t-19-45T319.5 64zm320 0q-26.5 0-45 18.5t-18.5 45t19 45.5t45 19t45-19t19-45.5t-19-45T639.5 64zM448 448H32q-13 0-22.5-9.5T0 416v-64q0-14 9.5-23t22.5-9h416v128zm0 576H128q-27 0-45.5-19T64 960V512h384v512zm512-512v448q0 26-18.5 45t-45.5 19H576V512h384z"/></svg> Subir Beneficio</h1>
                    <p className="business-location">Resilio Admin Portal</p>
                </div>

                {uploadSuccess && (
                    <div className="success-banner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512"><path fill="#FFFFFF" d="M437.3 30L202.7 339.3L64 200.7l-64 64L213.3 478L512 94z"/></svg> ¡{showBusinessForm ? 'Negocio creado' : 'Beneficio subido'} exitosamente!
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 384 384"><path fill="#FFFFFF" d="M341 0q18 0 30.5 12.5T384 43v298q0 18-12.5 30.5T341 384H42q-17 0-29.5-12.5T0 341V43q0-18 12.5-30.5T42 0h299zm0 256V43H42v213h86q0 27 18.5 45.5T192 320t45.5-18.5T256 256h85zm-64-107l-85 86l-85-86h42V85h86v64h42z"/></svg> {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    <span>Subiendo...</span>
                                </>
                            ) : ' Subir Beneficio'}
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 1024 1023"><path fill="#FFFFFF" d="m882 566l142 160l-174 47l46 122l-165-46l-59 174l-158-105l-74 105l-67-128H192l16-116H52l73-173L0 536l95-76L1 324l191-47V128l87 57L324 0l161 135L633 0l32 115l115-64l28 170l152-29l-68 154l131 93zM576 288q0-14-9.5-23t-22.5-9h-64q-13 0-22.5 9t-9.5 23v256q0 13 9.5 22.5T480 576h64q13 0 22.5-9.5T576 544V288zm0 384q0-14-9.5-23t-22.5-9h-64q-13 0-22.5 9t-9.5 23v63q0 14 9.5 23t22.5 9h64q13 0 22.5-9t9.5-23v-63z"/></svg> {error}
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
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="btn-spinner"></div>
                                        <span>Creando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
                                            <path fill="currentColor" d="M992 1024H32q-13 0-22.5-9.5T0 992t9.5-22.5T32 960h32q27 0 45.5-19t18.5-45V64q0-26 19-45t45-19h640q27 0 45.5 19T896 64v832q0 27 19 45.5t45 18.5h32q13 0 22.5 9.5t9.5 22.5t-9.5 22.5t-22.5 9.5zM384 160q0-13-9.5-22.5T352 128h-64q-13 0-22.5 9.5T256 160v64q0 13 9.5 22.5T288 256h64q13 0 22.5-9.5T384 224v-64zm0 192q0-13-9.5-22.5T352 320h-64q-13 0-22.5 9.5T256 352v64q0 13 9.5 22.5T288 448h64q13 0 22.5-9.5T384 416v-64zm0 192q0-13-9.5-22.5T352 512h-64q-13 0-22.5 9.5T256 544v64q0 13 9.5 22.5T288 640h64q13 0 22.5-9.5T384 608v-64zm192-384q0-13-9.5-22.5T544 128h-64q-13 0-22.5 9.5T448 160v64q0 13 9.5 22.5T480 256h64q13 0 22.5-9.5T576 224v-64zm0 192q0-13-9.5-22.5T544 320h-64q-13 0-22.5 9.5T448 352v64q0 13 9.5 22.5T480 448h64q13 0 22.5-9.5T576 416v-64zm0 192q0-13-9.5-22.5T544 512h-64q-13 0-22.5 9.5T448 544v64q0 13 9.5 22.5T480 640h64q13 0 22.5-9.5T576 608v-64zm32 224H416q-13 0-22.5 9.5T384 800v128q0 13 9.5 22.5T416 960h192q13 0 22.5-9.5T640 928V800q0-13-9.5-22.5T608 768zm160-608q0-13-9.5-22.5T736 128h-64q-13 0-22.5 9.5T640 160v64q0 13 9.5 22.5T672 256h64q13 0 22.5-9.5T768 224v-64zm0 192q0-13-9.5-22.5T736 320h-64q-13 0-22.5 9.5T640 352v64q0 13 9.5 22.5T672 448h64q13 0 22.5-9.5T768 416v-64zm0 192q0-13-9.5-22.5T736 512h-64q-13 0-22.5 9.5T640 544v64q0 13 9.5 22.5T672 640h64q13 0 22.5-9.5T768 608v-64z"/>
                                        </svg>
                                        <span>Crear Negocio</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PartnerUploadPage;
