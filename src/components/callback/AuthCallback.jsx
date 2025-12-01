import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendUserDataToBackend } from '../../services/authService';
import LoadingScreen from '../others/LoadingScreen';
import { AuthContext } from '../context/AuthContextOauth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshUserData, userData } = useContext(AuthContext);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Procesar autenticación con Google
        await sendUserDataToBackend();
        
        // Refrescar datos del usuario
        await refreshUserData();

      } catch (err) {
        console.error('Error en autenticación:', err);
        // Si hay error, redirigir a login
        navigate('/log-in', { replace: true });
      }
    };

    processAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData) {
      const destination = userData.role === 'admin' ? '/main/admin' : '/main/user';
      navigate(destination, { replace: true });
    }
  }, [userData, navigate]);

  return <LoadingScreen message="Iniciando sesión..." />;
};

export default AuthCallback;