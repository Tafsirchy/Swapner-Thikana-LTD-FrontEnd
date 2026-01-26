'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search } from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import { api } from '@/lib/api';

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <Heart size={32} className="text-brand-gold fill-brand-gold" />
          Saved Homes
        </h1>
        <div className="text-zinc-400">
          <span className="text-zinc-100 font-bold">{properties.length}</span> properties saved
        </div>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
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
          <a 
            href="/properties" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20"
          >
            <Search size={18} />
            Browse Properties
          </a>
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesPage;
