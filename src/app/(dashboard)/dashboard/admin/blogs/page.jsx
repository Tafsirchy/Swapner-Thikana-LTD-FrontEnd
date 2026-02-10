'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, PlusCircle, Search, ListFilter, Layout, Eye, Edit2, Trash2, Calendar, User, Eye as ViewIcon } from 'lucide-react';
import { api } from '@/lib/api';
import SmartImage from '@/components/shared/SmartImage';
import { toast } from 'react-hot-toast';
import LuxuryPagination from '@/components/shared/LuxuryPagination';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import ResponsiveTable from '@/components/shared/ResponsiveTable';
import LuxurySelect from '@/components/shared/LuxurySelect';

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
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
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter || undefined,
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
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) return;
    
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
      <DashboardPageHeader 
        title="Blog Management"
        subtitle="Publish and manage articles and news"
        icon={<FileText />}
        actions={
          <Link
            href="/dashboard/admin/blogs/add"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10 text-sm sm:text-base"
          >
            <PlusCircle size={18} /> NEW POST
          </Link>
        }
      />

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
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 sm:mt-0">
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
             <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Status</label>
                <LuxurySelect
                   value={statusFilter}
                   onChange={setStatusFilter}
                   options={[
                     { label: 'All Status', value: 'all' },
                     { label: 'Published', value: 'published' },
                     { label: 'Draft', value: 'draft' }
                   ]}
                   placeholder="All Status"
                   icon={<ListFilter size={18} />}
                   className="rounded-xl !py-2.5 sm:!py-3 sm:w-44 !bg-white/5 !border-white/10"
                 />
          </div>
          
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
             <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Category</label>
             <LuxurySelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { label: 'All Categories', value: '' },
                  { label: 'Real Estate', value: 'Real Estate' },
                  { label: 'Lifestyle', value: 'Lifestyle' },
                  { label: 'Investment', value: 'Investment' },
                  { label: 'Market Trends', value: 'Market Trends' },
                  { label: 'Construction', value: 'Construction' }
                ]}
                placeholder="All Categories"
                icon={<Layout size={18} />}
                className="rounded-xl !py-2.5 sm:!py-3 sm:w-52 !bg-white/5 !border-white/10"
              />
          </div>
        </div>
      </div>

      <ResponsiveTable
        columns={[
          {
            key: 'article',
            label: 'Article',
            renderCell: (blog) => (
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg bg-zinc-800 flex-shrink-0 border border-white/5 overflow-hidden relative">
                  {blog.thumbnail ? (
                    <SmartImage src={blog.thumbnail} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText size={20} className="text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-zinc-100 truncate max-w-[250px] xl:max-w-none">{blog.title}</div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                     <User size={12} className="text-brand-gold" />
                     <span>{blog.author?.name || 'Admin'}</span>
                  </div>
                </div>
              </div>
            )
          },
          {
            key: 'category',
            label: 'Category',
            renderCell: (blog) => (
              <span className="bg-white/5 px-2 py-1 rounded-md text-xs">{blog.category || 'General'}</span>
            )
          },
          {
            key: 'status',
            label: 'Status',
            renderCell: (blog) => (
              <span className={`${blog.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'} px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider`}>
                {blog.isPublished ? 'Published' : 'Draft'}
              </span>
            )
          },
          {
            key: 'views',
            label: 'Views',
            renderCell: (blog) => (
              <div className="flex items-center gap-1 text-zinc-400">
                 <ViewIcon size={14} className="text-zinc-500" />
                 {blog.views || 0}
              </div>
            )
          },
          {
            key: 'date',
            label: 'Date',
            renderCell: (blog) => (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Calendar size={14} className="text-zinc-500" />
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            headerClassName: 'text-right',
            renderCell: (blog) => (
              <div className="flex items-center justify-end gap-2">
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
            )
          }
        ]}
        data={displayBlogs}
        loading={loading}
        icon={FileText}
        emptyMessage="No Articles Found"
        renderCard={(blog) => (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-16 rounded-xl bg-zinc-800 flex-shrink-0 border border-white/5 overflow-hidden relative">
                {blog.thumbnail ? (
                  <SmartImage src={blog.thumbnail} alt="" fill className="object-cover" />
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
                aria-label="View"
              >
                <Eye size={18} />
              </Link>
              <Link
                href={`/dashboard/admin/blogs/edit/${blog._id}`}
                className="p-2.5 bg-white/5 hover:bg-brand-gold hover:text-royal-deep rounded-xl transition-all text-brand-gold"
                aria-label="Edit"
              >
                <Edit2 size={18} />
              </Link>
              <button
                onClick={() => handleDelete(blog._id)}
                className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors text-zinc-400 hover:text-red-500"
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

export default AdminBlogsPage;
