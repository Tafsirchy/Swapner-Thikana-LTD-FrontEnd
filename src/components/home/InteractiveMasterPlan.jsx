'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Building, Home, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const regions = [
  {
    id: 'uttara',
    name: 'Uttara',
    path: 'M260 280 L340 280 L360 340 L300 360 L240 320 Z', 
    stats: { projects: 12, value: 'High', type: 'Residential' },
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    description: 'The premium gateway to Dhaka, featuring exclusive residential sectors and modern amenities.'
  },
  {
    id: 'purbachal',
    name: 'Purbachal',
    path: 'M400 280 L480 260 L500 340 L420 360 Z',
    stats: { projects: 8, value: 'Emerging', type: 'Mixed Use' },
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
    description: 'The future modern city, designed for sustainable living and next-gen commercial hubs.'
  },
  {
    id: 'gazipur',
    name: 'Gazipur',
    path: 'M260 100 L360 100 L340 180 L240 180 Z',
    stats: { projects: 5, value: 'Industrial', type: 'Industrial/Res' },
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    description: 'A thriving industrial hub with rapidly developing residential eco-townships.'
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    path: 'M450 50 L550 20 L580 140 L480 160 Z', 
    stats: { projects: 6, value: 'Luxury', type: 'Resort/Res' },
    image: 'https://images.unsplash.com/photo-1605146764387-0d9b0f975962',
    description: 'Scenic landscapes and luxury tea-estate villas for the discerning elite.'
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    path: 'M450 450 L550 480 L520 580 L400 520 Z',
    stats: { projects: 9, value: 'Premium', type: 'Port City' },
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607',
    description: 'The commercial capital, offering premium port-city living and hillside retreats.'
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    path: 'M50 80 L150 60 L180 160 L80 180 Z',
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-semibold text-white mb-6">
                Interactive <span className="text-brand-gold font-cinzel">Master </span>Plan
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
                Explore our strategic footprint across the nation. Select a region to discover our active developments and future vision.
            </p>
        </div>

        {/* Map Container */}
        <div className="relative w-full max-w-4xl aspect-[16/9] md:aspect-[2/1] bg-white/5 border border-white/10 backdrop-blur-sm p-4 flex items-center justify-center overflow-hidden">
            
            {/* SVG Map */}
            <svg viewBox="0 0 800 600" className="w-full h-full max-h-[600px] drop-shadow-2xl">
                {/* Connecting Lines (Abstract Roads) */}
                <motion.path 
                    d="M300 320 L450 310 L515 100 M300 320 L300 140 M300 320 L480 500 M300 320 L120 120"
                    fill="none" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="3"
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
                {hoveredRegion && (() => {
                    const center = getCenter(hoveredRegion.path);
                    const isRightSide = center.x > 400;
                    
                    // Compact Creative Tooltip
                    return (
                        <motion.div
                            initial={{ opacity: 0, x: isRightSide ? 20 : -20, scale: 0.9, rotateY: isRightSide ? 10 : -10 }}
                            animate={{ opacity: 1, x: isRightSide ? -20 : 20, scale: 1, rotateY: 0 }}
                            exit={{ opacity: 0, x: isRightSide ? 20 : -20, scale: 0.9 }}
                            className="absolute pointer-events-none z-20 bg-zinc-900/95 backdrop-blur-xl border-l-4 border-l-brand-gold border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-4 min-w-[220px]"
                            style={{
                                top: `${(center.y / 600) * 100}%`, 
                                left: isRightSide ? `${(center.x / 800) * 100}%` : `${(center.x / 800) * 100}%`,
                                y: '-50%',
                                translateX: isRightSide ? '-115%' : '15%' // Explicitly move outside center
                            }}
                        >
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-lg">
                                <Image src={hoveredRegion.image} alt={hoveredRegion.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-brand-gold font-cinzel font-bold text-base tracking-wider leading-tight">{hoveredRegion.name}</h4>
                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                                    <Building size={10} className="text-brand-gold/70" />
                                    <span>{hoveredRegion.stats.projects} Projects</span>
                                </div>
                                <div className="mt-1.5 flex gap-1">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-bold uppercase tracking-tighter">
                                        {hoveredRegion.stats.value}
                                    </span>
                                </div>
                            </div>
                            {/* Accent Decorative Glow */}
                            <div className="absolute -inset-px bg-brand-gold/5 rounded-xl -z-10 blur-sm"></div>
                        </motion.div>
                    );
                })()}
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
