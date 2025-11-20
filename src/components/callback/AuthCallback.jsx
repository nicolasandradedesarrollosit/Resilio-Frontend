import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendUserDataToBackend } from '../../services/authService';
import LoadingScreen from '../others/LoadingScreen';
import ErrorDisplay from '../others/ErrorDisplay';
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
    initialWait: isMobile ? 2500 : 1500,
    maxRetries: isMobile ? 8 : 5,
    timeout: 35000 // 35 segundos timeout
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

  const handleAuthCallback = useCallback(async () => {
    let timeoutId;
    let isMounted = true;
    
    try {
      // Verificar errores de OAuth en la URL
      const urlParams = new URLSearchParams(window.location.search);
      const errorParam = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (errorParam) {
        if (!isMounted) return;
        
        let errorMessage = 'Error al autenticar con Google.';
        
        if (errorParam === 'access_denied' || errorDescription?.includes('cancel')) {
          errorMessage = 'Has cancelado el inicio de sesión con Google.';
        } else if (errorDescription) {
          errorMessage = `Error: ${errorDescription}`;
        }
        
        setError(errorMessage);
        
        setTimeout(() => {
          if (isMounted) navigate('/log-in', { replace: true });
        }, 2500);
        return;
      }
      
      const { initialWait, timeout } = getDeviceConfig();
      
      // Configurar timeout para la autenticación
      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        setError('La autenticación está tomando más tiempo del esperado. Por favor, intenta nuevamente.');
        setTimeout(() => {
          if (isMounted) navigate('/log-in', { replace: true });
        }, 2500);
      }, timeout);

      // Paso 1: Verificar si ya hay una sesión activa
      if (!isMounted) return;
      setLoadingStep('Verificando sesión...');
      
      const existingSession = await checkExistingSession();
      
      if (existingSession && existingSession.role) {
        if (!isMounted) return;
        setLoadingStep('✓ Sesión encontrada');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (timeoutId) clearTimeout(timeoutId);
        if (!isMounted) return;
        
        redirectByRole(existingSession.role, navigate);
        return;
      }
      
      // Paso 2: Procesar autenticación con Google
      if (!isMounted) return;
      setLoadingStep('Verificando credenciales con Google...');
      
      const authResult = await sendUserDataToBackend();
      
      if (!authResult || !authResult.role) {
        throw new Error('No se pudo obtener la información del usuario');
      }
      
      // Paso 3: Establecer sesión
      if (!isMounted) return;
      setLoadingStep('Estableciendo sesión segura...');
      await new Promise(resolve => setTimeout(resolve, initialWait));
      
      // Paso 4: Cargar perfil de usuario
      if (!isMounted) return;
      setLoadingStep('Cargando tu perfil...');
      
      try {
        await refreshUserData();
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (refreshError) {
        console.warn('Error al refrescar datos del usuario:', refreshError);
        // Continuar de todas formas si el refreshUserData falla
      }

      if (timeoutId) clearTimeout(timeoutId);
      if (!isMounted) return;

      // Paso 5: Redirigir según el rol
      setLoadingStep('✓ Inicio de sesión exitoso');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!isMounted) return;
      redirectByRole(authResult.role, navigate);
      
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      if (!isMounted) return;
      
      handleAuthError(err, 'AuthCallback');
      console.error('Error en AuthCallback:', err);
      
      // Determinar mensaje de error específico
      let errorMessage = 'Error al procesar el inicio de sesión.';
      
      if (err.message) {
        if (err.message.includes('No se encontró sesión')) {
          errorMessage = 'No se pudo establecer la sesión. Intenta iniciar sesión nuevamente.';
        } else if (err.message.includes('expirado')) {
          errorMessage = 'La sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (err.message.includes('incompleta')) {
          errorMessage = 'Faltan datos de autenticación. Intenta nuevamente.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      setTimeout(() => {
        if (isMounted) navigate('/log-in', { replace: true });
      }, 3500);
    }
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, refreshUserData]);

  useEffect(() => {
    handleAuthCallback();
  }, [handleAuthCallback]);

  if (error) {
    return (
      <ErrorDisplay 
        title="Error de autenticación" 
        message={error}
        autoRedirect={true}
        redirectText="Redirigiendo al inicio de sesión..."
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