import React from 'react';
import '../../styles/main-user/mainUser.css';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import TopBanner from '../components/main-user/TopBanner';

function MainUser() {
    return (
        <>
            <main className='main-container-user'>
                <NavbarMainUser />
                <div className='container-main-user'>
                    <TopBanner />
                </div>
            </main>
        </>
    );
}

export default MainUser;