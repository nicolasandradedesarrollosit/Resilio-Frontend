import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { checkAuthStatus } from '../../../utils/tokenManager';

function ProtectedRoute({ children, requiredRole = null }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                    method: 'GET',
                    credentials: 'include', 
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 401) {
                    console.log('No autenticado - redirigiendo al login');
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                if (!response.ok) {
                    console.error('Error en la respuesta:', response.status);
                    throw new Error('Error al obtener datos del usuario');
                }

                const result = await response.json();
                
                if (!result.ok || !result.data) {
                    console.error('Datos del usuario no disponibles');
                    throw new Error('Datos del usuario no disponibles');
                }

                const fetchedRole = result.data.role;
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

                console.log('Usuario autorizado:', fetchedRole);
                setIsAuthorized(true);
                setIsChecking(false);
                
            } catch (error) {
                console.error('Error verificando autorización:', error);
                setIsAuthorized(false);
                setIsChecking(false);
            }
        };

        checkAuthorization();
    }, [requiredRole, location.pathname]); 

    if (isChecking) {
        return <LoadingScreen message="Verificando acceso..." subtitle="Un momento por favor" />;
    }

    if (!isAuthorized) {
        if (userRole === 'admin' && requiredRole === 'user') {
            return <Navigate to="/main/admin" replace />;
        }
        
        return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
    }

    return children;
}

export default ProtectedRoute;
