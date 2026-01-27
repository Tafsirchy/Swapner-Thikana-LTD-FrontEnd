'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Move, Heart, Plus, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Global comparison state (simple client-side storage)
let compareList = [];
let compareListeners = [];

const addToCompare = (property) => {
  if (compareList.length >= 4) {
    toast.error('You can compare up to 4 properties');
    return false;
  }
  if (!compareList.find(p => p._id === property._id)) {
    compareList = [...compareList, property];
    compareListeners.forEach(fn => fn(compareList));
    toast.success('Added to comparison');
    return true;
  }
  return false;
};

const removeFromCompare = (propertyId) => {
  compareList = compareList.filter(p => p._id !== propertyId);
  compareListeners.forEach(fn => fn(compareList));
  toast.success('Removed from comparison');
};

const subscribeToCompare = (listener) => {
  compareListeners.push(listener);
  listener(compareList);
  return () => {
    compareListeners = compareListeners.filter(fn => fn !== listener);
  };
};

const PropertyCard = ({ property }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isInCompare, setIsInCompare] = useState(false);

  const {
    _id,
    title,
    slug,
    price,
    location,
    bedrooms,
    bathrooms,
    size,
    images,
    propertyType,
    listingType,
    featured
  } = property;

  // Check if property is saved
  useEffect(() => {
    if (user && user.savedProperties) {
      setIsSaved(user.savedProperties.some(id => id === _id));
    }
  }, [user, _id]);

  // Subscribe to comparison changes
  useEffect(() => {
    const unsubscribe = subscribeToCompare((list) => {
      setIsInCompare(list.some(p => p._id === _id));
    });
    return unsubscribe;
  }, [_id]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save properties');
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      
      // Optimistic UI update
      setIsSaved(!isSaved);

      if (isSaved) {
        await api.users.removeFromWishlist(_id);
        toast.success('Removed from wishlist');
      } else {
        await api.users.addToWishlist(_id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      // Revert on error
      setIsSaved(isSaved);
      console.error('Error toggling wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-card border border-white/10 rounded-3xl overflow-hidden hover:border-brand-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-gold/5"
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {featured && (
            <span className="px-3 py-1 bg-brand-gold text-royal-deep text-[10px] font-bold uppercase tracking-wider rounded-full">
              Featured
            </span>
          )}
          <span className="px-3 py-1 bg-royal-deep/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/10">
            {listingType === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isInCompare) {
                removeFromCompare(_id);
              } else {
                addToCompare(property);
              }
            }}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all active:scale-95 shadow-lg ${
              isInCompare
                ? 'bg-brand-emerald border-brand-emerald text-white' 
                : 'bg-white/10 border-white/20 text-white hover:bg-brand-emerald hover:text-white'
            }`}
            title={isInCompare ? "Remove from comparison" : "Add to comparison"}
          >
            {isInCompare ? <Check size={18} /> : <Plus size={18} />}
          </button>

          <button 
          onClick={handleToggleWishlist}
          disabled={saving}
          className={`p-2.5 rounded-full backdrop-blur-md border transition-all active:scale-95 shadow-lg disabled:opacity-50 ${
            isSaved 
              ? 'bg-brand-gold border-brand-gold text-royal-deep' 
              : 'bg-white/10 border-white/20 text-white hover:bg-brand-gold hover:text-royal-deep'
          }`}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        <div className="absolute bottom-4 left-4">
          <span className="text-brand-gold font-bold text-xl">
            ৳ {price?.toLocaleString('en-BD')}
            {listingType === 'rent' && <span className="text-xs text-zinc-300 font-normal ml-1">/ mo</span>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-[0.2em]">
            {propertyType}
          </span>
        </div>
        
        <Link href={`/properties/${slug}`}>
          <h3 className="text-xl font-bold text-zinc-100 mb-2 truncate group-hover:text-brand-gold transition-colors">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 text-zinc-400 text-sm mb-6">
          <MapPin size={14} className="text-brand-gold" />
          <span className="truncate">{location.area}, {location.city}</span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/5">
              <Bed size={16} className="text-brand-gold" />
            </div>
            <span className="text-sm font-medium text-zinc-300">{bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/5">
              <Bath size={16} className="text-brand-gold" />
            </div>
            <span className="text-sm font-medium text-zinc-300">{bathrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/5">
              <Move size={16} className="text-brand-gold" />
            </div>
            <span className="text-sm font-medium text-zinc-300">{size} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
