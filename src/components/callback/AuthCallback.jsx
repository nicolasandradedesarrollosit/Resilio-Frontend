import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendUserDataToBackend } from '../../services/authService';
import LoadingScreen from '../others/LoadingScreen';
import { AuthContext } from '../context/AuthContextOauth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useContext(AuthContext);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Procesar autenticación con Google
        const authResult = await sendUserDataToBackend();
        
        // Refrescar datos del usuario
        await refreshUserData();

        // Redirigir según rol
        const destination = authResult.role === 'admin' ? '/main/admin' : '/main/user';
        navigate(destination, { replace: true });

      } catch (err) {
        console.error('Error en autenticación:', err);
        // Si hay error, redirigir a login
        navigate('/log-in', { replace: true });
      }
    };

    processAuth();
  }, [navigate, refreshUserData]);

  return <LoadingScreen message="Iniciando sesión..." />;
};

export default AuthCallback;