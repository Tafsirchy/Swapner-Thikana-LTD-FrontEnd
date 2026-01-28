'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

const FEATURES = [
  {
    id: 1,
    title: "Eco-Conscious Living",
    subtitle: "Sustainable Sanctuaries",
    description: "Experience the perfect harmony of luxury and nature with our net-zero energy villas designed for the modern environmentalist.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop", 
    label: "Sustainability"
  },
  {
    id: 2,
    title: "Skyline Dominance",
    subtitle: "Urban Masterpieces",
    description: "Rise above the ordinary in our signature high-rises that redefine the city silhouette with bold architecture and panoramic views.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    label: "Architecture"
  },
  {
    id: 3,
    title: "Waterfront Serenity",
    subtitle: "Coastal Retreats",
    description: "Wake up to the rhythm of the waves in exclusive properties positioned perfectly along the most pristine coastlines.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    label: "Waterfront"
  }
];

const FeatureShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Move definitions up
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  };

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        handleNext();
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [isPaused, activeIndex]); // Removed handleNext from dependency array as it is stable component-scope function now, but technically it changes every render unless wrapped in useCallback. 
  // Ideally wrap handleNext in useCallback or ignore dependency. Given simplicity, this is fine or we can omit it if linter complains.
  // Actually, to avoid stale referencing in interval if handleNext depends on state, we should use functional update in handleNext (which we do).
  // But handleNext is re-created every render.
  // Let's just suppress or keep simple. The previous code didn't have handleNext in deps.
  // I will just use the function inside effect or useCallback.
  // EASIEST FIX: Define the interval callback inline or use a ref.
  // Reserving to simple structure:

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
            <div className="relative w-full h-[500px] lg:h-[650px] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div className="absolute inset-0 bg-black/20 z-10" />
                  <Image 
                    src={FEATURES[activeIndex].image} 
                    alt={FEATURES[activeIndex].title}
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
                      className="text-4xl md:text-6xl font-serif text-white mb-8 tracking-wide drop-shadow-lg"
                    >
                      {FEATURES[activeIndex].label.toUpperCase()}
                    </motion.h3>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-8 text-xs font-bold tracking-[0.3em] uppercase"
                    >
                      <button className="hover:text-brand-gold transition-colors flex items-center gap-2">
                        <span className="w-px h-3 bg-brand-gold"></span> Buy
                      </button>
                      <span className="text-brand-gold/50">|</span>
                      <button className="hover:text-brand-gold transition-colors flex items-center gap-2">
                        <span className="w-px h-3 bg-brand-gold"></span> Rent
                      </button>
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

          {/* Right Column: Thumbnails (35%) */}
          <div className="w-full lg:w-[35%] flex flex-col justify-between h-[500px] lg:h-[650px]">
             <div className="grid grid-cols-3 gap-4 h-full">
                {FEATURES.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveIndex(index)}
                    className={`flex flex-col h-full group text-center transition-all duration-500`}
                  >
                    <div className={`relative w-full flex-grow overflow-hidden mb-6 ${activeIndex === index ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}>
                      <Image 
                        src={feature.image} 
                        alt={feature.label}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <span className={`text-[10px] md:text-xs font-serif tracking-widest uppercase transition-colors ${activeIndex === index ? 'text-brand-gold' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {feature.subtitle || feature.label}
                    </span>
                    {index < FEATURES.length - 1 && (
                      <span className="hidden md:block absolute right-0 top-full w-px h-4 bg-zinc-800 lg:hidden"></span> 
                    )}
                  </button>
                ))}
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
