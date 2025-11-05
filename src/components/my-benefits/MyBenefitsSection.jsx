import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import '../../styles/my-benefits/myBenefits.css';

function MyBenefitsSection() {
    const { myBenefits = [], loading } = useContext(UserContext);
    const [benefitsData, setBenefitsData] = useState([]);

   useEffect(() => {
       if (myBenefits) {
           setBenefitsData(myBenefits);
       }
   }, [myBenefits]);

    if (loading) {
        return (
            <div className='container-section-my-benefits'>
                <h2>Mis Beneficios</h2>
                <div className='benefits-loading'>
                    <div className='spinner'></div>
                    <p>Cargando tus beneficios...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='container-section-my-benefits'>
                <h2>Mis Beneficios</h2>
                <div className='benefits-list'>
                    {benefitsData && benefitsData.length > 0 ? (
                        benefitsData.map((benefit, index) => (
                            <div key={benefit.id || index} className='benefit-item'>
                                <div className='benefit-image'>
                                    {benefit.route_jpg && (
                                        <img src={benefit.route_jpg} alt={benefit.name} />
                                    )}
                                </div>
                                <div className='benefit-content'>
                                    <h3>{benefit.name || 'Beneficio'}</h3>
                                    <p className='benefit-business'>{benefit.business_name || 'Negocio'}</p>
                                    <p className='benefit-location'>{benefit.location || 'Ubicación no disponible'}</p>
                                    <div className='benefit-details'>
                                        <span className='benefit-discount'>{benefit.discount}% OFF</span>
                                        {benefit.redeemed_code && (
                                            <span className='benefit-code'>Código: {benefit.redeemed_code}</span>
                                        )}
                                    </div>
                                    {benefit.redeemed_at && (
                                        <p className='benefit-date'>
                                            Canjeado: {new Date(benefit.redeemed_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='no-benefits'>
                            <p>No tienes beneficios canjeados aún.</p>
                            <small>Explora los beneficios disponibles y canjea tu código</small>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MyBenefitsSection;