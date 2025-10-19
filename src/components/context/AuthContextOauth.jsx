import React, { createContext, useState, useEffect } from 'react';
import { loginWithGoogle, logOut } from '../../services/authService';
import { fetchUserData } from '../../helpers/userFunctions';

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
            const data = await fetchUserData();
            setUserData(data);
            return data;
        } catch (error) {
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
        try {
            setIsLoggingOut(true);
            await logOut();
            setUserData(null);
            setIsLoggingOut(false);
        } catch (error) {
            setUserData(null);
            setIsLoggingOut(false);
            throw error;
        }
    };

    const contextValue = {
        userData,
        loginWithGoogle: handleLoginWithGoogle,
        logOut: handleLogOut,
        loading: loading && !isLoggingOut,
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