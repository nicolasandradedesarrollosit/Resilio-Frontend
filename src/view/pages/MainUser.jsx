import React, { useEffect } from 'react';
import '../../styles/main-user/mainUser.css';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import TopBanner from '../components/main-user/TopBanner';
import EventsUser from '../components/main-user/EventsUser';
import PartnerBenefits from '../components/main-user/PartnerBenefits';
import Footer from '../components/others/Footer';

function MainUser() {

    useEffect(() => {
          const contenedor = document.getElementById("top");
          if (contenedor) {
            contenedor.scrollIntoView({ behavior: "instant" });
          }
        }, []);

    return (
        <>
            <div id='top'></div>
            <main className='main-container-user'>
                <NavbarMainUser />
                <div className='container-top-banner'>
                    <TopBanner />
                </div>
                <main className='main-content-user'>
                    <PartnerBenefits />
                    <EventsUser />
                </main>
            </main>
            <footer className='footer-home'>
                <Footer />
            </footer>
        </>
    );
}

export default MainUser;