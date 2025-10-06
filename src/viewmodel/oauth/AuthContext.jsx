import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import supabase from './Supabase';

export const AuthContext = createContext({
    user: null,
    userData: null,
    loginWithGoogle: async () => {},
    logOut: async () => {},
    loading: false,
    refreshUserData: async () => {}
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return null;

            const decodedToken = jwtDecode(token);
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: decodedToken.sub })
            });

            if (!response.ok) throw new Error('Error al obtener datos del usuario');

            const result = await response.json();
            
            if (result.ok && result.data) {
                setUserData(result.data);
                return result.data;
            }
            return null;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Error en fetchUserData:', error);
            }
            return null;
        }
    };

    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email,
                        avatar: session.user.user_metadata?.avatar_url,
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                    });
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error('Error obteniendo sesión:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        getSession();
        
        fetchUserData();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    avatar: session.user.user_metadata?.avatar_url,
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                });
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
            
            if (session?.user) {
                fetchUserData();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
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
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setUserData(null);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Error en logout:', error);
            }
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
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