'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const NewsletterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(true);

  const benefits = [
    "First access to off-market luxury listings",
    "Monthly architectural market analysis",
    "Private invitations to property debuts",
    "Expert tips on sustainable estate management"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAgreed) {
      toast.error('Please agree to the communications terms.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.newsletter.subscribe({
        name: formData.name,
        email: formData.email
      });
      toast.success(response.message || 'Subscription successful! Welcome to the club.');
      setFormData({ name: '', email: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Subscription failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-royal-deep pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="max-container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] my-6"
            >
              <Mail size={16} />
              Executive Club
            </motion.div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-zinc-100 mb-6 sm:mb-8 tracking-tight leading-tight">
              The <span className="text-brand-gold">Newsletter</span>
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
              Join our exclusive distribution list for high-net-worth individuals and architectural enthusiasts.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full bg-white/5 border border-white/10 rounded-none p-6 sm:p-10 lg:p-16 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 italic">Subscribe for Insights</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                   <input 
                    type="text" 
                    required
                    placeholder="e.g. Rahim Ahmed" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-5 text-white placeholder:text-zinc-600 focus:border-brand-gold/40 outline-none transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                   <input 
                    type="email" 
                    required
                    placeholder="rahim@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-5 text-white placeholder:text-zinc-600 focus:border-brand-gold/40 outline-none transition-all"
                   />
                </div>
                <div className="flex items-center gap-3 pt-4">
                   <input 
                    type="checkbox" 
                    id="consent" 
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-5 h-5 rounded-none border-white/10 bg-white/5 text-brand-gold focus:ring-brand-gold/20" 
                   />
                   <label htmlFor="consent" className="text-zinc-500 text-sm">I agree to receive marketing communications and market reports.</label>
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-brand-gold text-royal-deep py-4 sm:py-5 rounded-none font-bold text-base sm:text-lg hover:bg-brand-gold-light transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-gold/10 mt-6 sm:mt-8 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                   {isSubmitting ? (
                     <>Processing... <Loader2 className="animate-spin" size={20} /></>
                   ) : (
                     <>Join the List <Send size={20} /></>
                   )}
                </button>
              </form>
              <div className="mt-8 flex items-center justify-center gap-2 text-zinc-500 text-xs">
                 <Shield size={14} /> <span>Your data is secure and will never be shared.</span>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 space-y-10"
            >
               <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-4 sm:mb-6 leading-tight">Beyond a simple email.</h2>
                  <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
                     Our newsletter is a curated executive briefing designed for those who value time and architectural significance. 
                  </p>
               </div>

               <div className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                       <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0 group-hover:bg-brand-gold group-hover:text-royal-deep transition-all duration-300">
                          <CheckCircle2 size={18} />
                       </div>
                       <span className="text-zinc-300 font-medium">{benefit}</span>
                    </div>
                  ))}
               </div>

               <div className="pt-10 border-t border-white/10">
                  <span className="block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Trusted by</span>
                  <div className="flex flex-wrap gap-8 opacity-40 grayscale">
                      <span className="text-white font-black text-xl italic tracking-tighter">FORBES.</span>
                      <span className="text-white font-black text-xl italic tracking-tighter">ARCH.DAILY</span>
                      <span className="text-white font-black text-xl italic tracking-tighter">LUXE.WORLD</span>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
