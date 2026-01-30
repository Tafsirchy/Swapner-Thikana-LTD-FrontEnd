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
  className = '', 
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200' 
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fail-safe: show image after 5 seconds even if onLoad doesn't fire
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [src, loading]);

  return (
    <div 
      className={`relative overflow-hidden bg-zinc-900/50 ${fill ? 'w-full h-full' : ''}`}
      style={!fill ? { width, height } : undefined}
    >
      {loading && (
        <div className="absolute inset-0 bg-zinc-900 animate-shimmer flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-brand-gold/20 border-t-brand-gold animate-spin" />
        </div>
      )}
      
      <Image
        key={src}
        src={error ? fallbackSrc : src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`transition-all duration-700 ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} ${className}`}
        onLoad={() => setLoading(false)}
        onError={() => {
           setError(true);
           setLoading(false);
        }}
        priority={priority}
        unoptimized={typeof src === 'string' && src.includes('ibb.co')} // Only skip optimization for ImgBB (high-res user uploads)
      />

      {error && (
        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-3 z-20">
          <ImageIcon className="text-zinc-700" size={32} />
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Preview Unavailable</span>
        </div>
      )}
    </div>
  );
};

export default SmartImage;
