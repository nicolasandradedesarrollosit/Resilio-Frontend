import React from 'react';
import '../components/others/AsideMenu.jsx';
import { getAdminData } from '../../context/oauth/context-admin/adminData.js';

function AdminEvents() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
          try {
            const data = await getAdminData();
            setUserData(data);
          } catch (err) {
            setError(err.message || 'Error al cargar los datos');
          } finally {
            setIsLoading(false);
          }
        };
    
        loadUserData();
      }, []);

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
            <AsideMenu userData={userData} />
        </>
    )
}

export default AdminEvents;