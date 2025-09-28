import React, { createContext, useState, useEffect } from 'react';
import supabase  from './Supabase';

export const AuthContext = createContext({
    user: null,
    loginWithGoogle: async () => {},
    loginWithApple: async () => {},
    logOut: async () => {}
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed: ', event, session);
            if (session){
                setUser({
                    id: session.user.user_metadata.id,
                    email: session.user.user_metadata.email,
                    avatar: session.user.user_metadata.avatar_url,
                    name: session.user.user_metadata.name,
                })
            }
            else{
                setUser(null);
            }
        });

        return () => {
             authListener.subscription.unsubscribe();
        }
    }, [])

    const loginWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google'
            });

            if (error) {
                throw new Error('Ha ocurrido algo inesperado durante la autenticación con Google: ' + error.message);
            }


        } catch (err) {
            console.error(err);
        }
    };
    
    const loginWithApple = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'apple'
            });

            if (error) {
                throw new Error('Ha ocurrido algo inesperado durante la autenticación con Apple: ' + error.message);
            }

        } catch (err) {
            console.error(err);
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
            console.error(err);
        }
    };

    const contextValue = {
        user, 
        loginWithGoogle,
        loginWithApple, 
        logOut
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;