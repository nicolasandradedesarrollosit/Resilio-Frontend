import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendUserData from './AuthSendSessionData';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        await sendUserData();
        navigate('/main/user');
      } catch (err) {
        setError('Error al procesar el inicio de sesión. Por favor, intenta nuevamente.');
        setTimeout(() => navigate('/log-in'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <p style={{ color: '#d32f2f', marginBottom: '20px' }}>{error}</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Redirigiendo al inicio de sesión...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #4285f4',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <p>Finalizando autenticación...</p>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Procesando login con Google...
      </p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AuthCallback;