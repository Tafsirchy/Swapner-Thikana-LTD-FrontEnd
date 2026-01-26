'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import { api } from '@/lib/api';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    listingType: '',
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 12
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
  }, [filters.page, filters.listingType, filters.propertyType, filters.city, fetchProperties]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
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
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 mt-4 glass rounded-3xl border-white/10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Property Type</label>
                      <select 
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-300 outline-none"
                        value={filters.propertyType}
                        onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
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
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Price Range (min)</label>
                      <input 
                        type="number" 
                        placeholder="Min Price"
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-100 outline-none"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Price Range (max)</label>
                      <input 
                        type="number" 
                        placeholder="Max Price"
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-100 outline-none"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={() => setFilters({
                          search: '',
                          listingType: '',
                          propertyType: '',
                          city: '',
                          minPrice: '',
                          maxPrice: '',
                          page: 1,
                          limit: 12
                        })}
                        className="w-full flex items-center justify-center gap-2 py-3 text-zinc-500 hover:text-brand-gold transition-colors text-sm font-medium"
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
          <div className="flex items-center justify-between mb-8">
            <p className="text-zinc-400">
              Showing <span className="text-zinc-100 font-bold">{properties.length}</span> of <span className="text-zinc-100 font-bold">{total}</span> premium properties
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card w-full h-[450px] rounded-3xl animate-pulse flex flex-col p-6 gap-4 border border-white/5">
                  <div className="w-full h-64 bg-white/5 rounded-2xl"></div>
                  <div className="w-3/4 h-6 bg-white/5 rounded-lg"></div>
                  <div className="w-1/2 h-4 bg-white/5 rounded-lg"></div>
                  <div className="mt-auto w-full h-10 bg-white/5 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-3xl border-white/5">
              <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Search size={32} className="text-zinc-500" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">No matching properties found</h3>
              <p className="text-zinc-400">Try adjusting your filters or searching for something else.</p>
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
    </div>
  );
};

export default PropertiesPage;
