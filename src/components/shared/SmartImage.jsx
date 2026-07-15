'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const SmartImage = ({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  sizes,
  className = '', 
  priority = false,
  noBg = false,
  unoptimized = false,
  title,
  fallbackSrc = '/assets/fallback.svg' 
}) => {
  const [error, setError] = useState(false);

  // Handle both string and structured object sources
  let imageUrl = (typeof src === 'object' && src !== null 
    ? (
        (width && width < 450) && src.thumbnail ? src.thumbnail :
        (width && width < 900) && src.medium ? src.medium :
        src.original || src.url
      )
    : src) || fallbackSrc;

  // Validate dynamic URL (prevent empty or undefined passing through)
  if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
     imageUrl = fallbackSrc;
  }

  // Auto-generate alt text if missing (Rule: every img must have meaningful alt)
  const displayAlt = alt !== undefined ? alt : (typeof imageUrl === 'string' ? 
    imageUrl.split('/').pop()?.split('.')?.[0]?.replace(/[-_]/g, ' ') || 'Image' 
    : 'Image');

  // Calculate standard sizes if not provided (Rule: srcset and sizes attributes)
  // Next.js automatically generates srcset based on sizes.
  const imageSizes = sizes || (fill ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : undefined);

  // Parse custom classes that shouldn't be on the wrapper but on the img or vice versa
  const roundedClass = className.split(' ').find(c => c.startsWith('rounded')) || '';
  
  return (
    <div 
      className={`image-wrapper ${!noBg ? 'bg-[#f0f0f0]' : '!bg-transparent'} ${roundedClass} ${fill ? 'w-full h-full' : ''}`}
      style={!fill ? { width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%', aspectRatio: width && height ? `${width}/${height}` : undefined } : undefined}
    >
      <Image
        key={imageUrl}
        src={error ? fallbackSrc : imageUrl}
        alt={displayAlt}
        title={title}
        fill={true}
        sizes={imageSizes}
        className={`object-cover object-center w-full h-full block ${className}`}
        onError={(e) => {
           setError(true);
           e.target.onerror = null;
           e.target.src = fallbackSrc;
        }}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        unoptimized={unoptimized}
      />
    </div>
  );
};

export default SmartImage;
