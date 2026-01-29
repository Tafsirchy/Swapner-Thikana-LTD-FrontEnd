'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, Send, Loader2, User, X, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const ReviewSection = ({ propertyId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: ''
  });

  const isFetching = React.useRef(false);
  const lastFetchedId = React.useRef(null);

  const fetchReviews = useCallback(async (force = false) => {
    if (!propertyId) {
      setLoading(false);
      return;
    }
    
    // Prevent duplicate fetches for the same property
    if (!force && lastFetchedId.current === propertyId) {
      setLoading(false);
      return;
    }

    // Prevent concurrent fetches
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setLoading(true);
      const res = await api.reviews.getPropertyReviews(propertyId);
      setReviews(res.data?.reviews || []);
      lastFetchedId.current = propertyId;
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [propertyId]);

  useEffect(() => {
    fetchReviews();
  }, [propertyId, fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.reviews.create({
        propertyId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      toast.success('Review published successfully');
      setNewReview({ rating: 5, comment: '' });
      setShowForm(false);
      fetchReviews(true); // Re-fetch reviews to show the new one immediately
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.reviews.update(editingId, editForm);
      toast.success('Review updated successfully');
      setEditingId(null);
      fetchReviews(true);
    } catch {
      toast.error('Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api.reviews.delete(id);
      toast.success('Review deleted');
      fetchReviews(true);
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-24 h-24 bg-brand-gold/10 border border-brand-gold/20 rounded-3xl">
            <span className="text-4xl font-bold text-brand-gold">{avgRating}</span>
            <div className="flex gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={10} 
                  fill={i < Math.round(avgRating) ? '#D4AF37' : 'none'} 
                  className={i < Math.round(avgRating) ? 'text-brand-gold' : 'text-zinc-600'} 
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-100">Reviews & Ratings</h3>
            <p className="text-zinc-500 text-sm">Based on {reviews.length} verified experiences</p>
          </div>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-100 hover:border-brand-gold/50 transition-all font-bold"
        >
          {showForm ? <X size={18} /> : <MessageSquare size={18} />}
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-8 bg-zinc-900/50 border border-brand-gold/20 rounded-[2rem] space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Rate your experience</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={32} 
                        fill={star <= newReview.rating ? '#D4AF37' : 'none'} 
                        className={star <= newReview.rating ? 'text-brand-gold' : 'text-zinc-700'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Review details</label>
                <textarea
                  required
                  placeholder="Share your thoughts about this property..."
                  className="w-full bg-royal-deep border border-white/10 rounded-2xl px-5 py-4 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all min-h-[120px] resize-none"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 w-full py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Submit for Moderation</>}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-zinc-500">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
            <p className="text-sm">Fetching verified reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-[2.5rem] border-dashed">
            <p className="text-zinc-500 italic font-medium tracking-wide">
              No reviews available for this property yet.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 relative group/review">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold overflow-hidden">
                    {review.userPhoto ? (
                      <Image src={review.userPhoto} alt={review.userName} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100">{review.userName}</h4>
                    <p className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < review.rating ? '#D4AF37' : 'none'} 
                        className={i < review.rating ? 'text-brand-gold' : 'text-zinc-700'} 
                      />
                    ))}
                  </div>

                  {/* Actions for owner */}
                  {user && review.userId === user._id && (
                    <div className="flex gap-2 opacity-0 group-hover/review:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(review)}
                        className="p-2 bg-white/5 text-zinc-400 hover:text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-all"
                        title="Edit Review"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(review._id)}
                        className="p-2 bg-white/5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Delete Review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {editingId === review._id ? (
                <form onSubmit={handleUpdate} className="mt-4 space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-brand-gold/20">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, rating: star })}
                      >
                        <Star 
                          size={20} 
                          fill={star <= editForm.rating ? '#D4AF37' : 'none'} 
                          className={star <= editForm.rating ? 'text-brand-gold' : 'text-zinc-700'} 
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    className="w-full bg-royal-deep border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all min-h-[80px] text-sm resize-none"
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-brand-gold text-royal-deep text-xs font-bold rounded-lg hover:bg-brand-gold-light transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-zinc-300 leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
