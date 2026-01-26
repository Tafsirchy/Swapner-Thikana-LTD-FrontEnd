'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Building2, Clock } from 'lucide-react';
import { api } from '@/lib/api';

const statusColors = {
  new: 'bg-blue-500/10 text-blue-500',
  contacted: 'bg-yellow-500/10 text-yellow-500',
  closed: 'bg-zinc-500/10 text-zinc-500',
  converted: 'bg-emerald-500/10 text-emerald-500',
};

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <MessageSquare size={32} className="text-brand-gold" />
          My Inquiries
        </h1>
        <div className="text-zinc-400">
          <span className="text-zinc-100 font-bold">{inquiries.length}</span> active threads
        </div>
      </div>

      {inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((lead) => (
            <div key={lead._id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-brand-gold/20 transition-all group">
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${statusColors[lead.status] || 'bg-zinc-500/10 text-zinc-500'}`}>
                          {lead.status}
                       </span>
                       <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(lead.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-brand-gold transition-colors">
                       Inquiry for: <span className="text-zinc-300">{lead.propertyName || 'General Inquiry'}</span>
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2">
                       &quot;{lead.message}&quot;
                    </p>
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
          <a 
            href="/properties" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20"
          >
            <Search size={18} />
            Find Properties
          </a>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;
