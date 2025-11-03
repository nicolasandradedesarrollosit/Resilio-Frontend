import {
    getMyBenefits
} from '../../helpers/myBenefitsFunctions';
import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../context/UserContext'

function MyBenefitsSection() {
    const { myBenefits = [], loading } = useContext(userContext);
    const [benefitsData, setBenefitsData] = useState(null);

   useEffect(() => {
       if (myBenefits) {
           setBenefitsData(myBenefits);
       }
   }, [myBenefits]);

    return (
        <>
            <div className='container-section-my-benefits'>
                <h2>Mis Beneficios</h2>
                <div className='benefits-list'>
                    {userData && userData.benefits && userData.benefits.length > 0 ? (
                        userData.benefits.map((benefit, index) => (
                            <div key={index} className='benefit-item'>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>No tienes beneficios disponibles.</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default MyBenefitsSection;