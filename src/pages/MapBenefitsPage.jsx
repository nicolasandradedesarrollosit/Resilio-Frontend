import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../components/context/UserContext';
import MapBenefits from '../components/user-benefits/MapBenefits';
import '../styles/user-benefits/mapBenefitsPage.css';
import GoBack from '../components/others/GoBack'

function MapBenefitsPage() {
  const { benefits, loading } = useContext(UserContext);
  const [benefitsData, setBenefitsData] = useState([]);

  useEffect(() => {
    if (benefits && benefits.length > 0) {
      setBenefitsData(benefits);
    } else {
      setBenefitsData(null);
    }
  }, [benefits]);

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
          <GoBack dominio={'/benefits/user'} />
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
