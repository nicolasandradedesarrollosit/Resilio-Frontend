import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function BenefitCard({ benefit, userData }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [redeemedCode, setRedeemedCode] = useState(null);
    const navigate = useNavigate();
    const { refreshMyBenefits, refreshBenefits } = useContext(UserContext);

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

            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'ALREADY_REDEEMED') {
                    alert('Ya has canjeado este beneficio anteriormente');
                } else {
                    alert(data.message || 'Error al canjear el beneficio');
                }
                return;
            }

            // Guardar el código canjeado y mostrar modal de éxito
            setRedeemedCode(data.data.code);
            setShowSuccessModal(true);

            // Recargar los datos de beneficios y mis beneficios
            await refreshMyBenefits();
            await refreshBenefits();
            
        } catch (err) {
            console.error('Error al agregar beneficio:', err);
            alert('Error al canjear el beneficio. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        setRedeemedCode(null);
    };

    const isRedeemed = benefit.is_redeemed === true || benefit.is_redeemed === 'true';

    return (
        <>
            <div className={`benefit-item ${isRedeemed ? 'benefit-redeemed' : ''}`}>
                <div className='container-image'>
                    <img 
                        className='image-benefit' 
                        src={benefit.route_jpg} 
                        alt={benefit.name || "beneficio"} 
                    />
                    {isRedeemed && (
                        <div className='redeemed-badge'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Canjeado</span>
                        </div>
                    )}
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
                    {isRedeemed && benefit.redeemed_code && (
                        <div className='redeemed-code-info'>
                            <span className='code-label'>Tu código:</span>
                            <span className='code-value'>{benefit.redeemed_code}</span>
                        </div>
                    )}
                </div>
                <div className='container-buttons-benefit'>
                    {isRedeemed ? (
                        <button className='btn-benefit btn-already-redeemed' disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Ya Canjeado
                        </button>
                    ) : (
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
                    )}
                </div>
            </div>

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className='success-modal-overlay' onClick={closeModal}>
                    <div className='success-modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='success-icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h2>¡Beneficio Canjeado!</h2>
                        <p>Tu código de descuento es:</p>
                        <div className='code-display'>
                            {redeemedCode}
                        </div>
                        <p className='code-instructions'>
                            Muestra este código en <strong>{benefit.business_name}</strong> para aplicar tu descuento.
                        </p>
                        <p className='code-note'>
                            También puedes encontrar este código en la sección "Mis Beneficios".
                        </p>
                        <button className='btn-close-modal' onClick={closeModal}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default BenefitCard;
