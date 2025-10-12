import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import sendUserData from './AuthSendSessionData';
import LoadingScreen from '../../view/components/others/LoadingScreen';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoadingStep('Verificando credenciales...');
        
        // Enviar datos del usuario y obtener el token
        await sendUserData();
        
        setLoadingStep('Obteniendo información del usuario...');
        
        // Esperar un momento para asegurar que el token esté guardado
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No se pudo obtener el token de autenticación');
        }

        // Decodificar el token para obtener el rol
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
        const userRole = decodedToken.role;

        setLoadingStep('Cargando datos completos del perfil...');
        
        // Obtener todos los datos del usuario antes de redirigir
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

        setLoadingStep('Preparando tu experiencia...');
        
        // Esperar un momento para mostrar el mensaje final
        await new Promise(resolve => setTimeout(resolve, 800));

        // Redirigir según el rol
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