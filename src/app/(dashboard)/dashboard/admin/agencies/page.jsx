'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle, Search, Edit2, Trash2, MapPin, Globe, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const AdminAgenciesPage = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await api.agencies.getAll();
      setAgencies(response.data.agencies || []);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast.error('Failed to load agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agency?')) return;
    
    try {
      await api.agencies.delete(id);
      setAgencies(agencies.filter(a => a._id !== id));
      toast.success('Agency deleted successfully');
    } catch (error) {
      toast.error('Failed to delete agency');
    }
  };

  const filteredAgencies = agencies.filter(agency => 
    agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-zinc-100 flex items-center gap-3">
            <Briefcase size={32} className="text-brand-gold" />
            Agency Management
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Manage partner real estate agencies
          </p>
        </div>
        <Link
          href="/dashboard/admin/agencies/add"
          className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10"
        >
          <PlusCircle size={18} /> ADD NEW AGENCIES
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search agencies..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50 text-zinc-100"
        />
      </div>

      {/* Agencies Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Agency Info</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Contact</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Location</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAgencies.map((agency) => (
                <tr key={agency._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden">
                        {agency.logo ? (
                          <img src={agency.logo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase size={24} className="text-zinc-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-100 truncate">{agency.name}</div>
                        <div className="text-xs text-zinc-500 truncate">{agency.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Phone size={12} className="text-brand-gold" />
                        {agency.phone}
                      </div>
                      {agency.website && (
                        <div className="flex items-center gap-2 text-xs">
                          <Globe size={12} className="text-brand-gold" />
                          <a href={agency.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">{agency.website.replace(/^https?:\/\//, '')}</a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 text-xs max-w-[200px]">
                      <MapPin size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                      <span className="truncate">{agency.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Link
                        href={`/dashboard/admin/agencies/edit/${agency._id}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-brand-gold"
                        title="Edit Agency"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(agency._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                        title="Delete Agency"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAgencies.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <Briefcase size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-300">No Agencies Found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mt-1">Try adjusting your search to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAgenciesPage;
