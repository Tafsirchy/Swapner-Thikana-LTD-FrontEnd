'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Building2, Clock, Filter, Search, Download } from 'lucide-react';
import { api } from '@/lib/api';
import { exportLeadsCSV } from '@/utils/exportUtils';

const statusColors = {
  new: 'bg-blue-500/10 text-blue-500',
  contacted: 'bg-yellow-500/10 text-yellow-500',
  closed: 'bg-zinc-500/10 text-zinc-500',
  converted: 'bg-emerald-500/10 text-emerald-500',
};

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const data = await api.leads.getMyInquiries();
        setInquiries(data.data.inquiries || []);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // Filter inquiries based on status
  const filteredInquiries = statusFilter === 'all' 
    ? inquiries 
    : inquiries.filter(inquiry => inquiry.status === statusFilter);

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
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <MessageSquare size={32} className="text-brand-gold" />
            My Inquiries
          </h1>
          <p className="text-zinc-400 mt-1">
            <span className="text-zinc-100 font-bold">{filteredInquiries.length}</span> {statusFilter !== 'all' ? statusFilter : 'total'} inquiries
          </p>
          <div className="flex items-center gap-3">
          <button
            onClick={() => exportLeadsCSV(inquiries)}
            disabled={inquiries.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50 text-sm"
          >
            <Download size={16} className="text-brand-gold" />
            Export CSV
          </button>
        </div>
      </div>
        
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 outline-none focus:border-brand-gold/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {filteredInquiries.length > 0 ? (
        <div className="space-y-4">
          {filteredInquiries.map((lead) => (
            <div key={lead._id} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 hover:border-brand-gold/30 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative z-10">
                  <div className="flex-1 space-y-4">
                     <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-current shadow-inner ${statusColors[lead.status] || 'bg-zinc-500/10 text-zinc-500'}`}>
                           {lead.status}
                        </span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-xs text-zinc-500 font-medium flex items-center gap-2">
                           <Clock size={14} className="text-zinc-600" />
                           {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                     
                     <h3 className="text-xl font-cinzel font-bold text-zinc-100 group-hover:text-brand-gold transition-colors uppercase tracking-wide truncate">
                        {lead.subject || (lead.interestType === 'general' ? 'General Inquiry' : `Inquiry for ${lead.interestType}`)}
                     </h3>
                     
                     {lead.propertyName && (
                        <div className="bg-white/5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10">
                           <Building2 size={14} className="text-brand-gold" />
                           <span className="text-sm text-zinc-300 font-medium">{lead.propertyName}</span>
                        </div>
                     )}
                     
                     <div className="bg-black/20 p-5 rounded-2xl border border-white/5 mt-4 group">
                        <p className="text-zinc-400 text-sm leading-relaxed italic line-clamp-3">
                           &quot;{lead.message}&quot;
                        </p>
                     </div>
                  </div>
                 <div className="flex flex-col md:items-end justify-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                       <Building2 size={14} className="text-brand-gold" />
                       Type: <span className="text-zinc-200 capitalize">{lead.interestType}</span>
                    </div>
                    {lead.assignedTo && (
                       <div className="text-xs text-zinc-500 mt-1">
                          Agent Assigned
                       </div>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={40} className="text-zinc-500" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-300 mb-2">No inquiries yet</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            Have questions about a property? Send an inquiry and track the conversation here.
          </p>
          <Link 
            href="/properties" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20"
          >
            <Search size={18} />
            Find Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;
