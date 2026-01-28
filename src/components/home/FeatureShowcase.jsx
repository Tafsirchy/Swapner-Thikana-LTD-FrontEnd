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
          sort: 'featured',
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
  const thumbnailIndices = [0, 1, 2].map(offset => (activeIndex + offset) % properties.length);

  return (
    <section 
      className="py-24 bg-royal-deep text-white overflow-hidden relative" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-gold/5 to-transparent pointer-events-none" />

      <div className="max-container px-4 relative z-10">
        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
          <div className="flex flex-col">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-brand-gold font-cinzel tracking-[0.4em] text-xs mb-4 block uppercase font-bold"
            >
              Exclusivity Defined
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-cinzel text-white leading-[0.9] flex flex-col"
            >
              <span>THE SELECTION</span>
              <span className="text-zinc-800 italic ml-12 md:ml-32 -mt-2">Portfolio</span>
            </motion.h2>
          </div>
          
          <div className="max-w-md lg:text-right">
            <p className="text-zinc-500 font-inter text-sm leading-relaxed italic border-l-2 lg:border-l-0 lg:border-r-2 border-brand-gold/30 pl-4 lg:pl-0 lg:pr-4">
              &quot;shwapner Thikana curates only the most architecturally significant residences across Bangladesh, 
              focusing on heritage, innovation, and the art of modern luxury.&quot;
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-12">
          
          {/* Left Column: Feature Display (65%) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8">
            <div className="relative w-full h-[500px] lg:h-[700px] overflow-hidden rounded-[2.5rem] shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProperty._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: ROTATION_TIME / 1000, ease: "linear" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    <Image 
                      src={activeProperty.images[0] || '/placeholder.jpg'} 
                      alt={activeProperty.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                  
                  {/* Property Info Overlay */}
                  <div className="absolute bottom-0 left-0 w-full z-20 p-10 md:p-16 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex flex-col max-w-lg">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 mb-4"
                      >
                         <span className="h-px w-8 bg-brand-gold" />
                         <span className="text-brand-gold font-cinzel text-xs tracking-widest uppercase">
                            {activeProperty.propertyType} • {activeProperty.location?.city}
                         </span>
                      </motion.div>
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-4xl md:text-5xl font-cinzel text-white tracking-tight drop-shadow-2xl"
                      >
                        {activeProperty.title}
                      </motion.h3>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Link 
                        href={`/properties/${activeProperty.slug}`}
                        className="group/btn flex items-center justify-center bg-brand-gold text-royal-deep px-8 py-5 rounded-full font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-all transform hover:-translate-y-1 shadow-lg"
                      >
                        Explore Now
                        <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-30">
                <motion.div 
                  className="h-full bg-brand-gold shadow-[0_0_10px_#F59E0B]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex justify-between items-center text-zinc-500">
               <div className="flex items-center gap-4 font-cinzel text-[10px] tracking-[0.3em] uppercase">
                  <span className="text-brand-gold">0{(activeIndex + 1)}</span>
                  <div className="w-20 h-[1px] bg-zinc-800 relative">
                     <motion.div 
                       className="absolute top-0 left-0 h-full bg-brand-gold"
                       initial={{ width: 0 }}
                       animate={{ width: `${((activeIndex + 1) / properties.length) * 100}%` }}
                     />
                  </div>
                  <span>0{properties.length}</span>
               </div>

               <div className="flex items-center gap-6">
                <button 
                  onClick={handlePrev} 
                  className="hover:text-brand-gold transition-all p-3 border border-zinc-800 rounded-full hover:border-brand-gold group"
                >
                  <ChevronRight size={20} className="rotate-180 group-active:scale-95 transition-transform" />
                </button>
                <button 
                   onClick={handleNext} 
                   className="hover:text-brand-gold transition-all p-3 border border-zinc-800 rounded-full hover:border-brand-gold group"
                >
                  <ChevronRight size={20} className="group-active:scale-95 transition-transform" />
                </button>
               </div>
            </div>
          </div>

          {/* Right Column: Dynamic Thumbnails (35%) */}
          <div className="w-full lg:w-[35%] flex flex-col h-[500px] lg:h-[700px]">
             <div className="flex flex-col h-full gap-6">
                {thumbnailIndices.map((idx, i) => { 
                   const property = properties[idx];
                   const isSelected = i === 0;
                   
                   return (
                  <button
                    key={`${property._id}-${idx}`}
                    onClick={() => {
                      setActiveIndex(idx);
                      setProgress(0);
                    }}
                    className={`flex items-start gap-6 group text-left transition-all duration-500 h-1/3 p-4 rounded-3xl border ${isSelected ? 'border-brand-gold/30 bg-brand-gold/5' : 'border-transparent hover:bg-white/5'}`}
                  >
                    <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-2xl shadow-xl">
                      <Image 
                        src={property.images[0] || '/placeholder.jpg'} 
                        alt={property.title}
                        fill
                        className={`object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-110 grayscale group-hover:grayscale-0'}`}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 ring-2 ring-inset ring-brand-gold rounded-2xl z-10" />
                      )}
                    </div>

                    <div className="flex flex-col justify-center py-2">
                      <span className={`text-[10px] font-cinzel tracking-[0.2em] uppercase mb-2 ${isSelected ? 'text-brand-gold' : 'text-zinc-600'}`}>
                        {property.location?.city} • {property.propertyType}
                      </span>
                      <h4 className={`text-lg font-cinzel leading-snug transition-colors ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                        {property.title}
                      </h4>
                      <div className={`mt-3 flex items-center gap-2 text-xs font-inter ${isSelected ? 'text-brand-gold/80' : 'text-zinc-600'}`}>
                        <span className="font-bold">{property.price?.toLocaleString()} BDT</span>
                        <ArrowTopRightIcon className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-0.5 -translate-y-0.5' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
                      </div>
                    </div>
                  </button>
                )})}
             </div>
             
             {/* Mobile Controls */}
             <div className="flex lg:hidden justify-center items-center gap-8 mt-10">
               <button onClick={handlePrev} className="p-4 bg-zinc-900 rounded-full text-brand-gold shadow-glow-gold active:scale-95 transition-all">
                <ChevronRight size={24} className="rotate-180" />
               </button>
               <button onClick={handleNext} className="p-4 bg-zinc-900 rounded-full text-brand-gold shadow-glow-gold active:scale-95 transition-all">
                <ChevronRight size={24} />
               </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// Simple Arrow Component
const ArrowTopRightIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export default FeatureShowcase;
