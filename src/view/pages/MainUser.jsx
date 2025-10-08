import React from 'react';
import '../../styles/main-user/mainUser.css';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import TopBanner from '../components/main-user/TopBanner';
import EventsUser from '../components/main-user/EventsUser';
import PartnerBenefits from '../components/main-user/PartnerBenefits';
import Footer from '../components/others/Footer';

function MainUser() {
    return (
        <>
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