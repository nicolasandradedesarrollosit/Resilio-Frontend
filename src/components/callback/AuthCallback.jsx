import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendUserDataToBackend } from '../../services/authService';
import LoadingScreen from '../others/LoadingScreen';
import ErrorDisplay from '../others/ErrorDisplay';
import { AuthContext } from '../context/AuthContextOauth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('Procesando autenticación...');
  const { refreshUserData } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

    const processAuth = async () => {
      try {
        // 1. Verificar errores OAuth en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (errorParam) {
          const errorMsg = errorParam === 'access_denied' || errorDescription?.includes('cancel')
            ? 'Has cancelado el inicio de sesión con Google.'
            : `Error: ${errorDescription || 'Error al autenticar con Google'}`;
          
          if (isMounted) {
            setError(errorMsg);
            setTimeout(() => navigate('/log-in', { replace: true }), 3000);
          }
          return;
        }

        // 2. Procesar autenticación
        if (isMounted) setLoadingMessage('Verificando con Google...');
        const authResult = await sendUserDataToBackend();

        if (!authResult?.role) {
          throw new Error('No se pudo obtener la información del usuario');
        }

        // 3. Refrescar datos del usuario en contexto
        if (isMounted) setLoadingMessage('Cargando tu perfil...');
        await refreshUserData();

        // 4. Redirigir según rol
        if (isMounted) {
          const destination = authResult.role === 'admin' ? '/main/admin' : '/main/user';
          navigate(destination, { state: { fromApp: true }, replace: true });
        }

      } catch (err) {
        console.error('Error en autenticación:', err);
        
        if (!isMounted) return;

        let errorMessage = 'Error al procesar el inicio de sesión.';
        
        if (err.message) {
          if (err.message.includes('No se encontró sesión') || 
              err.message.includes('Token de acceso no disponible')) {
            errorMessage = 'No se pudo establecer la sesión. Intenta nuevamente.';
          } else if (err.message.includes('expirado')) {
            errorMessage = 'La sesión ha expirado. Por favor, inicia sesión nuevamente.';
          } else if (err.message.includes('Información de usuario incompleta')) {
            errorMessage = 'Faltan datos de autenticación. Intenta nuevamente.';
          } else if (err.message.includes('conectar con el servidor')) {
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
        setTimeout(() => navigate('/log-in', { replace: true }), 3500);
      }
    };

    processAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, refreshUserData]);

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
      message={loadingMessage} 
      subtitle="Iniciando sesión con Google"
    />
  );
};

export default AuthCallback;