import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { AuthContext } from '../../../context/oauth/AuthContext';

function ProtectedRoute({ children, requiredRole = null }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    const { userData, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        // Solo verificar cuando el contexto haya terminado de cargar
        if (authLoading) {
            return;
        }

        // Verificar autorización
        if (!userData) {
            console.log('❌ No autenticado - redirigiendo al login');
            setIsAuthorized(false);
            return;
        }

        const fetchedRole = userData.role;
        setUserRole(fetchedRole);

        // Verificar roles requeridos
        if (requiredRole) {
            if (requiredRole === 'admin' && fetchedRole !== 'admin') {
                console.log('❌ Usuario no es admin - acceso denegado');
                setIsAuthorized(false);
                return;
            }
            
            if (requiredRole === 'user' && fetchedRole === 'admin') {
                console.log('⚠️ Admin intentando acceder a ruta de usuario - redirigiendo a admin');
                setIsAuthorized(false);
                return;
            }
        }

        console.log('✅ Usuario autorizado:', fetchedRole);
        setIsAuthorized(true);
    }, [authLoading, userData, requiredRole]);

    // Mostrar loading mientras el contexto está cargando
    if (authLoading) {
        return <LoadingScreen message="Verificando acceso..." subtitle="Un momento por favor" />;
    }

    // Si el contexto terminó de cargar pero no hay userData, redirigir a login
    if (!userData) {
        return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
    }

    // Si no está autorizado (problema de roles), redirigir según corresponda
    if (!isAuthorized) {
        if (userRole === 'admin' && requiredRole === 'user') {
            return <Navigate to="/main/admin" replace />;
        }
        
        return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
    }

    return children;
}

export default ProtectedRoute;
