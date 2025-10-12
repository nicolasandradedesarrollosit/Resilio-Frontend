import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LoadingScreen from './LoadingScreen';

function ProtectedRoute({ children, requiredRole = null }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const token = localStorage.getItem('access_token');
                
                // Si no hay token, redirigir al login
                if (!token) {
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                // Verificar si el token es válido
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Si el token expiró, redirigir al login
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('access_token');
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                // Si se requiere un rol específico, verificarlo
                if (requiredRole) {
                    // Para admin, debe ser exactamente 'admin'
                    // Para user, puede ser 'user' o 'influencer'
                    if (requiredRole === 'admin' && decodedToken.role !== 'admin') {
                        setIsAuthorized(false);
                        setIsChecking(false);
                        return;
                    }
                    
                    if (requiredRole === 'user' && decodedToken.role === 'admin') {
                        // Si es admin intentando acceder a user, redirigir a admin
                        setIsAuthorized(false);
                        setIsChecking(false);
                        return;
                    }
                }

                // Si hay token válido y rol correcto, permitir acceso
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
        // Si es admin intentando acceder a user, redirigir a admin
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role === 'admin' && requiredRole === 'user') {
                    return <Navigate to="/main/admin" replace />;
                }
            } catch (error) {
                // Token inválido, redirigir a login
            }
        }
        
        return <Navigate to="/log-in" replace state={{ from: location.pathname }} />;
    }

    return children;
}

export default ProtectedRoute;
