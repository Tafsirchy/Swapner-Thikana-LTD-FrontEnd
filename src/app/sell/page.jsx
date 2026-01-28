'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Upload, Home, DollarSign, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SellWithUsPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    address: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Thank you! Our agent will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        address: '',
        message: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs mb-3 block">List Your Property</span>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            Sell with <span className="text-brand-gold italic">Confidence</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Partner with shwapner Thikana Ltd to fetch the best value for your real estate assets. 
            We provide expert valuation, premium marketing, and access to an exclusive network of buyers.
          </p>
        </div>

        {/* Features - Value Prop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:border-brand-gold/30 transition-all text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6 text-brand-gold">
              <DollarSign size={28} />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Best Market Value</h3>
            <p className="text-zinc-400 text-sm">We ensure your property is valued correctly to attract serious buyers.</p>
          </motion.div>
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:border-brand-gold/30 transition-all text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6 text-brand-gold">
              <Home size={28} />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Premium Exposure</h3>
            <p className="text-zinc-400 text-sm">Your property gets showcased to our elite clientele through exclusive channels.</p>
          </motion.div>
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:border-brand-gold/30 transition-all text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6 text-brand-gold">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Fast Turnaround</h3>
            <p className="text-zinc-400 text-sm">Our efficient process ensures your property is sold within the shortest time.</p>
          </motion.div>
        </div>

        {/* Sell Form */}
        <div className="max-w-3xl mx-auto">
          <div className="glass p-8 md:p-12 rounded-[3rem] border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-zinc-100 mb-8 flex items-center gap-3">
              <Upload className="text-brand-gold" />
              Property Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-zinc-100 focus:border-brand-gold/50 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-zinc-100 focus:border-brand-gold/50 outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-zinc-100 focus:border-brand-gold/50 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Property Type</label>
                  <select 
                    required
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-zinc-300 focus:border-brand-gold/50 outline-none transition-all"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="land">Land / Plot</option>
                  </select>
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Property Address / Location</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-zinc-100 focus:border-brand-gold/50 outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

               <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Additional Details</label>
                <textarea 
                  rows="4"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-zinc-100 focus:border-brand-gold/50 outline-none transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold text-royal-deep font-bold py-4 rounded-xl hover:bg-brand-gold-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/20 disabled:opacity-70"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-royal-deep/30 border-t-royal-deep rounded-full animate-spin"></div>
                ) : (
                  <>
                    Submit For Listing
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellWithUsPage;
