import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { AuthContext } from '../../../context/oauth/AuthContext';

function ProtectedRoute({ children, requiredRole = null }) {
    const location = useLocation();
    const { userData, loading: authLoading } = useContext(AuthContext);

    // Mostrar loading mientras el contexto está cargando
    if (authLoading) {
        return <LoadingScreen message="Verificando acceso..." subtitle="Un momento por favor" />;
    }

    // Si no hay userData, redirigir a login
    if (!userData) {
        console.log('❌ No autenticado - redirigiendo al login');
        return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
    }

    const userRole = userData.role;

    // Verificar roles requeridos
    if (requiredRole) {
        if (requiredRole === 'admin' && userRole !== 'admin') {
            console.log('❌ Usuario no es admin - acceso denegado');
            return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
        }
        
        if (requiredRole === 'user' && userRole === 'admin') {
            console.log('⚠️ Admin intentando acceder a ruta de usuario - redirigiendo a admin');
            return <Navigate to="/main/admin" replace />;
        }
    }

    console.log('✅ Usuario autorizado:', userRole);
    return children;
}

export default ProtectedRoute;
