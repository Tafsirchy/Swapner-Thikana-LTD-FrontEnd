'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Building2, Clock, Filter, Search, Download } from 'lucide-react';
import { api } from '@/lib/api';
import { exportLeadsCSV } from '@/utils/exportUtils';
import LuxurySelect from '@/components/shared/LuxurySelect';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import ResponsiveTable from '@/components/shared/ResponsiveTable';

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
      <DashboardPageHeader 
        title="My Inquiries"
        subtitle="Track and manage incoming property inquiries and lead conversations"
        icon={<MessageSquare />}
        actions={
          <>
            <button
              onClick={() => exportLeadsCSV(inquiries)}
              disabled={inquiries.length === 0}
              className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 border border-white/10 text-zinc-100 rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50 text-sm active:scale-95 shrink-0"
            >
              <Download size={18} className="text-brand-gold" />
              Export Data (CSV)
            </button>

            <div className="h-8 w-px bg-white/5 hidden sm:block"></div>

            <div className="flex items-center gap-3 bg-zinc-900/50 p-1.5 rounded-xl border border-white/10">
              <Filter size={16} className="text-zinc-500 ml-2" />
              <LuxurySelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: 'All Status', value: 'all' },
                  { label: 'New', value: 'new' },
                  { label: 'Contacted', value: 'contacted' },
                  { label: 'Converted', value: 'converted' },
                  { label: 'Closed', value: 'closed' }
                ]}
                placeholder="All Status"
                className="!py-1.5 w-full sm:w-36 !bg-transparent !border-none"
              />
            </div>
          </>
        }
        className="bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/5"
      />

      <ResponsiveTable
        columns={[
          {
            key: 'info',
            label: 'Inquiry Details',
            renderCell: (lead) => (
              <div className="space-y-1.5 py-2">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <span className={`text-[8px] font-extrabold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-current shrink-0 ${statusColors[lead.status] || 'bg-zinc-500/10 text-zinc-500'}`}>
                    {lead.status}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                    <Clock size={12} className="text-zinc-600" />
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-cinzel font-bold text-zinc-100 uppercase tracking-wide truncate max-w-[250px] group-hover:text-brand-gold transition-colors">
                  {lead.subject || (lead.interestType === 'general' ? 'General Inquiry' : `Inquiry for ${lead.interestType}`)}
                </h3>
                {lead.propertyName && (
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5 overflow-hidden">
                    <Building2 size={12} className="text-brand-gold shrink-0" />
                    <span className="truncate">{lead.propertyName}</span>
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'message',
            label: 'Message Preview',
            renderCell: (lead) => (
              <p className="text-zinc-400 text-xs italic line-clamp-2 max-w-[350px] xl:max-w-[500px]">
                &quot;{lead.message}&quot;
              </p>
            )
          },
          {
            key: 'interest',
            label: 'Interest / Agent',
            renderCell: (lead) => (
              <div className="flex flex-col gap-1">
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="text-zinc-500">Interest:</span>
                  <span className="text-zinc-200 capitalize font-bold">{lead.interestType}</span>
                </div>
                {lead.assignedTo && (
                   <div className="bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-full text-[9px] text-emerald-500 font-bold uppercase tracking-widest inline-flex w-fit">
                      Agent Assigned
                   </div>
                )}
              </div>
            )
          }
        ]}
        data={filteredInquiries}
        loading={loading}
        icon={MessageSquare}
        emptyMessage="No inquiries yet"
        renderCard={(lead) => (
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-brand-gold/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
             
             <div className="flex flex-col gap-5 relative z-10">
                <div className="space-y-4">
                   <div className="flex items-center flex-wrap gap-3 mb-2">
                      <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-current shadow-inner shrink-0 ${statusColors[lead.status] || 'bg-zinc-500/10 text-zinc-500'}`}>
                         {lead.status}
                      </span>
                      <div className="h-4 w-px bg-white/10 hidden xs:block" />
                      <span className="text-xs text-zinc-500 font-medium flex items-center gap-2">
                         <Clock size={14} className="text-zinc-600" />
                         {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                   
                   <h3 className="text-lg font-cinzel font-bold text-zinc-100 group-hover:text-brand-gold transition-colors uppercase tracking-wide truncate">
                      {lead.subject || (lead.interestType === 'general' ? 'General Inquiry' : `Inquiry for ${lead.interestType}`)}
                   </h3>
                   
                   {lead.propertyName && (
                      <div className="bg-white/5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10">
                         <Building2 size={14} className="text-brand-gold" />
                         <span className="text-sm text-zinc-300 font-medium truncate max-w-[200px]">{lead.propertyName}</span>
                      </div>
                   )}
                   
                   <div className="bg-black/20 p-4 rounded-2xl border border-white/5 mt-2">
                      <p className="text-zinc-400 text-sm leading-relaxed italic line-clamp-3">
                         &quot;{lead.message}&quot;
                      </p>
                   </div>
                </div>
                
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
                   <div className="text-xs text-zinc-400 flex items-center gap-2">
                      <span className="text-zinc-500">Interest:</span>
                      <span className="text-zinc-200 capitalize font-bold">{lead.interestType}</span>
                   </div>
                   {lead.assignedTo && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                         Assigned
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}
      />
    </div>
  );
};

export default InquiriesPage;
