import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './Supabase';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                console.log('Procesando callback de Google...');
                console.log('URL actual:', window.location.href);
                console.log('Hash:', window.location.hash);
                
                // Procesar los tokens del hash de la URL
                const { data, error } = await supabase.auth.getSession();
                console.log('Datos de getSession:', data, error);
                
                // Si no hay sesión, intentar establecer la sesión desde la URL
                if (!data.session) {
                    console.log('No hay sesión, procesando hash...');
                    
                    // Supabase debería procesar automáticamente el hash
                    const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
                    console.log('Resultado de refreshSession:', sessionData, sessionError);
                    
                    if (sessionError) {
                        console.error('Error procesando tokens:', sessionError);
                        navigate('/log-in');
                        return;
                    }
                }
                
                // Esperar un momento para que Supabase procese todo
                setTimeout(async () => {
                    const { data: finalSession } = await supabase.auth.getSession();
                    console.log('Sesión final:', finalSession);
                    
                    if (finalSession?.session?.user) {
                        console.log('Usuario autenticado exitosamente:', finalSession.session.user);
                        navigate('/main/user');
                    } else {
                        console.log('No se pudo establecer la sesión');
                        navigate('/log-in');
                    }
                }, 1000);
                
            } catch (error) {
                console.error('Error procesando callback:', error);
                navigate('/log-in');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column'
        }}>
            <div style={{ 
                width: '50px', 
                height: '50px', 
                border: '4px solid #f3f3f3', 
                borderTop: '4px solid #4285f4', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                marginBottom: '20px'
            }}></div>
            <p>Finalizando autenticación...</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                Procesando tokens de Google...
            </p>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default AuthCallback;