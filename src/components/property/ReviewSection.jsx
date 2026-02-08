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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header & Stats - Mobile First */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl md:rounded-3xl shrink-0">
            <span className="text-3xl md:text-4xl font-bold text-brand-gold">{avgRating}</span>
            <div className="flex gap-0.5 mt-0.5">
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
            <h3 className="text-xl md:text-2xl font-bold text-zinc-100">Client Reviews</h3>
            <p className="text-zinc-500 text-xs md:text-sm">{reviews.length} verified experiences</p>
          </div>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-100 hover:border-brand-gold/50 transition-all font-bold text-sm md:text-base group"
        >
          <MessageSquare size={18} className="text-brand-gold" />
          Write a Review
        </button>
      </div>

      {/* Review Form (Desktop: Inline, Mobile: Bottom Sheet) */}
      <AnimatePresence>
        {showForm && (
          <>
            {/* Mobile Bottom Sheet Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 z-[1000] md:hidden bg-black/55 backdrop-blur-2xl"
            />
            
            {/* Form Container */}
            <motion.div
              initial={isMobile ? { y: '100%' } : { opacity: 0, height: 0 }}
              animate={isMobile ? { y: 0 } : { opacity: 1, height: 'auto' }}
              exit={isMobile ? { y: '100%' } : { opacity: 0, height: 0 }}
              className={`
                ${isMobile 
                  ? 'fixed bottom-0 left-0 right-0 z-[1001] bg-zinc-950 rounded-t-[2.5rem] border-t border-white/10 p-8 pb-32 overflow-y-auto max-h-[90vh] custom-scrollbar' 
                  : 'overflow-hidden md:block'}
              `}
              data-lenis-prevent
            >
              <div className="md:hidden w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
              
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h4 className="text-lg md:text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Star className="text-brand-gold fill-brand-gold" size={20} />
                  Share Your Experience
                </h4>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 bg-white/5 rounded-full text-zinc-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Rating</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-transform active:scale-90"
                      >
                        <Star 
                          size={36} 
                          fill={star <= newReview.rating ? '#D4AF37' : 'none'} 
                          className={star <= newReview.rating ? 'text-brand-gold' : 'text-zinc-700'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Comment</label>
                  <textarea
                    required
                    placeholder="Share the details of your stay or experience..."
                    className="w-full bg-royal-deep border border-white/10 rounded-2xl px-5 py-4 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all min-h-[140px] resize-none text-sm"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full py-4 mb-2 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-50 shadow-lg shadow-brand-gold/20"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Publish Review</>}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4 md:space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-zinc-500">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
            <p className="text-sm">Fetching verified reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] border-dashed space-y-6">
            <p className="text-zinc-500 italic font-medium tracking-wide text-sm md:text-base">
              No reviews available yet.
            </p>
            {/* Write a Review Button - Visible on Mobile in Empty State */}
            <button 
              onClick={() => setShowForm(true)}
              className="md:hidden inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold/10 border border-brand-gold/30 rounded-xl text-brand-gold hover:bg-brand-gold/20 transition-all font-bold text-sm group shadow-lg shadow-brand-gold/10"
            >
              <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
              Write a Review
            </button>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-5 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] space-y-4 relative group/review">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold overflow-hidden shrink-0">
                    {review.userPhoto ? (
                      <Image src={review.userPhoto} alt={review.userName} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="md:size-[24px]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100 text-sm md:text-base">{review.userName}</h4>
                    <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < review.rating ? 'text-brand-gold fill-brand-gold' : 'text-zinc-700'} 
                      />
                    ))}
                  </div>

                  {/* Actions for owner - Always visible on mobile, hover on desktop */}
                  {user && review.userId === user._id && (
                    <div className="flex gap-2 md:opacity-0 md:group-hover/review:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(review)}
                        className="p-2 bg-white/5 md:bg-white/10 text-zinc-400 hover:text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-all"
                        title="Edit Review"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(review._id)}
                        className="p-2 bg-white/5 md:bg-white/10 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Delete Review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {editingId === review._id ? (
                <form onSubmit={handleUpdate} className="mt-4 space-y-4 bg-zinc-900/50 p-5 md:p-6 rounded-2xl border border-brand-gold/20">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, rating: star })}
                      >
                        <Star 
                          size={24} 
                          className={star <= editForm.rating ? 'text-brand-gold fill-brand-gold' : 'text-zinc-700'} 
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    className="w-full bg-royal-deep border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 transition-all min-h-[100px] text-sm resize-none"
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-brand-gold text-royal-deep text-[10px] font-bold rounded-lg hover:bg-brand-gold-light transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
      `}</style>
    </div>
  );
};

export default ReviewSection;
