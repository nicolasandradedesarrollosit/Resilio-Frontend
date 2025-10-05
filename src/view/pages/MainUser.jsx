import React from 'react';
import '../../styles/main-user/mainUser.css';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import TopBanner from '../components/main-user/TopBanner';
import EventsUser from '../components/main-user/EventsUser';
import PartnerBenefits from '../components/main-user/PartnerBenefits';

function MainUser() {
    return (
        <>
            <main className='main-container-user'>
                <NavbarMainUser />
                <div className='container-main-user'>
                    <TopBanner />
                    <PartnerBenefits />
                    <EventsUser />
                </div>
            </main>
        </>
    );
}

export default MainUser;