'use client';

import React, { useState } from 'react';
import { X, Save, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const SaveSearchModal = ({ isOpen, onClose, filters }) => {
  const [searchName, setSearchName] = useState('');
  const [alertFrequency, setAlertFrequency] = useState('never');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!searchName.trim()) {
      toast.error('Please enter a name for your search');
      return;
    }

    try {
      setSaving(true);
      await api.savedSearches.create({
        name: searchName,
        filters,
        alertFrequency
      });
      toast.success('Search saved successfully!');
      setSearchName('');
      setAlertFrequency('never');
      onClose();
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('Failed to save search. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                <Save className="text-brand-gold" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">Save This Search</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">
                Search Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., 3BR Apartments in Gulshan"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-colors placeholder:text-zinc-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">
                <Bell size={14} className="inline mr-1" />
                Email Alerts
              </label>
              <select
                value={alertFrequency}
                onChange={(e) => setAlertFrequency(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-colors cursor-pointer"
              >
                <option value="never">Never</option>
                <option value="instant">Instantly (when new matches found)</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
              <p className="text-xs text-zinc-500 mt-2">
                Get notified when new properties match your saved search criteria
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-zinc-300 font-medium hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !searchName.trim()}
              className="flex-1 px-6 py-3 rounded-xl bg-brand-gold text-royal-deep font-bold hover:bg-brand-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-gold/20"
            >
              {saving ? 'Saving...' : 'Save Search'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SaveSearchModal;
