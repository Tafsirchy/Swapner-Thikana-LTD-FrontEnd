'use client';

import React from 'react';
import { History, Plus } from 'lucide-react';

const AdminHistoryPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 italic">Manage History</h2>
          <p className="text-zinc-400 mt-1 text-sm">Chronicle the Shwapner Thikana journey through milestones.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 text-sm">
          <Plus size={18} /> Add New Milestone
        </button>
      </div>

      <div className="glass rounded-[2rem] border-white/5 p-20 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
           <History size={40} />
        </div>
        <h3 className="text-xl font-bold text-zinc-300">No Milestones Found</h3>
        <p className="text-zinc-500 mt-2 max-w-sm">Build your legacy timeline. Add years, titles, and descriptions of your historical achievements.</p>
      </div>
    </div>
  );
};

export default AdminHistoryPage;
