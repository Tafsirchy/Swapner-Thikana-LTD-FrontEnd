'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MessageSquare, 
  Clock,
  Filter,
  Search,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'published', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.reviews.getAllAdmin({ status: filter === 'all' ? '' : filter });
      setReviews(res.data.reviews);
    } catch (err) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.reviews.updateStatus(id, status);
      toast.success(`Review ${status} successfully`);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review permanantly?')) return;
    try {
      await api.reviews.delete(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Review Moderation</h1>
        <p className="text-zinc-500">Manage and moderate property and agent reviews</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', 'pending', 'published', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap ${
                filter === f 
                  ? 'bg-brand-gold text-royal-deep' 
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search by user or comment..."
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-100 focus:border-brand-gold/50 outline-none w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews Table/Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-500">
          <Loader2 className="animate-spin text-brand-gold" size={40} />
          <p>Loading reviews for moderation...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
          <MessageSquare size={48} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-zinc-500">No reviews found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredReviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* User info */}
                  <div className="md:w-48 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                        <Star size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-zinc-100 truncate">{review.userName}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Reviewer</p>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <Clock size={12} />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-400 capitalize">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        review.status === 'published' ? 'bg-emerald-500' :
                        review.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      {review.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < review.rating ? '#D4AF37' : 'none'} 
                          className={i < review.rating ? 'text-brand-gold' : 'text-zinc-700'} 
                        />
                      ))}
                      <span className="ml-2 text-xs font-bold text-zinc-400">({review.rating}/5)</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed italic border-l-2 border-brand-gold/20 pl-4 py-1">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    
                    {review.propertyId && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500 pt-2">
                        <span className="font-bold text-zinc-400">Property:</span>
                        <span className="truncate">{review.propertyId}</span>
                        {/* Ideally we'd have the property title here, but we'll use ID for now or fetch it if needed */}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 justify-end">
                    {review.status !== 'published' && (
                      <button
                        onClick={() => handleUpdateStatus(review._id, 'published')}
                        className="p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                        title="Approve & Publish"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(review._id, 'rejected')}
                        className="p-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-500 hover:text-white transition-all"
                        title="Reject Review"
                      >
                        <XCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      title="Delete Permanently"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
