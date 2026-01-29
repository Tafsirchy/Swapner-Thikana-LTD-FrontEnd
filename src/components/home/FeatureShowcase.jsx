'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [progress, setProgress] = useState(0);

  const ROTATION_TIME = 6000; // 6 seconds

  // Fetch Featured Properties
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.properties.getAll({
          featured: 'true',
          limit: 6
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

  const handleNext = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % properties.length);
    setProgress(0);
  }, [properties.length]);

  const handlePrev = useCallback(() => {
    if (properties.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + properties.length) % properties.length);
    setProgress(0);
  }, [properties.length]);

  // Auto-Rotation logic with Progress
  useEffect(() => {
    let interval;
    let progressInterval;

    if (!isPaused && properties.length > 0) {
      progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + (100 / (ROTATION_TIME / 10)), 100));
      }, 10);

      interval = setInterval(() => {
        handleNext();
      }, ROTATION_TIME);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isPaused, handleNext, properties.length]);

  if (loading) {
    return (
      <section className="py-24 bg-royal-deep text-white flex justify-center items-center min-h-[600px]">
        <Loader2 className="animate-spin text-brand-gold" size={48} />
      </section>
    );
  }

  if (properties.length === 0) return null;

  const activeProperty = properties[activeIndex];

  return (
    <section 
      className="py-24 bg-royal-deep text-white overflow-hidden relative" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-container px-4 relative z-10">
        
        <div className="mb-16 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                    Exclusive Listings
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-cinzel text-white mb-6">
                    Featured <span className="text-brand-gold italic">Properties</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto" />
            </motion.div>
        </div>

        <div className="h-[600px] lg:h-[700px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Main Feature Display (8 Cols) */}
          <div className="lg:col-span-8 relative h-full overflow-hidden group border border-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProperty._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 w-full h-full"
              >
                <motion.div 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: ROTATION_TIME / 1000, ease: "linear" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image 
                    src={activeProperty.images[0] || '/placeholder.jpg'} 
                    alt={activeProperty.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                </motion.div>
                
                {/* Centered Content Overlay (Editorial Style) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-20 pointer-events-none">
                  <motion.h2 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-5xl md:text-7xl lg:text-8xl font-cinzel text-white mb-8 uppercase tracking-tight drop-shadow-xl"
                  >
                    {activeProperty.title || 'Featured Property'}
                  </motion.h2>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-8 text-sm md:text-base font-inter tracking-[0.3em] font-medium uppercase text-white/90 pointer-events-auto"
                  >
                    <span>{activeProperty.location?.city || 'Dhaka'}</span>
                    <span className="w-px h-4 bg-white/60" />
                    <span>{activeProperty.listingType === 'sale' ? 'Buy' : 'Rent'}</span>
                    <span className="w-px h-4 bg-white/60" />
                    <Link href={`/properties/${activeProperty.slug || activeProperty._id}`} className="hover:text-brand-gold transition-colors font-bold underline decoration-brand-gold underline-offset-4">
                      View Details
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Progress Bar (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30">
              <motion.div 
                className="h-full bg-brand-gold shadow-[0_0_10px_#F59E0B]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Side Column: Vertical Strips (4 Cols) */}
          <div className="lg:col-span-4 hidden lg:grid grid-cols-[1.6fr_0.9fr] gap-4 h-full">
            {[1, 2].map((offset) => {
              const idx = (activeIndex + offset) % properties.length;
              const property = properties[idx];
              
              return (
                <button
                  key={`${property._id}-${offset}`}
                  onClick={() => {
                    setActiveIndex(idx);
                    setProgress(0);
                  }}
                  className="relative h-full flex flex-col group text-center overflow-hidden"
                >
                  <div className="relative flex-1 w-full overflow-hidden mb-4">
                    <Image 
                        src={property.images[0] || '/placeholder.jpg'} 
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  
                  <div className="h-[auto] flex flex-col justify-center items-center py-2">
                    <h4 className="font-cinzel text-lg text-white mb-2 uppercase tracking-widest group-hover:text-brand-gold transition-colors line-clamp-1 px-2">
                        {property.title || 'Property'}
                    </h4>
                    
                    <div className="flex items-center gap-3 text-[10px] font-inter tracking-[0.2em] text-zinc-400 uppercase group-hover:text-zinc-200 transition-colors">
                       <span>{property.location?.city || 'Dhaka'}</span>
                       <span className="w-px h-3 bg-zinc-700" />
                       <span>{property.listingType === 'sale' ? 'Buy' : 'Rent'}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

           {/* Mobile Controls (Only visible on small screens) */}
           <div className="col-span-1 lg:hidden flex justify-center items-center gap-8 mt-4 md:mt-0">
             <button onClick={handlePrev} className="p-4 bg-zinc-900 rounded-full text-brand-gold border border-zinc-800 active:scale-95 transition-all">
              <ChevronRight size={24} className="rotate-180" />
             </button>
             <button onClick={handleNext} className="p-4 bg-zinc-900 rounded-full text-brand-gold border border-zinc-800 active:scale-95 transition-all">
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
