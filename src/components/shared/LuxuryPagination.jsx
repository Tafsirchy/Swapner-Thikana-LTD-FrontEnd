'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LuxuryPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    currentPage === i
                        ? 'bg-brand-gold text-royal-deep shadow-[0_0_20px_-5px_#D4AF37]'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
            >
                {i}
            </button>
        );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 sm:mt-24 pt-8 border-t border-white/5">
      <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
        Showing Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center gap-2 bg-black/20 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-2 px-2">
            {renderPageNumbers()}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default LuxuryPagination;
