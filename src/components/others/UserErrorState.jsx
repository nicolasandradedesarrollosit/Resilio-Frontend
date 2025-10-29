import React from 'react';


function UserErrorState({ 
    error = 'Error al cargar', 
    onRetry 
}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            background: 'radial-gradient(1200px 800px at 10% -10%, rgba(124, 58, 237, 0.20), transparent 60%), radial-gradient(1000px 900px at 110% 10%, rgba(79, 70, 229, 0.18), transparent 60%), #0b1022',
            color: '#f8fafc',
            padding: '2rem'
        }}>
            <div style={{
                background: 'rgba(15, 23, 42, 0.9)',
                padding: '3rem',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                maxWidth: '500px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1.5rem',
                    background: 'linear-gradient(135deg, #fecaca, #ef4444)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                        <path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <h2 style={{ 
                    marginBottom: '1rem', 
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#f8fafc'
                }}>
                    {error}
                </h2>
                <p style={{ 
                    color: '#94a3b8', 
                    textAlign: 'center',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    No pudimos cargar la información. Por favor, intenta nuevamente.
                </p>
                {onRetry && (
                    <button 
                        onClick={onRetry}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 24px rgba(139, 92, 246, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
                        }}
                    >
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    );
}

export default UserErrorState;
