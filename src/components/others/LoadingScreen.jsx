import React from 'react';
import '../../styles/others/loadingScreen.css';

function LoadingScreen({ message = "Cargando...", subtitle = null }) {
    return (
        <div className="loading-screen-overlay">
            <div className="loading-screen-container">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <img 
                        src="/logo-resilio-group.png" 
                        alt="Resilio Logo" 
                        className="spinner-icon"
                        style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain'
                        }}
                    />
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
