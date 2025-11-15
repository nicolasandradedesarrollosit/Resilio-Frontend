import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendUserDataToBackend } from '../../services/authService';
import LoadingScreen from '../others/LoadingScreen';
import { AuthContext } from '../context/AuthContextOauth';
import { fetchUserData } from '../../helpers/userFunctions';
import { handleAuthError } from '../../helpers/authHelpers';


const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};


const getDeviceConfig = () => {
  const isMobile = isMobileDevice();
  return {
    isMobile,
    initialWait: isMobile ? 5000 : 3000,
    maxRetries: isMobile ? 8 : 5
  };
};


const redirectByRole = (role, navigate) => {
  const destination = role === 'admin' ? '/main/admin' : '/main/user';
  navigate(destination, { state: { fromApp: true }, replace: true });
};


const checkExistingSession = async () => {
  try {
    const userData = await fetchUserData();
    if (userData) {
      console.log('Sesión existente encontrada:', userData);
    }
    return userData;
  } catch (error) {
    handleAuthError(error, 'Verificación de sesión existente');
    return null;
  }
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('Procesando autenticación...');
  const { refreshUserData } = useContext(AuthContext);

  useEffect(() => {
    let timeoutId;
    let isMounted = true; // Flag para prevenir actualizaciones después de desmontar
    
    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (errorParam) {
          if (!isMounted) return;
          
          if (errorParam === 'access_denied' || errorDescription?.includes('cancel')) {
            setError('Has cancelado el inicio de sesión con Google.');
          } else {
            setError('Error al autenticar con Google. Por favor, intenta nuevamente.');
          }
          
          setTimeout(() => {
            if (isMounted) navigate('/log-in', { replace: true });
          }, 2000);
          return;
        }
        
        const { isMobile, initialWait } = getDeviceConfig();
        
        // Timeout de 30 segundos
        timeoutId = setTimeout(() => {
          if (!isMounted) return;
          setError('La autenticación está tomando más tiempo del esperado. Por favor, intenta nuevamente.');
          setTimeout(() => {
            if (isMounted) navigate('/log-in', { replace: true });
          }, 2000);
        }, 30000);

        if (!isMounted) return;
        setLoadingStep('Verificando sesión...');
        const existingSession = await checkExistingSession();
        
        if (existingSession) {
          if (!isMounted) return;
          setLoadingStep('Redirigiendo a tu cuenta...');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (timeoutId) clearTimeout(timeoutId);
          if (!isMounted) return;
          
          redirectByRole(existingSession.role, navigate);
          return;
        }
        
        if (!isMounted) return;
        setLoadingStep('Verificando credenciales con Google...');
        
        const authResult = await sendUserDataToBackend();
        
        if (!isMounted) return;
        setLoadingStep('Estableciendo sesión segura...');
        await new Promise(resolve => setTimeout(resolve, initialWait));
        
        if (!isMounted) return;
        setLoadingStep('Cargando tu perfil...');
        
        // Refrescar los datos del usuario en el contexto
        await refreshUserData();
        
        // Pequeña pausa para asegurar que los datos se propaguen
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (timeoutId) clearTimeout(timeoutId);
        if (!isMounted) return;

        // Usar el rol del resultado de autenticación si está disponible
        const userRole = authResult?.role || 'user';
        redirectByRole(userRole, navigate);
        
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (!isMounted) return;
        
        handleAuthError(err, 'AuthCallback');
        console.error('Error en AuthCallback:', err);
        setError(err.message || 'Error al procesar el inicio de sesión. Por favor, intenta nuevamente.');
        setTimeout(() => {
          if (isMounted) navigate('/log-in', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
    
    return () => {
      isMounted = false;
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