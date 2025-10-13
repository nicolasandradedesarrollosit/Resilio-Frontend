import React, { useEffect, useState } from 'react';
import '../../styles/main-user/mainUser.css';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import TopBanner from '../components/main-user/TopBanner';
import EventsUser from '../components/main-user/EventsUser';
import PartnerBenefits from '../components/main-user/PartnerBenefits';
import LoadingScreen from '../components/others/LoadingScreen';

function MainUser() {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const contenedor = document.getElementById("top");
        if (contenedor) {
            contenedor.scrollIntoView({ behavior: "instant" });
        }
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Cargar datos del usuario usando cookies (sin localStorage)
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-data`, {
                    method: 'GET',
                    credentials: 'include', // Envía las cookies automáticamente
                    headers: { 'Content-Type': 'application/json' }
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
                message="Cargando tu espacio personal" 
                subtitle="Preparando beneficios y eventos..."
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
                background: 'radial-gradient(1200px 800px at 10% -10%, rgba(124, 58, 237, 0.20), transparent 60%), radial-gradient(1000px 900px at 110% 10%, rgba(79, 70, 229, 0.18), transparent 60%), #0b1022',
                color: '#f8fafc',
                padding: '2rem'
            }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Error al cargar</h2>
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    style={{
                        marginTop: '2rem',
                        padding: '0.75rem 2rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
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
            <div id='top'></div>
            <main className='main-container-user'>
                <NavbarMainUser userData={userData} />
                <div className='container-top-banner'>
                    <TopBanner />
                </div>
                <main className='main-content-user'>
                    <PartnerBenefits />
                    <EventsUser />
                </main>
            </main>
        </>
    );
}

export default MainUser;