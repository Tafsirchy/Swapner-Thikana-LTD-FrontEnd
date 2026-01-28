'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
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

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % FEATURES.length);
      }, 5000); // 5 seconds rotation
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    setIsPaused(true);
    // Optional: Resume after some time? For now, let's keep it paused if manually interacted, 
    // or we could just let the user resume. 
    // Let's implement a temporary pause resume logic if desired, but for now simple manual override is safer.
    // Actually, let's just reset the timer logic by clearing/setting interval effectively if we didn't use `isPaused` state for robust pausing.
    // But since we want "click pauses temporarily", let's handle "Resume on mouse leave" from the main container generally.
  };

  return (
    <section 
      className="py-24 bg-royal-deep text-white overflow-hidden" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-container px-4">
        <div className="mb-12">
          <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Exclusive Highlights</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            Curated <span className="text-brand-gold italic">Lifestyles</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row h-[600px] lg:h-[700px] w-full gap-6">
          
          {/* Left Column: Large Display */}
          <div className="relative w-full lg:w-[65%] h-full rounded-[2.5rem] overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <Image 
                  src={FEATURES[activeIndex].image} 
                  alt={FEATURES[activeIndex].title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 p-8 md:p-14 z-20 w-full md:max-w-xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <span className="inline-block px-3 py-1 mb-4 border border-brand-gold/30 rounded-full text-brand-gold text-xs font-bold uppercase tracking-widest bg-brand-gold/10 backdrop-blur-md">
                      {FEATURES[activeIndex].label}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-bold mb-4 font-heading leading-tight">
                      {FEATURES[activeIndex].title}
                    </h3>
                    <p className="text-zinc-300 text-lg mb-8 line-clamp-3 md:line-clamp-none">
                      {FEATURES[activeIndex].description}
                    </p>
                    <button className="flex items-center gap-3 text-white font-bold tracking-widest uppercase text-sm group/btn">
                      Explore Collection
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-brand-gold group-hover/btn:text-royal-deep transition-all">
                        <ArrowRight size={14} />
                      </span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar for Active Item */}
             <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-30">
                <motion.div 
                    key={activeIndex} // Reset animation on change
                    initial={{ width: "0%" }}
                    animate={{ width: isPaused ? "100%" : "100%" }} // If paused we might want to stop, but for simple visualization let's just animate.
                    // Better approach for "timer" visual:
                />
                {!isPaused && (
                     <motion.div 
                        key={`progress-${activeIndex}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="h-full bg-brand-gold"
                     />
                )}
                {isPaused && (
                     <div 
                        className="h-full bg-brand-gold w-full opacity-50"
                     />
                )}
             </div>
          </div>

          {/* Right Column: Thumbnails */}
          <div className="w-full lg:w-[35%] flex lg:flex-col gap-4 overflow-x-auto lg:overflow-hidden scrollbar-hide">
            {FEATURES.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-1 lg:flex-grow lg:h-auto min-w-[280px] lg:min-w-0 rounded-3xl overflow-hidden transition-all duration-500 group text-left ${
                  activeIndex === index 
                    ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-royal-deep grayscale-0' 
                    : 'opacity-60 hover:opacity-100 grayscale'
                }`}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <Image 
                  src={feature.image} 
                  alt={feature.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                  <div className={`transition-all duration-300 ${activeIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}`}>
                    <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-1">{feature.subtitle}</p>
                    <h4 className="text-xl font-bold text-white flex items-center justify-between">
                      {feature.label}
                      {activeIndex === index && <ChevronRight className="text-brand-gold" size={20} />}
                    </h4>
                  </div>
                </div>

                {/* Vertical Progress/Indicator for desktop could go here, but top bar on main image is cleaner */}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
