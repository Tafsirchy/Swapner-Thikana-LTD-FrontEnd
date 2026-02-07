'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building, MapPin, Star, Filter } from 'lucide-react';
import SmartImage from '@/components/shared/SmartImage';
import ProjectDetailsModal from '@/components/shared/ProjectDetailsModal';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import LuxurySelect from '@/components/shared/LuxurySelect';

const MasterPlanModal = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'dhaka', name: 'Dhaka' },
    { id: 'mymensingh', name: 'Mymensingh' },
    { id: 'rajshahi', name: 'Rajshahi' },
    { id: 'sylhet', name: 'Sylhet' },
    { id: 'chittagong', name: 'Chittagong' },
    { id: 'rangpur', name: 'Rangpur' },
    { id: 'khulna', name: 'Khulna' },
    { id: 'barisal', name: 'Barisal' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.masterPlan.getAllProjects();
      if (response.success) {
        setProjects(response.data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching master plan projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (projectId) => {
    try {
      setFetchingDetails(true);
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
      setFetchingDetails(false);
    }
  };

  // Filter projects based on selected region and featured toggle
  const filteredProjects = projects.filter(project => {
    const regionMatch = selectedRegion === 'all' || project.regionId === selectedRegion;
    const featuredMatch = !showFeaturedOnly || project.isFeatured;
    return regionMatch && featuredMatch;
  });

  // Group projects by region
  const projectsByRegion = filteredProjects.reduce((acc, project) => {
    const region = project.regionName || 'Unknown';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(project);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div key="master-plan-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full sm:w-[95%] max-w-6xl max-h-[95vh] sm:max-h-[90vh] bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden flex flex-col"
          data-lenis-prevent
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-zinc-900/95 backdrop-blur sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-cinzel font-bold text-white mb-1">
                Master Plan Overview
              </h2>
              <p className="text-sm text-zinc-400">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} across Bangladesh
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-zinc-900/50 sticky top-[72px] sm:top-[88px] z-10">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Region Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-zinc-400 mb-2 block flex items-center gap-2">
                  <Filter size={14} />
                  Filter by Region
                </label>
                <LuxurySelect
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  options={regions.map(r => ({ label: r.name, value: r.id }))}
                  placeholder="Select Region"
                  className="rounded-lg py-2.5"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3">
                <label className="text-xs text-zinc-400" id="featured-toggle-label">Featured Only</label>
                <button
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  aria-pressed={showFeaturedOnly}
                  aria-labelledby="featured-toggle-label"
                  className={`relative w-12 h-6 rounded-full transition-colors focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                    showFeaturedOnly ? 'bg-brand-gold' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    animate={{ x: showFeaturedOnly ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-xl h-72 animate-pulse" />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Building className="w-16 h-16 text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
                <p className="text-zinc-400 max-w-md">
                  {showFeaturedOnly
                    ? 'No featured projects in the selected region.'
                    : 'No projects have been linked to this region yet.'}
                </p>
              </div>
            ) : (
              // Projects grouped by region
              <div className="space-y-8">
                {Object.entries(projectsByRegion).map(([regionName, regionProjects]) => (
                  <div key={regionName}>
                    <h3 className="text-lg font-cinzel font-bold text-brand-gold mb-4 flex items-center gap-2">
                      <MapPin size={18} />
                      {regionName}
                      <span className="text-sm text-zinc-500 font-normal">
                        ({regionProjects.length})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regionProjects.map((project) => (
                        <div
                          key={project._id}
                          onClick={() => handleProjectClick(project._id)}
                          className="group block cursor-pointer"
                        >
                          <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-brand-gold/50 transition-all h-full"
                          >
                            {/* Project Image */}
                            <div className="relative aspect-video sm:h-48 bg-zinc-800">
                              {project.image ? (
                                <SmartImage
                                  src={project.image}
                                  alt={project.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Building className="w-12 h-12 text-zinc-600" />
                                </div>
                              )}
                              {project.isFeatured && (
                                <div className="absolute top-3 right-3 bg-brand-gold text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                  <Star size={12} fill="currentColor" />
                                  Featured
                                </div>
                              )}
                            </div>

                            {/* Project Info */}
                            <div className="p-4">
                              <h4 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">
                                {project.title || 'Untitled Project'}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                                <MapPin size={12} className="text-brand-gold/70" />
                                <span>{project.location || 'Location TBA'}</span>
                              </div>
                              {project.description && (
                                <p className="text-sm text-zinc-400 line-clamp-2">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <ProjectDetailsModal 
        key="project-details-overlay"
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </AnimatePresence>
  );
};

export default MasterPlanModal;
