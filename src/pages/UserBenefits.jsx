import React, {useContext, useEffect} from 'react';
import NavbarMainUser from '../components/main-user/NavbarMainUser'; '../components/main-user/NavbarMainUser'
import { UserContext } from '../components/context/UserContext';
import BenefitsSection from '../components/user-events/BenefitsSection';
import '../styles/user-benefits/userBenefits.css';

function UserBenefits() {
    const { userData, loading, error} = useContext(UserContext);

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