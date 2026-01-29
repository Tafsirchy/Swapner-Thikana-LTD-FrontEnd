'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Building, Home, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const regions = [
  {
    id: 'uttara',
    name: 'Uttara',
    path: 'M250 280 L280 280 L290 310 L260 320 L240 300 Z', // Central -ish
    stats: { projects: 12, value: 'High', type: 'Residential' },
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
    description: 'The premium gateway to Dhaka, featuring exclusive residential sectors and modern amenities.'
  },
  {
    id: 'purbachal',
    name: 'Purbachal',
    path: 'M300 290 L340 280 L350 320 L310 330 Z', // East of Uttara
    stats: { projects: 8, value: 'Emerging', type: 'Mixed Use' },
    image: 'https://images.unsplash.com/photo-1621609764095-64d1a63c78a0',
    description: 'The future modern city, designed for sustainable living and next-gen commercial hubs.'
  },
  {
    id: 'gazipur',
    name: 'Gazipur',
    path: 'M250 230 L300 230 L290 270 L240 270 Z', // North of Uttara
    stats: { projects: 5, value: 'Industrial', type: 'Industrial/Res' },
    image: 'https://images.unsplash.com/photo-1599423300746-b62533397364',
    description: 'A thriving industrial hub with rapidly developing residential eco-townships.'
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    path: 'M360 180 L420 160 L440 220 L380 240 Z', // North East
    stats: { projects: 6, value: 'Luxury', type: 'Resort/Res' },
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b',
    description: 'Scenic landscapes and luxury tea-estate villas for the discerning elite.'
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    path: 'M350 400 L400 420 L380 500 L320 450 Z', // South East (roughly)
    stats: { projects: 9, value: 'Premium', type: 'Port City' },
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d',
    description: 'The commercial capital, offering premium port-city living and hillside retreats.'
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    path: 'M150 150 L200 140 L220 200 L160 210 Z', // North West
    stats: { projects: 4, value: 'Value', type: 'Residential' },
    image: 'https://images.unsplash.com/photo-1549517045-bc93de075e53',
    description: 'A historic region transforming into a modern heritage city with new developments.'
  }
];

const InteractiveMasterPlan = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  return (
    <section className="py-24 bg-royal-deep relative overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-container px-4 relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-16">
            <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                National Footprint
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-cinzel text-white mb-6">
                Interactive <span className="text-brand-gold italic">Master Plan</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
                Explore our strategic footprint across the nation. Select a region to discover our active developments and future vision.
            </p>
        </div>

        {/* Map Container */}
        <div className="relative w-full max-w-4xl aspect-[16/9] md:aspect-[2/1] bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center overflow-hidden">
            
            {/* SVG Map */}
            <svg viewBox="0 0 600 600" className="w-full h-full max-h-[500px] drop-shadow-2xl">
                {/* Connecting Lines (Abstract Roads) */}
                <motion.path 
                    d="M270 300 L320 300 L390 200 M270 300 L270 250 M270 300 L360 420 M270 300 L190 180"
                    fill="none" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {regions.map((region) => (
                    <motion.g 
                        key={region.id}
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => setActiveRegion(region)}
                        className="cursor-pointer group"
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        {/* Region Path */}
                        <motion.path
                            d={region.path}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-zinc-600 group-hover:text-brand-gold transition-colors duration-300"
                            variants={{
                                initial: { fill: "rgba(255,255,255,0.05)", scale: 1 },
                                hover: { fill: "rgba(245, 158, 11, 0.2)", scale: 1.05, strokeWidth: 3 },
                                tap: { scale: 0.95 }
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                        
                        {/* Hotspot Marker */}
                        <motion.circle 
                            cx={getCenter(region.path).x} 
                            cy={getCenter(region.path).y} 
                            r="4" 
                            className="text-brand-gold fill-current"
                            initial={{ r: 0 }}
                            whileInView={{ r: 4 }}
                            transition={{ delay: 1 }}
                        >
                             <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                             <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                        </motion.circle>

                    </motion.g>
                ))}
            </svg>

            {/* Hover Tooltip (Floating) */}
            <AnimatePresence>
                {hoveredRegion && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute pointer-events-none z-20 bg-black/80 backdrop-blur-md border border-brand-gold/30 p-4 rounded-xl shadow-xl flex gap-4 min-w-[200px]"
                        style={{
                            top: '50%', 
                            left: '50%',
                            x: -100, // Center rough approximation, ideally mapped to exact coordinates
                            y: -100 
                        }}
                    >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <Image src={hoveredRegion.image} alt={hoveredRegion.name} fill className="object-cover" />
                        </div>
                        <div>
                            <h4 className="text-brand-gold font-bold text-lg">{hoveredRegion.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-zinc-300 mt-1">
                                <Building size={12} />
                                <span>{hoveredRegion.stats.projects} Projects</span>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1 block">{hoveredRegion.stats.value}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>

      {/* Slide-over Sidebar */}
      <AnimatePresence>
        {activeRegion && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setActiveRegion(null)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                
                {/* Drawer */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 border-l border-white/10 z-50 p-8 overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-cinzel text-white">{activeRegion.name}</h3>
                        <button onClick={() => setActiveRegion(null)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
                        <Image src={activeRegion.image} alt={activeRegion.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                            <span className="bg-brand-gold text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {activeRegion.stats.type}
                            </span>
                        </div>
                    </div>

                    <p className="text-zinc-400 leading-relaxed mb-8 border-l-2 border-brand-gold/30 pl-4">
                        {activeRegion.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <Building className="text-brand-gold mb-2" size={24} />
                            <div className="text-2xl font-bold text-white">{activeRegion.stats.projects}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">Projects</div>
                         </div>
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <TrendingUp className="text-brand-gold mb-2" size={24} />
                            <div className="text-xl font-bold text-white">{activeRegion.stats.value}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">Market Value</div>
                         </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-white uppercase tracking-wider text-sm border-b border-white/10 pb-2">Recent Developments</h4>
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-brand-gold">
                                    <Home size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-zinc-200">Project Alpha-{item}</div>
                                    <div className="text-xs text-zinc-500">Upcoming • Residential</div>
                                </div>
                                <ArrowRight size={16} className="text-zinc-600 group-hover:text-white" />
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-12 py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-white transition-colors">
                        View Full Master Plan
                    </button>

                </motion.div>
            </>
        )}
      </AnimatePresence>
    </section>
  );
};

// Helper: Calculate centroid of a polygon path string roughly for dot placement
function getCenter(pathString) {
    // Very rough estimation based on bounding box reasoning from the coordinates in string
    const numbers = pathString.match(/\d+/g).map(Number);
    const xCoords = numbers.filter((_, i) => i % 2 === 0);
    const yCoords = numbers.filter((_, i) => i % 2 !== 0);
    
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2
    };
}

export default InteractiveMasterPlan;
