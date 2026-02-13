'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Search as SearchIcon, Building2, MapPin, Calendar } from 'lucide-react';
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

const MapController = ({ onMapChange }) => {
  const [showSearchArea, setShowSearchArea] = useState(false);
  const map = useMapEvents({
    moveend: () => setShowSearchArea(true),
    zoomend: () => setShowSearchArea(true),
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

const ProjectsMapView = ({ projects, onMapChange }) => {
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
    
    const coords = cityCoords[city] || [23.8103, 90.4125];
    const randomOffset = () => (Math.random() - 0.5) * 0.01;
    return [coords[0] + randomOffset(), coords[1] + randomOffset()];
  };

  const getProjectCoordinates = (project) => {
    if (project.location?.latitude && project.location?.longitude) {
      return [parseFloat(project.location.latitude), parseFloat(project.location.longitude)];
    }
    return getCityCoordinates(project.location?.city);
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="h-[600px] rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center">
        <p className="text-zinc-400">No projects to display on map</p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {onMapChange && <MapController onMapChange={onMapChange} />}

        <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
          {projects.map((project) => {
            const coords = getProjectCoordinates(project);
            if (!coords) return null;
            
            return (
              <Marker key={project._id} position={coords} icon={goldIcon}>
                <Popup maxWidth={280} className="project-popup">
                  <Link href={`/projects/${project.slug}`} className="block group">
                    <div className="w-full">
                      {project.thumbnail && (
                        <div className="relative w-full h-32 mb-3 rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-2 right-2 px-2 py-1 bg-brand-gold text-royal-deep text-[8px] font-black uppercase rounded-md shadow-lg">
                            {project.status}
                          </div>
                        </div>
                      )}
                      <h3 className="font-bold text-zinc-900 text-sm mb-1 break-all break-words">{project.title}</h3>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-2 font-medium">
                        <MapPin size={10} className="text-brand-gold shrink-0" />
                        <span className="break-all break-words">{project.location?.address || project.location?.city}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-zinc-100">
                        <div className="flex flex-col">
                           <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Type</span>
                           <span className="text-xs text-zinc-700 font-bold capitalize">{project.type}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Handover</span>
                           <span className="text-xs text-zinc-700 font-bold">{project.handoverDate || 'TBA'}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.1em]">Starting From</span>
                            <span className="text-sm font-bold text-zinc-900">{project.pricePerSqFt || 'Exclusive'}</span>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-royal-deep transition-all duration-300">
                            <Building2 size={14} />
                         </div>
                      </div>
                    </div>
                  </Link>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      <style jsx global>{`
        .project-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 1.5rem;
          padding: 0.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .project-popup .leaflet-popup-tip {
          background: white;
        }
        .project-popup .leaflet-popup-content {
          margin: 0.75rem;
          width: auto !important;
        }
      `}</style>
    </div>
  );
};

export default ProjectsMapView;
