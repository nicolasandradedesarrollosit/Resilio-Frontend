import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AsideMenu from '../components/others/AsideMenu';
import ContentMain from '../components/main-admin/ContentAdmin';
import LoadingScreen from '../components/others/LoadingScreen';
import '../../styles/main-admin/mainAdmin.css'


function MainAdmin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          console.log('✅ Token renovado exitosamente');
          return true;
        }

        console.error('❌ Error al renovar token:', response.status);
        return false;
      } catch (error) {
        console.error('❌ Error en refreshAccessToken:', error);
        return false;
      }
    };

    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 401) {
          console.log('🔄 Token expirado, intentando renovar...');
          const refreshed = await refreshAccessToken();
          
          if (refreshed) {
            const retryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });

            if (retryResponse.ok) {
              const result = await retryResponse.json();
              if (result.ok && result.data) {
                setUserData(result.data);
                setIsLoading(false);
                return;
              }
            }
          }
          
          navigate('/log-in', { replace: true });
          return;
        }

        if (!response.ok) {
          if (response.status === 403) {
            navigate('/log-in', { replace: true });
            return;
          }
          throw new Error('Error al cargar los datos del usuario');
        }

        const result = await response.json();
        
        if (result.ok && result.data) {
          setUserData(result.data);
        } else {
          throw new Error('Datos del usuario no disponibles');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err.message || 'Error al cargar los datos');
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
      <AsideMenu userData={userData} activeItem={'dashboard'} />
      <main className='main-admin-page'>
        <ContentMain />
      </main>
    </div>
  </>
  )
}

export default MainAdmin;