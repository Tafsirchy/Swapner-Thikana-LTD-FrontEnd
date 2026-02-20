'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  GraduationCap, 
  Hospital, 
  ShoppingBag, 
  Trees, 
  Train,
  Loader2
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

const CATEGORIES = [
  { id: 'education', name: 'Education', icon: <GraduationCap size={18} />, query: 'node["amenity"~"school|university|college"]' },
  { id: 'health', name: 'Health', icon: <Hospital size={18} />, query: 'node["amenity"~"hospital|clinic|pharmacy"]' },
  { id: 'shopping', name: 'Shopping', icon: <ShoppingBag size={18} />, query: 'node["shop"~"supermarket|mall|convenience"]' },
  { id: 'recreation', name: 'Parks', icon: <Trees size={18} />, query: 'node["leisure"~"park|garden|playground"]' },
  { id: 'transit', name: 'Transit', icon: <Train size={18} />, query: 'node["highway"~"bus_stop"]["public_transport"~"stop_position"]' },
];

const NearbyPlaces = ({ lat: initialLat, lng: initialLng, address, radius = 5000 }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [places, setPlaces] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });

  // Map Components (dynamically imported to avoid SSR issues)
  const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
  const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
  const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
  const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

  // Helper to create custom Leaflet icons using Lucide React components
  const createCustomIcon = (iconNode, color = '#D4AF37') => {
    const iconHtml = renderToStaticMarkup(
      <div className="relative flex items-center justify-center w-8 h-8 bg-zinc-900 border-2 border-white rounded-full shadow-lg" style={{ borderColor: color }}>
        <div className="text-white transform scale-75">
           {iconNode}
        </div>
        <div className="absolute -bottom-1 w-2 h-2 bg-zinc-900 border-r-2 border-b-2 border-white transform rotate-45" style={{ borderColor: color }}></div>
      </div>
    );

    return L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 36], // Point at bottom center
      popupAnchor: [0, -36],
    });
  };

  // Component to handle map interactions like fitting bounds
  const MapController = ({ markers }) => {
    const map = useMap();
    
    useEffect(() => {
      if (!markers || markers.length === 0) return;
      
      const group = new L.FeatureGroup(
        markers.map(m => L.marker([m.lat, m.lon]))
      );
      
      // Add current location to bounds
      if (coords.lat && coords.lng) {
        group.addLayer(L.marker([coords.lat, coords.lng]));
      }

      map.fitBounds(group.getBounds().pad(0.1), {
          padding: [50, 50],
          maxZoom: 16,
          duration: 1 // smooth animation
      });
    }, [markers, map]);

    return null;
  };

  // Geocoding Fallback
  useEffect(() => {
    const resolveCoords = async () => {
      if (initialLat && initialLng) {
        setCoords({ lat: initialLat, lng: initialLng });
        return;
      }

      if (address) {
        try {
          const response = await fetch(`/api/locations/geocode?q=${encodeURIComponent(address)}`);
          const data = await response.json();
          if (data && data[0]) {
            setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          }
        } catch (error) {
          console.error("Geocoding failed:", error);
        }
      }
    };

    resolveCoords();
  }, [initialLat, initialLng, address]);

  const fetchAllNearby = useCallback(async () => {
    if (!coords.lat || !coords.lng) return;

    const deg2rad = (deg) => deg * (Math.PI/180);
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return Math.round(R * c * 10) / 10;
    };

    const performNearbySearch = async () => {
      if (!coords.lat || !coords.lng) return;

      try {
        setLoading(true);
        setError(null);
        
        let data;
        try {
            // Fetch from our internal backend proxy (which handles caching and multiple providers)
            const response = await fetch(`/api/locations/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`);
            if (!response.ok) throw new Error('Network response was not ok');
            data = await response.json();
            
            // Check for API-specific error format
            if (data.error) throw new Error(data.error);
        } catch (apiError) {
            console.warn('Location API failed:', apiError.message);
            // No fallback, just return empty to show "No places found"
            data = { elements: [] };
        }
        
        const newPlaces = {};
        CATEGORIES.forEach(cat => {
          newPlaces[cat.id] = data.elements.filter(el => {
            const tags = el.tags || {};
            const q = cat.query;
            if (q.includes('amenity')) return tags.amenity && q.includes(tags.amenity);
            if (q.includes('shop')) return tags.shop && q.includes(tags.shop);
            if (q.includes('leisure')) return tags.leisure && q.includes(tags.leisure);
            if (q.includes('highway')) return tags.highway === 'bus_stop' || tags.public_transport === 'stop_position';
            return false;
          }).map(el => ({
            id: el.id,
            lat: el.lat,
            lon: el.lon,
            name: el.tags.name || el.tags.amenity || el.tags.shop || el.tags.leisure || 'Unnamed place',
            distance: calculateDistance(coords.lat, coords.lng, el.lat, el.lon),
            type: el.tags.amenity || el.tags.shop || el.tags.leisure || 'Place',
            categoryIcon: cat.icon 
          })).sort((a, b) => a.distance - b.distance).slice(0, 10);
        });

        setPlaces(newPlaces);
      } catch (error) {
        console.error('Error in nearby places logic:', error);
        // Even if mock fails (unlikely), show error msg
        setError('Unable to load nearby places.');
      } finally {
        setLoading(false);
      }
    };
    
    performNearbySearch();
  }, [coords, radius]);

  useEffect(() => {
    fetchAllNearby();
  }, [fetchAllNearby]);

  return (
    <div className="space-y-8">
      {/* Category Selection - Mobile First Grid */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 min-[640px]:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center justify-center lg:justify-start gap-3 px-5 h-14 md:h-12 rounded-2xl border text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeCategory === cat.id 
                ? 'bg-brand-gold text-royal-deep border-brand-gold shadow-lg shadow-brand-gold/30 scale-[1.02]' 
                : 'bg-white/5 border-white/10 text-zinc-500 hover:border-brand-gold/30 hover:text-zinc-300'
            }`}
          >
            <span className={activeCategory === cat.id ? 'text-royal-deep' : 'text-brand-gold'}>
              {cat.icon}
            </span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {/* List View - Optimized for scannability */}
         <div className="lg:col-span-1 space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-2" data-lenis-prevent>
            {error ? (
               <div className="text-center py-10 px-6 text-zinc-400 bg-white/5 rounded-3xl border border-white/5">
                 <p className="text-sm italic">{error}</p>
                 <button 
                   onClick={fetchAllNearby}
                   className="mt-4 px-6 py-2 rounded-xl bg-brand-gold/10 text-brand-gold text-xs font-bold hover:bg-brand-gold/20 transition-all"
                 >
                   Try Again
                 </button>
               </div>
            ) : loading ? (
               <div className="flex flex-col items-center justify-center h-48 text-zinc-500 gap-4">
                  <Loader2 className="animate-spin text-brand-gold" size={28} />
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Discovering Nearby...</p>
               </div>
            ) : places[activeCategory]?.length > 0 ? (
               places[activeCategory].map((place, idx) => (
                  <div 
                    key={idx}
                    className="group flex items-center justify-between p-4 bg-zinc-950/40 border border-white/5 rounded-2xl hover:border-brand-gold/40 hover:bg-zinc-900 transition-all cursor-default"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-200 text-sm group-hover:text-brand-gold transition-colors line-clamp-2">{place.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter italic">
                        {place.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-gold/5 rounded-lg border border-brand-gold/10">
                      <span className="text-[11px] text-brand-gold font-bold font-mono">{place.distance}</span>
                      <span className="text-[9px] text-brand-gold/60 font-bold">KM</span>
                    </div>
                  </div>
               ))
            ) : (
               <div className="p-6 text-center text-zinc-500 bg-white/5 rounded-xl border border-white/5 dashed">
                  <p className="text-sm">No {CATEGORIES.find(c => c.id === activeCategory)?.name} found nearby.</p>
               </div>
            )}
         </div>

         {/* Map View */}
         <div className="lg:col-span-2 h-[400px] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 relative z-0">
            {(coords.lat && coords.lng) ? (
               <MapContainer 
                  center={[coords.lat, coords.lng]} 
                  zoom={14} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
               >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  
                  {/* Auto-Fit Bounds Controller */}
                  {places[activeCategory]?.length > 0 && (
                    <MapController markers={places[activeCategory]} />
                  )}

                  {/* Property Center Marker */}
                  <Marker 
                    position={[coords.lat, coords.lng]}
                    icon={createCustomIcon(<div className="w-3 h-3 bg-brand-gold rounded-full animate-pulse" />, '#D4AF37')}
                  >
                     <Popup className="custom-popup">
                        <div className="text-royal-deep font-bold text-sm">Property Location</div>
                     </Popup>
                  </Marker>

                  {/* Amenity Markers */}
                  {places[activeCategory]?.map((place, idx) => (
                     <Marker 
                        key={idx} 
                        position={[place.lat, place.lon]}
                        icon={createCustomIcon(place.categoryIcon || CATEGORIES.find(c => c.id === activeCategory)?.icon, '#ffffff')}
                     >
                        <Popup className="custom-popup">
                           <div className="min-w-[150px]">
                               <h5 className="font-bold text-royal-deep mb-1 text-sm">{place.name}</h5>
                               <p className="text-xs text-zinc-600 capitalize mb-2">{place.type.replace(/_/g, ' ')}</p>
                               <div className="flex items-center justify-between border-t border-zinc-200 pt-2 mt-2">
                                  <span className="text-xs font-bold text-zinc-500">{place.distance} KM</span>
                                  <a 
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-royal-blue hover:underline flex items-center gap-1"
                                  >
                                    Get Directions &rarr;
                                  </a>
                               </div>
                           </div>
                        </Popup>
                     </Marker>
                  ))}
               </MapContainer>
            ) : (
               <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                  <p>Map unavailable for this location</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default NearbyPlaces;
