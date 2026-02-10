'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, PlusCircle, Search, Edit2, Trash2, Calendar, Eye, Download } from 'lucide-react';
import { api } from '@/lib/api';
import SmartImage from '@/components/shared/SmartImage';
import { toast } from 'react-hot-toast';
import LuxuryPagination from '@/components/shared/LuxuryPagination';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import ResponsiveTable from '@/components/shared/ResponsiveTable';

const AdminMagazinesPage = () => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMagazines(currentPage);
  }, [currentPage, searchQuery]);

  const fetchMagazines = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.magazines.getAllAdmin({
        search: searchQuery || undefined,
        page,
        limit: 10
      });
      setMagazines(response.data.magazines || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching magazines:', error);
      toast.error('Failed to load magazines');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this magazine?')) return;
    
    try {
      await api.magazines.delete(id);
      setMagazines(magazines.filter(m => m._id !== id));
      toast.success('Magazine deleted successfully');
    } catch (error) {
      toast.error('Failed to delete magazine');
    }
  };

  // Server-side filtering
  const displayMagazines = magazines;

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
        title="Magazine Management"
        subtitle="Publish and manage digital magazines"
        icon={<Book />}
        actions={
          <Link
            href="/dashboard/admin/magazines/add"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10 text-sm sm:text-base"
          >
            <PlusCircle size={18} /> ADD NEW ISSUE
          </Link>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search magazines..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 text-sm"
        />
      </div>

      <ResponsiveTable
        columns={[
          {
            key: 'info',
            label: 'Magazine Info',
            renderCell: (mag) => (
              <div className="flex items-center gap-4">
                <div className="w-12 h-16 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                  {mag.coverImage ? (
                    <SmartImage src={mag.coverImage} alt="" fill className="object-cover" />
                  ) : (
                    <Book size={24} className="text-zinc-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-zinc-100 truncate max-w-[200px] xl:max-w-none">{mag.title}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-tight truncate max-w-[150px]">{mag.publisher}</div>
                </div>
              </div>
            )
          },
          {
            key: 'date',
            label: 'Publication Date',
            renderCell: (mag) => (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Calendar size={14} className="text-brand-gold" />
                {new Date(mag.publicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
              </div>
            )
          },
          {
            key: 'status',
            label: 'Status',
            renderCell: (mag) => (
              <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${mag.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                {mag.isPublished ? 'Published' : 'Draft'}
              </span>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            headerClassName: 'text-right',
            renderCell: (mag) => (
              <div className="flex items-center justify-end gap-2">
                <a
                  href={mag.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                  title="Download/View PDF"
                >
                  <Download size={18} />
                </a>
                <Link
                  href={`/dashboard/admin/magazines/edit/${mag._id}`}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-brand-gold"
                  title="Edit Magazine"
                >
                  <Edit2 size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(mag._id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                  title="Delete Magazine"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )
          }
        ]}
        data={displayMagazines}
        loading={loading}
        icon={Book}
        emptyMessage="No Magazines Found"
        renderCard={(mag) => (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-20 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                {mag.coverImage ? (
                  <SmartImage src={mag.coverImage} alt="" fill className="object-cover" />
                ) : (
                  <Book size={24} className="text-zinc-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-bold text-zinc-100 line-clamp-2">{mag.title}</div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${mag.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                    {mag.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-tight mt-1 truncate">{mag.publisher}</div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-2">
                  <Calendar size={12} className="text-brand-gold" />
                  {new Date(mag.publicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
              <a
                href={mag.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-xs text-zinc-300 font-bold"
              >
                <Eye size={16} /> VIEW PDF
              </a>
              <Link
                href={`/dashboard/admin/magazines/edit/${mag._id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-brand-gold hover:text-royal-deep rounded-xl transition-all text-xs text-brand-gold font-bold"
              >
                <Edit2 size={16} /> EDIT
              </Link>
              <button
                onClick={() => handleDelete(mag._id)}
                className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors text-red-500"
                aria-label="Delete"
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

export default AdminMagazinesPage;
