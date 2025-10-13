import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendUserData from './AuthSendSessionData';
import LoadingScreen from '../../view/components/others/LoadingScreen';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('Procesando autenticación...');

  useEffect(() => {
    let timeoutId;
    
    const handleAuthCallback = async () => {
      try {
        timeoutId = setTimeout(() => {
          console.error('⏱️ Timeout: Autenticación tomó demasiado tiempo');
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
        
        setLoadingStep('Verificando credenciales con Google...');
        
        const authResult = await sendUserData();
        console.log('✅ Autenticación con Google exitosa');
        
        setLoadingStep('Estableciendo sesión segura...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setLoadingStep('Cargando tu perfil...');
        
        let retries = 0;
        const maxRetries = 3;
        let userData = null;

        while (retries < maxRetries && !userData) {
          try {
            console.log(`Intento ${retries + 1} de obtener datos del usuario...`);
            
            response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });

            console.log(`Response status: ${response.status}`);

            if (response.ok) {
              const result = await response.json();
              console.log('Datos recibidos:', result);
              
              if (result.ok && result.data) {
                userData = result.data;
                console.log('✅ Datos del usuario cargados correctamente');
                break;
              }
            } else {
              const errorText = await response.text();
              console.error(`❌ Error ${response.status}:`, errorText);
            }
          } catch (fetchError) {
            console.error(`❌ Error en intento ${retries + 1}:`, fetchError);
          }

          retries++;
          if (retries < maxRetries) {
            const waitTime = 500 * retries; // Reducido de 800ms para móviles
            console.log(`⏳ Esperando ${waitTime}ms antes del siguiente intento...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }

        if (!userData) {
          throw new Error('No se pudieron cargar los datos del usuario después de ' + maxRetries + ' intentos');
        }

        const userRole = userData.role;
        console.log('Rol del usuario:', userRole);

        setLoadingStep('Preparando tu experiencia...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Reducido de 800ms

        if (userRole === 'admin') {
          navigate('/main/admin', { state: { fromApp: true }, replace: true });
        } else {
          navigate('/main/user', { state: { fromApp: true }, replace: true });
        }
        
        if (timeoutId) clearTimeout(timeoutId);
        
      } catch (err) {
        console.error('❌ Error en callback:', err);
        if (timeoutId) clearTimeout(timeoutId);
        setError(err.message || 'Error al procesar el inicio de sesión. Por favor, intenta nuevamente.');
        setTimeout(() => navigate('/log-in', { replace: true }), 3000);
      }
    };

    handleAuthCallback();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
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