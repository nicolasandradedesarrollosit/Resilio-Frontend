import React, { useEffect } from 'react';
import '../../styles/others/connectionError.css';

const ConnectionError = ({ 
  isVisible, 
  onClose, 
  title = "Error de Conexión",
  message = "No se pudo conectar con el servidor",
  autoHide = false,
  autoHideDelay = 5000
}) => {
  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, isVisible, autoHideDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="connection-error-toast">
      <div className="connection-error-content">
        <div className="connection-error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className="connection-error-text">
          <h4 className="connection-error-title">{title}</h4>
          <p className="connection-error-message">{message}</p>
        </div>
        <button 
          className="connection-error-close" 
          onClick={onClose}
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ConnectionError;
