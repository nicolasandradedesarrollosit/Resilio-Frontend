import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import BenefitCard from './BenefitCard'
import '../../styles/user-benefits/userBenefitsSection.css'

function BenefitsSection({ userData }) {
    const { benefits = [], loading } = useContext(UserContext);
    const [benefitsData, setBenefitsData] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);

    useEffect(() => {
        setBenefitsData(benefits);
    }, [benefits]);

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
                    <BenefitCard 
                        key={benefit.id ?? index} 
                        benefit={benefit}
                        userData={userData}
                    />
                ))}
            </div>
        </section>
    );
}

export default BenefitsSection;