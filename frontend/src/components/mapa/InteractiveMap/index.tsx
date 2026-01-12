import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Chip, IconButton, Paper } from '@mui/material';
import { LocationOn, MyLocation } from '@mui/icons-material';

// ícones do leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// capturar cliques no mapa
const LocationMarker: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
  editable: boolean;
}> = ({ onLocationSelect, initialPosition, editable }) => {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);

  useMapEvents({
    click(e) {
      if (editable) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        <Typography variant="body2">Local selecionado</Typography>
        <Typography variant="caption" display="block">
          Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
        </Typography>
      </Popup>
    </Marker>
  ) : null;
};

interface PlantMarker {
  id: string;
  position: [number, number];
  planta: {
    nomePopular: string;
    nomeCientifico?: string;
    comestivel: boolean;
    medicinal: boolean;
    imagemUrl?: string;
  };
}

interface InteractiveMapProps {
  markers?: PlantMarker[];
  onMarkerClick?: (marker: PlantMarker) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  editable?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: string | number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  markers = [],
  onMarkerClick,
  onLocationSelect,
  editable = false,
  initialCenter = [-15.833625950102766, -48.056869816799846], // Av Central, Taguatinga, Brasília-Df
  initialZoom = 12,
  height = 400,
}) => {
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Erro ao obter localização:', error);
        }
      );
    }
  }, []);

  // ícones customizados para plantas
  const createCustomIcon = (comestivel: boolean, medicinal: boolean) => {
    let color = '#666666';
    
    if (comestivel && medicinal) color = '#22c55e';
    else if (comestivel) color = '#3b82f6';
    else if (medicinal) color = '#ef4444'; 
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        ">
          <span style="margin-top: -1px;">P</span>
        </div>
      `,
      className: 'custom-marker-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Ícone para usuário
  const userIcon = L.divIcon({
    html: `
      <div style="
        background-color: #8b5cf6;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
      ">
        <span>Você</span>
      </div>
    `,
    className: 'user-marker-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const handleLocateUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);
    }
  };

  return (
    <Box sx={{ width: '100%', height, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
      <MapContainer
        center={userLocation || initialCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcadores de plantas */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createCustomIcon(marker.planta.comestivel, marker.planta.medicinal)}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {marker.planta.nomePopular}
                </Typography>
                {marker.planta.nomeCientifico && (
                  <Typography variant="caption" color="text.secondary">
                    {marker.planta.nomeCientifico}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {marker.planta.comestivel && (
                    <Chip label="Comestível" size="small" color="success" />
                  )}
                  {marker.planta.medicinal && (
                    <Chip label="Medicinal" size="small" color="error" />
                  )}
                </Box>
                {marker.planta.imagemUrl && (
                  <Box
                    component="img"
                    src={marker.planta.imagemUrl}
                    sx={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mt: 1,
                    }}
                  />
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Clique para mais detalhes
                </Typography>
              </Box>
            </Popup>
          </Marker>
        ))}
        
        {/* Marcador de usuário */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <Typography variant="body2">Sua localização atual</Typography>
            </Popup>
          </Marker>
        )}
        
        {/* Componente para seleção de localização (se editável) */}
        {editable && onLocationSelect && (
          <LocationMarker
            onLocationSelect={onLocationSelect}
            editable={editable}
            initialPosition={initialCenter}
          />
        )}
      </MapContainer>
      
      {/* Controles */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {userLocation && (
          <Paper elevation={2} sx={{ borderRadius: 1, overflow: 'hidden' }}>
            <IconButton
              onClick={handleLocateUser}
              sx={{ backgroundColor: 'white' }}
              title="Localizar minha posição"
            >
              <MyLocation />
            </IconButton>
          </Paper>
        )}
        
        {editable && (
          <Paper elevation={2} sx={{ p: 1.5, borderRadius: 1 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOn color="primary" fontSize="small" />
              <Typography variant="caption" display="block">
                Clique no mapa para selecionar
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default InteractiveMap;