'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LuxuryPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
      <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
        Showing Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-400 disabled:opacity-50 hover:bg-white/10 transition-all active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-400 disabled:opacity-50 hover:bg-white/10 transition-all active:scale-95"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default LuxuryPagination;
