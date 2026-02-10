'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle, Search, Edit2, Trash2, MapPin, Globe, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import SmartImage from '@/components/shared/SmartImage';
import { toast } from 'react-hot-toast';
import LuxuryPagination from '@/components/shared/LuxuryPagination';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import ResponsiveTable from '@/components/shared/ResponsiveTable';

const AdminAgenciesPage = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAgencies(currentPage);
  }, [currentPage, searchQuery]);

  const fetchAgencies = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.agencies.getAll({
        search: searchQuery || undefined,
        page,
        limit: 10
      });
      setAgencies(response.data.agencies || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast.error('Failed to load agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agency?')) return;
    
    try {
      await api.agencies.delete(id);
      setAgencies(agencies.filter(a => a._id !== id));
      toast.success('Agency deleted successfully');
    } catch (error) {
      toast.error('Failed to delete agency');
    }
  };

  // Server-side filtering
  const displayAgencies = agencies;

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
      <DashboardPageHeader 
        title="Agency Management"
        subtitle="Manage partner real estate agencies"
        icon={<Briefcase />}
        actions={
          <Link
            href="/dashboard/admin/agencies/add"
            className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10"
          >
            <PlusCircle size={18} /> ADD NEW AGENCIES
          </Link>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search agencies..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50 text-zinc-100"
        />
      </div>

      <ResponsiveTable
        columns={[
          {
            key: 'agency',
            label: 'Agency Info',
            renderCell: (agency) => (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                  {agency.logo ? (
                    <SmartImage src={agency.logo} alt="" fill className="object-cover" />
                  ) : (
                    <Briefcase size={22} className="text-zinc-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-zinc-100 truncate max-w-[200px] xl:max-w-none">{agency.name}</div>
                  <div className="text-xs text-zinc-500 truncate">{agency.email}</div>
                </div>
              </div>
            )
          },
          {
            key: 'contact',
            label: 'Contact',
            renderCell: (agency) => (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Phone size={12} className="text-brand-gold" />
                  {agency.phone}
                </div>
                {agency.website && (
                  <div className="flex items-center gap-2 text-xs">
                    <Globe size={12} className="text-brand-gold" />
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-brand-gold transition-colors truncate max-w-[150px]">
                      {agency.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'location',
            label: 'Location',
            renderCell: (agency) => (
              <div className="flex items-start gap-2 text-xs text-zinc-400 max-w-[200px]">
                <MapPin size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="truncate">{agency.address}</span>
              </div>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            headerClassName: 'text-right',
            renderCell: (agency) => (
              <div className="flex items-center justify-end gap-2">
                 <Link
                  href={`/dashboard/admin/agencies/edit/${agency._id}`}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-brand-gold"
                  title="Edit Agency"
                >
                  <Edit2 size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(agency._id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                  title="Delete Agency"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )
          }
        ]}
        data={displayAgencies}
        loading={loading}
        icon={Briefcase}
        emptyMessage="No Agencies Found"
        breakpoint="md"
        renderCard={(agency) => (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                {agency.logo ? (
                  <SmartImage src={agency.logo} alt="" fill className="object-cover" />
                ) : (
                  <Briefcase size={24} className="text-zinc-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-zinc-100 truncate">{agency.name}</div>
                <div className="text-sm text-zinc-500 truncate">{agency.email}</div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <Phone size={12} className="text-brand-gold" />
                  {agency.phone}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-start gap-2 text-xs text-zinc-400">
                <MapPin size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{agency.address}</span>
              </div>
              {agency.website && (
                <div className="flex items-center gap-2 text-xs">
                  <Globe size={12} className="text-brand-gold" />
                  <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline truncate">
                    {agency.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <Link
                href={`/dashboard/admin/agencies/edit/${agency._id}`}
                className="flex-1 py-2.5 bg-white/5 hover:bg-brand-gold hover:text-royal-deep rounded-xl transition-all text-brand-gold flex items-center justify-center gap-2 font-medium text-sm"
              >
                <Edit2 size={16} /> Edit
              </Link>
              <button
                onClick={() => handleDelete(agency._id)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-zinc-400 flex items-center justify-center gap-2 font-medium text-sm"
                aria-label="Delete"
              >
                <Trash2 size={16} /> Delete
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

export default AdminAgenciesPage;
