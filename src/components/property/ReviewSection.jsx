'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Loader2, User, X } from 'lucide-react';
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

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.reviews.getPropertyReviews(propertyId);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) fetchReviews();
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
      toast.success('Review submitted for moderation');
      setNewReview({ rating: 5, comment: '' });
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
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
          <div className="text-center py-12 bg-white/5 border border-white/5 rounded-[2rem] italic text-zinc-500">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
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
              </div>
              <p className="text-zinc-300 leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
