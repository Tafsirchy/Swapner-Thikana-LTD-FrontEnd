'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ShareButton = ({ title, text, url }) => {
  const handleShare = async () => {
    const shareData = {
      title: title || 'Check this out!',
      text: text || 'I found this interesting property.',
      url: url || (typeof window !== 'undefined' ? window.location.href : ''),
    };

    console.log('Attempting to share/copy:', shareData);

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
             await navigator.clipboard.writeText(shareData.url);
             toast.success('Link copied to clipboard!');
        } else {
             // Deep fallback for older browsers or non-secure contexts
             const textArea = document.createElement("textarea");
             textArea.value = shareData.url;
             document.body.appendChild(textArea);
             textArea.select();
             document.execCommand("copy");
             document.body.removeChild(textArea);
             toast.success('Link copied to clipboard!');
        }
      } catch (err) {
        console.error('Clipboard error:', err);
        toast.error('Failed to copy link.');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-3 rounded-full bg-zinc-900/40 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-all duration-300 group"
      aria-label="Share"
    >
      <Share2 
        size={20} 
        className="group-hover:scale-110 transition-transform duration-300" 
      />
    </button>
  );
};

export default ShareButton;
