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
        // Obtener sesión inicial
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                    console.log('Usuario encontrado:', session.user);
                    setUser({
                        id: session.user.id,
                        email: session.user.email,
                        avatar: session.user.user_metadata?.avatar_url,
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                    });
                }
            } catch (error) {
                console.error('Error obteniendo sesión:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Listener para cambios de estado
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Evento de auth:', event, session);
            
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
            console.log('Iniciando login con Google...');
            console.log('URL actual:', window.location.origin);
            console.log('URL completa:', window.location.href);
            
            // Para producción con BrowserRouter
            const redirectUrl = `${window.location.origin}/auth/callback`;
            console.log('Redirect URL que se enviará:', redirectUrl);
            
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

            console.log('Respuesta completa de OAuth:', { data, error });

            if (error) {
                console.error('Error de OAuth:', error);
                throw error;
            }

            // Forzar redirección si no ocurre automáticamente
            if (data?.url) {
                console.log('URL de Google recibida:', data.url);
                console.log('Iniciando redirección manual...');
                
                // Redirección inmediata
                window.location.replace(data.url);
            } else {
                console.log('No se recibió URL de redirección');
                throw new Error('No se pudo obtener la URL de autenticación');
            }

        } catch (error) {
            console.error('Error en loginWithGoogle:', error);
            throw error;
        }
    };

    const logOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } catch (error) {
            console.error('Error en logout:', error);
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