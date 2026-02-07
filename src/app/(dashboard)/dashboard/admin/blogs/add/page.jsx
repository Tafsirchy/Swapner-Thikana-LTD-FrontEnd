'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Save, X, Tag, Layout, ListFilter } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import ImgBBUpload from '@/components/shared/ImgBBUpload';
import LuxurySelect from '@/components/shared/LuxurySelect';

const AddBlogPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Real Estate',
    thumbnail: '',
    isPublished: true,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

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
      setLoading(true);
      await api.blogs.create(formData);
      toast.success('Blog post created successfully');
      router.push('/dashboard/admin/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-3">
             <FileText className="text-brand-gold w-8 h-8 sm:w-10 sm:h-10" size={32} />
             New Blog Post
          </h1>
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">Share news, tips, or insights with your audience.</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-3 hover:bg-white/5 rounded-full text-zinc-400 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6">
           <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Post Title</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. 5 Tips for First-Time Home Buyers"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-bold text-base sm:text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category</label>
                  <LuxurySelect
                    value={formData.category}
                    onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                    options={[
                      { label: 'Real Estate', value: 'Real Estate' },
                      { label: 'Lifestyle', value: 'Lifestyle' },
                      { label: 'Investment', value: 'Investment' },
                      { label: 'Market Trends', value: 'Market Trends' },
                      { label: 'Construction', value: 'Construction' }
                    ]}
                    icon={<Layout size={18} />}
                    className="rounded-xl !bg-white/5 !border-white/10 text-zinc-100 text-base !py-3"
                  />
                </div>

                <div>
                   <ImgBBUpload 
                     label="Thumbnail Image"
                     defaultImage={formData.thumbnail}
                     onUpload={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
                     required
                   />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Content (HTML or Markdown)</label>
                <textarea
                  required
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  placeholder="Write your article content here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium resize-none text-base"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tags (Press Enter)</label>
                <div className="flex flex-wrap gap-2 mb-1">
                   {formData.tags.map(tag => (
                     <span key={tag} className="flex items-center gap-1 bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-brand-gold/20">
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium text-base"
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Publication Status</label>
                  <LuxurySelect
                    value={formData.isPublished ? 'published' : 'draft'}
                    onChange={(val) => setFormData(prev => ({ ...prev, isPublished: val === 'published' }))}
                    options={[
                      { label: 'Published', value: 'published' },
                      { label: 'Draft', value: 'draft' }
                    ]}
                    icon={<ListFilter size={18} />}
                    className="rounded-xl !bg-white/5 !border-white/10 text-zinc-100 text-base !py-3"
                  />
                  <p className="text-[10px] text-zinc-500 font-medium ml-1">Published posts are visible to the public immediately.</p>
                </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <button
             type="button"
             onClick={() => router.back()}
             className="order-2 sm:order-1 flex-1 px-8 py-4 bg-white/5 text-zinc-300 font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5 text-sm sm:text-base"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={loading}
             className="order-1 sm:order-2 flex-2 px-12 py-4 bg-brand-gold text-royal-deep font-bold rounded-2xl hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
           >
             <Save size={20} />
             {loading ? 'Creating...' : 'Create Post'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogPage;
