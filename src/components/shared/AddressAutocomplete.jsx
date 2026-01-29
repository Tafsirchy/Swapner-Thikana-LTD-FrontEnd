'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import axios from 'axios';

const AddressAutocomplete = ({ value, onChange, onSelect, className, placeholder = "Search address..." }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Update internal state if external value changes
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Debounce logic implementation locally to avoid dependency assumptions
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 3 || !isOpen) {
        setSuggestions([]);
        return;
      }

      // If the query is exactly the same as the current value (already selected), don't search
      if (debouncedQuery === value) return;

      setIsLoading(true);
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: debouncedQuery,
            format: 'json',
            addressdetails: 1,
            limit: 5,
            countrycodes: 'bd' // Limit to Bangladesh for this specific project
          },
          headers: {
            'Accept-Language': 'en' // Prefer English results
          }
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, isOpen, value]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setIsOpen(true);
    // Propagate change to parent immediately for typing
    if (onChange) onChange(newValue);
  };

  const handleSelect = (item) => {
    const formattedAddress = item.display_name;
    setQuery(formattedAddress);
    setSuggestions([]);
    setIsOpen(false);

    // Extract useful data
    // OSM returns address parts in 'address' object
    const city = item.address.city || item.address.town || item.address.village || item.address.state || '';
    const area = item.address.suburb || item.address.neighbourhood || item.address.quarter || '';
    
    if (onSelect) {
      onSelect({
        address: formattedAddress,
        city: city,
        area: area,
        lat: item.lat,
        lon: item.lon
      });
    }
    
    if (onChange) onChange(formattedAddress);
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    if (onChange) onChange('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-10 py-3 outline-none focus:border-brand-gold/50 transition-all ${className}`}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          <MapPin size={18} />
        </div>
        
        {/* Right loading/clear icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
           {isLoading ? (
             <Loader2 size={18} className="animate-spin text-brand-gold" />
           ) : query ? (
             <button onClick={clearInput} className="hover:text-zinc-300">
               <X size={18} />
             </button>
           ) : null}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
           {suggestions.map((item, index) => (
             <button
               key={index}
               onClick={() => handleSelect(item)}
               className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex items-start gap-3 group"
             >
               <div className="mt-1 text-zinc-500 group-hover:text-brand-gold transition-colors">
                  <MapPin size={16} />
               </div>
               <div>
                 <p className="text-zinc-200 text-sm font-medium line-clamp-1">{item.display_name.split(',')[0]}</p>
                 <p className="text-zinc-500 text-xs line-clamp-1 mt-0.5">{item.display_name}</p>
               </div>
             </button>
           ))}
           <div className="px-3 py-1 bg-black/20 text-[10px] text-zinc-600 text-right uppercase tracking-wider font-bold">
              Powered by OpenStreetMap
           </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
