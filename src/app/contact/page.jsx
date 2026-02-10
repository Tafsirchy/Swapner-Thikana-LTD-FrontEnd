'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LuxurySelect from '@/components/shared/LuxurySelect';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.leads.create({
        ...formData,
        interestType: 'general'
      });
      toast.success('Your message has been received. Our concierge will contact you shortly.');
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-royal-deep pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="max-container px-4">
        {/* Header Section */}
        <section className="text-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <MessageSquare size={16} />
            Concierge Relations
          </motion.div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold font-cinzel text-zinc-100 mb-6 sm:mb-8 tracking-tight leading-tight">
            Connect with <span className="text-brand-gold">Excellence</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
            Whether you are looking for your next investment or need specialized real estate consultancy, our team is ready to assist you with absolute discretion and expertise.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Contact Details Cards */}
          <div className="space-y-4">
            <div className="p-6 sm:p-8 glass rounded-none border-white/10 hover:border-brand-gold/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Majestic Headquarters</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">Flat #5/A, House #18, Road #02, Sector #15/A, Uttara, Dhaka-1230</p>
              <a href="#" className="text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline">View on Map</a>
            </div>

            <div className="p-6 sm:p-8 glass rounded-none border-white/10 hover:border-brand-gold/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald mb-4 group-hover:scale-110 transition-transform">
                <Phone size={28} />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Direct Concierge</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-1">+880 1722550012</p>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">+880 1822335566</p>
              <a href="tel:+8801722550012" className="text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline">Call Now</a>
            </div>

            <div className="p-6 sm:p-8 glass rounded-none border-white/10 hover:border-brand-gold/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-brand-royal/10 flex items-center justify-center text-brand-royal mb-4 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Digital Inquiry</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">Shwapnerthikana@gmail.com</p>
              <a href="mailto:Shwapnerthikana@gmail.com" className="text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline">Send Email</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-6 sm:p-10 md:p-14 bg-white/5 rounded-none border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-4xl font-bold text-zinc-100 mb-4 tracking-tight">Send a Secure Dossier</h2>
                <p className="text-zinc-400 text-sm sm:text-base mb-8 sm:mb-12">Our consultants will analyze your requirements and reach out privately.</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex. Adnan Sami"
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 outline-none focus:border-brand-gold/30 transition-all text-zinc-100 text-sm sm:text-base"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Ex. s.adnan@finance.com"
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 outline-none focus:border-brand-gold/30 transition-all text-zinc-100 text-sm sm:text-base"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+880 1XXX XXXXXX"
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl sm:rounded-2xl px-5 py-3 sm:px-6 sm:py-4 outline-none focus:border-brand-gold/30 transition-all text-zinc-100 text-sm sm:text-base"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Inquiry Type</label>
                    <LuxurySelect 
                      value={formData.subject}
                      onChange={(val) => setFormData({...formData, subject: val})}
                      options={[
                        { label: 'General Inquiry', value: 'General Inquiry' },
                        { label: 'Property Acquisition', value: 'Property Acquisition' },
                        { label: 'Asset Management', value: 'Asset Management' },
                        { label: 'Sell Your Residence', value: 'Sell Your Residence' },
                        { label: 'Architectural Partnership', value: 'Architectural Partnership' }
                      ]}
                      className="rounded-xl sm:rounded-2xl !bg-zinc-900 !border-white/5 text-sm sm:text-base"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">A Brief Message</label>
                    <textarea 
                      rows="5"
                      placeholder="Describe your vision or requirements..."
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl sm:rounded-[2rem] px-5 py-4 sm:px-6 sm:py-5 outline-none focus:border-brand-gold/30 transition-all text-zinc-100 text-sm sm:text-base resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button 
                      disabled={isSubmitting}
                      className="w-full py-4 sm:py-5 bg-brand-gold text-royal-deep font-extrabold rounded-xl sm:rounded-2xl hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-3 active:scale-95 duration-150 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          Request Concierge Assistance
                          <Send size={20} />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-zinc-600 mt-6 text-center italic">
                      Disclaimer: Your submission is encrypted following our elite privacy protocols. 
                      Response time is prioritized for Platinum members.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
