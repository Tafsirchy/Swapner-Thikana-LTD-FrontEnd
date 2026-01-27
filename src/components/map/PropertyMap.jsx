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
  // Default coordinates for Dhaka if no coordinates provided
  const defaultLat = 23.8103;
  const defaultLng = 90.4125;

  // Use property coordinates or estimate based on city (simplified)
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

  const [lat, lng] = property.coordinates?.lat && property.coordinates?.lng
    ? [property.coordinates.lat, property.coordinates.lng]
    : getCityCoordinates(property.location?.city);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height }}>
      <MapContainer
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
            <div className="p-2">
              <h3 className="font-bold text-sm mb-1">{property.title}</h3>
              <p className="text-xs text-gray-600">{property.location?.area}, {property.location?.city}</p>
              <p className="text-xs font-bold text-amber-600 mt-1">
                ৳{property.price?.toLocaleString('en-BD')}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
