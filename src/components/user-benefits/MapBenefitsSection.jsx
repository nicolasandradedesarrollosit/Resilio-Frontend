import '../../styles/user-benefits/mapBenefitsSection.css';
import { useNavigate } from 'react-router-dom';

function MapBenefitsSection({ benefits }) {
    const navigate = useNavigate();
    
    const handleMapClick = () => {
        navigate('/user/map/benefits');
    };

    return (
        <>
            <h2>Mapa de beneficios</h2>
            <div 
                onClick={handleMapClick} 
                className='container-map'
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleMapClick()}
            >
                <div className='map-preview-content'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <p>Ver mapa interactivo</p>
                    <span className='map-benefit-count'>
                        {benefits?.length || 0} ubicaciones disponibles
                    </span>
                </div>
            </div>
        </>
    )
}

export default MapBenefitsSection;