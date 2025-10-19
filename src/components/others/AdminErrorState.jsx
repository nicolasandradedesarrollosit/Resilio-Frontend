import React from 'react';

/**
 * Componente reutilizable para mostrar errores en páginas admin
 */
function AdminErrorState({ 
    error = 'Error al cargar los datos', 
    onRetry, 
    onGoToLogin 
}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            background: '#e8e6e1',
            color: '#1a1a1a',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1.5rem',
                    background: 'linear-gradient(135deg, #fecaca, #ef4444)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                        <path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <h2 style={{ 
                    marginBottom: '1rem', 
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1a1a1a'
                }}>
                    Error al cargar
                </h2>
                <p style={{ 
                    color: '#666', 
                    textAlign: 'center',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    {error}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {onGoToLogin && (
                        <button 
                            onClick={onGoToLogin}
                            style={{
                                padding: '0.75rem 2rem',
                                background: 'linear-gradient(135deg, #8f6ddf, #b794f6)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'transform 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Ir al Login
                        </button>
                    )}
                    {onRetry && (
                        <button 
                            onClick={onRetry}
                            style={{
                                padding: '0.75rem 2rem',
                                background: '#f5f5f5',
                                color: '#333',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'transform 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Reintentar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminErrorState;
