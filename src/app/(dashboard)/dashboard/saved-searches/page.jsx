'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Trash2, Edit2, Play, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SavedSearchesPage = () => {
  const router = useRouter();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      setLoading(true);
      const response = await api.savedSearches.getAll();
      setSearches(response.data.savedSearches);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      toast.error('Failed to load saved searches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return;

    try {
      await api.savedSearches.delete(id);
      toast.success('Search deleted successfully');
      fetchSavedSearches();
    } catch (error) {
      console.error('Error deleting search:', error);
      toast.error('Failed to delete search');
    }
  };

  const handleApplySearch = (search) => {
    // Build URL with query params from saved filters
    const params = new URLSearchParams();
    Object.entries(search.filters).forEach(([key, value]) => {
      if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, value);
        }
      }
    });
    router.push(`/properties?${params.toString()}`);
  };

  const handleStartEdit = (search) => {
    setEditingId(search._id);
    setEditName(search.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      toast.error('Search name cannot be empty');
      return;
    }

    try {
      await api.savedSearches.update(id, { name: editName });
      toast.success('Search name updated');
      setEditingId(null);
      fetchSavedSearches();
    } catch (error) {
      console.error('Error updating search:', error);
      toast.error('Failed to update search');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const getFilterSummary = (filters) => {
    const parts = [];
    if (filters.search) parts.push(`"${filters.search}"`);
    if (filters.listingType) parts.push(filters.listingType);
    if (filters.propertyType) parts.push(filters.propertyType);
    if (filters.city) parts.push(filters.city);
    if (filters.bedrooms) parts.push(`${filters.bedrooms}+ beds`);
    if (filters.bathrooms) parts.push(`${filters.bathrooms}+ baths`);
    if (filters.minPrice || filters.maxPrice) {
      const priceRange = [];
      if (filters.minPrice) priceRange.push(`৳${Number(filters.minPrice).toLocaleString()}`);
      if (filters.maxPrice) priceRange.push(`৳${Number(filters.maxPrice).toLocaleString()}`);
      parts.push(priceRange.join(' - '));
    }
    if (filters.amenities && filters.amenities.length > 0) {
      parts.push(`${filters.amenities.length} amenities`);
    }
    return parts.join(' • ') || 'No filters applied';
  };

  const getAlertLabel = (frequency) => {
    const labels = {
      never: 'No Alerts',
      instant: 'Instant Alerts',
      daily: 'Daily Digest',
      weekly: 'Weekly Digest'
    };
    return labels[frequency] || frequency;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Saved Searches</h1>
        <p className="text-zinc-400">Manage your saved property searches and alerts</p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass border-white/5 rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-1/3 bg-white/5 rounded mb-3"></div>
              <div className="h-4 w-2/3 bg-white/5 rounded mb-4"></div>
              <div className="h-10 w-full bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      ) : searches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-white/5 rounded-3xl p-12 text-center"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Search size={32} className="text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-2">No Saved Searches Yet</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Save your property searches to quickly access them later and get notifications when new matching properties are listed.
          </p>
          <button
            onClick={() => router.push('/properties')}
            className="px-8 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20"
          >
            Browse Properties
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {searches.map((search, index) => (
            <motion.div
              key={search._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  {editingId === search._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 outline-none focus:border-brand-gold/50"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(search._id)}
                        className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-xl font-bold text-zinc-100 mb-1">{search.name}</h3>
                  )}
                  <p className="text-sm text-zinc-400">{getFilterSummary(search.filters)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {editingId !== search._id && (
                    <>
                      <button
                        onClick={() => handleStartEdit(search)}
                        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-100 transition-all"
                        title="Edit name"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(search._id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-all"
                        title="Delete search"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <Bell size={14} />
                    {getAlertLabel(search.alertFrequency)}
                  </span>
                  <span className="text-zinc-500">
                    Created {new Date(search.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleApplySearch(search)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-xl font-medium hover:bg-brand-gold/20 transition-all"
                >
                  <Play size={16} />
                  Apply Search
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSearchesPage;
