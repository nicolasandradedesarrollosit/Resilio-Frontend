import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/main-admin/mainContent.css';

const GenerateUniqueLinkModal = ({ isOpen, onClose }) => {
    const [expirationHours, setExpirationHours] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/unique-links`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    expirationHours: parseInt(expirationHours)
                })
            });

            const data = await response.json();

            if (data.ok) {
                // Copiar automáticamente al portapapeles
                await navigator.clipboard.writeText(data.data.uploadUrl);
                setSuccess(true);
                
                // Cerrar modal después de 2 segundos
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setError(data.message || 'Error al generar enlace');
            }

        } catch (err) {
            setError('Error de conexión');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setExpirationHours(2);
        setError('');
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🔗 Crear Enlace Único</h2>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label>Duración del enlace:</label>
                        <select 
                            value={expirationHours} 
                            onChange={(e) => setExpirationHours(e.target.value)}
                            disabled={isLoading || success}
                            className="admin-select"
                        >
                            <option value="1">1 hora</option>
                            <option value="2">2 horas</option>
                            <option value="6">6 horas</option>
                            <option value="12">12 horas</option>
                            <option value="24">24 horas (1 día)</option>
                            <option value="72">72 horas (3 días)</option>
                        </select>
                        <small className="form-hint">El enlace permitirá subir beneficios hasta que expire</small>
                    </div>

                    {success && (
                        <div className="success-message">
                            ✅ ¡Enlace copiado al portapapeles!
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {!success && (
                        <button 
                            className="admin-users-btn-create" 
                            style={{ width: '100%', marginTop: '16px' }}
                            onClick={handleGenerate}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Generando...' : '🔗 Crear y Copiar Enlace'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default GenerateUniqueLinkModal;
