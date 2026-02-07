'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, PlusCircle, Search, Filter, Eye, Edit2, Trash2, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LuxurySelect from '@/components/shared/LuxurySelect';
import LuxuryPagination from '@/components/shared/LuxuryPagination';

const statusColors = {
  ongoing: 'bg-blue-500/10 text-blue-500',
  completed: 'bg-emerald-500/10 text-emerald-500',
  upcoming: 'bg-yellow-500/10 text-yellow-500',
};

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage, statusFilter, searchQuery]);

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.projects.getAll({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        page,
        limit: 10
      });
      setProjects(response.data.projects || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      await api.projects.delete(id);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted successfully');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  // Server-side filtering
  const displayProjects = projects;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
            <Building2 className="text-brand-gold w-6 h-6 sm:w-8 sm:h-8" />
            Project Management
          </h1>
          <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-lg">
            Create and manage real estate projects
          </p>
        </div>
        <Link
          href="/dashboard/admin/projects/add"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10 text-sm sm:text-base"
        >
          <PlusCircle size={18} /> ADD NEW PROJECT
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-zinc-500 border-r border-white/10 pr-3">
            <Filter size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Filters</span>
          </div>
          
          <div className="flex-1 sm:flex-none sm:min-w-[200px]">
            <LuxurySelect
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Ongoing', value: 'ongoing' },
                { label: 'Completed', value: 'completed' }
              ]}
              className="!py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {displayProjects.map((project) => (
          <div key={project._id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                {project.images?.[0] ? (
                  <SmartImage src={project.images[0]} alt="" fill className="object-cover" />
                ) : (
                  <Building2 size={24} className="text-zinc-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-zinc-100 truncate">{project.title}</div>
                  <span className={`${statusColors[project.status] || 'bg-zinc-500/10 text-zinc-500'} px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider whitespace-nowrap`}>
                    {project.status}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-tight mt-1 flex items-center gap-1">
                  <MapPin size={10} className="text-brand-gold" />
                  {project.location?.city}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-2">
                  <Calendar size={10} />
                  {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <Link
                href={`/projects/${project._id}`}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white"
                title="View"
              >
                <Eye size={18} />
              </Link>
              <Link
                href={`/dashboard/admin/projects/edit/${project._id}`}
                className="p-2.5 bg-white/5 hover:bg-brand-gold hover:text-royal-deep rounded-xl transition-all text-brand-gold"
                title="Edit"
              >
                <Edit2 size={18} />
              </Link>
              <button
                onClick={() => handleDelete(project._id)}
                className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors text-zinc-400 hover:text-red-500"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white/5 border border-white/5 rounded-3xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Project Info</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Location</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Type</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {displayProjects.map((project) => (
                <tr key={project._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                        {project.images?.[0] ? (
                          <SmartImage src={project.images[0]} alt="" fill className="object-cover rounded-xl" />
                        ) : (
                          <Building2 size={24} className="text-zinc-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-100 truncate">{project.title}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-tight">{project.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-brand-gold" />
                       <span className="truncate max-w-[200px]">{project.location?.city}, {project.location?.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize">{project.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${statusColors[project.status] || 'bg-zinc-500/10 text-zinc-500'} px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar size={14} />
                      {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${project._id}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                        title="View Public Page"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/dashboard/admin/projects/edit/${project._id}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-brand-gold"
                        title="Edit Project"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                        title="Delete Project"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {displayProjects.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <Building2 size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-300">No Projects Found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mt-1">Try adjusting your search or filters to find what you&apos;re looking for.</p>
        </div>
      )}

      <LuxuryPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminProjectsPage;
