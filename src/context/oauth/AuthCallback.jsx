import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendUserData from './AuthSendSessionData';
import LoadingScreen from '../../view/components/others/LoadingScreen';
import { getValidToken, getUserIdFromToken, isTokenValid, clearToken } from '../../utils/tokenManager';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        let token = localStorage.getItem('access_token');
        
        if (token && isTokenValid(token)) {
          setLoadingStep('Sesión activa detectada...');
          
          const userId = getUserIdFromToken(token);
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.ok && result.data) {
              const userRole = result.data.role;
              
              setLoadingStep('Redirigiendo a tu cuenta...');
              await new Promise(resolve => setTimeout(resolve, 500));
              
              if (userRole === 'admin') {
                navigate('/main/admin', { state: { fromApp: true }, replace: true });
              } else {
                navigate('/main/user', { state: { fromApp: true }, replace: true });
              }
              return;
            }
          }
        } else if (token) {
          // Token inválido o expirado
          clearToken();
          token = null;
        }
        
        setLoadingStep('Verificando credenciales...');
        
        await sendUserData();
        
        setLoadingStep('Obteniendo información del usuario...');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No se pudo obtener el token de autenticación');
        }

        const userId = getUserIdFromToken(token);
        setLoadingStep('Cargando datos completos del perfil...');
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId })
        });

        if (!response.ok) {
          throw new Error('Error al cargar los datos del usuario');
        }

        const result = await response.json();
        
        if (!result.ok || !result.data) {
          throw new Error('Datos del usuario incompletos');
        }

        const userRole = result.data.role;

        setLoadingStep('Preparando tu experiencia...');
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (userRole === 'admin') {
          navigate('/main/admin', { state: { fromApp: true }, replace: true });
        } else {
          navigate('/main/user', { state: { fromApp: true }, replace: true });
        }
        
      } catch (err) {
        console.error('Error en callback:', err);
        setError('Error al procesar el inicio de sesión. Por favor, intenta nuevamente.');
        setTimeout(() => navigate('/log-in', { replace: true }), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <LoadingScreen 
        message="Error de autenticación" 
        subtitle={error}
      />
    );
  }

  return (
    <LoadingScreen 
      message={loadingStep} 
      subtitle="Iniciando sesión con Google"
    />
  );
};

export default AuthCallback;