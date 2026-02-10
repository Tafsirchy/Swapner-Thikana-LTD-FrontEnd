'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, PlusCircle, Search, Filter, Eye, Edit2, Trash2, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import SmartImage from '@/components/shared/SmartImage';
import { toast } from 'react-hot-toast';
import LuxurySelect from '@/components/shared/LuxurySelect';
import LuxuryPagination from '@/components/shared/LuxuryPagination';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import ResponsiveTable from '@/components/shared/ResponsiveTable';
import { useAuth } from '@/hooks/useAuth';

const statusColors = {
  ongoing: 'bg-blue-500/10 text-blue-500',
  completed: 'bg-emerald-500/10 text-emerald-500',
  upcoming: 'bg-yellow-500/10 text-yellow-500',
};

const MyProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?._id) {
       fetchProjects(currentPage);
    }
  }, [currentPage, statusFilter, searchQuery, user]);

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.projects.getAll({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        page,
        limit: 10,
        agentId: user._id // Fetch only projects created by this agent
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

  if (loading && !projects.length) {
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
      <DashboardPageHeader 
        title="My Projects"
        subtitle="Manage your listed projects"
        icon={<Building2 />}
        actions={
          <Link
            href="/dashboard/projects/add"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10 text-sm sm:text-base"
          >
            <PlusCircle size={18} /> ADD NEW PROJECT
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your projects..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50 text-zinc-100 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-zinc-500 border-r border-white/10 pr-3">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
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

      <ResponsiveTable
        columns={[
          {
            key: 'title',
            label: 'Project Info',
            renderCell: (project) => (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                  {project.images?.[0] ? (
                    <SmartImage src={project.images[0]} alt="" fill className="object-cover rounded-xl" />
                  ) : (
                    <Building2 size={24} className="text-zinc-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-zinc-100 truncate max-w-[200px] xl:max-w-none">{project.title}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-tight">{project.slug}</div>
                </div>
              </div>
            )
          },
          {
            key: 'location',
            label: 'Location',
            renderCell: (project) => (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-gold" />
                <span className="truncate max-w-[300px]">{project.location?.city}, {project.location?.address}</span>
              </div>
            )
          },
          {
            key: 'type',
            label: 'Type',
            renderCell: (project) => <span className="capitalize">{project.type}</span>
          },
          {
            key: 'status',
            label: 'Status',
            renderCell: (project) => (
              <span className={`${statusColors[project.status] || 'bg-zinc-500/10 text-zinc-500'} px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider`}>
                {project.status}
              </span>
            )
          },
          {
            key: 'completionDate',
            label: 'Date',
            renderCell: (project) => (
              <div className="flex items-center gap-2 text-xs">
                <Calendar size={14} />
                {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'N/A'}
              </div>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            headerClassName: 'text-right',
            renderCell: (project) => (
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/projects/${project._id}`}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                  title="View Public Page"
                >
                  <Eye size={18} />
                </Link>
                <Link
                  href={`/dashboard/projects/edit/${project._id}`}
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
            )
          }
        ]}
        data={displayProjects}
        loading={loading}
        icon={Building2}
        emptyMessage="No Projects Found"
        renderCard={(project) => (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                {project.images?.[0] ? (
                  <SmartImage src={project.images[0]} alt="" fill className="object-cover" />
                ) : (
                  <Building2 size={24} className="text-zinc-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-zinc-100 truncate">{project.title}</div>
                  <span className={`${statusColors[project.status] || 'bg-zinc-500/10 text-zinc-500'} px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap`}>
                    {project.status}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-tight mt-1 flex items-center gap-1">
                  <MapPin size={10} className="text-brand-gold" />
                  {project.location?.city}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-2">
                  <Calendar size={10} />
                  {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <Link
                href={`/projects/${project._id}`}
                className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all shadow-inner"
                title="View"
              >
                <Eye size={18} />
              </Link>
              <Link
                href={`/dashboard/projects/edit/${project._id}`}
                className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-brand-gold transition-all shadow-inner"
                title="Edit"
              >
                <Edit2 size={18} />
              </Link>
              <button
                onClick={() => handleDelete(project._id)}
                className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-red-500 transition-all shadow-inner"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      />

      <LuxuryPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default MyProjectsPage;
