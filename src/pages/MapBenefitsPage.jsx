import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/context/UserContext';
import MapBenefits from '../components/user-benefits/MapBenefits';
import '../styles/user-benefits/mapBenefitsPage.css';

function MapBenefitsPage() {
  const navigate = useNavigate();
  const { benefits, loading } = useContext(UserContext);
  const [benefitsData, setBenefitsData] = useState([]);

  useEffect(() => {
    if (benefits) {
      setBenefitsData(benefits);
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
        {benefitsData.length > 0 ? (
          <MapBenefits benefits={benefitsData} />
        ) : (
          <div className="map-page-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"/>
            </svg>
            <h2>No hay beneficios disponibles</h2>
            <p>Por el momento no hay beneficios para mostrar en el mapa</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapBenefitsPage;
