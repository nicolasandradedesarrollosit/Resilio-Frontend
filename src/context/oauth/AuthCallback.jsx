import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendUserData from './AuthSendSessionData';
import LoadingScreen from '../../view/components/others/LoadingScreen';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Verificar si ya hay una sesión activa usando cookies
        setLoadingStep('Verificando sesión...');
        
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
          method: 'GET',
          credentials: 'include', // Envía las cookies automáticamente
          headers: { 'Content-Type': 'application/json' }
        });

        // Si ya hay una sesión activa, redirigir directamente
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
        
        // Si no hay sesión activa, procesar el callback de Google OAuth
        setLoadingStep('Verificando credenciales...');
        
        await sendUserData();
        
        setLoadingStep('Obteniendo información del usuario...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Ahora el servidor ya envió las cookies, obtener datos del usuario
        setLoadingStep('Cargando datos completos del perfil...');
        
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
          method: 'GET',
          credentials: 'include', // Envía las cookies automáticamente
          headers: { 'Content-Type': 'application/json' }
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