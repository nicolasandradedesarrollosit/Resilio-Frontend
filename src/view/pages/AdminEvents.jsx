import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AsideMenu from '../components/others/AsideMenu.jsx';
import { getAdminData } from '../../context/oauth/context-admin/adminData.js';
import LoadingScreen from '../components/others/LoadingScreen';
import ContentEvents from '../components/admin-events/contentEvents.jsx';
import '../../styles/main-admin/mainAdmin.css';


function AdminEvents() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
          try {
            const data = await getAdminData();
            setUserData(data);
          } catch (err) {
            console.error('Error loading admin data:', err);
            if (err.message?.includes('401') || err.message?.includes('403') || err.message?.includes('no disponibles')) {
              navigate('/log-in', { replace: true });
              return;
            }
            setError(err.message || 'Error al cargar los datos');
          } finally {
            setIsLoading(false);
          }
        };
    
        loadUserData();
      }, [navigate]);

      if (isLoading) {
    return (
      <LoadingScreen 
        message="Cargando panel de administración" 
        subtitle="Preparando herramientas y estadísticas..."
      />
    );
  }

      if (error) {
        return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            background: '#e8e6e1',
            color: '#1a1a1a',
            padding: '2rem'
        }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Error al cargar</h2>
            <p style={{ color: '#666', textAlign: 'center' }}>{error}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => navigate('/log-in', { replace: true })} 
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, #8f6ddf, #b794f6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Ir al Login
              </button>
              <button 
                onClick={() => window.location.reload()} 
                style={{
                  padding: '0.75rem 2rem',
                  background: '#f5f5f5',
                  color: '#333',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Reintentar
              </button>
            </div>
        </div>
        );
    }

    return (
        <>
            <div className='container-admin-page'>
              <AsideMenu userData={userData} activeItem={'events'} />
              <main className='main-admin-page'>
                <ContentEvents />
              </main>
            </div>

        </>
    )
}

export default AdminEvents;