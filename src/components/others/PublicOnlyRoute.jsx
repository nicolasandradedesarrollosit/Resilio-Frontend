import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextOauth';
import LoadingScreen from './LoadingScreen';

/**
 * Componente que protege rutas que solo deben ser accesibles cuando NO estás logueado
 * (como login y register). Si el usuario ya está logueado, redirige a su página principal.
 */
const PublicOnlyRoute = ({ children }) => {
    const { userData, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return <LoadingScreen message="Verificando sesión" subtitle="Un momento por favor..." />;
    }

    if (userData) {
        const destination = userData.role === 'admin' ? '/main/admin' : '/main/user';
        return <Navigate to={destination} replace />;
    }

    return children;
};

export default PublicOnlyRoute;
