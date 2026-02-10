'use client';

import React from 'react';
import { Plus, Send, UserCheck, Clock, ShieldCheck } from 'lucide-react';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import ResponsiveTable from '@/components/shared/ResponsiveTable';

const AdminNewsletterPage = () => {
  const subscribers = [
    { id: 1, email: "john.doe@example.com", name: "John Doe", date: "2025-01-28", status: "Active" },
    { id: 2, email: "n.jahan@lifestyle.com", name: "Nusrat Jahan", date: "2025-01-27", status: "Active" },
    { id: 3, email: "m.arif@arch.daily", name: "Mahmud Arif", date: "2025-01-25", status: "Unsubscribed" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <DashboardPageHeader 
        title="Newsletter Management"
        subtitle="Manage your distribution list and campaign analytics."
        icon={<Send />}
        actions={
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-zinc-300 font-bold rounded-xl hover:border-brand-gold hover:text-brand-gold transition-all text-sm w-full sm:w-auto">
              <Send size={18} /> Send Campaign
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg text-sm w-full sm:w-auto">
              <Plus size={18} /> Export List
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Subscribers', value: '1,284', trend: '+12% this month', icon: UserCheck },
           { label: 'Open Rate', value: '42.5%', trend: '+2.1% higher', icon: ShieldCheck },
           { label: 'Click Rate', value: '18.2%', trend: '-0.5% lower', icon: Clock },
         ].map((stat, i) => (
           <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:border-brand-gold/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                <stat.icon size={18} className="text-brand-gold/40 group-hover:text-brand-gold transition-colors" />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-[10px] text-brand-gold mt-1 font-bold tracking-wider">{stat.trend}</div>
           </div>
         ))}
      </div>

      <ResponsiveTable
        columns={[
          {
            key: 'subscriber',
            label: 'Subscriber',
            renderCell: (sub) => (
              <div>
                <div className="font-bold text-zinc-100">{sub.name}</div>
                <div className="text-xs text-zinc-500">{sub.email}</div>
              </div>
            )
          },
          {
            key: 'date',
            label: 'Date Joined',
            renderCell: (sub) => (
              <span className="text-sm text-zinc-400">{sub.date}</span>
            )
          },
          {
            key: 'status',
            label: 'Status',
            headerClassName: 'text-right',
            renderCell: (sub) => (
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  sub.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {sub.status}
                </span>
              </div>
            )
          }
        ]}
        data={subscribers}
        breakpoint="md"
        icon={Send}
        emptyMessage="No subscribers found"
        renderCard={(sub) => (
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-zinc-100">{sub.name}</div>
              <div className="text-xs text-zinc-500 mb-2">{sub.email}</div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <Clock size={10} /> {sub.date}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  sub.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {sub.status}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default AdminNewsletterPage;
