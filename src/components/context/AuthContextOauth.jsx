import React, { createContext, useState, useEffect } from 'react';
import { loginWithGoogle, logOut } from '../../services/authService';
import { fetchUserData } from '../../helpers/userFunctions';
import { fetchBusinessData } from '../../helpers/businessFunctions';

export const AuthContext = createContext({
    userData: null,
    loginWithGoogle: async () => {},
    logOut: async () => {},
    loading: false,
    refreshUserData: async () => {}
});

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const loadUserData = async () => {
        try {
            // Intentar cargar datos de usuario primero
            let data = await fetchUserData();
            
            // Si no hay datos de usuario, intentar cargar datos de negocio
            if (!data) {
                data = await fetchBusinessData();
            }
            
            setUserData(data);
            return data;
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
            setUserData(null);
            return null;
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            await loadUserData();
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const handleLoginWithGoogle = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            throw error;
        }
    };

    const handleLogOut = async () => {
        setIsLoggingOut(true);
        setUserData(null); // Limpiar inmediatamente
        
        try {
            await logOut();
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            setIsLoggingOut(false);
        }
        
        return { success: true };
    };

    const contextValue = {
        userData,
        loginWithGoogle: handleLoginWithGoogle,
        logOut: handleLogOut,
        loading: loading,
        isLoggingOut,
        refreshUserData: loadUserData
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;