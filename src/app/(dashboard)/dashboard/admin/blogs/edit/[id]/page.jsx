'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FileText, Save, X, Image as ImageIcon, Tag, Layout, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const EditBlogPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Real Estate',
    thumbnail: '',
    isPublished: true,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await api.blogs.getById(id);
        const blog = response.data.blog;
        
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          category: blog.category || 'Real Estate',
          thumbnail: blog.thumbnail || '',
          isPublished: blog.isPublished !== false,
          tags: blog.tags || []
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.blogs.update(id, formData);
      toast.success('Blog post updated successfully');
      router.push('/dashboard/admin/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="text-brand-gold animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Loading article details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
             <FileText className="text-brand-gold" size={32} />
             Edit Blog Post
          </h1>
          <p className="text-zinc-400 mt-1">Refine your article for the best engagement.</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 text-xs uppercase tracking-wider">Post Title</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-bold text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 text-xs uppercase tracking-wider">Category</label>
                  <div className="relative">
                    <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium appearance-none"
                    >
                      <option value="Real Estate">Real Estate</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Investment">Investment</option>
                      <option value="Market Trends">Market Trends</option>
                      <option value="Construction">Construction</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-2 text-xs uppercase tracking-wider">Thumbnail URL</label>
                   <div className="relative">
                     <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                     <input
                        required
                        type="url"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                      />
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 text-xs uppercase tracking-wider">Content (HTML or Markdown)</label>
                <textarea
                  required
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium resize-none text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 text-xs uppercase tracking-wider">Tags (Press Enter)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                   {formData.tags.map(tag => (
                     <span key={tag} className="flex items-center gap-1 bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-xs font-bold ring-1 ring-brand-gold/20">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                     </span>
                   ))}
                </div>
                <div className="relative">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                   <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                    />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
                <span className="text-sm font-medium text-zinc-300">Published Status</span>
              </div>
           </div>
        </div>

        <div className="flex gap-4 pt-4">
           <button
             type="button"
             onClick={() => router.back()}
             className="flex-1 px-8 py-4 bg-white/5 text-zinc-300 font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={saving}
             className="flex-2 px-12 py-4 bg-brand-gold text-royal-deep font-bold rounded-2xl hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
           >
             <Save size={20} />
             {saving ? 'Saving...' : 'Save Changes'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;
