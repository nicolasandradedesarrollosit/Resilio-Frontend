import '../../styles/user-benefits/userBenefitsSection.css'
import { useNavigate } from 'react-router-dom';

function MapBenefitsSection({ benefits }) {
    const navigate = useNavigate();
    return (
        <>
            <h2>Mapa de beneficios</h2>
            <div onClick={() => {
                navigate('user/map/benefits');
            }} className='container-map'>
                
            </div>
        </>
    )
}

export default MapBenefitsSection;