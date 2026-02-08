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
  // Handle both string and structured object sources
  const imageUrl = typeof src === 'object' && src !== null 
    ? (
        width < 450 && src.thumbnail ? src.thumbnail :
        width < 900 && src.medium ? src.medium :
        src.original || src.url
      )
    : src;

  const [lastSrc, setLastSrc] = useState(imageUrl);
  const [isChanging, setIsChanging] = useState(false);

  // Auto-generate alt text if missing
  const displayAlt = alt || (typeof imageUrl === 'string' ? 
    imageUrl.split('/').pop()?.split('.')?.[0]?.replace(/[-_]/g, ' ') || 'Luxury Property' 
    : 'Luxury Property');

  // Loading guard for smooth transitions
  React.useEffect(() => {
    if (imageUrl !== lastSrc) {
      setIsChanging(true);
      setLoading(true);
    }
  }, [imageUrl, lastSrc]);

  return (
    <div 
      className={`relative overflow-hidden bg-zinc-900/50 ${fill ? 'w-full h-full' : ''}`}
      style={!fill ? { width, height } : undefined}
    >
      {/* Previous Image (Loading Guard) */}
      {isChanging && lastSrc && (
        <div className="absolute inset-0 z-0">
          <Image
            src={lastSrc}
            alt=""
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            className={`object-cover ${className}`}
            priority={priority}
          />
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            
            {/* Central Loader - Slightly smaller for detail views */}
            <div className="relative scale-75">
                <div className="w-12 h-12 rounded-full border border-brand-gold/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-brand-gold/20 border-t-brand-gold animate-spin" />
                </div>
            </div>
        </div>
      )}
      
      <Image
        key={imageUrl}
        src={error ? fallbackSrc : imageUrl}
        alt={displayAlt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={`transition-all duration-700 ease-out z-[5] ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} ${className}`}
        onLoad={() => {
          setLoading(false);
          setLastSrc(imageUrl);
          setIsChanging(false);
        }}
        onError={() => {
           setError(true);
           setLoading(false);
           setIsChanging(false);
        }}
        priority={priority}
      />

      {error && (
        <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-3 z-20">
          <ImageIcon className="text-zinc-800" size={32} />
          <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Visual Unavailable</span>
        </div>
      )}

      {/* Dev-only Image Monitoring Overlay */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-1 right-1 z-30 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-black/80 text-[8px] text-white px-1.5 py-0.5 rounded font-mono border border-white/10 flex flex-col items-end">
             <span>{width}x{height}</span>
             <span className={typeof src === 'object' ? 'text-brand-gold' : 'text-zinc-400'}>
               {typeof src === 'object' ? 'Optimized Object' : 'Native String'}
             </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartImage;
