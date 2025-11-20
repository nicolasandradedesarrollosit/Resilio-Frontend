

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
            console.error('Error obteniendo sesión de Supabase:', error);
            throw new Error('No se pudo obtener la sesión de autenticación');
        }
        
        if (!session) {
            throw new Error('No se encontró sesión de autenticación');
        }
        
        if (!session.access_token) {
            throw new Error('Token de acceso no disponible');
        }
        
        if (!session.user || !session.user.email) {
            throw new Error('Información de usuario incompleta');
        }
        
        // Verificar expiración de la sesión
        if (session.expires_at && session.expires_at * 1000 < Date.now()) {
            throw new Error('La sesión de autenticación ha expirado');
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
        
        // Manejar respuestas de error del servidor
        if (!response.ok) {
            let errorMessage = 'Error al procesar la autenticación';
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (parseError) {
                console.error('Error parseando respuesta de error:', parseError);
                
                // Mensajes específicos según código de estado
                if (response.status === 401) {
                    errorMessage = 'Credenciales inválidas';
                } else if (response.status === 403) {
                    errorMessage = 'Acceso denegado';
                } else if (response.status === 404) {
                    errorMessage = 'Servicio de autenticación no encontrado';
                } else if (response.status === 500) {
                    errorMessage = 'Error del servidor. Intenta nuevamente';
                } else if (response.status >= 500) {
                    errorMessage = 'El servidor no está disponible';
                }
            }
            
            throw new Error(errorMessage);
        }
        
        // Procesar respuesta exitosa
        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            console.error('Error parseando respuesta exitosa:', parseError);
            throw new Error('Respuesta del servidor inválida');
        }
        
        // Validar que la respuesta tenga los datos necesarios
        if (!result || typeof result !== 'object') {
            throw new Error('Respuesta del servidor inválida');
        }
        
        // Cerrar sesión de Supabase después de enviar los datos
        try {
            await supabase.auth.signOut();
        } catch (signOutError) {
            console.warn('Error al cerrar sesión de Supabase:', signOutError);
            // No lanzar error aquí, la autenticación fue exitosa
        }
        
        return { 
            user: session.user,
            userId: result.userId,
            role: result.role || 'user'
        };
        
    } catch (err) {
        // Log detallado en desarrollo
        if (import.meta.env.DEV) {
            console.error('Error detallado en sendUserDataToBackend:', {
                message: err.message,
                stack: err.stack,
                error: err
            });
        }
        
        // Re-lanzar el error para que sea manejado por el componente
        throw err;
    }
}
