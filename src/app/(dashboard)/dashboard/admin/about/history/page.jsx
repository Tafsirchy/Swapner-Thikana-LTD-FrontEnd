'use client';

import React from 'react';
import { History, Plus, Edit2, Trash2, Calendar } from 'lucide-react';

const AdminHistoryPage = () => {
  const milestones = [
    {
      id: 1,
      year: "2015",
      title: "The Foundation",
      description: "Shwapner Thikana was founded as a boutique real estate advisory team.",
      status: "Published"
    },
    {
      id: 2,
      year: "2018",
      title: "Expansion to Chittagong",
      description: "Successful expansion into the port city establishing reputation in hills-side developments.",
      status: "Published"
    },
    {
      id: 3,
      year: "2020",
      title: "Digital Transformation",
      description: "Launch of our first AI-driven property matching platform.",
      status: "Published"
    },
    {
      id: 4,
      year: "2022",
      title: "Excellence Awards",
      description: "Recognized as the 'Luxury Real Estate Agency of the Year'.",
      status: "Draft"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 italic">Manage History</h2>
          <p className="text-zinc-400 mt-1 text-sm">Chronicle the Shwapner Thikana journey through milestones.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 text-sm">
          <Plus size={18} /> Add New Milestone
        </button>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Year</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Milestone Title</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {milestones.map((ms) => (
              <tr key={ms.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-zinc-100 font-bold">
                    <Calendar size={14} className="text-brand-gold" /> {ms.year}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-zinc-200">{ms.title}</div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-zinc-500 line-clamp-1 max-w-xs">{ms.description}</p>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ms.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {ms.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-brand-gold transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
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

export default AdminHistoryPage;
