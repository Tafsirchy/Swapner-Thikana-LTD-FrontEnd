'use client';

import React from 'react';
import { Users, Plus, Search, Star, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

const AdminAgentsManagementPage = () => {
  const agents = [
    {
      id: 1,
      name: "Zayan Ahmed",
      specialty: "Luxury Penthouses",
      experience: "8 Years",
      status: "Verified",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      email: "zayan@stltd.com",
      listings: 12
    },
    {
      id: 2,
      name: "Sumiya Rahman",
      specialty: "Diplomatic Area Specialist",
      experience: "5 Years",
      status: "Verified",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      email: "sumiya@stltd.com",
      listings: 8
    },
    {
      id: 3,
      name: "Tanvir Hasan",
      specialty: "Commercial Estates",
      experience: "10 Years",
      status: "Pending",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      email: "tanvir@stltd.com",
      listings: 15
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 italic">Manage Agents</h2>
          <p className="text-zinc-400 mt-1 text-sm">Onboard, verify, and manage real estate agents and their performance.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 text-sm">
          <Plus size={18} /> Onboard New Agent
        </button>
      </div>

      {/* Agents Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Agent Info</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Specialty</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Listings</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Rating</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-100">{agent.name}</div>
                      <div className="text-[10px] text-brand-gold font-bold uppercase tracking-wider">{agent.status}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-zinc-400">{agent.specialty}</div>
                  <div className="text-[10px] text-zinc-600 italic">{agent.experience} experience</div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300 font-bold">{agent.listings}</td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1 text-brand-gold">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold">{agent.rating}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-zinc-500">
                    <button className="p-2 rounded-lg bg-white/5 hover:text-brand-gold transition-colors"><Mail size={16} /></button>
                    <button className="p-2 rounded-lg bg-white/5 hover:text-brand-gold transition-colors"><Edit2 size={16} /></button>
                    <button className="p-2 rounded-lg bg-white/5 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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

export default AdminAgentsManagementPage;
