import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function BenefitCard({ benefit, userData, onBenefitRedeemed }) {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { refreshMyBenefits, refreshBenefits } = useContext(UserContext);

    const handleAddBenefit = async () => {
        try {
            setErrorMessage('');
            setSuccessMessage('');
            
            // Verificación de premium
            const isPremium = userData.ispremium === true || userData.ispremium === 'true';
            
            if (!isPremium) {
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

            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'ALREADY_REDEEMED') {
                    setErrorMessage('Ya has canjeado este beneficio anteriormente');
                } else {
                    setErrorMessage(data.message || 'Error al canjear el beneficio');
                }
                setIsLoading(false);
                return;
            }

            // Mostrar mensaje de éxito con el código
            setSuccessMessage(`¡Beneficio canjeado! Tu código es: ${data.data.code}`);

            // Recargar beneficios
            await Promise.all([
                refreshMyBenefits(),
                refreshBenefits()
            ]);

            // Notificar al componente padre
            if (onBenefitRedeemed) {
                onBenefitRedeemed(benefit.id);
            }
            
        } catch (err) {
            console.error('Error al agregar beneficio:', err);
            setErrorMessage('Error al canjear el beneficio. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
                    {errorMessage && (
                        <div className='benefit-error-message'>
                            ⚠️ {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className='benefit-success-message'>
                            ✅ {successMessage}
                        </div>
                    )}
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
                                ✨ Canjear beneficio
                            </>
                        ) : (
                            <>
                                ⭐ Mejorar a Premium
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

export default BenefitCard;
