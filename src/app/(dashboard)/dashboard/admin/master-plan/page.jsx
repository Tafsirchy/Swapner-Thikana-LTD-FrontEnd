'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Upload, Save, GripVertical, Star, Trash2, Plus, Search, Building2, X } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import SmartImage from '@/components/shared/SmartImage';
import { toast } from 'react-hot-toast';
import { uploadToImgBB } from '@/lib/imgbb';

const REGIONS = [
  { id: 'dhaka', name: 'Dhaka' },
  { id: 'mymensingh', name: 'Mymensingh' },
  { id: 'rajshahi', name: 'Rajshahi' },
  { id: 'sylhet', name: 'Sylhet' },
  { id: 'chittagong', name: 'Chittagong' },
  { id: 'rangpur', name: 'Rangpur' },
  { id: 'khulna', name: 'Khulna' },
  { id: 'barisal', name: 'Barisal' }
];

const MasterPlanAdminPage = () => {
  const [activeTab, setActiveTab] = useState('dhaka');
  const [regions, setRegions] = useState({});
  const [allProjects, setAllProjects] = useState([]);
  const [linkedProjects, setLinkedProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingDescription, setSavingDescription] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const abortControllerRef = useRef(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch all regions
      const regionsData = await api.regions.getAll();
      
      if (regionsData.success) {
        const regionsMap = {};
        regionsData.data.regions.forEach(r => {
          regionsMap[r.id] = r;
        });
        setRegions(regionsMap);
      }

      // Fetch all projects
      const projectsResponse = await api.projects.getAll({ limit: 1000 });
      setAllProjects(projectsResponse.data.projects || []);

      // Fetch all region-project links
      const linksData = await api.masterPlan.getLinks();
      
      if (linksData.success) {
        const linksMap = {};
        linksData.data.links.forEach(link => {
          if (!linksMap[link.regionId]) {
            linksMap[link.regionId] = [];
          }
          linksMap[link.regionId].push(link);
        });
        setLinkedProjects(linksMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (regionId, file) => {
    try {
      // Cancel previous upload if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setUploadingImage(true);
      const imageUrl = await uploadToImgBB(file, controller.signal);
      
      // Update region via API
      const data = await api.regions.update(regionId, { image: imageUrl });
      
      if (data.success) {
        setRegions(prev => ({
          ...prev,
          [regionId]: { ...prev[regionId], image: imageUrl }
        }));
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelled');
        return;
      }
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploadingImage(false);
      toast.error('Upload cancelled');
    }
  };

  const handleRemoveImage = async (regionId) => {
    if (!window.confirm('Remove this region image?')) return;

    try {
      const data = await api.regions.update(regionId, { image: '' });
      if (data.success) {
        setRegions(prev => ({
          ...prev,
          [regionId]: { ...prev[regionId], image: '' }
        }));
        toast.success('Image removed successfully');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleDescriptionSave = async (regionId, description) => {
    try {
      setSavingDescription(true);
      
      const data = await api.regions.update(regionId, { description });
      
      if (data.success) {
        setRegions(prev => ({
          ...prev,
          [regionId]: { ...prev[regionId], description }
        }));
        toast.success('Description saved successfully');
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving description:', error);
      toast.error('Failed to save description');
    } finally {
      setSavingDescription(false);
    }
  };

  const handleLinkProject = async (projectId, regionId) => {
    try {
      const data = await api.masterPlan.linkProject({ projectId, regionId, isFeatured: false });
      
      if (data.success) {
        // Refresh linked projects
        await fetchInitialData();
        toast.success('Project pinned successfully');
      } else {
        throw new Error(data.error || 'Pin failed');
      }
    } catch (error) {
      console.error('Error pinning project:', error);
      toast.error(error.message || 'Failed to pin project');
    }
  };

  const handleUnlinkProject = async (linkId, regionId) => {
    if (!window.confirm('Unpin this project from the region?')) return;

    try {
      const data = await api.masterPlan.deleteLink(linkId);
      
      if (data.success) {
        setLinkedProjects(prev => ({
          ...prev,
          [regionId]: prev[regionId].filter(p => p._id !== linkId)
        }));
        await fetchInitialData();
        toast.success('Project unpinned successfully');
      } else {
        throw new Error(data.error || 'Unpin failed');
      }
    } catch (error) {
      console.error('Error unpinning project:', error);
      toast.error('Failed to unpin project');
    }
  };

  const handleToggleFeatured = async (linkId, currentStatus) => {
    try {
      const data = await api.masterPlan.updateLink(linkId, { isFeatured: !currentStatus });
      
      if (data.success) {
        await fetchInitialData();
        toast.success(currentStatus ? 'Removed from featured' : 'Marked as featured');
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update featured status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
        ))}
      </div>
    );
  }

  const currentRegion = regions[activeTab] || {};
  const currentLinkedProjects = linkedProjects[activeTab] || [];
  
  // Robust ID comparison: Ensure we use strings for everything
  const linkedProjectIds = currentLinkedProjects.map(lp => String(lp.projectId));
  const availableProjects = allProjects.filter(p => !linkedProjectIds.includes(String(p._id)));
  
  // Diagnostic trace for developers
  if (allProjects.length > 0 && availableProjects.length === 0 && linkedProjectIds.length < allProjects.length) {
    console.warn('[Admin] Master Plan Filtering Mismatch:', {
      total: allProjects.length,
      linked: linkedProjectIds.length,
      available: availableProjects.length,
      firstProjectId: allProjects[0]?._id,
      firstLinkedId: linkedProjectIds[0]
    });
  }
  
  const filteredAvailableProjects = availableProjects.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(query) ||
      p.location?.address?.toLowerCase().includes(query) ||
      p.location?.city?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
          <MapPin className="text-brand-gold w-6 h-6 sm:w-8 sm:h-8" />
          Interactive Master Plan
        </h1>
        <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-lg">
          Manage regions, images, descriptions, and project links
        </p>
      </div>

      {/* Region Tabs */}
      <div className="relative border-b border-white/10 group/tabs">
        <div className="overflow-x-auto pb-px custom-scrollbar-hide scroll-smooth">
          <div className="flex gap-2 min-w-max pr-12">
            {REGIONS.map(region => (
              <button
                key={region.id}
                onClick={() => setActiveTab(region.id)}
                className={`px-6 py-4 sm:py-3 font-semibold transition-all whitespace-nowrap border-b-2 ${
                  activeTab === region.id
                    ? 'text-brand-gold border-brand-gold bg-brand-gold/5'
                    : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {region.name}
                {linkedProjects[region.id]?.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] bg-brand-gold/20 text-brand-gold rounded-full font-bold">
                    {linkedProjects[region.id].length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Horizontal Scroll Gradient Indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-royal-deep via-royal-deep/40 to-transparent pointer-events-none group-hover/tabs:opacity-0 transition-opacity" />
      </div>

      {/* Region Content Editor */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-zinc-100">Region Content</h2>
          <span className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-lg">
            {REGIONS.find(r => r.id === activeTab)?.name}
          </span>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-4 font-cinzel tracking-wider uppercase text-[10px]">Region Marker Image</label>
          <div className="flex flex-col sm:flex-row gap-6">
            {currentRegion.image && (
              <div className="relative group/img w-full sm:w-80 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <SmartImage
                  src={currentRegion.image}
                  alt={currentRegion.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/img:scale-110"
                />
                <button 
                  onClick={() => handleRemoveImage(activeTab)}
                  className="absolute top-3 right-3 p-2.5 bg-red-500/90 backdrop-blur-md text-white rounded-xl lg:opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-600 shadow-2xl"
                  title="Remove Image"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
            <div className={`flex-1 flex flex-col justify-center gap-3 ${!currentRegion.image ? 'items-center sm:items-start' : ''}`}>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded-xl hover:bg-brand-gold/20 transition-all font-bold">
                  {uploadingImage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      {currentRegion.image ? 'Change Image' : 'Upload Image'}
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(activeTab, file);
                    }}
                  />
                </label>

                {uploadingImage && (
                  <button 
                    onClick={handleCancelUpload}
                    className="flex items-center gap-2 px-4 py-3 bg-zinc-800 text-zinc-400 border border-white/10 rounded-xl hover:bg-zinc-700 hover:text-white transition-all text-sm font-bold"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-500 italic max-w-xs">
                Recommend 1920x1080px or higher. Compressed at 2.5K boundary.
              </p>
            </div>
          </div>
        </div>

        {/* Description Editor */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Region Description
            <span className="ml-2 text-xs text-zinc-500">
              ({currentRegion.description?.length || 0}/300 recommended)
            </span>
          </label>
          <textarea
            value={currentRegion.description || ''}
            onChange={(e) => {
              setRegions(prev => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], description: e.target.value }
              }));
            }}
            onBlur={(e) => handleDescriptionSave(activeTab, e.target.value)}
            rows={6}
            className="w-full bg-zinc-900 text-zinc-100 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-base"
            placeholder="Enter region description..."
          />
          <button
            onClick={() => handleDescriptionSave(activeTab, currentRegion.description)}
            disabled={savingDescription}
            className="mt-3 flex items-center gap-2 px-6 py-2 bg-brand-gold text-royal-deep font-semibold rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {savingDescription ? 'Saving...' : 'Save Description'}
          </button>
        </div>
      </div>

      {/* Project Linking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Projects */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-100">Available Projects</h3>
              <Link
                href="/dashboard/admin/projects/add"
                className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-gold-light flex items-center gap-1.5 transition-colors"
              >
                <Plus size={12} />
                Create New Project
              </Link>
            </div>
            <p className="text-xs text-zinc-500 italic mt-0.5">Select projects to add them as pins for the current region.</p>
            
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-zinc-900 text-zinc-100 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-base"
              />
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar" data-lenis-prevent>
              {filteredAvailableProjects.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Building2 size={48} className="mx-auto mb-2 opacity-20" />
                  <p>All projects linked to this region</p>
                </div>
              ) : (
                filteredAvailableProjects.map(project => (
                  <div
                    key={project._id}
                    className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl hover:border-brand-gold/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {project.images?.[0] && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden relative">
                          <SmartImage
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-zinc-100 truncate">{project.title}</h4>
                        <p className="text-sm text-zinc-400 truncate">
                          {project.location?.address || project.location?.city}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {project.type && (
                            <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-500 rounded">
                              {project.type}
                            </span>
                          )}
                          {project.status && (
                            <span className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-500 rounded">
                              {project.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleLinkProject(project._id, activeTab)}
                        className="flex items-center gap-1.5 px-4 py-3 sm:px-3 sm:py-2 bg-brand-gold/10 text-brand-gold text-sm font-bold rounded-xl hover:bg-brand-gold/20 transition-all whitespace-nowrap group focus:ring-2 focus:ring-brand-gold/50"
                      >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        Pin
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Linked Projects */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-100">
              Linked Projects
              <span className="ml-2 text-sm text-zinc-400">({currentLinkedProjects.length})</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar" data-lenis-prevent>
              {currentLinkedProjects.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Building2 size={48} className="mx-auto mb-2 opacity-20" />
                  <p>No projects pinned yet</p>
                  <p className="text-sm mt-1">Pin projects from the left</p>
                </div>
              ) : (
                currentLinkedProjects.map(link => (
                  <div
                    key={link._id}
                    className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical size={20} className="text-zinc-600 flex-shrink-0 mt-1 cursor-move" />
                      <div className="w-20 h-20 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden relative flex-shrink-0 border border-white/5">
                        {link.project?.image ? (
                          <SmartImage
                            src={link.project.image}
                            alt={link.project?.title || 'Project'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 size={24} className="text-zinc-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-zinc-100 truncate">{link.project?.title || 'Unknown Project'}</h4>
                        <p className="text-sm text-zinc-400 truncate">{link.project?.location || 'No location set'}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleToggleFeatured(link._id, link.isFeatured)}
                            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-all ${
                              link.isFeatured
                                ? 'bg-brand-gold/20 text-brand-gold'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                          >
                            <Star size={12} fill={link.isFeatured ? 'currentColor' : 'none'} />
                            {link.isFeatured ? 'Featured' : 'Feature'}
                          </button>
                          <button
                            onClick={() => handleUnlinkProject(link._id, activeTab)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-bold text-xs"
                          >
                            <Trash2 size={14} />
                            Unpin
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterPlanAdminPage;
