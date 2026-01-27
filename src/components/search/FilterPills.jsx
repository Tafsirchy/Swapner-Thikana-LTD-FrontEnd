import React from 'react';
import { X } from 'lucide-react';

const FilterPills = ({ filters, onRemoveFilter, onClearAll }) => {
  const getActiveFilters = () => {
    const active = [];
    
    if (filters.search) active.push({ key: 'search', label: `Search: ${filters.search}`, value: filters.search });
    if (filters.listingType) active.push({ key: 'listingType', label: `Type: ${filters.listingType}`, value: filters.listingType });
    if (filters.propertyType) active.push({ key: 'propertyType', label: `Property: ${filters.propertyType}`, value: filters.propertyType });
    if (filters.city) active.push({ key: 'city', label: `City: ${filters.city}`, value: filters.city });
    if (filters.bedrooms) active.push({ key: 'bedrooms', label: `${filters.bedrooms} Beds`, value: filters.bedrooms });
    if (filters.bathrooms) active.push({ key: 'bathrooms', label: `${filters.bathrooms} Baths`, value: filters.bathrooms });
    if (filters.minPrice) active.push({ key: 'minPrice', label: `Min: ৳${Number(filters.minPrice).toLocaleString()}`, value: filters.minPrice });
    if (filters.maxPrice) active.push({ key: 'maxPrice', label: `Max: ৳${Number(filters.maxPrice).toLocaleString()}`, value: filters.maxPrice });
    if (filters.minArea) active.push({ key: 'minArea', label: `Min: ${filters.minArea} sq ft`, value: filters.minArea });
    if (filters.maxArea) active.push({ key: 'maxArea', label: `Max: ${filters.maxArea} sq ft`, value: filters.maxArea });
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        active.push({ key: 'amenity', label: amenity, value: amenity });
      });
    }
    
    return active;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Filters:</span>
      
      {activeFilters.map((filter, index) => (
        <button
          key={`${filter.key}-${index}`}
          onClick={() => onRemoveFilter(filter.key, filter.value)}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-full text-sm font-medium hover:bg-brand-gold/20 transition-all group"
        >
          <span>{filter.label}</span>
          <X size={14} className="group-hover:scale-110 transition-transform" />
        </button>
      ))}

      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs font-bold text-zinc-500 hover:text-brand-gold transition-colors uppercase tracking-wider ml-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterPills;
