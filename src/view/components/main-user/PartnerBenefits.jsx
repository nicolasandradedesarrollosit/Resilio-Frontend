import React, { useEffect, useState } from "react";
import '../../../styles/main-user/partnerBenefits.css'

function PartnerBenefits() {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataPartners = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/partners`);
                
                if(!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const result = await response.json();
                const data = result.data;
                
                if(result.ok && Array.isArray(data)) {
                    setBenefits(data);
                } else {
                    setBenefits([]);
                }
            }
            catch (error) {
                console.error("Error fetching partner benefits data:", error);
                setError("No se pudieron cargar los beneficios. Por favor, intenta más tarde.");
            } finally {
                setLoading(false);
            }
        }
        fetchDataPartners();
    }, [])

    if (loading) {
        return (
            <div className="partner_benefits_container">
                <div className="loading_state">
                    <p>Cargando beneficios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="partner_benefits_container">
                <div className="error_state">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return(
        <div className="partner_benefits_container">
            <h2 className="partner_benefits_title">Partners adheridos</h2>
            
            {benefits.length === 0 ? (
                <div className="empty_state">
                    <p>No hay beneficios disponibles en este momento.</p>
                </div>
            ) : (
                <div className="partner_benefits_grid">
                    {benefits.map((item, index) => (
                        <div key={item.id || index} className="partner_benefit_card">
                            <div className="benefit_image_wrapper">
                                <img 
                                    src={item.route_jpg} 
                                    alt={item.title || "Beneficio"} 
                                    className="benefit_image"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                            <div className="benefit_content">
                                <h3 className="benefit_title">{item.title}</h3>
                                <p className="benefit_description">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PartnerBenefits;