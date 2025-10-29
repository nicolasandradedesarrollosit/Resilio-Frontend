import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendUserDataToBackend } from '../../services/authService';
import LoadingScreen from '../others/LoadingScreen';
import { AuthContext } from '../context/AuthContextOauth';
import { fetchUserData, getUserData } from '../../helpers/userFunctions';
import { extractUserData, handleAuthError } from '../../helpers/authHelpers';


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


const fetchUserDataWithRetries = async (maxRetries) => {
  let retries = 0;
  let userData = null;

  while (retries < maxRetries && !userData) {
    try {
      const result = await getUserData();
      userData = extractUserData(result);
      
      if (userData) {
        break;
      }
    } catch (fetchError) {
      handleAuthError(fetchError, 'Reintento de obtención de datos');
    }

    retries++;
    if (retries < maxRetries) {
      const waitTime = 1000 * retries;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  return userData;
};


const checkExistingSession = async () => {
  try {
    const userData = await fetchUserData();
    if (userData) {
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
    
    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (errorParam) {
          if (errorParam === 'access_denied' || errorDescription?.includes('cancel')) {
            setError('Has cancelado el inicio de sesión con Google.');
          } else {
            setError('Error al autenticar con Google. Por favor, intenta nuevamente.');
          }
          
          setTimeout(() => navigate('/log-in', { replace: true }), 2000);
          return;
        }
        
        const { isMobile, initialWait, maxRetries } = getDeviceConfig();
        
        timeoutId = setTimeout(() => {
          setError('La autenticación está tomando más tiempo del esperado. Por favor, intenta nuevamente.');
          setTimeout(() => navigate('/log-in', { replace: true }), 2000);
        }, 30000);

        setLoadingStep('Verificando sesión...');
        const existingSession = await checkExistingSession();
        
        if (existingSession) {
          setLoadingStep('Redirigiendo a tu cuenta...');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (timeoutId) clearTimeout(timeoutId);
          
          redirectByRole(existingSession.role, navigate);
          return;
        }
        
        setLoadingStep('Verificando credenciales con Google...');
        
        await sendUserDataToBackend();
        
        setLoadingStep('Estableciendo sesión segura...');
        await new Promise(resolve => setTimeout(resolve, initialWait));
        
        setLoadingStep('Cargando tu perfil...');
        const userData = await fetchUserDataWithRetries(maxRetries);

        if (!userData) {
          throw new Error('No se pudieron cargar los datos del usuario después de ' + maxRetries + ' intentos');
        }

        setLoadingStep('Preparando tu experiencia...');
        await refreshUserData();
        await new Promise(resolve => setTimeout(resolve, 500));

        if (timeoutId) clearTimeout(timeoutId);

        redirectByRole(userData.role, navigate);
        
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        handleAuthError(err, 'AuthCallback');
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