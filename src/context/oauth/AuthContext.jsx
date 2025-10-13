import React, { createContext, useState, useEffect, useCallback } from 'react';
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

    // Usar useCallback para que la función no se recree en cada render
    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // No hay sesión activa
                    setUser(null);
                    setUserData(null);
                    return null;
                }
                throw new Error('Error al obtener datos del usuario');
            }

            const result = await response.json();
            
            if (result.ok && result.data) {
                // Actualizar tanto user como userData desde el backend
                // El backend devuelve: name, ispremium, role, email, phone_number, city, province, email_verified, q_of_redeemed, points_user
                setUser({
                    email: result.data.email,
                    name: result.data.name
                });
                setUserData(result.data);
                return result.data;
            }
            
            setUser(null);
            setUserData(null);
            return null;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Error en fetchUserData:', error);
            }
            setUser(null);
            setUserData(null);
            return null;
        }
    }, []); // Sin dependencias porque solo usa setters de estado

    useEffect(() => {
        let timeoutId;
        let isMounted = true;
        
        const initializeAuth = async () => {
            try {
                // Timeout de seguridad
                timeoutId = setTimeout(() => {
                    if (import.meta.env.DEV) {
                        console.warn('Timeout en la carga de sesión');
                    }
                    if (isMounted) {
                        setLoading(false);
                    }
                }, 10000);

                // Primero verificar si hay sesión activa en el backend (cookies)
                await fetchUserData();
                
                if (timeoutId) clearTimeout(timeoutId);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error('Error inicializando autenticación:', error);
                }
                if (timeoutId) clearTimeout(timeoutId);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        // Escuchar cambios en la sesión de Supabase (solo para login con Google)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (import.meta.env.DEV) {
                console.log('🔔 Auth state change:', event);
            }
            
            // Cuando hay cambio de estado, verificar en el backend
            if (isMounted) {
                await fetchUserData();
            }
        });

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
            subscription.unsubscribe();
        };
    }, [fetchUserData]); // Agregar fetchUserData como dependencia

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
            
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            setUser(null);
            setUserData(null);
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