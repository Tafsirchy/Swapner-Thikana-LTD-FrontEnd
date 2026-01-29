'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Save, X, Mail, Phone, Briefcase, Award, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const OnboardAgentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    email: '',
    phone: '',
    bio: '',
    image: '',
    status: 'Verified',
    rating: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.agents.create(formData);
      toast.success('Agent onboarded successfully');
      router.push('/dashboard/admin/agents');
    } catch (error) {
      console.error('Error onboarding agent:', error);
      toast.error(error.response?.data?.message || 'Failed to onboard agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3 italic font-sans italic">
             <Users className="text-brand-gold" size={32} />
             Onboard New Agent
          </h1>
          <p className="text-zinc-400 mt-1 text-sm font-sans italic">Professional verification and onboarding for new platform agents.</p>
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
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Full Legal Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Zayan Ahmed"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Specialization</label>
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="e.g. Luxury Penthouses"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Experience Level</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 8 Years"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="agent@stltd.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Professional Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about the agent's expertise and background..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Portrait URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    required
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Verification Status</label>
                <div className="relative">
                   <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                   <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans appearance-none"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending Review</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Initial Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans"
                />
              </div>
           </div>
        </div>

        <div className="flex gap-4 pt-4">
           <button
             type="button"
             onClick={() => router.back()}
             className="flex-1 px-8 py-4 bg-white/5 text-zinc-300 font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5 font-sans italic"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={loading}
             className="flex-2 px-12 py-4 bg-brand-gold text-royal-deep font-bold rounded-2xl hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 font-sans uppercase italic"
           >
             <Save size={20} />
             {loading ? 'Onboarding...' : 'ONBOARD NEW AGENT'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardAgentPage;
