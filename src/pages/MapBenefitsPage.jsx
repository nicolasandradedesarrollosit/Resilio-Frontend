import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/context/UserContext';
import MapBenefits from '../components/user-benefits/MapBenefits';
import '../styles/user-benefits/mapBenefitsPage.css';

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

function MapBenefitsPage() {
  const navigate = useNavigate();
  const { benefits, loading } = useContext(UserContext);
  const [benefitsData, setBenefitsData] = useState([]);

  useEffect(() => {
    // Usar benefits del contexto si existen, sino usar MOCK_BENEFITS para demo
    if (benefits && benefits.length > 0) {
      setBenefitsData(benefits);
    } else {
      setBenefitsData(MOCK_BENEFITS);
    }
  }, [benefits]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="map-page-loading">
        <div className="spinner"></div>
        <p>Cargando beneficios...</p>
      </div>
    );
  }

  return (
    <div className="map-benefits-page">
      <div className="map-page-header">
        <button onClick={handleGoBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Volver
        </button>
        <h1>Mapa de Beneficios</h1>
        <p>Encuentra todos los negocios con beneficios cerca de ti</p>
      </div>

      <div className="map-page-content">
        <MapBenefits benefits={benefitsData} />
      </div>
    </div>
  );
}

export default MapBenefitsPage;
