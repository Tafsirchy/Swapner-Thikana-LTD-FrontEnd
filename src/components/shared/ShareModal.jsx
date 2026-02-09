'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Twitter, Facebook, MessageSquare, Linkedin, Mail } from 'lucide-react';
import logger from '@/utils/logger';
import logger from '@/utils/logger';
import SmartImage from './SmartImage';
import { toast } from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-[#25D366]',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(data.title + ' ' + shareUrl)}`, '_blank')
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      name: 'Messenger',
      icon: MessageSquare,
      color: 'bg-[#0084FF]',
      action: () => window.open(`fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      name: 'More',
      icon: Mail,
      color: 'bg-zinc-700',
      action: async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: data.title,
              text: data.text,
              url: shareUrl
            });
          } catch (err) {
            logger.error('Share error:', err);
          }
        } else {
            handleCopy();
        }
      }
    }
  ];

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Backdrop with intense blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-lg bg-zinc-950 border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[3rem] p-8 pb-12 md:pb-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-[1001] outline-none"
          >
            {/* Elegant Handle for SM */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 md:hidden" />

            {/* Header Content */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Share Experience</h3>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-medium">Shwapner Thikana Exclusive</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Context Card - High Contrast Dark */}
            <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/10 flex gap-5 mb-10 group/card transition-all hover:bg-white/[0.05]">
               <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/10">
                  <SmartImage 
                    src={data.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'} 
                    alt={data.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
               </div>
               <div className="flex flex-col justify-center min-w-0 flex-1">
                  <span className="text-brand-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Featured Listing</span>
                  <h4 className="text-zinc-100 font-bold text-lg truncate leading-tight mb-2 uppercase">{data.title}</h4>
                  <div className="bg-zinc-900/50 self-start px-3 py-1 rounded-lg border border-white/5">
                    <p className="text-brand-gold font-bold text-sm">
                      {data.price || data.location}
                    </p>
                  </div>
               </div>
            </div>

            {/* Premium Share Grid */}
            <div className="grid grid-cols-4 gap-6 mb-10 px-2">
              {shareOptions.map((option, i) => (
                <button
                  key={i}
                  onClick={option.action}
                  className="flex flex-col items-center gap-3 group/option"
                >
                  <div className={`w-16 h-16 ${option.color} rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover/option:-translate-y-2 group-active/option:scale-90 group-hover/option:shadow-2xl`}>
                    <option.icon size={28} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover/option:text-zinc-300 transition-colors">{option.name}</span>
                </button>
              ))}
            </div>

            {/* URL Utility - Dark Aesthetic */}
            <div className="relative group/copy">
               <div className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl p-5 pr-20 text-zinc-400 text-xs font-mono truncate transition-all group-hover/copy:border-brand-gold/30">
                  {shareUrl}
               </div>
               <button 
                 onClick={handleCopy}
                 className="absolute right-2 top-2 bottom-2 px-5 bg-brand-gold text-royal-deep hover:bg-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg"
               >
                 <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                        <Check size={18} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                        <Copy size={18} strokeWidth={2.5} />
                      </motion.div>
                    )}
                 </AnimatePresence>
               </button>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5 text-center">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <span className="w-8 h-[1px] bg-white/10" />
                Build Your Legacy
                <span className="w-8 h-[1px] bg-white/10" />
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
