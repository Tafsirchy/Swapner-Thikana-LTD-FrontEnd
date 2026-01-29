'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Users, Save, X, Mail, Phone, Briefcase, Award, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import ImgBBUpload from '@/components/shared/ImgBBUpload';

const EditAgentPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const response = await api.agents.getById(id);
        const agent = response.data.agent;
        setFormData({
          name: agent.name || '',
          specialty: agent.specialty || '',
          experience: agent.experience || '',
          email: agent.email || '',
          phone: agent.phone || '',
          bio: agent.bio || '',
          image: agent.image || '',
          status: agent.status || 'Verified',
          rating: agent.rating || 0
        });
      } catch (error) {
        console.error('Error fetching agent:', error);
        toast.error('Failed to load agent details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAgent();
  }, [id]);

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
      setSaving(true);
      await api.agents.update(id, formData);
      toast.success('Agent profile updated successfully');
      router.push('/dashboard/admin/agents');
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error(error.response?.data?.message || 'Failed to update agent');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="text-brand-gold animate-spin mb-4" />
        <p className="text-zinc-500 font-medium font-sans italic">Retrieving agent profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3 italic font-sans italic">
             <Users className="text-brand-gold" size={32} />
             Edit Agent Profile
          </h1>
          <p className="text-zinc-400 mt-1 text-sm font-sans italic">Modify professional credentials and contact information for this agent.</p>
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium font-sans resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <ImgBBUpload 
                  label="Portrait Image"
                  defaultImage={formData.image}
                  onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  required
                />
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
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 font-sans italic">Performance Rating (0-5)</label>
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
             disabled={saving}
             className="flex-2 px-12 py-4 bg-brand-gold text-royal-deep font-bold rounded-2xl hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 font-sans uppercase italic"
           >
             <Save size={20} />
             {saving ? 'Saving...' : 'Save Changes'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default EditAgentPage;
