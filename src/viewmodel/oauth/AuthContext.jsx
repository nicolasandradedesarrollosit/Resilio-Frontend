import React, { createContext, useState, useEffect } from 'react';
import supabase from './Supabase';

export const AuthContext = createContext({
    user: null,
    loginWithGoogle: async () => {},
    logOut: async () => {},
    loading: false
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                // Error silencioso - solo en desarrollo usar console.error
                if (import.meta.env.DEV) {
                    console.error('Error obteniendo sesión:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        getSession();

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
            }
            setLoading(false);
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
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Error en logout:', error);
            }
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;