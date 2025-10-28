import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext'
import '../../styles/user-benefits/userBenefitsSection.css'

function BenefitsSection() {
    const { benefits = [], loading } = useContext(UserContext) || {};

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
            <div className='benefits-events-user-container'>
                {benefits.map((benefit, index) => (
                    <div key={benefit.id ?? index} className='benefit-item'>
                        <h3>{benefit.name ?? benefit.title}</h3>
                        <p>{benefit.description ?? benefit.discount ?? ''}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BenefitsSection;