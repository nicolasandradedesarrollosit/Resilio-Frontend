import '../../styles/user-benefits/userBenefitsSection.css';
import { useNavigate } from 'react-router-dom';

// MOCK DATA para demostración al cliente
const MOCK_BENEFITS = [
    {
        id: 1,
        name: "20% de descuento en almuerzos",
        business_name: "Restaurante El Sabor",
        location: "Av. Providencia 2330, Providencia, Santiago, Chile",
        discount: 20,
        q_of_codes: 50,
        category_id: 1,
        route_jpg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
    },
    {
        id: 2,
        name: "2x1 en cafés",
        business_name: "Café Central",
        location: "Paseo Ahumada 312, Santiago Centro, Santiago, Chile",
        discount: 50,
        q_of_codes: 100,
        category_id: 1,
        route_jpg: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"
    },
    {
        id: 3,
        name: "15% descuento en cortes de pelo",
        business_name: "Barbería Moderna",
        location: "Av. Italia 1234, Providencia, Santiago, Chile",
        discount: 15,
        q_of_codes: 30,
        category_id: 2,
        route_jpg: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400"
    },
    {
        id: 4,
        name: "10% en membresía mensual",
        business_name: "Gym Fitness Pro",
        location: "Av. Las Condes 7700, Las Condes, Santiago, Chile",
        discount: 10,
        q_of_codes: 20,
        category_id: 3,
        route_jpg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"
    },
    {
        id: 5,
        name: "30% en entradas de cine",
        business_name: "Cinemark Alto Las Condes",
        location: "Av. Kennedy 9001, Las Condes, Santiago, Chile",
        discount: 30,
        q_of_codes: 75,
        category_id: 4,
        route_jpg: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400"
    },
    {
        id: 6,
        name: "25% en pizzas familiares",
        business_name: "Pizzería Roma",
        location: "Av. Apoquindo 4900, Las Condes, Santiago, Chile",
        discount: 25,
        q_of_codes: 40,
        category_id: 1,
        route_jpg: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"
    },
    {
        id: 7,
        name: "15% en productos de belleza",
        business_name: "Beauty Store",
        location: "Mall Parque Arauco, Av. Kennedy 5413, Las Condes, Santiago, Chile",
        discount: 15,
        q_of_codes: 60,
        category_id: 2,
        route_jpg: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"
    },
    {
        id: 8,
        name: "40% en clases de yoga",
        business_name: "Yoga Center Santiago",
        location: "Av. El Bosque Norte 500, Las Condes, Santiago, Chile",
        discount: 40,
        q_of_codes: 25,
        category_id: 3,
        route_jpg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"
    }
];

function MapBenefitsSection({ benefits = [] }) {
    const navigate = useNavigate();
    
    // Usar MOCK_BENEFITS si benefits está vacío (para demo al cliente)
    const displayBenefits = benefits.length > 0 ? benefits : MOCK_BENEFITS;
    
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
                        {displayBenefits?.length || 0} ubicaciones disponibles
                    </span>
                </div>
            </div>
        </>
    )
}

export default MapBenefitsSection;