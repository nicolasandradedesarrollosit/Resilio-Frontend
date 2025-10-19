import React, { useEffect, useContext } from 'react';
import '../styles/main-user/mainUser.css';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import TopBanner from '../components/main-user/TopBanner';
import EventsUser from '../components/main-user/EventsUser';
import PartnerBenefits from '../components/main-user/PartnerBenefits';
import LoadingScreen from '../components/others/LoadingScreen';
import UserErrorState from '../components/others/UserErrorState';
import { UserContext } from '../components/context/UserContext';

function MainUser() {
    const { userData, loading, error } = useContext(UserContext);

    useEffect(() => {
        const contenedor = document.getElementById("top");
        if (contenedor) {
            contenedor.scrollIntoView({ behavior: "instant" });
        }
    }, []);

    if (loading) {
        return (
            <LoadingScreen 
                message="Cargando tu espacio personal" 
                subtitle="Preparando beneficios y eventos..."
            />
        );
    }

    if (error || !userData) {
        return (
            <UserErrorState 
                error={error || 'Error al cargar los datos'}
                onRetry={() => window.location.reload()}
            />
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