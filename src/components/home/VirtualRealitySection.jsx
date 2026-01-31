'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import { Compass, Move, X, ChevronRight, Box } from 'lucide-react';
import api from '@/lib/api';
import LiquidButton from '@/components/shared/LiquidButton';

const DEFAULT_PANO = 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg';

const VirtualRealitySection = () => {
  const [activeCategory, setActiveCategory] = useState('properties');
  const [selectedProject, setSelectedProject] = useState(null);
  const [categories, setCategories] = useState({
    properties: { label: 'Properties', items: [] },
    projects: { label: 'Projects', items: [] }
  });
  const [loading, setLoading] = useState(true);

  const viewerRef = useRef(null);
  const viewerInstance = useRef(null);

  // Fetch Data

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, projectsRes] = await Promise.all([
          api.properties.getAll({ limit: 100 }), 
          api.projects.getAll({ limit: 100 })
        ]);
        
        // Robust extraction finding the first array in the response
        const extractArray = (res, key) => {
            console.log(`Extracting ${key}:`, res);
            if (!res) return [];
            
            // Handle Axios response structure
            const data = res.data || res;
            
            if (Array.isArray(data)) return data;
            if (data[key] && Array.isArray(data[key])) return data[key];
            if (data.data && Array.isArray(data.data)) return data.data;
            if (data.data && data.data[key] && Array.isArray(data.data[key])) return data.data[key];
            
            // Fallback for direct array or nested objects
            if (Array.isArray(res)) return res;
            if (res[key] && Array.isArray(res[key])) return res[key];
            
            return [];
        };

        const propertiesData = extractArray(propertiesRes, 'properties');
        const projectsData = extractArray(projectsRes, 'projects');
        
        console.log('Extracted Data:', { propertiesData, projectsData });

        const formatItems = (items) => items.map(p => ({
             id: p._id || p.id,
             name: p.title || 'Untitled Project',
             location: p.location?.city || p.location || 'Bangladesh',
             pano: p.images?.[0] || DEFAULT_PANO 
        }));

        const propertyItems = formatItems(propertiesData);
        const projectItems = formatItems(projectsData);
        
        console.log('Formatted Items:', { propertyItems, projectItems });

        // FALLBACK: If API returns empty, show demo items so section isn't empty
        const finalPropertyItems = propertyItems.length > 0 ? propertyItems : [
             { id: 'demo1', name: 'Gulshan Palace (Demo)', location: 'Gulshan', pano: DEFAULT_PANO },
             { id: 'demo2', name: 'Banani Heights (Demo)', location: 'Banani', pano: DEFAULT_PANO }
        ];

        const finalProjectItems = projectItems.length > 0 ? projectItems : [
             { id: 'demo_p1', name: 'Metro Rail Hub (Demo)', location: 'Dhaka', pano: DEFAULT_PANO },
             { id: 'demo_p2', name: 'Purbachal Eco City (Demo)', location: 'Purbachal', pano: DEFAULT_PANO }
        ];

        setCategories({
            properties: { label: 'Properties', items: finalPropertyItems },
            projects: { label: 'Projects', items: finalProjectItems }
        });
      } catch (error) {
        console.error("Failed to fetch VR data:", error);
         // Fallback on error
         setCategories({
            properties: { label: 'Properties', items: [{ id: 'err1', name: 'Demo Property', location: 'Dhaka', pano: DEFAULT_PANO }] },
            projects: { label: 'Projects', items: [{ id: 'err2', name: 'Demo Project', location: 'Dhaka', pano: DEFAULT_PANO }] }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize Viewer when selectedProject changes
  useEffect(() => {
    if (selectedProject && viewerRef.current) {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
      }

      viewerInstance.current = new Viewer({
        container: viewerRef.current,
        panorama: selectedProject.pano, // In a real app, ensure this URL is a valid equirectangular image
        navbar: false,
        defaultZoomLvl: 0,
        plugins: [
            [MarkersPlugin, {
                markers: [
                    {
                        id: 'marker-1',
                        position: { yaw: '45deg', pitch: '0deg' },
                        image: 'https://photo-sphere-viewer.js.org/assets/pin-red.png',
                        size: { width: 32, height: 32 },
                        anchor: 'bottom center',
                        tooltip: 'Details',
                    },
                ],
            }],
        ],
      });
    }

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, [selectedProject]);

  const handleClose = () => {
    setSelectedProject(null);
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden min-h-screen flex items-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-deep/30 via-black to-black opacity-50 pointer-events-none"></div>

      <div className="max-container px-4 w-full relative z-10 flex flex-col md:flex-row gap-0 h-[80vh]">
        
        {/* Glass Aside (Sidebar) */}
        {!selectedProject && (
            <motion.aside 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="w-full md:w-1/3 lg:w-1/4 h-full bg-zinc-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 z-20"
            >
                <div className="mb-12">
                    <span className="text-brand-gold text-[10px] tracking-[0.3em] uppercase font-bold">Immersive Experience</span>
                    <h2 className="text-3xl font-cinzel text-white mt-2 leading-tight">Virtual <br/><span className="text-brand-gold">Reality</span></h2>
                </div>

                {/* Category Toggles */}
                <div className="flex flex-col gap-4 mb-8">
                    {Object.keys(categories).map((key) => (
                        <LiquidButton 
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            baseColor={activeCategory === key ? 'bg-brand-gold/20' : 'bg-white/5'}
                            liquidColor="fill-brand-gold/10"
                            className={`!p-4 !rounded-xl border !transition-all !duration-500 !flex !justify-start !text-left ${
                                activeCategory === key 
                                ? 'border-brand-gold shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
                                : 'border-white/10 hover:border-white/30'
                            }`}
                        >
                            <span className={`relative z-10 font-bold uppercase tracking-wider text-sm ${activeCategory === key ? 'text-brand-gold' : 'text-zinc-400 group-hover:text-white'}`}>
                                {categories[key].label}
                            </span>
                        </LiquidButton>
                    ))}
                </div>

                {/* Kinetic List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-zinc-500 text-sm animate-pulse">Loading data...</div>
                    ) : (
                        <AnimatePresence mode='wait'>
                            <motion.div 
                                key={activeCategory}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ staggerChildren: 0.1 }}
                                className="space-y-2"
                            >
                                {categories[activeCategory].items.length > 0 ? (
                                    categories[activeCategory].items.map((item) => (
                                        <motion.div 
                                            key={item.id}
                                            onClick={() => setSelectedProject(item)}
                                            className="group cursor-pointer p-3 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                            whileHover={{ x: 5 }}
                                        >
                                            <div>
                                                <div className="text-zinc-200 font-bold font-cinzel text-lg group-hover:text-brand-gold transition-colors">{item.name}</div>
                                                <div className="text-xs text-zinc-500 uppercase tracking-widest">{item.location}</div>
                                            </div>
                                            <ChevronRight className="text-zinc-600 group-hover:text-brand-gold opacity-0 group-hover:opacity-100 transition-all" size={16} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-zinc-500 text-sm italic">No items found.</div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </motion.aside>
        )}

        {/* 360 Viewer / Placeholder Area */}
        <div className="flex-1 h-full relative overflow-hidden bg-zinc-950 border border-white/10 md:rounded-r-3xl rounded-none">
             
             <AnimatePresence mode="popLayout">
                {selectedProject ? (
                    <motion.div 
                        key="viewer"
                        initial={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // Hyperspace easing
                        className="absolute inset-0 z-30 w-full h-full"
                    >
                        {/* HUD Interface */}
                        <div className="absolute top-6 left-6 z-40 flex items-center gap-4">
                            <button onClick={handleClose} className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-brand-gold transition-colors group">
                                <X size={20} className="group-hover:rotate-90 transition-transform" />
                            </button>
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 border border-white/20 rounded-full">
                                <span className="text-brand-gold font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
                                    Live View
                                </span>
                            </div>
                        </div>

                        <div className="absolute bottom-6 left-6 z-40 font-cinzel text-white">
                             <h3 className="text-4xl font-bold">{selectedProject.name}</h3>
                             <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">{selectedProject.location}</p>
                        </div>
                        
                        <div className="absolute bottom-6 right-6 z-40 flex gap-4">
                             <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur flex items-center justify-center text-zinc-400">
                                <Compass size={20} />
                             </div>
                             <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur flex items-center justify-center text-zinc-400">
                                <Move size={20} />
                             </div>
                        </div>

                        {/* Viewer Ref */}
                        <div ref={viewerRef} className="w-full h-full cursor-move" />

                    </motion.div>
                ) : (
                    <motion.div 
                         key="placeholder"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-center opacity-30">
                            <Box size={64} className="mx-auto mb-4 text-zinc-500" strokeWidth={1} />
                            <p className="text-zinc-500 uppercase tracking-[0.2em] text-sm">Select a project to enter hyperspace</p>
                        </div>
                         {/* Static grid background effect */}
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                    </motion.div>
                )}
             </AnimatePresence>

        </div>

      </div>
    </section>
  );
};

export default VirtualRealitySection;
