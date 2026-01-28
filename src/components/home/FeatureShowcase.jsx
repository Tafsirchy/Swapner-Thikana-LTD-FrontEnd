'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import Link from 'next/link';

const FeatureShowcase = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch Featured Properties
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.properties.getAll({
          sort: 'featured',
          limit: 6 // Fetch a few to rotate
        });
        if (res.data && res.data.properties) {
          setProperties(res.data.properties);
        }
      } catch (error) {
        console.error('Failed to fetch featured properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Wrap handlers in useCallback
  const handleNext = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % properties.length);
  }, [properties.length]);

  const handlePrev = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + properties.length) % properties.length);
  }, [properties.length]);

  // Auto-Rotation logic
  useEffect(() => {
    let interval;
    if (!isPaused && properties.length > 0) {
      interval = setInterval(() => {
        handleNext();
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [isPaused, handleNext, properties.length]); // handleNext is now stable

  if (loading) {
    return (
      <section className="py-24 bg-royal-deep text-white flex justify-center items-center min-h-[600px]">
        <Loader2 className="animate-spin text-brand-gold" size={48} />
      </section>
    );
  }

  if (properties.length === 0) return null;

  const activeProperty = properties[activeIndex];

  // Sliding window for thumbnails (Next 3 items, wrapping)
  const thumbnailIndices = [0, 1, 2].map(offset => (activeIndex + offset) % properties.length);

  return (
    <section 
      className="py-24 bg-royal-deep text-white overflow-hidden" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-container px-4">
        {/* Header Section: Split Layout */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8">
          <div className="max-w-md">
            <span className="text-zinc-400 font-serif tracking-wider text-sm mb-2 block uppercase">Discover The</span>
            <h2 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">
              LIFESTYLE
            </h2>
          </div>
          <div className="max-w-xl text-zinc-400 text-sm leading-relaxed text-justify">
            <p>
              The shwapner Thikana Group opens the doors to the most beautiful properties in authentic Dhaka, 
              passing through the wild Cox&apos;s Bazar coastline leading to the Saint Martin peninsula, extended by its Gulf and 
              the Sylhet Massif, reaching Chittagong and the Hill Tracts. Immerse yourself in the timeless 
              art of living of our destinations...
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-8">
          
          {/* Left Column: Main Display (65%) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            <div className="relative w-full h-[500px] lg:h-[650px] overflow-hidden group rounded-[2.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProperty._id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div className="absolute inset-0 bg-black/20 z-10" />
                  <Image 
                    src={activeProperty.images[0] || '/placeholder.jpg'} 
                    alt={activeProperty.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Center Overlay Content */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl md:text-6xl font-serif text-white mb-8 tracking-wide drop-shadow-lg max-w-2xl leading-tight"
                    >
                      {activeProperty.title}
                    </motion.h3>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-8 text-xs font-bold tracking-[0.3em] uppercase"
                    >
                      <Link href={`/properties/${activeProperty._id}`} className="hover:text-brand-gold transition-colors flex items-center gap-2">
                        <span className="w-px h-3 bg-brand-gold"></span> View Details
                      </Link>
                      <span className="text-brand-gold/50">|</span>
                      <span className="text-brand-gold">
                        {activeProperty.price?.toLocaleString()} BDT
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation Arrows */}
            <div className="hidden lg:flex justify-center items-center gap-12 mt-4 text-zinc-400">
              <button onClick={handlePrev} className="hover:text-brand-gold transition-colors p-2">
                <ChevronRight size={32} className="rotate-180" strokeWidth={1} />
              </button>
              <button onClick={handleNext} className="hover:text-brand-gold transition-colors p-2">
                <ChevronRight size={32} strokeWidth={1} />
              </button>
            </div>
          </div>

          {/* Right Column: Thumbnails (35%) - Sliding Window */}
          <div className="w-full lg:w-[35%] flex flex-col justify-between h-[500px] lg:h-[650px] overflow-hidden">
             
             <div className="flex flex-col h-full gap-4">
                {thumbnailIndices.map((idx, i) => { 
                   const property = properties[idx];
                   const isSelected = i === 0; // First item in window is always the "active" one
                   
                   return (
                  <button
                    key={`${property._id}-${idx}`} // Use idx to ensure key uniqueness if duplicates appear in sliding window
                    onClick={() => setActiveIndex(idx)} // Clicking any brings it to top/active
                    className={`flex flex-col h-1/3 group text-center transition-all duration-500`}
                  >
                    <div className={`relative w-full flex-grow overflow-hidden mb-3 ${isSelected ? 'opacity-100 ring-2 ring-brand-gold ring-offset-2 ring-offset-royal-deep' : 'opacity-60 group-hover:opacity-80'}`}>
                      <Image 
                        src={property.images[0] || '/placeholder.jpg'} 
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <span className={`text-[10px] md:text-xs font-serif tracking-widest uppercase transition-colors ${isSelected ? 'text-brand-gold' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {property.location?.city || 'Dhaka'} • {property.propertyType}
                    </span>
                  </button>
                )})}
             </div>
             
             {/* Mobile Navigation Arrows */}
             <div className="flex lg:hidden justify-center items-center gap-12 mt-8 text-zinc-400">
              <button onClick={handlePrev} className="hover:text-brand-gold transition-colors">
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button onClick={handleNext} className="hover:text-brand-gold transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
