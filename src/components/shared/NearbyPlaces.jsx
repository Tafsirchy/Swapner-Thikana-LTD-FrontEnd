'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  GraduationCap, 
  Hospital, 
  ShoppingBag, 
  Trees, 
  Train,
  MapPin,
  Loader2,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'education', name: 'Education', icon: <GraduationCap size={18} />, query: 'node["amenity"~"school|university|college"]' },
  { id: 'health', name: 'Health', icon: <Hospital size={18} />, query: 'node["amenity"~"hospital|clinic|pharmacy"]' },
  { id: 'shopping', name: 'Shopping', icon: <ShoppingBag size={18} />, query: 'node["shop"~"supermarket|mall|convenience"]' },
  { id: 'recreation', name: 'Parks', icon: <Trees size={18} />, query: 'node["leisure"~"park|garden|playground"]' },
  { id: 'transit', name: 'Transit', icon: <Train size={18} />, query: 'node["highway"~"bus_stop"]["public_transport"~"stop_position"]' },
];

const NearbyPlaces = ({ lat, lng }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [places, setPlaces] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAllNearby = useCallback(async () => {
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

    try {
      setLoading(true);
      const newPlaces = {};
      
      const radius = 2000;
      const combinedQuery = CATEGORIES.map(cat => (
        `(${cat.query}(around:${radius},${lat},${lng});)`
      )).join('');

      const url = `https://overpass-api.de/api/interpreter?data=[out:json];(${combinedQuery});out body;`;
      
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        console.warn('NearbyPlaces: Received non-JSON response from Overpass API', { 
          status: response.status, 
          contentType 
        });
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      CATEGORIES.forEach(cat => {
        newPlaces[cat.id] = data.elements.filter(el => {
          const tags = el.tags || {};
          const q = cat.query;
          if (q.includes('amenity')) {
            return tags.amenity && q.includes(tags.amenity);
          }
          if (q.includes('shop')) {
            return tags.shop && q.includes(tags.shop);
          }
          if (q.includes('leisure')) {
            return tags.leisure && q.includes(tags.leisure);
          }
          if (q.includes('highway')) {
            return tags.highway === 'bus_stop' || tags.public_transport === 'stop_position';
          }
          return false;
        }).map(el => ({
          name: el.tags.name || el.tags.amenity || el.tags.shop || el.tags.leisure || 'Unnamed place',
          distance: calculateDistance(lat, lng, el.lat, el.lon),
          type: el.tags.amenity || el.tags.shop || el.tags.leisure || 'Place'
        })).sort((a, b) => a.distance - b.distance).slice(0, 5);
      });

      setPlaces(newPlaces);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (lat && lng) {
      fetchAllNearby();
    }
  }, [lat, lng, fetchAllNearby]);

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

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[300px]">
        {loading ? (
          <div className="h-[250px] flex flex-col items-center justify-center text-zinc-500 gap-4">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
            <p className="text-sm font-medium">Scanning neighborhood...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {places[activeCategory]?.length > 0 ? (
              places[activeCategory].map((place, idx) => (
                <div 
                  key={idx}
                  className="group flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-brand-gold/30 transition-all cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold/10 transition-colors">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100 group-hover:text-brand-gold transition-colors">{place.name}</h4>
                      <p className="text-xs text-zinc-500 capitalize">{place.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 font-medium">
                    <span className="text-sm">{place.distance} km</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-zinc-500 italic">
                <p>No results found for this category within 2km.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest font-bold">
        Powered by OpenStreetMap data
      </p>
    </div>
  );
};

export default NearbyPlaces;
