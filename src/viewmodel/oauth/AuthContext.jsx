import React, { createContext, useState, useEffect } from 'react';
import supabase from './Supabase';

export const AuthContext = createContext({
    user: null,
    loginWithGoogle: async () => {},
    loginWithApple: async () => {},
    logOut: async () => {},
    loading: false
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener sesión inicial
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    avatar: session.user.user_metadata.avatar_url,
                    name: session.user.user_metadata.full_name || session.user.user_metadata.name,
                });
            }
            setLoading(false);
        };

        getInitialSession();

        // Escuchar cambios en el estado de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed: ', event, session);
                setLoading(true);
                
                if (session) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email,
                        avatar: session.user.user_metadata.avatar_url,
                        name: session.user.user_metadata.full_name || session.user.user_metadata.name,
                    });
                } else {
                    setUser(null);
                }
                
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loginWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/main/user`
                }
            });

            if (error) {
                console.error('Error de autenticación con Google:', error);
                throw new Error('Ha ocurrido algo inesperado durante la autenticación con Google: ' + error.message);
            }

            return data;
        } catch (err) {
            console.error('Error en loginWithGoogle:', err);
            throw err;
        }
    };
    
    const loginWithApple = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'apple',
                options: {
                    redirectTo: `${window.location.origin}/main/user`
                }
            });

            if (error) {
                console.error('Error de autenticación con Apple:', error);
                throw new Error('Ha ocurrido algo inesperado durante la autenticación con Apple: ' + error.message);
            }

            return data;
        } catch (err) {
            console.error('Error en loginWithApple:', err);
            throw err;
        }
    };

    const logOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                throw new Error('Error al cerrar sesión: ' + error.message);
            }

            setUser(null); 
        } catch (err) {
            console.error('Error en logout:', err);
            throw err;
        }
    };

    const contextValue = {
        user, 
        loginWithGoogle,
        loginWithApple, 
        logOut,
        loading
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;