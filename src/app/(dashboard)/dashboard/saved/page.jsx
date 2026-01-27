'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Heart, Search, ArrowUpDown } from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import { api } from '@/lib/api';

const SavedPropertiesPage = () => {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'collections'
  const [properties, setProperties] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === 'saved') {
        const data = await api.user.getSavedProperties();
        setProperties(data.data.properties || []);
      } else if (activeTab === 'collections') {
        if (selectedWishlist) {
          const data = await api.wishlists.getProperties(selectedWishlist._id);
          setProperties(data.data.properties || []);
        } else {
          const data = await api.wishlists.getAll();
          setWishlists(data.data.wishlists || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedWishlist]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteWishlist = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      await api.wishlists.delete(id);
      setWishlists(wishlists.filter(w => w._id !== id));
    } catch {
      console.error('Failed to delete wishlist');
    }
  };

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    switch(sortBy) {
      case 'price-low': return sorted.sort((a, b) => a.price - b.price);
      case 'price-high': return sorted.sort((a, b) => b.price - a.price);
      case 'newest': return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default: return sorted;
    }
  }, [properties, sortBy]);

  if (loading && !properties.length && !wishlists.length) {
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
            Manage your favorite properties and collections
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => { setActiveTab('saved'); setSelectedWishlist(null); }}
          className={`pb-4 px-2 font-bold transition-all ${
            activeTab === 'saved' 
              ? 'text-brand-gold border-b-2 border-brand-gold' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Favorites
        </button>
        <button
          onClick={() => { setActiveTab('collections'); setSelectedWishlist(null); }}
          className={`pb-4 px-2 font-bold transition-all ${
            activeTab === 'collections' 
              ? 'text-brand-gold border-b-2 border-brand-gold' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          My Collections
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'saved' || selectedWishlist ? (
          <>
            {/* Sort & Back Button */}
            <div className="flex justify-between items-center mb-6">
              {selectedWishlist && (
                <button 
                  onClick={() => setSelectedWishlist(null)}
                  className="text-sm font-bold text-zinc-400 hover:text-white flex items-center gap-2"
                >
                  ← Back to Collections
                </button>
              )}
              {sortedProperties.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <ArrowUpDown size={18} className="text-zinc-400" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50 cursor-pointer"
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
                <h3 className="text-2xl font-bold text-zinc-300 mb-2">No saved properties</h3>
                <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                  {selectedWishlist ? 'This collection is empty.' : 'Start browsing our exclusive listings and save your favorites.'}
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
          </>
        ) : (
          /* Collections Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card (Visual only, modal handles creation) */}
            
            {wishlists.map((wishlist) => (
              <div 
                key={wishlist._id}
                onClick={() => setSelectedWishlist(wishlist)}
                className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-brand-gold/30 transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold">
                    <Heart size={24} />
                  </div>
                  <button 
                    onClick={(e) => handleDeleteWishlist(e, wishlist._id)}
                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                  >
                    <Search size={16} className="rotate-45" /> {/* Use X icon ideally, reusing Search for now or import X */}
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-zinc-100 mb-1 group-hover:text-brand-gold transition-colors">
                  {wishlist.name}
                </h3>
                <p className="text-zinc-500 text-sm">
                  {wishlist.properties?.length || 0} Properties
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  View Collection <ArrowUpDown className="rotate-90" size={14} />
                </div>
              </div>
            ))}

            {wishlists.length === 0 && (
              <div className="col-span-full text-center py-12 opacity-50">
                <p>No collections found. Create one by saving a property!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
