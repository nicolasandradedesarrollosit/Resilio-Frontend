import React, {useEffect, useContext} from 'react';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import BenefitsSection from '../components/user-benefits/BenefitsSection';
import { UserContext } from '../components/context/UserContext';
import '../styles/user-benefits/userBenefitss.css';

function UserBenefits() {
    const { userData } = useContext(UserContext);
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
                    <BenefitsSection userData={userData}/>
                </main>
            </div>
        </>
    );
}

export default UserBenefits;