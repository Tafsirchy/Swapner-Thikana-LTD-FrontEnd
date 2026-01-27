'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, LayoutGrid, List, X, Bookmark, Map, Loader2 } from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import FilterPills from '@/components/search/FilterPills';
import SaveSearchModal from '@/components/search/SaveSearchModal';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamic import for map view
const PropertiesMapView = dynamic(() => import('@/components/map/PropertiesMapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-gold" size={48} />
    </div>
  )
});

const PropertiesPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [saveSearchModal, setSaveSearchModal] = useState(false);

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    listingType: '',
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    amenities: [],
    sort: 'featured',
    page: 1,
    limit: 12,
    bounds: '',
    polygon: ''
  });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.properties.getAll(filters);
      setProperties(data.data.properties);
      setTotal(data.data.pagination.total);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [filters.page, filters.listingType, filters.propertyType, filters.city, filters.bounds, filters.polygon, fetchProperties]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const AMENITIES = [
    'Swimming Pool',
    'Gym',
    'Parking',
    'Security',
    'Garden',
    'Balcony',
    'Elevator',
    'Power Backup',
    'Wi-Fi'
  ];

  const handleRemoveFilter = (key, value) => {
    if (key === 'amenity') {
      setFilters({
        ...filters,
        amenities: filters.amenities.filter(a => a !== value),
        page: 1
      });
    } else {
      setFilters({ ...filters, [key]: '', page: 1 });
    }
  };

  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      listingType: '',
      propertyType: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      amenities: [],
      sort: 'featured',
      page: 1,
      limit: 12
    });
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ ...filters, amenities: newAmenities, page: 1 });
  };

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      {/* Search & Header Section */}
      <section className="mb-12">
        <div className="max-container px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Premium Listings</span>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">
                Discover Exclusive <span className="text-brand-gold italic">Properties</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {user && (filters.search || filters.listingType || filters.propertyType || filters.city || 
                        filters.bedrooms || filters.bathrooms || filters.minPrice || filters.maxPrice || 
                        filters.minArea || filters.maxArea || filters.amenities.length > 0) && (
                <button
                  onClick={() => setSaveSearchModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-xl font-medium hover:bg-brand-gold/20 transition-all"
                >
                  <Bookmark size={18} />
                  <span className="hidden sm:inline">Save Search</span>
                </button>
              )}
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl border transition-all ${viewMode === 'grid' ? 'bg-brand-gold text-royal-deep border-brand-gold' : 'border-white/10 text-zinc-400 hover:border-white/20'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl border transition-all ${viewMode === 'list' ? 'bg-brand-gold text-royal-deep border-brand-gold' : 'border-white/10 text-zinc-400 hover:border-white/20'}`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2.5 rounded-xl border transition-all ${viewMode === 'map' ? 'bg-brand-gold text-royal-deep border-brand-gold' : 'border-white/10 text-zinc-400 hover:border-white/20'}`}
              >
                <Map size={20} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative z-20">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 p-4 glass rounded-[2.5rem] border-white/10">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by title, neighborhood or keyword..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-100 outline-none focus:border-brand-gold/30 transition-all placeholder:text-zinc-500"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <div className="flex flex-wrap lg:flex-nowrap gap-4">
                <select 
                  className="bg-zinc-900/80 text-zinc-300 border border-white/5 rounded-2xl py-3.5 px-6 outline-none focus:border-brand-gold/30 appearance-none min-w-[150px]"
                  value={filters.listingType}
                  onChange={(e) => setFilters({...filters, listingType: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                <select 
                  className="bg-zinc-900/80 text-zinc-300 border border-white/5 rounded-2xl py-3.5 px-6 outline-none focus:border-brand-gold/30 appearance-none min-w-[150px]"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                >
                  <option value="">All Cities</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Sylhet">Sylhet</option>
                </select>
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl border transition-all ${showFilters ? 'bg-brand-gold text-royal-deep border-brand-gold' : 'border-white/10 text-zinc-100 hover:border-brand-gold/30'}`}
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
                <button 
                  type="submit"
                  className="bg-brand-emerald text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-brand-emerald-light transition-all shadow-lg shadow-brand-emerald/10"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 mt-4 glass rounded-3xl border-white/10 space-y-6">
                    {/* Row 1: Property Type, Bedrooms, Bathrooms */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Property Type</label>
                        <select 
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-300 outline-none focus:border-brand-gold/50"
                          value={filters.propertyType}
                          onChange={(e) => setFilters({...filters, propertyType: e.target.value, page: 1})}
                        >
                          <option value="">Any Type</option>
                          <option value="apartment">Apartment</option>
                          <option value="villa">Luxury Villa</option>
                          <option value="duplex">Duplex</option>
                          <option value="penthouse">Penthouse</option>
                          <option value="commercial">Commercial Space</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Bedrooms</label>
                        <select 
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-300 outline-none focus:border-brand-gold/50"
                          value={filters.bedrooms}
                          onChange={(e) => setFilters({...filters, bedrooms: e.target.value, page: 1})}
                        >
                          <option value="">Any</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5+</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Bathrooms</label>
                        <select 
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-300 outline-none focus:border-brand-gold/50"
                          value={filters.bathrooms}
                          onChange={(e) => setFilters({...filters, bathrooms: e.target.value, page: 1})}
                        >
                          <option value="">Any</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4+</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Price Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Min Price (BDT)</label>
                        <input 
                          type="number" 
                          placeholder="Min Price"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-100 outline-none focus:border-brand-gold/50"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({...filters, minPrice: e.target.value, page: 1})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Max Price (BDT)</label>
                        <input 
                          type="number" 
                          placeholder="Max Price"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-100 outline-none focus:border-brand-gold/50"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({...filters, maxPrice: e.target.value, page: 1})}
                        />
                      </div>
                    </div>

                    {/* Row 3: Area Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Min Area (sq ft)</label>
                        <input 
                          type="number" 
                          placeholder="Min Area"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-100 outline-none focus:border-brand-gold/50"
                          value={filters.minArea}
                          onChange={(e) => setFilters({...filters, minArea: e.target.value, page: 1})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Max Area (sq ft)</label>
                        <input 
                          type="number" 
                          placeholder="Max Area"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-100 outline-none focus:border-brand-gold/50"
                          value={filters.maxArea}
                          onChange={(e) => setFilters({...filters, maxArea: e.target.value, page: 1})}
                        />
                      </div>
                    </div>

                    {/* Row 4: Amenities */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Amenities</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {AMENITIES.map((amenity) => (
                          <label
                            key={amenity}
                            className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:border-brand-gold/30 transition-colors group"
                          >
                            <input
                              type="checkbox"
                              checked={filters.amenities.includes(amenity)}
                              onChange={() => handleAmenityToggle(amenity)}
                              className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-gold focus:ring-brand-gold/50 focus:ring-offset-0"
                            />
                            <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Clear Button */}
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button 
                        onClick={handleClearAllFilters}
                        className="flex items-center justify-center gap-2 px-6 py-3 text-zinc-400 hover:text-brand-gold transition-colors text-sm font-medium rounded-xl hover:bg-white/5"
                      >
                        <X size={16} />
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section>
        <div className="max-container px-4">
          {/* Filter Pills */}
          <FilterPills 
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />

          {/* Results Header with Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <p className="text-zinc-400">
              Showing <span className="text-zinc-100 font-bold">{properties.length}</span> of <span className="text-zinc-100 font-bold">{total}</span> premium properties
            </p>
            <div className="flex items-center gap-3">
              <label className="text-sm text-zinc-400">Sort by:</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value, page: 1})}
                className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-zinc-300 outline-none focus:border-brand-gold/50 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area">Area: Largest First</option>
              </select>
            </div>
          </div>

          {/* Results Section */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-gold mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading properties...</p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border-white/5">
              <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Search size={32} className="text-zinc-500" />
              </div>
              <p className="text-2xl text-zinc-400 mb-4">No properties found</p>
              <p className="text-zinc-500 mb-6">Try adjusting your filters or search criteria</p>
              <button 
                onClick={handleClearAllFilters}
                className="px-6 py-3 bg-brand-gold text-royal-deep rounded-xl font-medium hover:bg-brand-gold-light transition-all"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="mb-12">
              <div className="mb-4 text-zinc-300 text-sm">
                Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'} on map
              </div>
              <PropertiesMapView 
                properties={properties} 
                onMapChange={(bounds) => setFilters(prev => ({ ...prev, bounds, polygon: '', page: 1 }))}
                onPolygonChange={(polygon) => setFilters(prev => ({ ...prev, polygon, bounds: '', page: 1 }))}
              />
            </div>
          ) : (
            <div className={`grid gap-8 mb-16 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > filters.limit && (
            <div className="mt-16 flex justify-center gap-2">
              <button 
                disabled={filters.page === 1}
                onClick={() => setFilters({...filters, page: filters.page - 1})}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:border-brand-gold transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                Previous
              </button>
              {[...Array(Math.ceil(total / filters.limit))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters({...filters, page: i + 1})}
                  className={`w-12 h-12 rounded-xl border transition-all ${filters.page === i + 1 ? 'bg-brand-gold text-royal-deep border-brand-gold font-bold shadow-lg shadow-brand-gold/20' : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={filters.page * filters.limit >= total}
                onClick={() => setFilters({...filters, page: filters.page + 1})}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:border-brand-gold transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Save Search Modal */}
      <SaveSearchModal
        isOpen={saveSearchModal}
        onClose={() => setSaveSearchModal(false)}
        filters={filters}
      />
    </div>
  );
};

export default PropertiesPage;
