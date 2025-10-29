

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
        await fetch(`${API_URL}/api/log-out`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        
        await supabase.auth.signOut();
        
    } catch (error) {
        handleAuthError(error, 'logOut');
        throw error;
    }
}


export async function sendUserDataToBackend() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            throw error;
        }
        
        if (!session) {
            throw new Error('No se encontró sesión de autenticación');
        }
        
        if (!session.access_token || !session.user || !session.user.email) {
            throw new Error('Sesión de autenticación incompleta');
        }
        
        if (session.expires_at && session.expires_at * 1000 < Date.now()) {
            throw new Error('La sesión de autenticación ha expirado');
        }
        
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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al procesar la autenticación');
        }
        
        const result = await response.json();
        await supabase.auth.signOut();
        return { 
            user: session.user,
            userId: result.userId,
            role: result.role
        };
        
    } catch (err) {
        if (import.meta.env.DEV) {
        }
        throw err;
    }
}
