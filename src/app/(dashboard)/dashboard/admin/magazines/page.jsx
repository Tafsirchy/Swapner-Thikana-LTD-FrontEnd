'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, PlusCircle, Search, Edit2, Trash2, Calendar, Eye, Download } from 'lucide-react';
import { api } from '@/lib/api';
import SmartImage from '@/components/shared/SmartImage';
import { toast } from 'react-hot-toast';
import LuxuryPagination from '@/components/shared/LuxuryPagination';

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
      const response = await api.magazines.getAll({
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
            <Book className="text-brand-gold w-6 h-6 sm:w-8 sm:h-8" />
            Magazine Management
          </h1>
          <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-lg">
            Publish and manage digital magazines
          </p>
        </div>
        <Link
          href="/dashboard/admin/magazines/add"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10 text-sm sm:text-base"
        >
          <PlusCircle size={18} /> ADD NEW ISSUE
        </Link>
      </div>

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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
              {displayMagazines.map((mag) => (
          <div key={mag._id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
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
                <div className="text-xs text-zinc-500 uppercase tracking-tight mt-1">{mag.publisher}</div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-2">
                  <Calendar size={12} />
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
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-zinc-400">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Magazine Info</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Publication Date</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                    {displayMagazines.map((mag) => (
                <tr key={mag._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                        {mag.coverImage ? (
                          <SmartImage src={mag.coverImage} alt="" fill className="object-cover" />
                        ) : (
                          <Book size={24} className="text-zinc-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-100 truncate">{mag.title}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-tight truncate max-w-[200px]">{mag.publisher}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar size={14} />
                      {new Date(mag.publicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${mag.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                      {mag.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {displayMagazines.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <Book size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-300">No Magazines Found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mt-1">Try adjusting your search to find what you're looking for.</p>
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

export default AdminMagazinesPage;
