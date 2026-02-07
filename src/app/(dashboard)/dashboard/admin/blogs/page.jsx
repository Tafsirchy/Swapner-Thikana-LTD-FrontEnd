'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, PlusCircle, Search, Filter, Eye, Edit2, Trash2, Calendar, User, Eye as ViewIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LuxuryPagination from '@/components/shared/LuxuryPagination';

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, statusFilter, searchQuery]);

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.blogs.getAll({
        status: statusFilter,
        search: searchQuery || undefined,
        page,
        limit: 10
      });
      setBlogs(response.data.blogs || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await api.blogs.delete(id);
      setBlogs(blogs.filter(b => b._id !== id));
      toast.success('Blog post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog post');
    }
  };

  // Server-side filtering
  const displayBlogs = blogs;

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
            <FileText size={32} className="text-brand-gold w-8 h-8 sm:w-10 sm:h-10" />
            Blog Management
          </h1>
          <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-lg font-sans">
            Publish and manage articles and news
          </p>
        </div>
        <Link
          href="/dashboard/admin/blogs/add"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10 text-sm sm:text-base"
        >
          <PlusCircle size={18} /> NEW POST
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative text-sm sm:text-base">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100"
          />
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Filter size={18} className="text-zinc-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-zinc-100 outline-none focus:border-brand-gold/50 cursor-pointer text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {displayBlogs.map((blog) => (
          <div key={blog._id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-16 rounded-xl bg-zinc-800 flex-shrink-0 border border-white/5 overflow-hidden">
                {blog.thumbnail ? (
                  <img src={blog.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={24} className="text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-zinc-100 text-sm line-clamp-2">{blog.title}</div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {blog.category || 'General'}
                  </span>
                  <span className={`${blog.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'} px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-y border-white/5 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1.5 uppercase font-bold tracking-tight">
                <User size={12} className="text-brand-gold" />
                {blog.author?.name || 'Admin'}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                   <ViewIcon size={12} /> {blog.views || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Link
                href={`/blog/${blog.slug || blog._id}`}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white"
                title="View"
              >
                <Eye size={18} />
              </Link>
              <Link
                href={`/dashboard/admin/blogs/edit/${blog._id}`}
                className="p-2.5 bg-white/5 hover:bg-brand-gold hover:text-royal-deep rounded-xl transition-all text-brand-gold"
                title="Edit"
              >
                <Edit2 size={18} />
              </Link>
              <button
                onClick={() => handleDelete(blog._id)}
                className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors text-zinc-400 hover:text-red-500"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blogs Table (Desktop) */}
      <div className="hidden lg:block bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Article</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Category</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Views</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayBlogs.map((blog) => (
                <tr key={blog._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-zinc-800 flex-shrink-0 border border-white/5 overflow-hidden">
                        {blog.thumbnail ? (
                          <img src={blog.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText size={20} className="text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-100 truncate max-w-[300px]">{blog.title}</div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                           <User size={12} />
                           <span>{blog.author?.name || 'Admin'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-white/5 px-2 py-1 rounded-md text-xs">{blog.category || 'General'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${blog.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'} px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                       <ViewIcon size={14} />
                       {blog.views || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar size={14} />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Link
                        href={`/blog/${blog.slug || blog._id}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                        title="View Public Post"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/dashboard/admin/blogs/edit/${blog._id}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-brand-gold"
                        title="Edit Post"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                        title="Delete Post"
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

      {displayBlogs.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <FileText size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-300">No Articles Found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mt-1">Ready to share some knowledge? Create your first blog post today.</p>
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

export default AdminBlogsPage;
