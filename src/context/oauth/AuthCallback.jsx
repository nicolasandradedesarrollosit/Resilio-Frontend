import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import sendUserData from './AuthSendSessionData';
import LoadingScreen from '../../view/components/others/LoadingScreen';
import { AuthContext } from './AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('Procesando autenticación...');
  const { refreshUserData } = useContext(AuthContext);

  useEffect(() => {
    let timeoutId;
    
    const handleAuthCallback = async () => {
      try {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const initialWait = isMobile ? 5000 : 3000;
        const maxRetries = isMobile ? 8 : 5;
        
        console.log('📱 Dispositivo:', isMobile ? 'Móvil' : 'Desktop');
        console.log('⏱️ Tiempo de espera inicial:', initialWait, 'ms');
        
        timeoutId = setTimeout(() => {
          setError('La autenticación está tomando más tiempo del esperado. Por favor, intenta nuevamente.');
          setTimeout(() => navigate('/log-in', { replace: true }), 2000);
        }, 30000);

        setLoadingStep('Verificando sesión...');
        
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
          method: 'GET',
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.ok && result.data) {
            const userRole = result.data.role;
            
            console.log('✅ Sesión ya existente, redirigiendo...');
            setLoadingStep('Redirigiendo a tu cuenta...');
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (timeoutId) clearTimeout(timeoutId);
            
            if (userRole === 'admin') {
              navigate('/main/admin', { state: { fromApp: true }, replace: true });
            } else {
              navigate('/main/user', { state: { fromApp: true }, replace: true });
            }
            return;
          }
        }
        
        console.log('🔄 No hay sesión existente, procesando OAuth...');
        setLoadingStep('Verificando credenciales con Google...');
        
        await sendUserData();
        
        console.log('⏳ Esperando establecimiento de cookies...');
        setLoadingStep('Estableciendo sesión segura...');
        await new Promise(resolve => setTimeout(resolve, initialWait));
        
        setLoadingStep('Cargando tu perfil...');
        
        let retries = 0;
        let userData = null;

        while (retries < maxRetries && !userData) {
          try {
            response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
              const result = await response.json();
              
              if (result.ok && result.data) {
                userData = result.data;
                break;
              }
            }
          } catch (fetchError) {
            
          }

          retries++;
          if (retries < maxRetries) {
            const waitTime = 1000 * retries;
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }

        if (!userData) {
          throw new Error('No se pudieron cargar los datos del usuario después de ' + maxRetries + ' intentos');
        }

        const userRole = userData.role;

        setLoadingStep('Preparando tu experiencia...');
        
        await refreshUserData();
        
        await new Promise(resolve => setTimeout(resolve, 500));

        if (timeoutId) clearTimeout(timeoutId);

        if (userRole === 'admin') {
          navigate('/main/admin', { state: { fromApp: true }, replace: true });
        } else {
          navigate('/main/user', { state: { fromApp: true }, replace: true });
        }
        
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        setError(err.message || 'Error al procesar el inicio de sesión. Por favor, intenta nuevamente.');
        setTimeout(() => navigate('/log-in', { replace: true }), 3000);
      }
    };

    handleAuthCallback();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, refreshUserData]);

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