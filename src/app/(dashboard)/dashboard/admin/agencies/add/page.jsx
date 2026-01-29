'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Save, X, Info, MapPin, Globe, Phone, Mail, Link as LinkIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const AddAgencyPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    logo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.agencies.create(formData);
      toast.success('Agency created successfully');
      router.push('/dashboard/admin/agencies');
    } catch (error) {
      console.error('Error creating agency:', error);
      toast.error(error.response?.data?.message || 'Failed to create agency');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
             <Briefcase className="text-brand-gold" size={32} />
             Add New Agency
          </h1>
          <p className="text-zinc-400 mt-1">Register a new partner real estate agency.</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
           <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-4">
              <Info size={20} className="text-brand-gold" />
              Agency Information
           </h3>
           
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Agency Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Elite Properties Ltd."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about the agency's expertise..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Logo URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="url"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>
              </div>
           </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
           <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-4">
              <Phone size={20} className="text-brand-gold" />
              Contact Details
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.eliteproperties.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Physical Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3 text-zinc-500" size={18} />
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium resize-none"
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
             {loading ? 'Registering...' : 'Register Agency'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default AddAgencyPage;
