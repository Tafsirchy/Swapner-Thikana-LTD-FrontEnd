'use client';

import React from 'react';
import { Mail, Plus, Search, Send } from 'lucide-react';

const AdminNewsletterPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 italic">Newsletter Management</h2>
          <p className="text-zinc-400 mt-1 text-sm">Manage your distribution list and campaign analytics.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-zinc-300 font-bold rounded-xl hover:border-brand-gold hover:text-brand-gold transition-all text-sm">
            <Send size={18} /> Send Campaign
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg text-sm">
            <Plus size={18} /> Export List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Subscribers', value: '1,284', trend: '+12% this month' },
           { label: 'Open Rate', value: '42.5%', trend: '+2.1% higher' },
           { label: 'Click Rate', value: '18.2%', trend: '-0.5% lower' },
         ].map((stat, i) => (
           <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
              <div className="text-3xl font-bold text-white mt-2">{stat.value}</div>
              <div className="text-xs text-brand-gold mt-1 font-medium">{stat.trend}</div>
           </div>
         ))}
      </div>

      <div className="glass rounded-[2rem] border-white/5 p-20 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
           <Mail size={40} />
        </div>
        <h3 className="text-xl font-bold text-zinc-300">Newsletter List is Private</h3>
        <p className="text-zinc-500 mt-2 max-w-sm">Subscription management and broadcast systems are being prepared for deployment. Check back for live stats.</p>
      </div>
    </div>
  );
};

export default AdminNewsletterPage;
