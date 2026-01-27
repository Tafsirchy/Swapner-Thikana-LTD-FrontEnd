'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Pencil, Move, RotateCcw, Search as SearchIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import Image from 'next/image';

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Custom gold marker
const goldIcon = typeof window !== 'undefined' ? new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

const MapController = ({ onMapChange, drawMode, setPolygonPoints }) => {
  const [showSearchArea, setShowSearchArea] = useState(false);
  const map = useMapEvents({
    moveend: () => {
      if (!drawMode) setShowSearchArea(true);
    },
    zoomend: () => {
      if (!drawMode) setShowSearchArea(true);
    },
    click: (e) => {
      if (drawMode) {
        setPolygonPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
      }
    }
  });

  const handleSearchArea = () => {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    onMapChange(`${sw.lat},${sw.lng},${ne.lat},${ne.lng}`);
    setShowSearchArea(false);
  };

  return (
    <>
      {showSearchArea && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
          <button 
            onClick={handleSearchArea}
            className="bg-brand-gold text-royal-deep px-6 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:bg-brand-gold-light transition-all animate-bounce"
          >
            <SearchIcon size={16} />
            Search this area
          </button>
        </div>
      )}
    </>
  );
};

const PropertiesMapView = ({ properties, onMapChange, onPolygonChange }) => {
  // Default center (Dhaka)
  const [center] = useState([23.8103, 90.4125]);
  const [drawMode, setDrawMode] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);

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
    
    const coords = cityCoords[city] || [23.8103, 90.4125];
    const randomOffset = () => (Math.random() - 0.5) * 0.02;
    return [coords[0] + randomOffset(), coords[1] + randomOffset()];
  };

  const getPropertyCoordinates = (property) => {
    if (property.coordinates?.lat && property.coordinates?.lng) {
      return [property.coordinates.lat, property.coordinates.lng];
    }
    return getCityCoordinates(property.location?.city);
  };

  const handleFinishDraw = () => {
    if (polygonPoints.length >= 3) {
      onPolygonChange(JSON.stringify(polygonPoints));
    }
    setDrawMode(false);
  };

  const handleResetDraw = () => {
    setPolygonPoints([]);
    onPolygonChange('');
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="h-[600px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
        <p className="text-zinc-400">No properties to display on map</p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] rounded-2xl overflow-hidden border border-white/10">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => setDrawMode(!drawMode)}
          className={`p-3 rounded-xl shadow-lg transition-all ${drawMode ? 'bg-brand-gold text-royal-deep' : 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800'}`}
          title={drawMode ? "Finish Drawing" : "Draw Search Area"}
        >
          {drawMode ? <Move size={20} /> : <Pencil size={20} />}
        </button>
        {polygonPoints.length > 0 && (
          <button 
            onClick={handleResetDraw}
            className="p-3 bg-zinc-900 text-zinc-100 rounded-xl shadow-lg hover:bg-zinc-800"
            title="Reset Area"
          >
            <RotateCcw size={20} />
          </button>
        )}
        {drawMode && polygonPoints.length >= 3 && (
          <button 
            onClick={handleFinishDraw}
            className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg"
          >
            Apply
          </button>
        )}
      </div>

      {drawMode && (
        <div className="absolute top-4 left-4 z-[1000] bg-brand-gold/90 text-royal-deep px-4 py-2 rounded-xl text-xs font-bold animate-pulse">
          Click on map to draw your search area...
        </div>
      )}

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
        
        <MapController 
          onMapChange={onMapChange} 
          drawMode={drawMode}
          setPolygonPoints={setPolygonPoints}
        />

        {polygonPoints.length > 0 && (
          <Polygon positions={polygonPoints} color="#D4AF37" fillOpacity={0.2} />
        )}

        <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
          {properties.map((property) => {
            const coords = getPropertyCoordinates(property);
            if (!coords) return null;
            
            return (
              <Marker key={property._id} position={coords} icon={goldIcon}>
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
