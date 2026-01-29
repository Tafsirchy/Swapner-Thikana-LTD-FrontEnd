'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Save, X, Plus, Trash2, MapPin, Type, Calendar, Info, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const EditProjectPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'residential',
    status: 'upcoming',
    location: {
      city: 'Dhaka',
      address: ''
    },
    completionDate: '',
    features: ['']
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.projects.getById(id);
        const project = response.data.project;
        
        // Format date for input field
        const date = project.completionDate ? new Date(project.completionDate).toISOString().split('T')[0] : '';
        
        setFormData({
          title: project.title || '',
          description: project.description || '',
          type: project.type || 'residential',
          status: project.status || 'upcoming',
          location: {
            city: project.location?.city || 'Dhaka',
            address: project.location?.address || ''
          },
          completionDate: date,
          features: project.features?.length > 0 ? project.features : ['']
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });
  const removeFeature = (index) => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.projects.update(id, formData);
      toast.success('Project updated successfully');
      router.push('/dashboard/admin/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="text-brand-gold animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
             <Edit2 className="text-brand-gold" size={32} />
             Edit Project
          </h1>
          <p className="text-zinc-400 mt-1">Update the details of your real estate project.</p>
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
              General Information
           </h3>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Project Title</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Project Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Current Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
           </div>
        </div>

        {/* Location & Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-6">
                <MapPin size={20} className="text-brand-gold" />
                Location
              </h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">City</label>
                    <input
                      required
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Address / Area</label>
                    <input
                      required
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                    />
                 </div>
              </div>
           </div>

           <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-6">
                <Calendar size={20} className="text-brand-gold" />
                Timeline
              </h3>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Estimated Completion</label>
                <input
                  type="date"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all font-medium"
                />
              </div>
           </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Type size={20} className="text-brand-gold" />
                Key Features
              </h3>
              <button 
                type="button"
                onClick={addFeature}
                className="text-xs font-bold text-brand-gold hover:text-brand-gold-light transition-colors uppercase tracking-widest"
              >
                + Add Feature
              </button>
           </div>
           <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                   <input
                     type="text"
                     value={feature}
                     onChange={(e) => handleFeatureChange(index, e.target.value)}
                     className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all"
                   />
                   <button 
                     type="button"
                     onClick={() => removeFeature(index)}
                     className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              ))}
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
             {saving ? 'Saving Changes...' : 'Save Project'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
