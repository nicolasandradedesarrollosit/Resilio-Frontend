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
            // Si es user, ir a main/user, si es business, ir a main/business
            if (userRole === 'business') {
                return <Navigate to="/main/business" replace />;
            }
            return <Navigate to="/main/user" replace />;
        }
        
        // Si requiere business pero no es business
        if (requiredRole === 'business' && userRole !== 'business') {
            // Si es admin, ir a main/admin, si es user, ir a main/user
            if (userRole === 'admin') {
                return <Navigate to="/main/admin" replace />;
            }
            return <Navigate to="/main/user" replace />;
        }
        
        // Si requiere user pero es admin o business, redirigir al panel correspondiente
        if (requiredRole === 'user' && userRole !== 'user') {
            if (userRole === 'admin') {
                return <Navigate to="/main/admin" replace />;
            }
            if (userRole === 'business') {
                return <Navigate to="/main/business" replace />;
            }
        }
    }

    return children;
}

export default ProtectedRoute;
