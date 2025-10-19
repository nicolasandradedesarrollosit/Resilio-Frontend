import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { AuthContext } from '../context/AuthContextOauth';

function ProtectedRoute({ children, requiredRole = null }) {
    const location = useLocation();
    const { userData, loading: authLoading, isLoggingOut } = useContext(AuthContext);

    // Si está haciendo logout, redirigir inmediatamente sin mostrar loading
    if (isLoggingOut) {
        return <Navigate to="/log-in" replace />;
    }

    // Solo mostrar loading si realmente está cargando y no es un logout
    if (authLoading) {
        return <LoadingScreen message="Verificando acceso..." subtitle="Un momento por favor" />;
    }

    if (!userData) {
        return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
    }

    const userRole = userData.role;

    if (requiredRole) {
        if (requiredRole === 'admin' && userRole !== 'admin') {
            return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
        }
        
        if (requiredRole === 'user' && userRole === 'admin') {
            return <Navigate to="/main/admin" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;
