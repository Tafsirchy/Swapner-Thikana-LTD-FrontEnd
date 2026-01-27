'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, FolderHeart, Check, Loader2, FolderPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { Heart } from 'lucide-react';

const WishlistModal = ({ propertyId, propertyTitle, onClose, onUpdate }) => {
  const { user, refreshUser } = useAuth(); // Assuming refreshUser exists to update user state
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(user?.savedProperties?.some(id => id === propertyId) || false);
    fetchWishlists();
  }, [user, propertyId]);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const res = await api.wishlists.getAll();
      setWishlists(res.data.wishlists || []);
    } catch {
      console.error('Failed to fetch wishlists');
      toast.error('Could not load your collections');
    } finally {
      setLoading(false);
    }
  };



  const handleToggleFavorite = async () => {
    try {
      setProcessingId('favorite');
      if (isFavorite) {
        await api.user.removeFromWishlist(propertyId);
        setIsFavorite(false);
        toast.success('Removed from Favorites');
      } else {
        await api.user.addToWishlist(propertyId);
        setIsFavorite(true);
        toast.success('Added to Favorites');
      }
      if (refreshUser) refreshUser(); // Or we rely on parent re-render? Parent might need onUpdate
      if (onUpdate) onUpdate();
    } catch {
      toast.error('Failed to update favorites');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      setCreating(true);
      const res = await api.wishlists.create({ name: newCollectionName });
      setWishlists([res.data.wishlist, ...wishlists]);
      setNewCollectionName('');
      toast.success('Collection created');
    } catch {
      toast.error('Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleProperty = async (wishlistId, isCurrentlySaved) => {
    try {
      setProcessingId(wishlistId);
      if (isCurrentlySaved) {
        await api.wishlists.removeProperty(wishlistId, propertyId);
        setWishlists(wishlists.map(w => 
          w._id === wishlistId 
            ? { ...w, properties: w.properties.filter(id => id.toString() !== propertyId.toString()) } 
            : w
        ));
        toast.success('Removed from collection');
      } else {
        await api.wishlists.addProperty(wishlistId, propertyId);
        setWishlists(wishlists.map(w => 
          w._id === wishlistId 
            ? { ...w, properties: [...(w.properties || []), propertyId] } 
            : w
        ));
        toast.success('Added to collection');
      }
      if (onUpdate) onUpdate();
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <FolderHeart className="text-brand-gold" size={24} />
              Save to Collection
            </h2>
            <p className="text-zinc-500 text-xs mt-1 truncate max-w-[200px]">{propertyTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-brand-gold" size={24} />
            </div>
          ) : (

            <div className="space-y-3">
              {/* Default Favorites Collection */}
              <button
                onClick={handleToggleFavorite}
                disabled={processingId === 'favorite'}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isFavorite 
                    ? 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold' 
                    : 'bg-white/5 border-white/5 text-zinc-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isFavorite ? 'bg-brand-gold/20' : 'bg-white/10'}`}>
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Favorites</p>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest">
                      Default List
                    </p>
                  </div>
                </div>
                {processingId === 'favorite' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isFavorite ? (
                  <Check size={18} />
                ) : (
                  <Plus size={18} className="opacity-40" />
                )}
              </button>

              <div className="h-px bg-white/5 my-2"></div>

              {wishlists.map((wishlist) => {
                const isSaved = wishlist.properties?.some(id => id.toString() === propertyId.toString());
                const isProcessing = processingId === wishlist._id;

                return (
                  <button
                    key={wishlist._id}
                    onClick={() => handleToggleProperty(wishlist._id, isSaved)}
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isSaved 
                        ? 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold' 
                        : 'bg-white/5 border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSaved ? 'bg-brand-gold/20' : 'bg-white/10'}`}>
                        <FolderHeart size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">{wishlist.name}</p>
                        <p className="text-[10px] opacity-60 uppercase tracking-widest">
                          {wishlist.properties?.length || 0} Items
                        </p>
                      </div>
                    </div>
                    {isProcessing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isSaved ? (
                      <Check size={18} />
                    ) : (
                      <Plus size={18} className="opacity-40" />
                    )}
                  </button>
                );
              })}

              {wishlists.length === 0 && !loading && (
                <div className="text-center py-8 opacity-40">
                  <p className="text-sm italic">You don&apos;t have any collections yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5">
          <form onSubmit={handleCreateCollection} className="flex gap-2">
            <input 
              type="text"
              placeholder="New collection name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
            />
            <button 
              type="submit"
              disabled={creating || !newCollectionName.trim()}
              className="p-3 bg-brand-gold text-royal-deep rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-50"
            >
              {creating ? <Loader2 size={20} className="animate-spin" /> : <FolderPlus size={20} />}
            </button>
          </form>
        </div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default WishlistModal;
