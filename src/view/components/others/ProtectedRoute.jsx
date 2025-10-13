import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { AuthContext } from '../../../context/oauth/AuthContext';

function ProtectedRoute({ children, requiredRole = null }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    const { user, userData, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        // Esperar a que el AuthContext termine de cargar
        if (authLoading) {
            setIsChecking(true);
            return;
        }

        // Verificar autorización una vez que el contexto ha cargado
        const checkAuth = () => {
            try {
                // Si no hay userData después de que el contexto cargó, no está autenticado
                if (!userData) {
                    console.log('❌ No autenticado - redirigiendo al login');
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                const fetchedRole = userData.role;
                setUserRole(fetchedRole);

                // Verificar roles requeridos
                if (requiredRole) {
                    if (requiredRole === 'admin' && fetchedRole !== 'admin') {
                        console.log('❌ Usuario no es admin - acceso denegado');
                        setIsAuthorized(false);
                        setIsChecking(false);
                        return;
                    }
                    
                    if (requiredRole === 'user' && fetchedRole === 'admin') {
                        console.log('⚠️ Admin intentando acceder a ruta de usuario - redirigiendo a admin');
                        setIsAuthorized(false);
                        setIsChecking(false);
                        return;
                    }
                }

                console.log('✅ Usuario autorizado:', fetchedRole);
                setIsAuthorized(true);
                setIsChecking(false);
                
            } catch (error) {
                console.error('Error verificando autorización:', error);
                setIsAuthorized(false);
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [authLoading, userData, requiredRole]); // Remover refreshUserData y user de las dependencias

    if (authLoading || isChecking) {
        return <LoadingScreen message="Verificando acceso..." subtitle="Un momento por favor" />;
    }    if (!isAuthorized) {
        if (userRole === 'admin' && requiredRole === 'user') {
            return <Navigate to="/main/admin" replace />;
        }
        
        return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
    }

    return children;
}

export default ProtectedRoute;
