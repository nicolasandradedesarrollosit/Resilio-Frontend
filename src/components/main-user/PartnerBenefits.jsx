import React, { useContext } from "react";
import { Link } from "react-router-dom";
import '../../styles/main-user/partnerBenefits.css'
import LoadingScreen from '../others/LoadingScreen';
import { UserContext } from '../context/UserContext';

function PartnerBenefits() {
    const { benefits, loading, error } = useContext(UserContext);

    if (loading) {
        return <LoadingScreen message="Cargando beneficios" subtitle="Preparando ofertas exclusivas para ti" />;
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 27, 75, 0.85) 100%)',
                borderRadius: '16px',
                padding: '2rem',
                margin: '2rem',
                color: '#f8fafc'
            }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Error al cargar beneficios</h3>
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>{error}</p>
            </div>
        );
    }
    
    // Formatear datos de beneficios
    const formattedBenefits = benefits.map(item => ({
        ...item,
        q_of_codes: item.q_of_codes === null ? "ilimitados" : item.q_of_codes
    }));

    return(
        <div className="partner_benefits_container">
            <Link to={'/user/benefits'} className="benefits-title-link"><h2 className="partner-benefits-title">Red de beneficios</h2></Link>
            <p className="subtitle-benefits">Descubre los beneficios exclusivos que ofrecemos a nuestros socios.</p>
            
            {formattedBenefits.length === 0 ? (
                <div className="empty_state">
                    <p>No hay beneficios disponibles en este momento.</p>
                </div>
            ) : (
                <div className="partner_benefits_grid">
                    {formattedBenefits.map((item, index) => (
                        <div key={item.id || index} className="partner_benefit_card">
                            <div className="benefit_image_wrapper">
                                <img 
                                    src={item.route_jpg || "/logo-resilio-group.png"} 
                                    alt={item.name || "Beneficio"} 
                                    className="benefit_image"
                                />
                            </div>
                            <div className="benefit_content">
                                <h3 className="benefit_title">{item.name}</h3>
                                <p className="benefit_description">
                                    Descuento de: {item.discount}% hasta {item.q_of_codes} códigos.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PartnerBenefits;