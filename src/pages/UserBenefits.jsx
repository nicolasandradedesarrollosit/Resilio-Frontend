import React, {useEffect} from 'react';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import BenefitsSection from '../components/user-benefits/BenefitsSection';
import '../styles/user-benefits/userBenefitss.css';

function UserBenefits() {

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
                    <BenefitsSection />
                </main>
            </div>
        </>
    );
}

export default UserBenefits;