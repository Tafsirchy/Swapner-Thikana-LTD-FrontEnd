'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Save, X, Mail, Briefcase, Link as LinkIcon, Image as ImageIcon, Crown } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const AddLeaderPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    image: '',
    linkedin: '',
    order: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.management.create(formData);
      toast.success('Leader added successfully');
      router.push('/dashboard/admin/management');
    } catch (error) {
      console.error('Error adding leader:', error);
      toast.error(error.response?.data?.message || 'Failed to add leader');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3 italic">
             <Crown className="text-brand-gold" size={32} />
             Add Leadership Member
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">Onboard a new member to the Board of Directors or Executive Team.</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Tafsir Chowdhury"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Role / Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Founder & CEO"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="leader@stltd.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">LinkedIn Profile URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Profile Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>
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
             disabled={loading}
             className="flex-2 px-12 py-4 bg-brand-gold text-royal-deep font-bold rounded-2xl hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
           >
             <Save size={20} />
             {loading ? 'Adding...' : 'ADD LEADER'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeaderPage;
