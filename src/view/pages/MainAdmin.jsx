import React, { useEffect, useState } from 'react';
import AsideMenu from '../components/others/AsideMenu';
import ContentMain from '../components/main-admin/ContentAdmin';
import LoadingScreen from '../components/others/LoadingScreen';
import { jwtDecode } from 'jwt-decode';
import '../../styles/main-admin/mainAdmin.css'


function MainAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Verificar que existe el token
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No se encontró sesión activa');
          setIsLoading(false);
          return;
        }

        // Obtener el userId del token
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        // Cargar datos del usuario
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId })
        });

        if (!response.ok) {
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
  }, []);

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
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: '2rem',
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
          Reintentar
        </button>
      </div>
    );
  }

  return (
  <>
    <div className='container-admin-page'>
      <AsideMenu userData={userData} />
      <main className='main-admin-page'>
        <ContentMain />
      </main>
    </div>
  </>
  )
}

export default MainAdmin;