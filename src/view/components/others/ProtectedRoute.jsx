import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LoadingScreen from './LoadingScreen';

function ProtectedRoute({ children, requiredRole = null }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const token = localStorage.getItem('access_token');
                
                if (!token) {
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('access_token');
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                const userId = decodedToken.sub;
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
                localStorage.removeItem('access_token');
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
