import supabase from '../services/Supabase';
import { handleAuthError } from './authHelpers';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * @returns {Promise<void>}
 * @throws {Error} Si hay un error en el proceso de autenticación
 */
export const loginWithGoogle = async () => {
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

        if (error) {
            throw error;
        }

        if (!data?.url) {
            throw new Error('No se pudo obtener la URL de autenticación');
        }

        window.location.replace(data.url);
        
    } catch (error) {
        handleAuthError(error, 'loginWithGoogle');
        throw error;
    }
};

/**
 * @returns {Promise<void>}
 */
export const logOut = async () => {
    try {
        await fetch(`${API_URL}/api/log-out`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        
        // Cerrar sesión en Supabase
        await supabase.auth.signOut();
        
    } catch (error) {
        handleAuthError(error, 'logOut');
        throw error;
    }
};


