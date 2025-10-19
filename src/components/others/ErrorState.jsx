import React from 'react';
import '../../styles/others/errorState.css';

/**
 * Componente reutilizable para mostrar estados de error
 * @param {string} title - Título del error
 * @param {string} message - Mensaje de error
 * @param {Function} onRetry - Función para reintentar (opcional)
 * @param {string} variant - Variante de estilo: 'inline' | 'fullscreen' (default: 'inline')
 */
function ErrorState({ 
    title = 'Error al cargar', 
    message = 'Ha ocurrido un error', 
    onRetry,
    variant = 'inline'
}) {
    return (
        <div className={`error-state ${variant === 'fullscreen' ? 'error-state-fullscreen' : 'error-state-inline'}`}>
            <div className="error-state-content">
                <div className="error-state-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <h3 className="error-state-title">{title}</h3>
                <p className="error-state-message">{message}</p>
                {onRetry && (
                    <button 
                        onClick={onRetry}
                        className="error-state-button"
                    >
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorState;
