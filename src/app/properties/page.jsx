'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, LayoutGrid, List, X, Bookmark, Map, Loader2, Building2, Trash2 } from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import FilterPills from '@/components/search/FilterPills';
import SaveSearchModal from '@/components/search/SaveSearchModal';
import LuxurySelect from '@/components/shared/LuxurySelect';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamic import for map view
const PropertiesMapView = dynamic(() => import('@/components/map/PropertiesMapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-gold" size={48} />
    </div>
  )
});

const PropertiesContent = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  // Raw Data State
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [saveSearchModal, setSaveSearchModal] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    listingType: searchParams.get('listingType') || '',
    propertyType: searchParams.get('propertyType') || '',
    city: searchParams.get('city') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    amenities: [],
    sort: 'featured',
    page: 1,
    limit: 6,
    bounds: '',
    polygon: ''
  });

  // Update filters when URL params change
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const listingType = searchParams.get('listingType') || '';
    const propertyType = searchParams.get('propertyType') || '';
    
    setFilters(prev => ({
      ...prev,
      search,
      city,
      listingType,
      propertyType,
      page: 1
    }));
  }, [searchParams]);

  // 1. Fetch ALL Properties on Mount
  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        setLoading(true);
        // Request a high limit to get all published properties
        // We only fetch 'published' properties for the public page
        const response = await api.properties.getAll({ 
          limit: 2000, 
          status: 'published' 
        });
        
        if (response.data && response.data.properties) {
          setAllProperties(response.data.properties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []); // Empty dependency array = run once on mount

  // 2. Client-Side Filtering & Sorting Logic
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...allProperties];

    // --- FILTERING ---

    // Search (Title, Address, Description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(searchLower) ||
        p.location?.address?.toLowerCase().includes(searchLower) ||
        p.location?.area?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Listing Type (Exact)
    if (filters.listingType) {
      result = result.filter(p => p.listingType === filters.listingType);
    }

    // Property Type (Exact)
    if (filters.propertyType) {
      result = result.filter(p => p.propertyType === filters.propertyType);
    }

    // City (Exact/Includes)
    if (filters.city) {
      result = result.filter(p => p.location?.city === filters.city);
    }

    // Price Range
    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    // Bedrooms (Min)
    if (filters.bedrooms) {
      result = result.filter(p => (p.bedrooms || 0) >= Number(filters.bedrooms));
    }

    // Bathrooms (Min)
    if (filters.bathrooms) {
      result = result.filter(p => (p.bathrooms || 0) >= Number(filters.bathrooms));
    }

    // Area/Size Range (Check 'size' first, then 'area')
    if (filters.minArea) {
      const min = Number(filters.minArea);
      result = result.filter(p => (p.size || p.area || 0) >= min);
    }
    if (filters.maxArea) {
      const max = Number(filters.maxArea);
      result = result.filter(p => (p.size || p.area || 0) <= max);
    }

    // Amenities (Strict: Must have ALL selected)
    if (filters.amenities.length > 0) {
      result = result.filter(p => {
        const pAmenities = p.amenities || [];
        // Every selected amenity must be in property's amenities
        return filters.amenities.every(selected => pAmenities.includes(selected));
      });
    }

    // Map Bounds / Polygon (Client-side geospatial filtering is complex, 
    // usually best left to backend or map library visually. 
    // For now, we'll skip strict geospatial filtering here unless coordinates are available and simple bounds are needed.
    // Assuming Map component handles visual filtering or we rely on backend for this specific case.
    // If user asked to 'keep all data', we prioritize attribute filtering.)
    
    // --- SORTING ---
    
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'area-desc': // Sort by size primarily
        result.sort((a, b) => (b.size || b.area || 0) - (a.size || a.area || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'featured':
      default:
        // Featured first, then newest
        result.sort((a, b) => {
          if (a.featured === b.featured) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.featured ? -1 : 1;
        });
        break;
    }

    return result;
  }, [allProperties, filters]);

  // 3. Pagination Slicing
  const paginatedProperties = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.limit;
    return filteredAndSortedProperties.slice(startIndex, startIndex + filters.limit);
  }, [filteredAndSortedProperties, filters.page, filters.limit]);

  // Handler Helpers
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

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
      limit: 6,
      bounds: '',
      polygon: ''
    });
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ ...filters, amenities: newAmenities, page: 1 });
  };

  const AMENITIES = [
    'Swimming Pool', 'Gym', 'Parking', 'Security',
    'Garden', 'Balcony', 'Elevator', 'Power Backup', 'Wi-Fi'
  ];

  return (
    <div className="min-h-screen bg-royal-deep pt-24 sm:pt-32 pb-16 sm:pb-24">
      {/* Search & Header Section */}
      <section className="mb-12">
        <div className="max-container px-4">

          {/* Centered Hero Section (Matching Projects Style) */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6"
            >
              <Building2 size={16} />
              Premium Listings
            </motion.div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold font-cinzel text-zinc-100 mb-4 sm:mb-6 tracking-tight leading-tight">
              Discover Exclusive <span className="text-brand-gold">Properties</span>
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-400 text-sm sm:text-lg leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0">
              Browse our curated collection of luxury apartments, commercial spaces, and exclusive land opportunities designed for your lifestyle.
            </p>

            {/* View Controls Toolbar */}
            <div className="flex justify-center md:justify-end items-center gap-3">
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
              <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl shadow-inner">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-gold text-royal-deep shadow-lg' : 'text-zinc-400 hover:text-zinc-200'}`}
                    title="Grid View"
                    aria-label="Switch to Grid View"
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-gold text-royal-deep shadow-lg' : 'text-zinc-400 hover:text-zinc-200'}`}
                    title="List View"
                    aria-label="Switch to List View"
                  >
                    <List size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('map')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'map' ? 'bg-brand-gold text-royal-deep shadow-lg' : 'text-zinc-400 hover:text-zinc-200'}`}
                    title="Map View"
                    aria-label="Switch to Map View"
                  >
                    <Map size={20} />
                  </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative z-20">
            <form onSubmit={handleSearch} className="grid grid-cols-2 lg:flex lg:flex-row gap-4 p-4 lg:p-6 glass rounded-2xl sm:rounded-3xl border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="col-span-2 lg:flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1 hidden lg:block">Search</label>
                <div className="relative group flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={18} />
                  <input 
                    type="text" 
                    placeholder="Title, neighborhood, or keyword..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-3.5 pl-12 pr-4 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all placeholder:text-zinc-500 text-sm sm:text-base h-[52px]"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
                  />
                </div>
              </div>
              
              <div className="col-span-2 lg:contents grid grid-cols-2 gap-4">
                <div className="flex flex-col items-start gap-1.5 min-w-[140px]">
                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Listing</label>
                  <LuxurySelect 
                    value={filters.listingType}
                    onChange={(val) => setFilters({...filters, listingType: val, page: 1})}
                    options={[
                      { label: 'All', value: '' },
                      { label: 'Sale', value: 'sale' },
                      { label: 'Rent', value: 'rent' }
                    ]}
                    icon={<Building2 size={16} />}
                    className="!rounded-2xl !bg-zinc-900/80 !border-white/5 h-[52px]"
                  />
                </div>
                
                <div className="flex flex-col items-start gap-1.5 min-w-[140px] hidden xl:flex">
                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Property Type</label>
                  <LuxurySelect 
                    value={filters.propertyType}
                    onChange={(val) => setFilters({...filters, propertyType: val, page: 1})}
                    options={[
                      { label: 'Any Type', value: '' },
                      { label: 'Apartment', value: 'apartment' },
                      { label: 'Villa', value: 'villa' },
                      { label: 'Duplex', value: 'duplex' },
                      { label: 'Penthouse', value: 'penthouse' }
                    ]}
                    className="!rounded-2xl !bg-zinc-900/80 !border-white/5 h-[52px]"
                  />
                </div>
                
                <div className="flex flex-col items-start gap-1.5 min-w-[140px]">
                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">City</label>
                  <LuxurySelect 
                    value={filters.city}
                    onChange={(val) => setFilters({...filters, city: val, page: 1})}
                    options={[
                      { label: 'All', value: '' },
                      { label: 'Dhaka', value: 'Dhaka' },
                      { label: 'Chattogram', value: 'Chattogram' },
                      { label: 'Sylhet', value: 'Sylhet' }
                    ]}
                    icon={<Map size={16} />}
                    className="!rounded-2xl !bg-zinc-900/80 !border-white/5 h-[52px]"
                  />
                </div>
                
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-6 h-[52px] rounded-2xl border transition-all mt-auto ${showFilters ? 'bg-brand-gold text-royal-deep border-brand-gold shadow-lg shadow-brand-gold/20' : 'border-white/10 text-zinc-100 hover:border-brand-gold/30 hover:bg-white/5'}`}
                  aria-label={showFilters ? "Hide advanced filters" : "Show advanced filters"}
                >
                  <SlidersHorizontal size={18} />
                  <span className="font-bold sm:font-normal">Filters</span>
                </button>
                
                <button 
                  type="submit"
                  className="bg-brand-emerald text-white px-8 h-[52px] rounded-2xl font-bold hover:bg-brand-emerald-light transition-all shadow-lg shadow-brand-emerald/20 mt-auto flex items-center justify-center gap-2"
                >
                  <Search size={18} className="lg:hidden" />
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
                  <div className="p-6 md:p-10 mt-6 glass rounded-3xl border-white/10 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
                    {/* Row 1: Property Type, Bedrooms, Bathrooms */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Property Type</label>
                        <LuxurySelect 
                          value={filters.propertyType}
                          onChange={(val) => setFilters({...filters, propertyType: val, page: 1})}
                          options={[
                            { label: 'Any Type', value: '' },
                            { label: 'Apartment', value: 'apartment' },
                            { label: 'Luxury Villa', value: 'villa' },
                            { label: 'Duplex', value: 'duplex' },
                            { label: 'Penthouse', value: 'penthouse' },
                            { label: 'Commercial Space', value: 'commercial' },
                            { label: 'Land', value: 'land' },
                            { label: 'Office', value: 'office' },
                            { label: 'Shop', value: 'shop' },
                            { label: 'Warehouse', value: 'warehouse' }
                          ]}
                          icon={<Building2 size={18} />}
                          className="rounded-xl text-base !bg-white/5 !border-white/5"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Bedrooms</label>
                        <LuxurySelect 
                          value={filters.bedrooms}
                          onChange={(val) => setFilters({...filters, bedrooms: val, page: 1})}
                          options={[
                            { label: 'Any', value: '' },
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5+', value: '5' }
                          ]}
                          className="rounded-xl text-base !bg-white/5 !border-white/5"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Bathrooms</label>
                        <LuxurySelect 
                          value={filters.bathrooms}
                          onChange={(val) => setFilters({...filters, bathrooms: val, page: 1})}
                          options={[
                            { label: 'Any', value: '' },
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4+', value: '4' }
                          ]}
                          className="rounded-xl text-base !bg-white/5 !border-white/5"
                        />
                      </div>
                    </div>

                    {/* Row 2: Price Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Min Price (BDT)</label>
                        <input 
                          type="number" 
                          placeholder="Min Price"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-100 outline-none focus:border-brand-gold/50"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({...filters, minPrice: e.target.value, page: 1})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Max Price (BDT)</label>
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
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Min Area (sq ft)</label>
                        <input 
                          type="number" 
                          placeholder="Min Area"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-zinc-100 outline-none focus:border-brand-gold/50"
                          value={filters.minArea}
                          onChange={(e) => setFilters({...filters, minArea: e.target.value, page: 1})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Max Area (sq ft)</label>
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
                        className="flex items-center justify-center gap-2 px-6 py-3 text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-medium rounded-xl shadow-lg shadow-red-500/5 w-full md:w-auto"
                      >
                        <Trash2 size={16} />
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
              Showing <span className="text-zinc-100 font-bold">{filteredAndSortedProperties.length}</span> results 
              {allProperties.length > 0 && <span className="text-xs text-zinc-600 ml-2">(from {allProperties.length} total)</span>}
            </p>
            <div className="flex flex-col gap-1.5 min-w-[180px]">
               <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Sort by</label>
               <LuxurySelect
                 value={filters.sort}
                 onChange={(val) => setFilters({...filters, sort: val, page: 1})}
                 options={[
                   { label: 'Featured First', value: 'featured' },
                   { label: 'Newest First', value: 'newest' },
                   { label: 'Most Popular', value: 'popular' },
                   { label: 'Price: Low to High', value: 'price-asc' },
                   { label: 'Price: High to Low', value: 'price-desc' },
                   { label: 'Area: Largest First', value: 'area-desc' }
                 ]}
                 icon={<SlidersHorizontal size={14} />}
                 className="rounded-xl text-sm !bg-white/5 !border-white/5"
               />
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
          ) : filteredAndSortedProperties.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border-white/5">
              <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Search size={32} className="text-zinc-500" />
              </div>
              <p className="text-2xl text-zinc-400 mb-4">No properties found</p>
              <p className="text-zinc-500 mb-6">Try adjusting your filters or search criteria</p>
              <button 
                onClick={handleClearAllFilters}
                className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-medium hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center gap-2 mx-auto"
              >
                <Trash2 size={16} />
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="mb-12">
              <div className="mb-4 text-zinc-300 text-sm">
                Showing {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? 'property' : 'properties'} on map
              </div>
              <PropertiesMapView 
                properties={filteredAndSortedProperties} 
                onMapChange={(bounds) => setFilters(prev => ({ ...prev, bounds, polygon: '', page: 1 }))}
                onPolygonChange={(polygon) => setFilters(prev => ({ ...prev, polygon, bounds: '', page: 1 }))}
              />
            </div>
          ) : (
            <div className={`grid gap-8 mb-16 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {paginatedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredAndSortedProperties.length > filters.limit && (
            <div className="mt-16 flex justify-center gap-2">
              <button 
                disabled={filters.page === 1}
                onClick={() => setFilters({...filters, page: filters.page - 1})}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:border-brand-gold transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                Previous
              </button>
              
              {/* Simplified pagination for client-side to avoid massive arrays for pages */}
              <span className="flex items-center px-4 text-zinc-400">
                Page {filters.page} of {Math.ceil(filteredAndSortedProperties.length / filters.limit)}
              </span>

              <button 
                disabled={filters.page * filters.limit >= filteredAndSortedProperties.length}
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

const PropertiesPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-royal-deep pt-32 pb-24 flex items-center justify-center">
        <Loader2 size={48} className="text-brand-gold animate-spin" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
};

export default PropertiesPage;
