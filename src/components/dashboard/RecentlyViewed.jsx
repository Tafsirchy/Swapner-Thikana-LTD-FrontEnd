'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

const RecentlyViewed = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.user.getRecentlyViewed();
        setProperties(res.data.properties);
      } catch (err) {
        console.error('Failed to fetch recent history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="animate-spin text-brand-gold" size={24} />
    </div>
  );

  if (properties.length === 0) return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-10 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock className="text-zinc-600" size={32} />
      </div>
      <h3 className="text-zinc-300 font-bold">No history yet</h3>
      <p className="text-zinc-500 text-sm mt-2">Properties you view will appear here for quick access.</p>
    </div>
  );

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Clock className="text-brand-gold" size={20} />
          Recently Viewed
        </h2>
      </div>
      
      <div className="space-y-4">
        {properties.slice(0, 5).map((property) => (
          <Link 
            key={property._id} 
            href={`/properties/${property.slug || property._id}`}
            className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-all group"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image 
                src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'} 
                alt={property.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-zinc-100 truncate">{property.title}</h4>
              <p className="text-xs text-zinc-400 mt-1 truncate">{property.location?.area}, {property.location?.city}</p>
              <p className="text-xs font-bold text-brand-gold mt-1">BDT {property.price?.toLocaleString()}</p>
            </div>
            <ArrowRight size={16} className="text-zinc-600 group-hover:text-brand-gold transition-colors mr-2" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
