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

const CATEGORIES = [
  { id: 'education', name: 'Education', icon: <GraduationCap size={18} />, query: 'node["amenity"~"school|university|college"]' },
  { id: 'health', name: 'Health', icon: <Hospital size={18} />, query: 'node["amenity"~"hospital|clinic|pharmacy"]' },
  { id: 'shopping', name: 'Shopping', icon: <ShoppingBag size={18} />, query: 'node["shop"~"supermarket|mall|convenience"]' },
  { id: 'recreation', name: 'Parks', icon: <Trees size={18} />, query: 'node["leisure"~"park|garden|playground"]' },
  { id: 'transit', name: 'Transit', icon: <Train size={18} />, query: 'node["highway"~"bus_stop"]["public_transport"~"stop_position"]' },
];

const NearbyPlaces = ({ lat: initialLat, lng: initialLng, address }) => {
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

  // Custom Icons logic would go here (omitted for brevity, using default for now or importing if available)

  // Geocoding Fallback
  useEffect(() => {
    const resolveCoords = async () => {
      if (initialLat && initialLng) {
        setCoords({ lat: initialLat, lng: initialLng });
        return;
      }

      if (address) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
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

    const fetchFromOverpass = async (query) => {
      const servers = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
      ];

      for (const server of servers) {
        try {
          const url = `${server}?data=[out:json];(${query});out body;`;
          // Add timeout signal
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          const contentType = response.headers.get('content-type');
          if (response.ok && contentType && contentType.includes('application/json')) {
            return await response.json();
          }
        } catch (err) {
          console.warn(`Failed to fetch from ${server}:`, err.message);
          continue; // Try next server
        }
      }
      throw new Error('All Overpass servers failed');
    };

    const fetchAllNearby = async () => {
      if (!coords) return;

      try {
        setLoading(true);
        setError(null);
        
        const radius = 5000;
        const combinedQuery = CATEGORIES.map(cat => (
          `(${cat.query}(around:${radius},${coords.lat},${coords.lng});)`
        )).join('');

        const data = await fetchFromOverpass(combinedQuery);
        
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
            type: el.tags.amenity || el.tags.shop || el.tags.leisure || 'Place'
          })).sort((a, b) => a.distance - b.distance).slice(0, 10);
        });

        setPlaces(newPlaces);
      } catch (error) {
        console.error('Error fetching nearby places:', error);
        setError('Unable to load nearby places');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllNearby();
  }, [coords]);

  useEffect(() => {
    fetchAllNearby();
  }, [fetchAllNearby]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === cat.id 
                ? 'bg-brand-gold text-royal-deep border-brand-gold shadow-lg shadow-brand-gold/20' 
                : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* List View */}
         <div className="lg:col-span-1 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {error ? (
               <div className="text-center py-8 text-zinc-400 bg-white/5 rounded-2xl border border-white/5">
                 <p>{error}</p>
                 <button 
                   onClick={fetchAllNearby}
                   className="mt-4 text-xs text-brand-gold hover:text-brand-gold-light underline"
                 >
                   Try Again
                 </button>
               </div>
            ) : loading ? (
               <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-4">
                  <Loader2 className="animate-spin text-brand-gold" size={24} />
                  <p className="text-sm">Finding nearby gems...</p>
               </div>
            ) : places[activeCategory]?.length > 0 ? (
               places[activeCategory].map((place, idx) => (
                  <div 
                    key={idx}
                    className="group flex items-center justify-between p-3 bg-zinc-900/50 border border-white/5 rounded-xl hover:border-brand-gold/30 transition-all cursor-pointer"
                  >
                    <div>
                      <h4 className="font-bold text-zinc-100 text-sm group-hover:text-brand-gold transition-colors line-clamp-1">{place.name}</h4>
                      <p className="text-[10px] text-zinc-500 capitalize">{place.type.replace(/_/g, ' ')}</p>
                    </div>
                    <span className="text-xs text-brand-gold font-mono whitespace-nowrap">{place.distance} km</span>
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
                  
                  {/* Property Center Marker */}
                  <Marker position={[coords.lat, coords.lng]}>
                     <Popup>Property Location</Popup>
                  </Marker>

                  {/* Amenity Markers */}
                  {places[activeCategory]?.map((place, idx) => (
                     <Marker key={idx} position={[place.lat, place.lon]}>
                        <Popup>
                           <span className="font-bold">{place.name}</span> <br/>
                           <span className="text-xs capitalize">{place.type.replace(/_/g, ' ')}</span>
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

      <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest font-bold pt-4">
        Powered by OpenStreetMap data
      </p>
    </div>
  );
};

export default NearbyPlaces;
