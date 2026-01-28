'use client';

import React from 'react';
import { Users, Plus, Edit2, Trash2, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';

const AdminManagementPage = () => {
  const leaders = [
    {
      id: 1,
      name: "Tafsir Chowdhury",
      role: "Founder & CEO",
      status: "Active",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200",
      email: "tafsir@stltd.com"
    },
    {
      id: 2,
      name: "Nusrat Jahan",
      role: "Chief Operating Officer",
      status: "Active",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
      email: "nusrat@stltd.com"
    },
    {
      id: 3,
      name: "Arif Ahmed",
      role: "Head of Architecture",
      status: "Active",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
      email: "arif@stltd.com"
    },
    {
      id: 4,
      name: "Selina Rahman",
      role: "Director of Client Services",
      status: "On Leave",
      image: "https://images.unsplash.com/photo-1580894732230-28ec0527ac35?q=80&w=200",
      email: "selina@stltd.com"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 italic">Manage Leadership</h2>
          <p className="text-zinc-400 mt-1 text-sm">Manage entries for key management personal and roles.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 text-sm">
          <Plus size={18} /> Add Leader
        </button>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Leadership Profile</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leaders.map((leader) => (
              <tr key={leader.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <Image src={leader.image} alt={leader.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-100">{leader.name}</div>
                      <div className="text-xs text-zinc-500">{leader.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-zinc-400">{leader.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    leader.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-500/10 text-zinc-500'
                  }`}>
                    {leader.status}
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

export default AdminManagementPage;
