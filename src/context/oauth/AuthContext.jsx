import React, { createContext, useState, useEffect } from 'react';
import supabase from './Supabase';
import { authenticatedFetch } from '../../utils/tokenManager';

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

    const fetchUserData = async () => {
        try {
            const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                method: 'GET'
            });

            if (!response.ok) {
                setUserData(null);
                return null;
            }

            const result = await response.json();
            
            if (result.ok && result.data) {
                setUserData(result.data);
                return result.data;
            }
            
            setUserData(null);
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserData(null);
            return null;
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            await fetchUserData();
            setLoading(false);
        };

        initializeAuth();
    }, []); 

    const loginWithGoogle = async () => {
        try {
            const redirectUrl = `${window.location.origin}/auth/callback`;
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) throw error;

            if (data?.url) {
                window.location.replace(data.url);
            } else {
                throw new Error('No se pudo obtener la URL de autenticación');
            }

        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Error en loginWithGoogle:', error);
            }
            throw error;
        }
    };

    const logOut = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/log-out`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            
            await supabase.auth.signOut();
            setUserData(null);
        } catch (error) {
            console.error('Error en logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            userData, 
            loginWithGoogle, 
            logOut, 
            loading,
            refreshUserData: fetchUserData 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;