import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import '../../styles/user-benefits/userBenefitsSection.css'
import { useNavigate } from 'react-router-dom';

function BenefitsSection({ userData }) {
    const { benefits = [], loading } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [benefitsData, setBenefitsData] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setBenefitsData(benefits);
    }, [benefits]);

    const handleAddBenefit = async (benefit) => {
        try {
            if (userData.isPremium === false) {
                navigate('/user/plans');
                return;
            }
            setIsLoading(true);
            await fetch(`${import.meta.env.VITE_API_URL}/benefits/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.id,
                    benefitId: benefit.id
                })
            });
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    }

    const filterBenefits = (e) => {
        const buttonValue = e.target.value;
        setActiveFilter(buttonValue);
        
        if (buttonValue === 'all') {
            setBenefitsData(benefits);
        } else {
            const filteredBenefits = benefits.filter(benefit => benefit.category_id === buttonValue);
            setBenefitsData(filteredBenefits);
        }
    }

    if (loading) return null;

    if (!Array.isArray(benefits) || benefits.length === 0) {
        return (
            <section className='benefits-events-user'>
                <h2>Beneficios para ti</h2>
                <div className='benefits-events-user-container'>
                    <p>No hay beneficios disponibles por el momento.</p>
                </div>
            </section>
        );
    }

    return (
        <section className='benefits-events-user'>
            <h2>Beneficios para ti</h2>
            <div className='container-filters'>
                <button 
                    className={`button-filter-benefit ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={filterBenefits} 
                    value='all'
                >
                    Todos
                </button>
                <button 
                    className={`button-filter-benefit ${activeFilter === '1' ? 'active' : ''}`}
                    onClick={filterBenefits} 
                    value='1'
                >
                    🍽️ Comida
                </button>
                <button 
                    className={`button-filter-benefit ${activeFilter === '2' ? 'active' : ''}`}
                    onClick={filterBenefits} 
                    value='2'
                >
                    🔧 Servicios
                </button>
                <button 
                    className={`button-filter-benefit ${activeFilter === '3' ? 'active' : ''}`}
                    onClick={filterBenefits} 
                    value='3'
                >
                    👕 Ropa
                </button>
                <button 
                    className={`button-filter-benefit ${activeFilter === '4' ? 'active' : ''}`}
                    onClick={filterBenefits} 
                    value='4'
                >
                    🎮 Entretenimiento
                </button>
            </div>
            <div className='benefits-events-user-container'>
                {benefitsData?.map((benefit, index) => (
                    <div key={benefit.id ?? index} className='benefit-item'>
                        <div className='container-image'>
                            <img 
                                className='image-benefit' 
                                src={benefit.route_jpg || 'https://via.placeholder.com/400x250'} 
                                alt={benefit.name || "beneficio"} 
                            />
                        </div>
                        <div className='benefit-content'>
                            <h3>{benefit.name ?? benefit.title}</h3>
                            <p className='benefit-description'>{benefit.description ?? ''}</p>
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
                                onClick={() => handleAddBenefit(benefit)} 
                                className={`btn-benefit ${userData.isPremium ? 'btn-premium' : 'btn-basic'} ${isLoading ? 'loading' : ''}`} 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className='spinner'></span>
                                        Procesando...
                                    </>
                                ) : userData.isPremium ? (
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
                ))}
            </div>
        </section>
    );
}

export default BenefitsSection;