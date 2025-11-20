

import supabase from './Supabase';
import { handleAuthError } from '../helpers/authHelpers';

const API_URL = import.meta.env.VITE_API_URL;


export async function loginWithGoogle() {
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
}


export async function logOut() {
    try {
        // Llamar al backend para limpiar cookies
        await fetch(`${API_URL}/api/log-out`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        
        // Cerrar sesión de Supabase
        await supabase.auth.signOut();
        
    } catch (error) {
        console.error('Error en logout:', error);
    }
}


export async function sendUserDataToBackend() {
    try {
        // Obtener sesión de Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
            throw new Error('No se pudo obtener la sesión');
        }
        
        // Enviar datos al backend
        const response = await fetch(`${API_URL}/api/auth/google`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                supabaseToken: session.access_token,
                email: session.user.email
            })
        });
        
        if (!response.ok) {
            throw new Error('Error en el servidor');
        }
        
        const result = await response.json();
        
        // Cerrar sesión de Supabase después de autenticar
        await supabase.auth.signOut();
        
        return { 
            user: session.user,
            userId: result.userId,
            role: result.role || 'user'
        };
        
    } catch (err) {
        console.error('Error en sendUserDataToBackend:', err);
        throw err;
    }
}
