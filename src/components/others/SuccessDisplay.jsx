import React from 'react';
import '../../styles/others/successDisplay.css';

const SuccessDisplay = ({ 
  title = "¡Éxito!", 
  message = "Operación completada exitosamente",
  showRedirect = false,
  redirectText = "Redirigiendo..."
}) => {
  return (
    <div className="success-display-overlay">
      <div className="success-display-container">
        <div className="success-icon-wrapper">
          <svg 
            className="success-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path 
              d="M8 12L11 15L16 9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h2 className="success-title">{title}</h2>
        <p className="success-message">{message}</p>
        
        {showRedirect && (
          <div className="success-redirect-info">
            <div className="success-spinner"></div>
            <span>{redirectText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessDisplay;
