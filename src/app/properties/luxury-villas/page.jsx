import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, LayoutGrid, List, Map, Loader2 } from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

const PropertiesMapView = dynamic(() => import('@/components/map/PropertiesMapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-gold" size={48} />
    </div>
  )
});

const LuxuryVillasPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); // Keeping total as it is used in 'Showing X of Y' content
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Pre-set filter for Luxury Villas
  const [filters, setFilters] = useState({
    search: '',
    listingType: '',
    propertyType: 'villa', // Fixed
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
  }, [filters.page, filters.listingType, filters.city, filters.bounds, filters.polygon, fetchProperties]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const AMENITIES = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 
    'Balcony', 'Elevator', 'Power Backup', 'Wi-Fi'
  ];

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ ...filters, amenities: newAmenities, page: 1 });
  };

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <section className="mb-12">
        <div className="max-container px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Exclusive Collection</span>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">
                Luxury <span className="text-brand-gold italic">Villas</span>
              </h1>
            </div>
            {/* View toggles... same as main page */}
             <div className="flex items-center gap-3">
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

          <div className="relative z-20">
             {/* Simplified Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 p-4 glass rounded-[2.5rem] border-white/10">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={18} />
                <input 
                  type="text" 
                  placeholder="Search via keyword..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-100 outline-none focus:border-brand-gold/30 transition-all placeholder:text-zinc-500"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
               <div className="flex flex-wrap lg:flex-nowrap gap-4">
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

             <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 mt-4 glass rounded-3xl border-white/10 space-y-6">
                    {/* Row 1: Bedrooms, Bathrooms (Removed Property Type) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Bedrooms</label>
                        <select 
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-300 outline-none focus:border-brand-gold/50"
                          value={filters.bedrooms}
                          onChange={(e) => setFilters({...filters, bedrooms: e.target.value, page: 1})}
                        >
                          <option value="">Any</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6+</option>
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
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5+</option>
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
                     {/* Amenities */}
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
           {/* Results count & sort */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <p className="text-zinc-400">
              Showing <span className="text-zinc-100 font-bold">{properties.length}</span> of <span className="text-zinc-100 font-bold">{total}</span> luxury villas
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
              </select>
            </div>
           </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-gold mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading magnificent villas...</p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border-white/5">
              <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Search size={32} className="text-zinc-500" />
              </div>
              <p className="text-2xl text-zinc-400 mb-4">No villas found</p>
              <p className="text-zinc-500">Try adjusting your filters</p>
            </div>
          ) : viewMode === 'map' ? (
             <PropertiesMapView 
                properties={properties} 
                onMapChange={(bounds) => setFilters(prev => ({ ...prev, bounds, polygon: '', page: 1 }))}
                onPolygonChange={(polygon) => setFilters(prev => ({ ...prev, polygon, bounds: '', page: 1 }))}
              />
          ) : (
            <div className={`grid gap-8 mb-16 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LuxuryVillasPage;
