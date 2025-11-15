import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextOauth';
import '../../styles/others/already-logged-in.css';

const AlreadyLoggedIn = () => {
    const navigate = useNavigate();
    const { userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = () => {
        navigate('/main/user', { replace: true });
    };

    const logOutSession = async () => {
        setIsLoading(true);
        try {
            const logOutResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/log-out`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!logOutResponse.ok) {
                throw new Error('Error al cerrar sesión');
            }
            
            // Recargar la página para limpiar el estado
            window.location.href = '/log-in';
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Error al cerrar sesión:', err);
            }
            // En caso de error, igual redirigir al login
            window.location.href = '/log-in';
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="already-logged-in-overlay">
            <div className="already-logged-in-container">
                <div className="already-logged-in-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 512 512">
                        <path fill="#fbbf24" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48Zm0 319.91a20 20 0 1 1 20-20a20 20 0 0 1-20 20Zm21.72-201.15l-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0Z"/>
                    </svg>
                </div>
                <h2 className="already-logged-in-title">Ya tienes una sesión activa</h2>
                <p className="already-logged-in-text">
                    Hola <strong>{userData?.name || 'Usuario'}</strong>, ya has iniciado sesión. 
                    Para acceder al formulario de inicio de sesión, primero debes cerrar tu sesión actual.
                </p>
                <div className="already-logged-in-buttons">
                    <button 
                        onClick={handleCancel} 
                        className="already-logged-in-cancel-button"
                        disabled={isLoading}
                    >
                        <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19 12H5m7 7l-7-7l7-7"/>
                        </svg>
                        Volver a mi cuenta
                    </button>
                    <button 
                        onClick={logOutSession} 
                        className="already-logged-in-logout-button"
                        disabled={isLoading}
                    >
                        <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M160 256a16 16 0 0 1 16-16h144V136c0-32-33.79-56-64-56H104a56.06 56.06 0 0 0-56 56v240a56.06 56.06 0 0 0 56 56h160a56.06 56.06 0 0 0 56-56V272H176a16 16 0 0 1-16-16Zm299.31-11.31l-80-80a16 16 0 0 0-22.62 22.62L409.37 240H320v32h89.37l-52.68 52.69a16 16 0 1 0 22.62 22.62l80-80a16 16 0 0 0 0-22.62Z"/>
                        </svg>
                        {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
                    </button>
                </div>
                {isLoading && (
                    <div className="already-logged-in-loading">
                        <div className="loading-spinner-small">
                            <div className="spinner-ring-small"></div>
                            <div className="spinner-ring-small"></div>
                        </div>
                        <p className="loading-text-small">Procesando...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlreadyLoggedIn;
