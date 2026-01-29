'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Briefcase, Star, ShieldCheck, MapPin } from 'lucide-react';
import Image from 'next/image';

const AgentDetailsModal = ({ agent, isOpen, onClose }) => {
  if (!agent) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-30 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side: Portrait */}
              <div className="relative w-full md:w-[40%] h-72 md:h-auto overflow-hidden">
                <Image 
                  src={agent.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop'} 
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-900 via-transparent to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="flex flex-col gap-2">
                    <span className="bg-brand-gold text-royal-deep text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> {agent.rating || '4.9'}
                    </span>
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Info */}
              <div className="flex-1 p-8 md:p-10 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-100 mb-2 italic">{agent.name}</h2>
                  <p className="text-brand-gold font-bold text-sm tracking-wide uppercase italic">
                    {agent.specialty || 'Luxury Property Consultant'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Experience</p>
                      <p className="text-sm font-bold text-zinc-200">{agent.experience || '8+ Years'}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Focus</p>
                      <p className="text-sm font-bold text-zinc-200">{agent.area || 'Dhaka North'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">About Consultant</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed italic">
                    {agent.bio || 'Specializing in high-end residential estates and investment portfolios. Dedicated to providing a concierge-level experience for elite clientele seeking the pinnacle of luxury living in Bangladesh.'}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                  <a 
                    href={`mailto:${agent.email}`}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm"
                  >
                    <Mail size={18} className="text-brand-gold" />
                    EMAIL AGENT
                  </a>
                  <a 
                    href={`tel:${agent.phone}`}
                    className="flex-1 bg-brand-gold hover:bg-brand-gold-light text-royal-deep py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm shadow-xl shadow-brand-gold/10"
                  >
                    <Phone size={18} />
                    CALL NOW
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AgentDetailsModal;
