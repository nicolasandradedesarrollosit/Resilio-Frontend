import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { getValidToken, getUserIdFromToken, clearToken } from '../../../utils/tokenManager';

function ProtectedRoute({ children, requiredRole = null }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                // Intenta obtener un token válido (renueva si es necesario)
                const token = await getValidToken();
                
                // Si no se pudo obtener un token válido, redirigir al login
                if (!token) {
                    clearToken();
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                // Obtener el rol del usuario desde la API
                const userId = getUserIdFromToken(token);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: userId })
                });

                if (!response.ok) {
                    throw new Error('Error al obtener datos del usuario');
                }

                const result = await response.json();
                
                if (!result.ok || !result.data) {
                    throw new Error('Datos del usuario no disponibles');
                }

                const fetchedRole = result.data.role;
                setUserRole(fetchedRole);

                if (requiredRole) {
                    if (requiredRole === 'admin' && fetchedRole !== 'admin') {
                        setIsAuthorized(false);
                        setIsChecking(false);
                        return;
                    }
                    
                    if (requiredRole === 'user' && fetchedRole === 'admin') {
                        setIsAuthorized(false);
                        setIsChecking(false);
                        return;
                    }
                }

                setIsAuthorized(true);
                setIsChecking(false);
                
            } catch (error) {
                console.error('Error verificando autorización:', error);
                clearToken();
                setIsAuthorized(false);
                setIsChecking(false);
            }
        };

        checkAuthorization();
    }, [requiredRole, location]);

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
