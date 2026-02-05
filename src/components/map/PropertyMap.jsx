'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom gold marker icon
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const PropertyMap = ({ property, height = '400px' }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Default coordinates for Dhaka
  const defaultLat = 23.8103;
  const defaultLng = 90.4125;

  const getCityCoordinates = (city) => {
    const cityCoords = {
      'Dhaka': [23.8103, 90.4125],
      'Chittagong': [22.3569, 91.7832],
      'Sylhet': [24.8949, 91.8687],
      'Khulna': [22.8456, 89.5403],
      'Rajshahi': [24.3745, 88.6042],
      'Barisal': [22.7010, 90.3535],
      'Rangpur': [25.7439, 89.2752],
      'Mymensingh': [24.7471, 90.4203]
    };
    return cityCoords[city] || [defaultLat, defaultLng];
  };

  const coords = React.useMemo(() => {
    if (property.coordinates?.lat && property.coordinates?.lng) {
      return [property.coordinates.lat, property.coordinates.lng];
    }
    return getCityCoordinates(property.location?.city);
  }, [property]);

  const [lat, lng] = coords;

  if (!isMounted) {
    return (
      <div className="rounded-2xl bg-white/5 animate-pulse border border-white/10" style={{ height }}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="flex items-center justify-center bg-white/5 rounded-2xl border border-white/10" style={{ height }}>
        <p className="text-zinc-500 text-sm">Location coordinates unavailable</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 isolation-auto" style={{ height }}>
      <MapContainer
        key={`map-${property._id}-${lat}-${lng}`}
        center={[lat, lng]}
        zoom={property.coordinates?.lat ? 15 : 12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={goldIcon}>
          <Popup>
            <div className="p-2 min-w-[150px]">
              <h3 className="font-bold text-sm mb-1 text-zinc-900">{property.title}</h3>
              <p className="text-xs text-zinc-600 italic mb-2">{property.location?.area}, {property.location?.city}</p>
              <div className="text-xs font-bold text-brand-gold bg-zinc-900 px-2 py-1 rounded inline-block">
                ৳{property.price?.toLocaleString('en-BD')}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
