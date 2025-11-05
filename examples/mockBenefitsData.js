// EJEMPLO DE DATOS para probar el mapa
// Si necesitas datos de prueba, puedes usar estos

export const MOCK_BENEFITS = [
  {
    id: 1,
    name: "20% de descuento en almuerzos",
    business_name: "Restaurante El Sabor",
    location: "Av. Providencia 2330, Providencia, Santiago",
    discount: 20,
    q_of_codes: 50,
    category_id: 1,
    route_jpg: "https://via.placeholder.com/300x200"
  },
  {
    id: 2,
    name: "2x1 en cafés",
    business_name: "Café Central",
    location: "Paseo Ahumada 312, Santiago Centro, Santiago",
    discount: 50,
    q_of_codes: 100,
    category_id: 1,
    route_jpg: "https://via.placeholder.com/300x200"
  },
  {
    id: 3,
    name: "15% descuento en cortes de pelo",
    business_name: "Barbería Moderna",
    location: "Av. Italia 1234, Providencia, Santiago",
    discount: 15,
    q_of_codes: 30,
    category_id: 2,
    route_jpg: "https://via.placeholder.com/300x200"
  },
  {
    id: 4,
    name: "10% en gimnasio",
    business_name: "Gym Fitness",
    location: "Av. Las Condes 7700, Las Condes, Santiago",
    discount: 10,
    q_of_codes: 20,
    category_id: 3,
    route_jpg: "https://via.placeholder.com/300x200"
  },
  {
    id: 5,
    name: "30% en entradas de cine",
    business_name: "Cinemark Alto Las Condes",
    location: "Av. Kennedy 9001, Las Condes, Santiago",
    discount: 30,
    q_of_codes: 75,
    category_id: 4,
    route_jpg: "https://via.placeholder.com/300x200"
  }
];

// EJEMPLO DE BENEFICIOS CON COORDENADAS (después de optimizar el backend)
export const MOCK_BENEFITS_WITH_COORDS = [
  {
    id: 1,
    name: "20% de descuento en almuerzos",
    business_name: "Restaurante El Sabor",
    location: "Av. Providencia 2330, Providencia, Santiago",
    latitude: -33.4239,
    longitude: -70.6114,
    discount: 20,
    q_of_codes: 50,
    category_id: 1,
    route_jpg: "https://via.placeholder.com/300x200"
  },
  {
    id: 2,
    name: "2x1 en cafés",
    business_name: "Café Central",
    location: "Paseo Ahumada 312, Santiago Centro, Santiago",
    latitude: -33.4389,
    longitude: -70.6517,
    discount: 50,
    q_of_codes: 100,
    category_id: 1,
    route_jpg: "https://via.placeholder.com/300x200"
  }
];

// EJEMPLO DE USO en un componente:
/*
import { MOCK_BENEFITS } from './mockBenefitsData';
import MapBenefits from '../components/user-benefits/MapBenefits';

function TestMap() {
  return (
    <div style={{ height: '100vh', padding: '2rem' }}>
      <MapBenefits benefits={MOCK_BENEFITS} />
    </div>
  );
}
*/
