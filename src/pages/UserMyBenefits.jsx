import React, {useEffect, useContext} from 'react';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import '../styles/user-my-benefits/userBenefits.css';

function UserMyBenefits() {
    useEffect(() => {
            const contenedor = document.getElementById("top");
            if (contenedor) {
                contenedor.scrollIntoView({ behavior: "instant" });
            }
        }, []);
    return (
        <>
            <div id='top'></div>
            <div className='main-container-user-events'>
                <NavbarMainUser userData={userData} />
                <main className='main-content-user-events'>
                    <MyBenefitsSection/>
                </main>
            </div>
        </>
    )
}

export default UserMyBenefits;