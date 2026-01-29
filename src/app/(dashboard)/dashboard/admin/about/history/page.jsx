'use client';

import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

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

      <div className="relative max-w-5xl mx-auto pt-8">
        {/* Timeline Center Line (Desktop) */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-0 w-px bg-white/10 hidden md:block md:-translate-x-1/2"></div>
         {/* Timeline Line (Mobile) */}
        <div className="absolute left-6 top-4 bottom-0 w-px bg-white/10 md:hidden"></div>

        <div className="space-y-12">
          {milestones.map((ms, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={ms.id} className={`relative flex flex-col md:flex-row gap-8 items-start ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Content Card */}
                <div className="flex-1 w-full pl-16 md:pl-0">
                  <div className={`
                    bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-brand-gold/30 transition-all group relative
                    ${isEven ? 'md:text-left' : 'md:text-right'}
                  `}>
                    {/* Arrow for Desktop */}
                    <div className={`hidden md:block absolute top-8 ${isEven ? '-right-3' : '-left-3'} w-6 h-6 bg-zinc-900 border-l border-b border-white/10 rotate-45 ${isEven ? 'border-l-0 border-b-0 border-r border-t bg-zinc-900' : ''}`}></div>

                    <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                       <span className="text-4xl font-black text-white/10 group-hover:text-brand-gold/20 transition-colors">
                          {ms.year}
                       </span>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ms.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {ms.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-100 mb-2 truncate group-hover:text-brand-gold transition-colors">{ms.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">{ms.description}</p>
                    
                    {/* Action Buttons */}
                    <div className={`flex items-center gap-2 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-brand-gold hover:text-royal-deep transition-all">
                         <Edit2 size={14} /> Edit
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-red-500 hover:text-white transition-all">
                         <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Center Point */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-royal-deep border-4 border-brand-gold shadow-[0_0_15px_rgba(197,164,126,0.5)] z-10 mt-8"></div>
                
                {/* Empty Flex Child for correct spacing on desktop */}
                <div className="flex-1 hidden md:block"></div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminHistoryPage;
