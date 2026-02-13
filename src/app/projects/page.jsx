'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Building2, Loader2, ChevronLeft, ChevronRight, ArrowUpDown, LayoutGrid, Map } from 'lucide-react';
import ProjectCard from '@/components/shared/ProjectCard';
import ProjectCardSkeleton from '@/components/shared/ProjectCardSkeleton';
import ProjectFilters from '@/components/projects/ProjectFilters';
import LuxurySelect from '@/components/shared/LuxurySelect';
import { api } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import StructuredData from '@/components/seo/StructuredData';
import dynamic from 'next/dynamic';

const ProjectsMapView = dynamic(() => import('@/components/map/ProjectsMapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-gold" size={48} />
    </div>
  )
});

const SORT_OPTIONS = [
  { label: "Newest Project", value: "newest" },
  { label: "Price (Low to High)", value: "price-asc" },
  { label: "Price (High to Low)", value: "price-desc" },
  { label: "Size (Large to Small)", value: "size-desc" },
  { label: "Size (Small to Large)", value: "size-asc" }
];

const ProjectsContent = () => {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [allFilteredProjects, setAllFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    road: '',
    minSize: '',
    maxSize: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    minFloors: '',
    facing: '',
    handoverTime: '',
    amenities: [],
    availableOnly: false,
    parking: false,
  });

  // Update filters when URL params change
  useEffect(() => {
    const status = searchParams.get('status') || '';
    const city = searchParams.get('city') || '';
    const area = searchParams.get('area') || '';
    
    setFilters(prev => ({
      ...prev,
      status,
      city,
      area,
      page: 1
    }));
  }, [searchParams]);
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PROJECTS_PER_PAGE = 6;

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clean filters
      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const params = {
        page: currentPage,
        limit: PROJECTS_PER_PAGE,
        sort,
        ...activeFilters
      };
      
      const res = await api.projects.getAll(params);
      
      // Handle response structure
      if (res.data) {
        setProjects(res.data.projects || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.pages);
        }
      }

      // If in map mode, or to support map mode markers, fetch all matching projects
      if (viewMode === 'map') {
        const allRes = await api.projects.getAll({ ...params, limit: 1000, page: 1 });
        setAllFilteredProjects(allRes.data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, sort]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, viewMode]);

  // Handle filter change - reset to page 1
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      city: '',
      area: '',
      road: '',
      minSize: '',
      maxSize: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
      minFloors: '',
      facing: '',
      handoverTime: '',
      amenities: [],
      availableOnly: false,
      parking: false,
    });
    setCurrentPage(1);
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-royal-deep pt-24 sm:pt-32 pb-16 sm:pb-24">
      <section className="mb-8 sm:mb-12">
        <div className="max-container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Building2 size={16} />
            Architectural Landmarks
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold font-cinzel text-zinc-100 mb-6 sm:mb-8 tracking-tight leading-tight">
            Our Iconic <span className="text-brand-gold">Developments</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
            From skyline-defining towers to boutique residential havens, explore our portfolio of ongoing and completed architectural masterpieces across Bangladesh.
          </p>
        </div>
      </section>

      <StructuredData 
        type="ItemList" 
        data={{
          type: 'projects',
          items: projects.slice(0, 10).map(p => ({
            name: p.title,
            slug: p.slug
          }))
        }} 
      />

      <section className="max-container px-4">
        {/* Filters Top Bar */}
        <div className="sticky top-20 sm:top-28 z-30 mb-8 px-2 sm:px-0">
          <ProjectFilters 
            filters={filters} 
            onChange={handleFilterChange} 
            onClear={clearFilters}
          />
        </div>

        <div className="flex flex-col">
          {/* Results Area */}
          <div className="flex-1">
             {/* Sort & Controls */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-white/5 gap-4">
                <p className="text-zinc-500 text-sm font-medium">
                   Showing <span className="text-zinc-100 font-bold">{projects.length}</span> results
                </p>
                
                <div className="w-full sm:w-64 flex items-center gap-4">
                    <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl shadow-inner shrink-0">
                        <button 
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-gold text-royal-deep shadow-lg' : 'text-zinc-400 hover:text-zinc-200'}`}
                          title="Grid View"
                        >
                          <LayoutGrid size={18} />
                        </button>
                        <button 
                          onClick={() => setViewMode('map')}
                          className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-brand-gold text-royal-deep shadow-lg' : 'text-zinc-400 hover:text-zinc-200'}`}
                          title="Map View"
                        >
                          <Map size={18} />
                        </button>
                    </div>
                    <LuxurySelect
                      value={sort}
                      onChange={setSort}
                      options={SORT_OPTIONS}
                      icon={<ArrowUpDown size={14} />}
                      className="!py-3 !rounded-xl !text-xs font-bold uppercase tracking-widest bg-zinc-950/50 flex-1"
                    />
                 </div>
             </div>

             {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-full">
                      <ProjectCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : viewMode === 'map' ? (
                <div className="mb-20">
                   <div className="mb-4 flex items-center justify-between">
                      <p className="text-zinc-400 text-sm">
                        Showing <span className="text-zinc-100 font-bold">{allFilteredProjects.length}</span> projects on map
                      </p>
                   </div>
                   <ProjectsMapView projects={allFilteredProjects} />
                </div>
              ) : projects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {projects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
    
                  {/* Pagination Controls */}
                  {viewMode === 'grid' && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 sm:gap-6 pt-4">
                       <button 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          aria-label="Previous Page"
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-royal-deep"
                       >
                         <ChevronLeft size={20} />
                       </button>
                       
                       <span className="text-xs sm:text-sm font-bold text-zinc-500 tracking-[0.2em] sm:tracking-widest uppercase">
                          PAGE <span className="text-brand-gold">{currentPage}</span> / {totalPages}
                       </span>
    
                       <button 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          aria-label="Next Page"
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-royal-deep"
                       >
                         <ChevronRight size={20} />
                       </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 glass rounded-[3rem] border-white/5">
                  <h3 className="text-2xl font-bold text-zinc-400 italic">No projects match your criteria</h3>
                  <p className="text-zinc-500 mt-2">Try adjusting your filters to find what you&apos;re looking for.</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-6 text-brand-gold font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
};

const ProjectsPage = () => {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-royal-deep pt-24 sm:pt-32 pb-16 sm:pb-24">
            <div className="max-container px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-full">
                            <ProjectCardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
};

export default ProjectsPage;
