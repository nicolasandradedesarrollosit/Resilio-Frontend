import React from 'react';
import '../../styles/main-user/main-user.css';
import NavbarMainUser from '../components/main-user/NavbarMainUser';

function MainUser() {
    return (
        <>
            <main className='main-container-user'>
                <NavbarMainUser />
                <div className='container-main-user'>

                </div>
            </main>
        </>
    );
}

export default MainUser;