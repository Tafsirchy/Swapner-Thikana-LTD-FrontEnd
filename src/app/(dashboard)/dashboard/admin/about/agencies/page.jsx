'use client';

import React from 'react';
import { Globe, Plus, Search, MapPin, Phone, Mail, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

const AdminAgenciesPage = () => {
  const agencies = [
    {
      id: 1,
      name: "Dhaka HQ",
      location: "Gulshan 2, Dhaka",
      address: "Shwapner Thikana Tower, Road 90, Gulshan 2, Dhaka 1212",
      phone: "+880 2 1234567",
      email: "dhaka.hq@stltd.com",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200",
      status: "Active"
    },
    {
      id: 2,
      name: "Chittagong Office",
      location: "Khulshi, Chittagong",
      address: "Aman Heritage, Khulshi R/A, Chittagong",
      phone: "+880 31 7654321",
      email: "ctg@stltd.com",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200",
      status: "Active"
    },
    {
      id: 3,
      name: "Sylhet Branch",
      location: "Shahjalal Uposhahar, Sylhet",
      address: "Rose View Complex, Shahjalal Uposhahar, Sylhet",
      phone: "+880 821 987654",
      email: "sylhet@stltd.com",
      image: "https://images.unsplash.com/photo-1464146072230-91cabc70e272?q=80&w=200",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 italic">Manage Agencies</h2>
          <p className="text-zinc-400 mt-1 text-sm">Update branch locations, contact details, and partnership info.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 text-sm">
          <Plus size={18} /> Add New Agency
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search agencies by city or address..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-zinc-100 outline-none focus:border-brand-gold/40 transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Agency Branch</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Contact Information</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-gold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {agencies.map((agency) => (
              <tr key={agency.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <Image src={agency.image} alt={agency.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-100">{agency.name}</div>
                      <div className="text-xs text-zinc-500">{agency.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Phone size={12} className="text-brand-gold" /> {agency.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Mail size={12} className="text-brand-gold" /> {agency.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {agency.status}
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

export default AdminAgenciesPage;
