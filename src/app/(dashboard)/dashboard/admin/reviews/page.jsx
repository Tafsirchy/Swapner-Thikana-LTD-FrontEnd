'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, CheckCircle, XCircle, Trash2, User, Building2, UserCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  published: 'bg-emerald-500/10 text-emerald-500',
  rejected: 'bg-red-500/10 text-red-500',
};

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.reviews.getAllAdmin(filter !== 'all' ? { status: filter } : {});
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.reviews.updateStatus(id, status);
      setReviews(reviews.map(r => r._id === id ? { ...r, status } : r));
      toast.success(`Review ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api.reviews.delete(id);
      setReviews(reviews.filter(r => r._id !== id));
      toast.success('Review deleted');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <MessageSquare size={32} className="text-brand-gold" />
            Review Moderation
          </h1>
          <p className="text-zinc-400 mt-1">Manage feedback for properties and agents</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {['all', 'pending', 'published', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === s ? 'bg-brand-gold text-royal-deep' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group">
            <div className="flex flex-col md:flex-row gap-6">
              {/* User Info */}
              <div className="flex items-start gap-4 md:w-64 flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 overflow-hidden">
                  {review.userPhoto ? (
                    <img src={review.userPhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-zinc-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-100 text-sm">{review.userName}</h4>
                  <p className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? 'fill-brand-gold text-brand-gold' : 'text-zinc-700'} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                   {review.propertyId && (
                     <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-tight">
                        <Building2 size={12} /> Property Review
                     </div>
                   )}
                   {review.agentId && (
                     <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-[10px] font-bold uppercase tracking-tight">
                        <UserCheck size={12} /> Agent Review
                     </div>
                   )}
                   <span className={`${statusColors[review.status]} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                     {review.status}
                   </span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed italic">"{review.comment}"</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:self-center">
                {review.status !== 'published' && (
                  <button
                    onClick={() => handleUpdateStatus(review._id, 'published')}
                    className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                    title="Publish"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(review._id, 'rejected')}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    title="Reject"
                  >
                    <XCircle size={20} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review._id)}
                  className="p-3 bg-white/5 text-zinc-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <MessageSquare size={48} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-lg font-bold text-zinc-300">No Reviews Found</h3>
            <p className="text-zinc-500 mt-1">Feedback from users will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
