'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import Image from 'next/image';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom gold marker
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const PropertiesMapView = ({ properties }) => {
  // Default center (Dhaka)
  const [center] = useState([23.8103, 90.4125]);

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
    
    // Add some randomness to prevent exact overlaps
    const coords = cityCoords[city] || [23.8103, 90.4125];
    const randomOffset = () => (Math.random() - 0.5) * 0.02; // ~1-2km offset
    return [coords[0] + randomOffset(), coords[1] + randomOffset()];
  };

  const getPropertyCoordinates = (property) => {
    if (property.coordinates?.lat && property.coordinates?.lng) {
      return [property.coordinates.lat, property.coordinates.lng];
    }
    return getCityCoordinates(property.location?.city);
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="h-[600px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
        <p className="text-zinc-400">No properties to display on map</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
        >
          {properties.map((property) => {
            const [lat, lng] = getPropertyCoordinates(property);
            
            return (
              <Marker key={property._id} position={[lat, lng]} icon={goldIcon}>
                <Popup maxWidth={300}>
                  <Link href={`/properties/${property.slug}`} className="block">
                    <div className="w-full">
                      {property.images?.[0] && (
                        <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden">
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-sm mb-1 line-clamp-1">{property.title}</h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {property.location?.area}, {property.location?.city}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-600">
                          ৳{property.price?.toLocaleString('en-BD')}
                        </span>
                        <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                          {property.propertyType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>🛏️ {property.bedrooms}</span>
                        <span>🛁 {property.bathrooms}</span>
                        <span>📐 {property.size} sqft</span>
                      </div>
                    </div>
                  </Link>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default PropertiesMapView;
