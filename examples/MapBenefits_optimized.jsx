// FUTURO: MapBenefits.jsx optimizado con coordenadas del backend
// Este archivo muestra cómo modificar el componente cuando tengas coordenadas en la BD

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../../styles/user-benefits/mapBenefits.css';

// Fix para los iconos de Leaflet con Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function FitBounds({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
}

function MapBenefits({ benefits = [] }) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsGeocoding, setNeedsGeocoding] = useState([]);

  // Función para geocodificar (solo para fallback)
  const geocodeAddress = async (location, businessName, benefitId) => {
    try {
      const searchQuery = location.toLowerCase().includes('chile') 
        ? location 
        : `${location}, Chile`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'User-Agent': 'Resilio-Benefits-App'
          }
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          businessName,
          location,
          benefitId,
          success: true
        };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  useEffect(() => {
    const loadMarkers = async () => {
      setLoading(true);
      const markersData = [];
      const needsGeocodingData = [];

      // Procesar cada beneficio
      for (const benefit of benefits) {
        // Si tiene coordenadas en la BD, usarlas directamente
        if (benefit.latitude && benefit.longitude) {
          markersData.push({
            lat: benefit.latitude,
            lng: benefit.longitude,
            businessName: benefit.business_name || benefit.name,
            location: benefit.location,
            benefitId: benefit.id,
            fromDatabase: true
          });
        } 
        // Si no tiene coordenadas pero tiene location, intentar geocodificar
        else if (benefit.location) {
          needsGeocodingData.push(benefit);
        }
      }

      // Si hay beneficios que necesitan geocodificación, hacerlo como fallback
      if (needsGeocodingData.length > 0) {
        console.log(`⚠️ ${needsGeocodingData.length} negocios sin coordenadas. Geocodificando...`);
        
        for (let i = 0; i < needsGeocodingData.length; i++) {
          const benefit = needsGeocodingData[i];
          const result = await geocodeAddress(
            benefit.location,
            benefit.business_name || benefit.name,
            benefit.id
          );

          if (result.success) {
            markersData.push(result);
          }

          // Delay para no saturar la API
          if (i < needsGeocodingData.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      setMarkers(markersData);
      setNeedsGeocoding(needsGeocodingData.length);
      setLoading(false);
    };

    if (benefits.length > 0) {
      loadMarkers();
    } else {
      setLoading(false);
    }
  }, [benefits]);

  const defaultCenter = [-33.4489, -70.6693];
  const defaultZoom = 12;

  if (loading) {
    return (
      <div className="map-loading">
        <div className="spinner"></div>
        <p>Cargando ubicaciones de beneficios...</p>
        {needsGeocoding > 0 && (
          <small>Geocodificando {needsGeocoding} ubicaciones...</small>
        )}
      </div>
    );
  }

  return (
    <div className="map-benefits-container">
      <div className="map-info">
        <h3>Mapa de Beneficios</h3>
        <p>
          Mostrando {markers.length} de {benefits.length} ubicaciones
        </p>
        {needsGeocoding > 0 && (
          <div className="map-warning" style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: '#856404'
          }}>
            ℹ️ Algunas ubicaciones fueron geocodificadas en tiempo real. 
            Considera actualizar la base de datos con coordenadas para mejorar el rendimiento.
          </div>
        )}
      </div>

      {markers.length > 0 ? (
        <MapContainer
          center={markers.length > 0 ? [markers[0].lat, markers[0].lng] : defaultCenter}
          zoom={defaultZoom}
          className="map-container"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]}>
              <Popup>
                <div className="marker-popup">
                  <h4>{marker.businessName}</h4>
                  <p>{marker.location}</p>
                  <small>ID: {marker.benefitId}</small>
                  {marker.fromDatabase && (
                    <div style={{ 
                      marginTop: '0.5rem', 
                      fontSize: '0.7rem', 
                      color: '#28a745' 
                    }}>
                      ✓ Coordenadas desde BD
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          <FitBounds markers={markers} />
        </MapContainer>
      ) : (
        <div className="map-empty">
          <p>No hay ubicaciones disponibles para mostrar en el mapa</p>
        </div>
      )}
    </div>
  );
}

export default MapBenefits;
