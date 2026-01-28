'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, PlusCircle, Search, Filter, Eye, Edit2, Trash2, Calendar, User, Eye as ViewIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.blogs.getAll();
      setBlogs(response.data.blogs || []);
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

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && blog.isPublished) ||
                         (statusFilter === 'draft' && !blog.isPublished);
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <FileText size={32} className="text-brand-gold" />
            Blog Management
          </h1>
          <p className="text-zinc-400 mt-1">
            Publish and manage articles and news
          </p>
        </div>
        <Link
          href="/dashboard/admin/blogs/add"
          className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10"
        >
          <PlusCircle size={18} /> New Blog Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50 text-zinc-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
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
              {filteredBlogs.map((blog) => (
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
                        href={`/blogs/${blog.slug}`}
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

      {filteredBlogs.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <FileText size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-300">No Articles Found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mt-1">Ready to share some knowledge? Create your first blog post today.</p>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsPage;
