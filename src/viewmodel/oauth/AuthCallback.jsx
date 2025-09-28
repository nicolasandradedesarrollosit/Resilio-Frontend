import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './Supabase';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                console.log('Procesando callback de Google...');
                
                // Obtener la sesión después del callback
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Error en callback:', error);
                    navigate('/login');
                    return;
                }

                if (session) {
                    console.log('Usuario autenticado:', session.user);
                    navigate('/main/user');
                } else {
                    console.log('No hay sesión válida');
                    navigate('/login');
                }
                
            } catch (error) {
                console.error('Error procesando callback:', error);
                navigate('/login');
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