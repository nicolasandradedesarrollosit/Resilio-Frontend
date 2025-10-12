import React from 'react';
import '../../../styles/others/loadingScreen.css';

function LoadingScreen({ message = "Cargando...", subtitle = null }) {
    return (
        <div className="loading-screen-overlay">
            <div className="loading-screen-container">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <svg 
                        className="spinner-icon" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        width="60" 
                        height="60"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                </div>
                
                <h2 className="loading-title">{message}</h2>
                
                {subtitle && (
                    <p className="loading-subtitle">{subtitle}</p>
                )}
                
                <div className="loading-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>
        </div>
    );
}

export default LoadingScreen;
