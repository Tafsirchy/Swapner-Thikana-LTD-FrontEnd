'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, PlusCircle, Search, Edit2, Trash2, Mail, Phone, Star, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import SmartImage from '@/components/shared/SmartImage';
import { toast } from 'react-hot-toast';
import LuxuryPagination from '@/components/shared/LuxuryPagination';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';

const AdminAgentsListPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAgents(currentPage);
  }, [currentPage, searchQuery]);

  const fetchAgents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.agents.getAll({
        search: searchQuery || undefined,
        page,
        limit: 10
      });
      setAgents(response.data.agents || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this agent?')) return;
    
    try {
      await api.agents.delete(id);
      setAgents(agents.filter(a => a._id !== id));
      toast.success('Agent removed successfully');
    } catch (error) {
      toast.error('Failed to remove agent');
    }
  };

  // Server-side filtering
  const displayAgents = agents;

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
      <DashboardPageHeader 
        title="Agent Management"
        subtitle="Manage real estate agents and their performance metrics."
        icon={<Users />}
        actions={
          <Link
            href="/dashboard/admin/agents/add"
            className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10 font-sans italic"
          >
            <PlusCircle size={18} /> ONBOARD NEW AGENT
          </Link>
        }
      />

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search agents by name or specialty..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50 text-zinc-100 font-sans"
        />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {displayAgents.map((agent) => (
          <div key={agent._id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                {agent.image ? (
                  <SmartImage src={agent.image} alt="" fill className="object-cover" />
                ) : (
                  <Users size={24} className="text-zinc-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-zinc-100 truncate font-sans">{agent.name}</div>
                <div className="text-xs text-zinc-500 truncate font-sans">{agent.email}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider font-sans ${agent.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {agent.status || 'Pending'}
                  </span>
                  {agent.rating > 0 && (
                    <div className="flex items-center gap-1 text-brand-gold text-xs font-bold font-sans">
                       <Star size={10} fill="currentColor" />
                       {agent.rating}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 font-sans">
               <div className="text-zinc-300 font-medium text-sm">{agent.specialty || 'General'}</div>
               <div className="text-xs text-zinc-500">{agent.experience || 'No info'} experience</div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <Link
                href={`/dashboard/admin/agents/edit/${agent._id}`}
                className="flex-1 py-2 bg-white/5 hover:bg-brand-gold hover:text-royal-deep rounded-lg transition-all text-brand-gold flex items-center justify-center gap-2 font-medium text-xs font-sans"
              >
                <Edit2 size={14} /> Edit
              </Link>
              <button
                onClick={() => handleDelete(agent._id)}
                className="flex-1 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-zinc-400 flex items-center justify-center gap-2 font-medium text-xs font-sans"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs font-sans italic">Agent Info</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs font-sans italic">Specialty</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs font-sans italic">Status</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs font-sans italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayAgents.map((agent) => (
                <tr key={agent._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden relative">
                        {agent.image ? (
                          <SmartImage src={agent.image} alt="" fill className="object-cover" />
                        ) : (
                          <Users size={24} className="text-zinc-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-100 truncate font-sans">{agent.name}</div>
                        <div className="text-xs text-zinc-500 truncate font-sans">{agent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-sans">
                      <div className="text-zinc-300 font-medium">{agent.specialty || 'General'}</div>
                      <div className="text-[10px] text-zinc-500">{agent.experience || 'No info'} exp.</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider font-sans ${agent.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {agent.status || 'Pending'}
                      </span>
                      {agent.rating > 0 && (
                        <div className="flex items-center gap-1 text-brand-gold text-xs font-bold font-sans">
                           <Star size={10} fill="currentColor" />
                           {agent.rating}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link
                        href={`/dashboard/admin/agents/edit/${agent._id}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-brand-gold"
                        title="Edit Agent"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(agent._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                        title="Delete Agent"
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

      {displayAgents.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <Users size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-300 font-sans italic">No Agents Found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mt-1 font-sans italic">Quiet here. Onboard your first agent to start listing properties.</p>
        </div>
      )}

      <LuxuryPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminAgentsListPage;
