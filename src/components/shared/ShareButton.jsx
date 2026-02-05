'use client';

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import ShareModal from './ShareModal';

const ShareButton = ({ title, text, image, price, location }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative select-none">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white hover:text-brand-gold hover:border-brand-gold/50 hover:bg-black/60 transition-all duration-300 active:scale-95"
        aria-label="Share"
      >
        <Share2 size={20} />
      </button>

      <ShareModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        data={{ title, text, image, price, location }}
      />
    </div>
  );
};

export default ShareButton;
