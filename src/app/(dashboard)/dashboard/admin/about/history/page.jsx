'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ScrollText, Loader2, X, Save, Eye, EyeOff, ShieldCheck, Award, Briefcase, Users, History } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import LuxurySelect from '@/components/shared/LuxurySelect';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';

const AdminHistoryPage = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    icon: 'History',
    status: 'Published',
    order: 0
  });

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await api.history.getAllAdmin();
      if (response.success) {
        setMilestones(response.data.milestones || []);
      }
    } catch (err) {
      console.error('Error fetching milestones:', err);
      toast.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleOpenModal = (ms = null) => {
    if (ms) {
      setEditingMilestone(ms);
      setFormData({
        year: ms.year,
        title: ms.title,
        description: ms.description,
        icon: ms.icon || 'History',
        status: ms.status || 'Published',
        order: ms.order || 0
      });
    } else {
      setEditingMilestone(null);
      setFormData({
        year: '',
        title: '',
        description: '',
        icon: 'History',
        status: 'Published',
        order: milestones.length
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMilestone(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMilestone) {
        await api.history.update(editingMilestone._id, formData);
        toast.success('Milestone updated successfully');
      } else {
        await api.history.create(formData);
        toast.success('Milestone created successfully');
      }
      fetchMilestones();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving milestone:', err);
      toast.error('Failed to save milestone');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await api.history.delete(id);
      toast.success('Milestone deleted');
      fetchMilestones();
    } catch (err) {
      console.error('Error deleting milestone:', err);
      toast.error('Failed to delete milestone');
    }
  };

  const toggleStatus = async (ms) => {
    try {
      const newStatus = ms.status === 'Published' ? 'Draft' : 'Published';
      await api.history.update(ms._id, { ...ms, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchMilestones();
    } catch (err) {
      console.error('Error toggling status:', err);
      toast.error('Failed to update status');
    }
  };

  if (loading && milestones.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <DashboardPageHeader 
        title="History Management"
        subtitle="Chronicle the Shwapner Thikana journey through milestones."
        icon={<ScrollText />}
        actions={
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 text-sm"
          >
            <Plus size={18} /> Add New Milestone
          </button>
        }
      />

      <div className="relative max-w-5xl mx-auto pt-8">
        {/* Timeline Center Line (Desktop) */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-0 w-px bg-white/10 hidden md:block md:-translate-x-1/2"></div>
         {/* Timeline Line (Mobile) */}
        <div className="absolute left-6 top-4 bottom-0 w-px bg-white/10 md:hidden"></div>

        <div className="space-y-12">
          {milestones.length === 0 ? (
             <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl">
                <p className="text-zinc-400">No milestones found. Create your first one!</p>
             </div>
          ) : (
            milestones.map((ms, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={ms._id} className={`relative flex flex-col md:flex-row gap-8 items-start ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Content Card */}
                  <div className="flex-1 w-full pl-16 md:pl-0">
                    <div className={`
                      bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-brand-gold/30 transition-all group relative
                      ${isEven ? 'md:text-left' : 'md:text-right'}
                    `}>
                      {/* Arrow for Desktop */}
                      <div className={`hidden md:block absolute top-8 ${isEven ? '-right-3' : '-left-3'} w-6 h-6 bg-zinc-900 border-l border-b border-white/10 rotate-45 ${isEven ? 'border-l-0 border-b-0 border-r border-t bg-zinc-900' : ''}`}></div>

                      <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                         <span className="text-4xl font-black text-white/10 group-hover:text-brand-gold/20 transition-colors">
                            {ms.year}
                         </span>
                         <button 
                          onClick={() => toggleStatus(ms)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                            ms.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                          }`}
                         >
                          {ms.status === 'Published' ? <Eye size={10} /> : <EyeOff size={10} />}
                          {ms.status}
                        </button>
                      </div>

                      <h3 className="text-xl font-bold text-zinc-100 mb-2 truncate group-hover:text-brand-gold transition-colors">{ms.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6 whitespace-pre-line">{ms.description}</p>
                      
                      {/* Action Buttons */}
                      <div className={`flex items-center gap-2 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                        <button 
                          onClick={() => handleOpenModal(ms)}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-brand-gold hover:text-royal-deep transition-all"
                        >
                           <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(ms._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-red-500 hover:text-white transition-all"
                        >
                           <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Center Point */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-royal-deep border-4 border-brand-gold shadow-[0_0_15px_rgba(197,164,126,0.5)] z-10 mt-8"></div>
                  
                  {/* Empty Flex Child for correct spacing on desktop */}
                  <div className="flex-1 hidden md:block"></div>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={handleCloseModal}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-royal-deep border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <h3 className="text-2xl font-bold text-zinc-100 italic">
                  {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
                </h3>
                <button 
                  onClick={handleCloseModal}
                  className="p-3 hover:bg-white/5 rounded-full text-zinc-400 transition-colors touch-manipulation"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1" data-lenis-prevent>
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2">Year</label>
                      <input 
                        type="text"
                        required
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        placeholder="e.g. 2024"
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-zinc-100 text-base focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2">Icon</label>
                      <LuxurySelect
                        value={formData.icon}
                        onChange={(value) => setFormData({...formData, icon: value})}
                        options={[
                          { label: 'History', value: 'History' },
                          { label: 'Users', value: 'Users' },
                          { label: 'Building', value: 'Building' },
                          { label: 'ShieldCheck', value: 'ShieldCheck' },
                          { label: 'Award', value: 'Award' }
                        ]}
                        className="rounded-xl h-12"
                        placeholder="Select Icon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2">Title</label>
                    <input 
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. The Expansion"
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-zinc-100 text-base focus:border-brand-gold outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2">Description</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Tell the story..."
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-zinc-100 text-base focus:border-brand-gold outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2">Order</label>
                      <input 
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-zinc-100 text-base focus:border-brand-gold outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2">Status</label>
                      <LuxurySelect
                        value={formData.status}
                        onChange={(value) => setFormData({...formData, status: value})}
                        options={[
                          { label: 'Published', value: 'Published' },
                          { label: 'Draft', value: 'Draft' }
                        ]}
                        className="rounded-xl h-12"
                        placeholder="Select Status"
                      />
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <button 
                      type="submit"
                      className="w-full h-14 bg-brand-gold text-royal-deep font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/10 active:scale-[0.98]"
                    >
                      <Save size={20} />
                      {editingMilestone ? 'Update Milestone' : 'Save Milestone'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
            
            <style jsx>{`
            `}</style>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHistoryPage;
