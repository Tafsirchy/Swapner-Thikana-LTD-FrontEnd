'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Building, Home, TrendingUp } from 'lucide-react';
import SmartImage from '@/components/shared/SmartImage';
import LiquidButton from '@/components/shared/LiquidButton';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import MasterPlanModal from './MasterPlanModal';
import ProjectDetailsModal from '@/components/shared/ProjectDetailsModal';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

// Fixed SVG paths and positions (never fetched from API)
const REGION_PATHS = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    path: 'M380 280 L460 270 L480 340 L420 360 L360 330 Z',
    position: { x: 420, y: 310 }
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh',
    path: 'M380 130 L460 120 L480 190 L420 210 L360 180 Z',
    position: { x: 420, y: 170 }
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    path: 'M130 280 L210 270 L230 340 L170 360 L110 330 Z',
    position: { x: 170, y: 310 }
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    path: 'M630 130 L710 120 L730 190 L670 210 L610 180 Z',
    position: { x: 670, y: 170 }
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    path: 'M630 430 L710 420 L730 490 L670 510 L610 480 Z',
    position: { x: 670, y: 470 }
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    path: 'M130 130 L210 120 L230 190 L170 210 L110 180 Z',
    position: { x: 170, y: 170 }
  },
  {
    id: 'khulna',
    name: 'Khulna',
    path: 'M130 430 L210 420 L230 490 L170 510 L110 480 Z',
    position: { x: 170, y: 470 }
  },
  {
    id: 'barisal',
    name: 'Barisal',
    path: 'M380 430 L460 420 L480 490 L420 510 L360 480 Z',
    position: { x: 420, y: 470 }
  }
];

const InteractiveMasterPlan = () => {
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [regionProjects, setRegionProjects] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [showFullPlan, setShowFullPlan] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch region content on component mount
  useEffect(() => {
    const fetchRegionContent = async () => {
      try {
        const data = await api.regions.getAll();
        
        if (data.success) {
          // Merge hardcoded paths with dynamic content
          const mergedRegions = REGION_PATHS.map(pathData => {
            const apiData = data.data.regions.find(r => r.id === pathData.id);
            return {
              ...pathData,
              image: apiData?.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
              description: apiData?.description || 'Coming soon...',
              projectCount: apiData?.projectCount || 0
            };
          });
          
          setRegions(mergedRegions);
        } else {
          throw new Error('Failed to fetch regions');
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
        // Fallback: use paths with defaults
        setRegions(REGION_PATHS.map(r => ({
          ...r,
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
          description: '',
          projectCount: 0
        })));
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegionContent();
  }, []);

  // Fetch projects for a specific region
  const handleRegionClick = async (region) => {
    setActiveRegion(region);
    setLoadingProjects(true);

    try {
      const data = await api.regions.getById(region.id);
      
      if (data.success) {
        setRegionProjects(prev => ({
          ...prev,
          [region.id]: data.data.projects || []
        }));
      }
    } catch (error) {
      console.error('Error fetching region projects:', error);
      setRegionProjects(prev => ({
        ...prev,
        [region.id]: []
      }));
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleProjectClick = async (projectId) => {
    setActiveRegion(null); // Close sidebar when project is clicked
    try {
      setLoadingProjects(true); // Reuse loading state for modal too or add new one
      const response = await api.projects.getById(projectId);
      if (response.success) {
        setSelectedProject(response.data.project);
      } else {
        toast.error('Failed to load project details');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast.error('Unable to fetch project information');
    } finally {
      setLoadingProjects(false);
    }
  };

  // Body scroll lock effect
  useEffect(() => {
    if (activeRegion) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [activeRegion]);

  return (
    <section className="py-16 md:py-24 bg-royal-deep relative overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
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
            {/* Mobile Interaction Hint */}
            <div className="mt-4 flex items-center gap-2 text-brand-gold/60 text-[10px] uppercase tracking-[0.2em] font-bold md:hidden animate-pulse">
                <div className="w-1 h-1 bg-brand-gold rounded-full" />
                Tap a region to explore
                <div className="w-1 h-1 bg-brand-gold rounded-full" />
            </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[16/9] md:aspect-[2/1] border border-white/10 p-2 sm:p-4 flex items-center justify-center overflow-hidden bg-white/5 backdrop-blur-xl">
            
            {/* SVG Map */}
            <svg 
              viewBox="0 0 800 600" 
              className="w-full h-full max-h-[600px] drop-shadow-2xl"
              role="img"
              aria-label="Interactive Map of Bangladesh Regions"
            >
                {/* Connecting Lines (Abstract Roads) */}
                <motion.path 
                    d="M420 310 L420 170 M420 310 L670 170 M420 310 L670 460 M420 310 L420 460 M420 310 L170 460 M420 310 L170 310 M420 310 L170 170"
                    fill="none" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    aria-hidden="true"
                />

                {regions.map((region) => (
                    <motion.g 
                        key={region.id}
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => handleRegionClick(region)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRegionClick(region);
                          }
                        }}
                        className="cursor-pointer group outline-none focus:ring-2 focus:ring-brand-gold rounded-full"
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        role="button"
                        aria-label={`Select ${region.name} region, currently has ${region.projectCount || 0} projects`}
                        tabIndex={0}
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
                {hoveredRegion && mounted && window.innerWidth > 1024 && (() => {
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
                                <SmartImage 
                                    src={hoveredRegion.image} 
                                    alt={hoveredRegion.name} 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-brand-gold font-cinzel font-bold text-base tracking-wider leading-tight">{hoveredRegion.name}</h4>
                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                                    <Building size={10} className="text-brand-gold/70" />
                                    <span>{hoveredRegion.projectCount || 0} Projects</span>
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1090]"
                />
                
                {/* Drawer */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-screen w-full max-w-md bg-zinc-900 border-l border-white/10 z-[9999] overflow-y-auto custom-scrollbar pointer-events-auto"
                    style={{
                        touchAction: 'pan-y',
                        WebkitOverflowScrolling: 'touch',
                    }}
                    data-lenis-prevent
                >
                    <div className="p-5 sm:p-8 pb-24">
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                        <h3 className="text-2xl sm:text-3xl font-cinzel text-white leading-tight">{activeRegion.name}</h3>
                        <button 
                            onClick={() => setActiveRegion(null)} 
                            className="p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/5 active:scale-95 shadow-lg"
                            aria-label="Close sidebar"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/5">
                        <SmartImage 
                            src={activeRegion.image} 
                            alt={activeRegion.name} 
                            fill 
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                            <span className="bg-brand-gold text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {activeRegion.projectCount > 0 ? 'Active Development' : 'Future Vision'}
                            </span>
                        </div>
                    </div>

                    <p className="text-zinc-400 leading-relaxed mb-8 border-l-2 border-brand-gold/30 pl-4">
                        {activeRegion.description || 'Discover our projects in this region.'}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <Building className="text-brand-gold mb-2" size={24} />
                            <div className="text-2xl font-bold text-white">{activeRegion.projectCount || 0}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">Projects</div>
                         </div>
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <TrendingUp className="text-brand-gold mb-2" size={24} />
                            <div className="text-xl font-bold text-white">
                              {activeRegion.projectCount > 5 ? 'High' : activeRegion.projectCount > 2 ? 'Growing' : 'Emerging'}
                            </div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">Market Value</div>
                         </div>
                    </div>

                    {/* Projects List */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="font-bold text-white uppercase tracking-wider text-sm">Linked Projects</h4>
                          {loadingProjects && (
                            <span className="text-xs text-zinc-500">Loading...</span>
                          )}
                        </div>
                        
                        {loadingProjects ? (
                          // Loading skeleton
                          [...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-2">
                              <div className="w-16 h-16 bg-white/5 rounded-lg animate-pulse"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
                                <div className="h-3 bg-white/5 rounded animate-pulse w-1/2"></div>
                              </div>
                            </div>
                          ))
                        ) : regionProjects[activeRegion.id]?.length > 0 ? (
                          // Display real projects
                          regionProjects[activeRegion.id].map((project) => (
                            <div 
                              key={project._id} 
                              onClick={() => handleProjectClick(project._id)}
                              className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all border border-transparent hover:border-white/5 active:scale-[0.98]"
                            >
                                {project.image ? (
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <SmartImage
                                      src={project.image}
                                      alt={project.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-brand-gold">
                                    <Home size={24} />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-zinc-200 truncate">{project.title}</div>
                                    <div className="text-xs text-zinc-500 truncate">{project.location}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      {project.isFeatured && (
                                        <span className="px-2 py-0.5 text-[10px] bg-brand-gold/20 text-brand-gold rounded uppercase font-bold">
                                          Featured
                                        </span>
                                      )}
                                      {project.status && (
                                        <span className="px-2 py-0.5 text-[10px] bg-blue-500/10 text-blue-500 rounded capitalize">
                                          {project.status}
                                        </span>
                                      )}
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-zinc-600 group-hover:text-white flex-shrink-0" />
                            </div>
                          ))
                        ) : (
                          // Empty state
                          <div className="text-center py-8 text-zinc-500">
                            <Building size={40} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No projects linked yet</p>
                            <p className="text-xs mt-1">Coming soon to {activeRegion.name}</p>
                          </div>
                        )}
                    </div>

                    <LiquidButton className="w-full shadow-lg shadow-brand-gold/10" onClick={() => { setShowFullPlan(true); setActiveRegion(null); }}>
                        View Full Master Plan
                    </LiquidButton>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>

      <MasterPlanModal 
        isOpen={showFullPlan} 
        onClose={() => setShowFullPlan(false)} 
      />

      <ProjectDetailsModal 
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
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

// Wrap with Error Boundary for production safety
const ProtectedInteractiveMasterPlan = () => (
  <ErrorBoundary 
    title="Unable to Load Master Plan"
    message="We're having trouble loading the interactive map. Please try refreshing the page."
  >
    <InteractiveMasterPlan />
  </ErrorBoundary>
);

export default ProtectedInteractiveMasterPlan;

