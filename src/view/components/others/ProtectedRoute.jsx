import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { AuthContext } from '../../../context/oauth/AuthContext';

function ProtectedRoute({ children, requiredRole = null }) {
    const [isChecking, setIsChecking] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    const { user, userData, loading: authLoading, refreshUserData } = useContext(AuthContext);

    useEffect(() => {
        if (authLoading) {
            setIsChecking(true);
            return;
        }

        const checkAuthorization = async () => {
            setIsChecking(true);
            
            try {
                if (!user && !userData) {
                    console.log('No autenticado - redirigiendo al login');
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                let currentUserData = userData;
                
                if (!currentUserData && user) {
                    console.log('Intentando refrescar userData...');
                    currentUserData = await refreshUserData();
                }

                if (!currentUserData) {
                    console.log('No se pudieron obtener datos del usuario');
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                const fetchedRole = currentUserData.role;
                setUserRole(fetchedRole);

                if (requiredRole) {
                    if (requiredRole === 'admin' && fetchedRole !== 'admin') {
                        console.log('Usuario no es admin - acceso denegado');
                        setIsAuthorized(false);
                        setIsChecking(false);
                        return;
                    }
                    
                    if (requiredRole === 'user' && fetchedRole === 'admin') {
                        console.log('Admin intentando acceder a ruta de usuario - redirigiendo a admin');
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

        checkAuthorization();
    }, [authLoading, user, userData, requiredRole, location.pathname, refreshUserData]);

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
