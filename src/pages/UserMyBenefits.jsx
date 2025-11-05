import React, {useEffect, useContext} from 'react';
import NavbarMainUser from '../components/main-user/NavbarMainUser';
import MyBenefitsSection from '../components/my-benefits/MyBenefitsSection';
import { UserContext } from '../components/context/UserContext';
import '../styles/user-benefits/userBenefits.css';

function UserMyBenefits() {
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
                    <MyBenefitsSection userData={userData} />
                </main>
            </div>
        </>
    )
}

export default UserMyBenefits;