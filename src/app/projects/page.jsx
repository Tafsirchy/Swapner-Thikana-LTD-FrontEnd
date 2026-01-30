'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, Loader2, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import ProjectCard from '@/components/shared/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';
import { api } from '@/lib/api';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
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
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, sort]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <section className="mb-12">
        <div className="max-container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Building2 size={16} />
            Architectural Landmarks
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold font-cinzel text-zinc-100 mb-8 tracking-tight">
            Our Iconic <span className="text-brand-gold">Developments</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            From skyline-defining towers to boutique residential havens, explore our portfolio of ongoing and completed architectural masterpieces across Bangladesh.
          </p>
        </div>
      </section>

      <section className="max-container px-4">
        {/* Filters Top Bar */}
        <div className="sticky top-28 z-30 mb-8">
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
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <p className="text-zinc-400 text-sm">
                   Showing <span className="text-zinc-100 font-bold">{projects.length}</span> results
                </p>
                
                <div className="flex items-center gap-2">
                   <ArrowUpDown size={16} className="text-zinc-500" />
                   <select
                     value={sort}
                     onChange={(e) => setSort(e.target.value)}
                     className="bg-transparent text-sm text-zinc-300 outline-none cursor-pointer hover:text-brand-gold"
                   >
                     <option value="newest">Newest Project</option>
                     <option value="price-asc">Price (Low to High)</option>
                     <option value="price-desc">Price (High to Low)</option>
                     <option value="size-desc">Size (Large to Small)</option>
                     <option value="size-asc">Size (Small to Large)</option>
                   </select>
                </div>
             </div>

             {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 size={48} className="text-brand-gold animate-spin" />
                  <p className="mt-4 text-zinc-500 font-medium">Curating architectural masterpieces...</p>
                </div>
              ) : projects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {projects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
    
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4">
                       <button 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                       >
                         <ChevronLeft size={20} />
                       </button>
                       
                       <span className="text-sm font-bold text-zinc-500 tracking-widest">
                          PAGE <span className="text-brand-gold">{currentPage}</span> / {totalPages}
                       </span>
    
                       <button 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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

export default ProjectsPage;
