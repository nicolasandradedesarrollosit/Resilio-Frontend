import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BenefitCard({ benefit, userData }) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddBenefit = async () => {
        try {
            if (!userData.ispremium) {
                navigate('/user/plans');
                return;
            }
            
            setIsLoading(true);
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my-benefits`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.id,
                    benefitId: benefit.id
                })
            });

            if (!response.ok) {
                throw new Error('Error al agregar beneficio');
            }

            // Opcional: mostrar un toast o notificación de éxito
            // alert('¡Beneficio agregado exitosamente!');
            
        } catch (err) {
            console.error('Error al agregar beneficio:', err);
            // Opcional: mostrar mensaje de error
            // alert('Error al agregar el beneficio. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='benefit-item'>
            <div className='container-image'>
                <img 
                    className='image-benefit' 
                    src={benefit.route_jpg} 
                    alt={benefit.name || "beneficio"} 
                />
            </div>
            <div className='benefit-content'>
                <h3>{benefit.name}</h3>
                <p className='benefit-description'>De: {benefit.business_name}</p>
                <p className='benefit-description'>Ubicación: {benefit.location}</p>
                <div className='benefit-details'>
                    {benefit.discount && (
                        <span className='benefit-discount'>
                            🎁 {benefit.discount}% OFF
                        </span>
                    )}
                    {benefit.codes && (
                        <span className='benefit-codes'>
                            🎫 {benefit.codes} códigos
                        </span>
                    )}
                </div>
            </div>
            <div className='container-buttons-benefit'>
                <button 
                    onClick={handleAddBenefit} 
                    className={`btn-benefit ${userData.ispremium ? 'btn-premium' : 'btn-basic'} ${isLoading ? 'loading' : ''}`} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className='spinner-small'></span>
                            <span className='loading-text'>Procesando...</span>
                        </>
                    ) : userData.ispremium ? (
                        <>
                            ✨ Acceder a beneficio
                        </>
                    ) : (
                        <>
                            ⭐ Mejorar a Premium
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default BenefitCard;
