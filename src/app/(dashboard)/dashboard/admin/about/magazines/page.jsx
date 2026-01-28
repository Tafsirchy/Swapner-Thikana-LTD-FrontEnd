'use client';

import React from 'react';
import { BookOpen, Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const AdminMagazinesPage = () => {
  const magazines = [
    {
      id: 1,
      title: "The Architecture Annual 2025",
      issue: "Issue #42",
      category: "Architectural",
      status: "Published",
      date: "2025-01-15",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=200"
    },
    {
      id: 2,
      title: "Luxe Living Monthly",
      issue: "Winter Edition",
      category: "Lifestyle",
      status: "Published",
      date: "2024-12-01",
      image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=200"
    },
    {
      id: 3,
      title: "Urban Development Report",
      issue: "Q4 2024",
      category: "Market Analysis",
      status: "Draft",
      date: "2024-11-20",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=200"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 italic">Manage Magazines</h2>
          <p className="text-zinc-400 mt-1 text-sm">Update and publish architectural journals and lifestyle guides.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 text-sm">
          <Plus size={18} /> Add New Issue
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search magazines..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-zinc-100 outline-none focus:border-brand-gold/40 transition-all text-sm"
          />
        </div>
      </div>

      {/* Magazines Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Magazine</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {magazines.map((mag) => (
              <tr key={mag.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <Image src={mag.image} alt={mag.title} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-100">{mag.title}</div>
                      <div className="text-xs text-zinc-500">{mag.issue}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-zinc-400">{mag.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    mag.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {mag.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-zinc-400">{mag.date}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-brand-gold transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMagazinesPage;
