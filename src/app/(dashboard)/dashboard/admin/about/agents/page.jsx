'use client';

import React from 'react';
import { Users, Plus, Search } from 'lucide-react';

const AdminAgentsManagementPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 italic">Manage Agents</h2>
          <p className="text-zinc-400 mt-1 text-sm">Onboard, verify, and manage real estate agents and their performance.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 text-sm">
          <Plus size={18} /> Onboard New Agent
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search agents by name, license, or specialty..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-zinc-100 outline-none focus:border-brand-gold/40 transition-all text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-[2rem] border-white/5 p-20 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
           <Users size={40} />
        </div>
        <h3 className="text-xl font-bold text-zinc-300">No Agents Managed Here</h3>
        <p className="text-zinc-500 mt-2 max-w-sm">Agent verification and lead assignment tools are currently being integrated into the About CMS bundle.</p>
      </div>
    </div>
  );
};

export default AdminAgentsManagementPage;
