'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Heart, Search, ArrowUpDown } from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import { api } from '@/lib/api';

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        setLoading(true);
        const data = await api.user.getSavedProperties();
        setProperties(data.data.properties || []);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    
    switch(sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return sorted;
    }
  }, [properties, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-3xl h-[400px] animate-pulse border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <Heart size={32} className="text-brand-gold fill-brand-gold" />
            Saved Homes
          </h1>
          <p className="text-zinc-400 mt-1">
            <span className="text-zinc-100 font-bold">{properties.length}</span> properties saved
          </p>
        </div>
        
        {/* Sort Dropdown */}
        {properties.length > 0 && (
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="text-zinc-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 outline-none focus:border-brand-gold/50 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {sortedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-zinc-500" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-300 mb-2">No saved properties yet</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            Start browsing our exclusive listings and save your favorites to access them quickly from here.
          </p>
          <Link 
            href="/properties" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20"
          >
            <Search size={18} />
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesPage;
