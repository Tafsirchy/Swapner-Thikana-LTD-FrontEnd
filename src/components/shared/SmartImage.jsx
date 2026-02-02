'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

const SmartImage = ({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  sizes,
  className = '', 
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200' 
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fail-safe: show image after 8 seconds even if onLoad doesn't fire
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [src, loading]);

  return (
    <div 
      className={`relative overflow-hidden bg-zinc-900/50 ${fill ? 'w-full h-full' : ''}`}
      style={!fill ? { width, height } : undefined}
    >
      {loading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-900 flex items-center justify-center">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            
            {/* Central Loader */}
            <div className="relative">
                <div className="w-12 h-12 rounded-full border border-brand-gold/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-brand-gold/20 border-t-brand-gold animate-spin" />
                </div>
                <div className="absolute -inset-4 bg-brand-gold/5 rounded-full blur-xl animate-pulse" />
            </div>
        </div>
      )}
      
      <Image
        key={src}
        src={error ? fallbackSrc : src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={`transition-all duration-1000 ease-out ${loading ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'} ${className}`}
        onLoad={() => setLoading(false)}
        onError={() => {
           setError(true);
           setLoading(false);
        }}
        priority={priority}
        unoptimized={typeof src === 'string' && src.includes('ibb.co')}
      />

      {error && (
        <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-3 z-20">
          <ImageIcon className="text-zinc-800" size={32} />
          <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Visual Unavailable</span>
        </div>
      )}
    </div>
  );
};

export default SmartImage;
