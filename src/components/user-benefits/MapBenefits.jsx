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
  const [geocodingErrors, setGeocodingErrors] = useState([]);

  // Función para geocodificar una dirección usando Nominatim (OpenStreetMap)
  const geocodeAddress = async (location, businessName, benefitId) => {
    try {
      // Agregar "Chile" a la búsqueda si no está incluido (ajusta según tu país)
      const searchQuery = location.toLowerCase().includes('chile') 
        ? location 
        : `${location}, Chile`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'User-Agent': 'Resilio-Benefits-App' // Nominatim requiere un User-Agent
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error en la geocodificación');
      }

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
      } else {
        return {
          businessName,
          location,
          benefitId,
          success: false,
          error: 'No se encontraron coordenadas'
        };
      }
    } catch (error) {
      console.error(`Error geocodificando ${location}:`, error);
      return {
        businessName,
        location,
        benefitId,
        success: false,
        error: error.message
      };
    }
  };

  useEffect(() => {
    const loadMarkers = async () => {
      setLoading(true);
      setGeocodingErrors([]);

      const results = [];
      const errors = [];

      for (let i = 0; i < benefits.length; i++) {
        const benefit = benefits[i];
        
        if (benefit.location) {
          const result = await geocodeAddress(
            benefit.location,
            benefit.business_name || benefit.name,
            benefit.id
          );

          if (result.success) {
            results.push(result);
          } else {
            errors.push(result);
          }

          if (i < benefits.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      setMarkers(results);
      setGeocodingErrors(errors);
      setLoading(false);
    };

    if (benefits.length > 0) {
      loadMarkers();
    } else {
      setLoading(false);
    }
  }, [benefits]);

  // Centro por defecto (Santiago, Chile - ajusta según tu ubicación)
  const defaultCenter = [-33.4489, -70.6693];
  const defaultZoom = 12;

  if (loading) {
    return (
      <div className="map-loading">
        <div className="spinner"></div>
        <p>Cargando ubicaciones de beneficios...</p>
        <small>Esto puede tomar unos momentos</small>
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
        {geocodingErrors.length > 0 && (
          <details className="map-errors">
            <summary>
              ⚠️ {geocodingErrors.length} ubicaciones no pudieron ser mapeadas
            </summary>
            <ul>
              {geocodingErrors.map((error, index) => (
                <li key={index}>
                  <strong>{error.businessName}:</strong> {error.location}
                  <br />
                  <small>{error.error}</small>
                </li>
              ))}
            </ul>
          </details>
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
