'use client';

import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const SocialShare = ({ url, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      color: 'hover:bg-[#1877F2]',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: 'hover:bg-[#1DA1F2]',
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      color: 'hover:bg-[#25D366]',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')
    },
    {
      name: 'Copy Link',
      icon: <LinkIcon size={20} />,
      color: 'hover:bg-zinc-700',
      action: () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-medium hover:bg-white/10 transition-all"
      >
        <Share2 size={18} className="text-brand-gold" />
        Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Share This</span>
                <button onClick={() => setIsOpen(false)}>
                  <X size={14} className="text-zinc-500 hover:text-zinc-100" />
                </button>
              </div>
              
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    if (option.name !== 'Copy Link') setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-300 transition-all ${option.color} hover:text-white`}
                >
                  <span className="flex-shrink-0">{option.icon}</span>
                  {option.name}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;
