import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { AuthContext } from '../context/AuthContextOauth';

function ProtectedRoute({ children, requiredRole = null }) {
    const location = useLocation();
    const { userData, loading, isLoggingOut } = useContext(AuthContext);

    // Si está cerrando sesión, redirigir directamente
    if (isLoggingOut) {
        return <Navigate to="/log-in" replace />;
    }

    // Si está cargando, mostrar loading
    if (loading) {
        return <LoadingScreen message="Verificando acceso..." />;
    }

    // Si no hay usuario, redirigir a login
    if (!userData) {
        return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
    }

    const userRole = userData.role;

    // Validar rol si es requerido
    if (requiredRole) {
        // Si requiere admin pero no es admin
        if (requiredRole === 'admin' && userRole !== 'admin') {
            return <Navigate to="/main/user" replace />;
        }
        
        // Si requiere user pero es admin, redirigir a panel admin
        if (requiredRole === 'user' && userRole === 'admin') {
            return <Navigate to="/main/admin" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;
