import React from 'react';
import '../../styles/others/errorDisplay.css';

const ErrorDisplay = ({ 
  title = "Error", 
  message = "Ha ocurrido un error", 
  onRetry = null,
  autoRedirect = false,
  redirectText = "Redirigiendo..."
}) => {
  return (
    <div className="error-display-overlay">
      <div className="error-display-container">
        <div className="error-icon-wrapper">
          <svg 
            className="error-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
        </div>
        
        <h2 className="error-title">{title}</h2>
        <p className="error-message">{message}</p>
        
        {autoRedirect && (
          <div className="error-redirect-info">
            <div className="redirect-spinner"></div>
            <span>{redirectText}</span>
          </div>
        )}
        
        {onRetry && !autoRedirect && (
          <button 
            onClick={onRetry}
            className="error-retry-button"
          >
            Intentar nuevamente
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
