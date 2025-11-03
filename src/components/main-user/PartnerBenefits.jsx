import React, { useContext } from "react";
import { Link } from "react-router-dom";
import '../../styles/main-user/partnerBenefits.css'
import ErrorState from '../others/ErrorState';
import EmptyState from '../others/EmptyState';
import { UserContext } from '../context/UserContext';

function PartnerBenefits() {
    const { benefits, error } = useContext(UserContext);

    if (error) {
        return <ErrorState title="Error al cargar beneficios" message={error} />;
    }
    
    const formattedBenefits = benefits.map(item => ({
        ...item,
        q_of_codes: item.q_of_codes === null ? "ilimitados" : item.q_of_codes
    }));

    return(
        <div className="partner_benefits_container">
            <Link to={'/benefits/user'} className="benefits-title-link"><h2 className="partner-benefits-title">Red de beneficios</h2></Link>
            <p className="subtitle-benefits">Descubre los beneficios exclusivos que ofrecemos a nuestros socios.</p>
            
            {formattedBenefits.length === 0 ? (
                <EmptyState 
                    icon="gift"
                    title="No hay beneficios disponibles"
                    message="En este momento no tenemos beneficios para mostrar. Vuelve pronto para descubrir nuevas ofertas."
                />
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