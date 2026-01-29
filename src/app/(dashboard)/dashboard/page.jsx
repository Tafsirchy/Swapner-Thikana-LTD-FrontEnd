'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  Building2, Users, Heart, Search, MessageSquare, 
  TrendingUp, PlusCircle, ArrowRight,
  CheckCircle, XCircle, Clock, Bell, Send, Mail
} from 'lucide-react';
import RecentlyViewed from '@/components/dashboard/RecentlyViewed';
import UpcomingReminders from '@/components/dashboard/UpcomingReminders';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon size={80} />
    </div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} bg-white/5`}>
        <Icon size={24} />
      </div>
      <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-zinc-100">{value}</span>
        {trend && (
           <span className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
             <TrendingUp size={12} /> {trend}
           </span>
        )}
      </div>
    </div>
  </div>
);

const ViewAllLink = ({ href }) => (
  <a href={href} className="text-brand-gold text-sm font-bold flex items-center gap-1 hover:underline">
    View All <ArrowRight size={14} />
  </a>
);

const CustomerDashboard = () => (
  <div className="space-y-8">
     {/* Stats Grid */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Saved Homes" value="12" icon={Heart} color="text-pink-500" />
        <StatCard title="Active Inquiries" value="3" icon={MessageSquare} color="text-brand-gold" trend="+1 new" />
        <StatCard title="Saved Searches" value="5" icon={Search} color="text-blue-500" />
     </div>

     {/* Recent Activity */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-100">Recent Inquiries</h2>
              <ViewAllLink href="/dashboard/inquiries" />
           </div>
           <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex-shrink-0"></div>
                    <div>
                       <h4 className="font-bold text-sm text-zinc-100">Luxury Villa in Gulshan</h4>
                       <p className="text-xs text-zinc-400 mt-1">Pending Response • 2h ago</p>
                    </div>
                    <div className="ml-auto text-xs font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
                       Pending
                    </div>
                 </div>
              ))}
           </div>
        </div>
        <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-3xl p-8 flex flex-col justify-center text-center">
           <h2 className="text-2xl font-bold text-brand-gold mb-2">Find Your Dream Home</h2>
           <p className="text-zinc-400 mb-6 max-w-sm mx-auto">Explore our latest premium listings tailored to your preferences.</p>
           <Link href="/properties" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all">
              Browse Properties
           </Link>
        </div>
     </div>

     <RecentlyViewed />
  </div>
);

const AgentDashboard = () => (
  <div className="space-y-8">
     {/* Stats Grid */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="My Listings" value="8" icon={Building2} color="text-brand-emerald" trend="+2 this month" />
        <StatCard title="Total Leads" value="45" icon={Users} color="text-blue-500" trend="+12%" />
        <StatCard title="Total Views" value="1.2k" icon={Search} color="text-purple-500" trend="+8%" />
        <StatCard title="Pending" value="2" icon={Clock} color="text-yellow-500" />
     </div>

     <div className="flex items-center justify-end">
        <a href="/dashboard/properties/add" className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all">
           <PlusCircle size={18} /> Add New Property
        </a>
     </div>

      {/* Ongoing Leads & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
         <div className="lg:col-span-3 bg-white/5 border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-zinc-100">Recent Leads</h2>
               <ViewAllLink href="/dashboard/leads" />
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-zinc-400">
                  <thead>
                     <tr className="border-b border-white/10">
                        <th className="pb-4 font-bold uppercase tracking-wider text-xs">Client</th>
                        <th className="pb-4 font-bold uppercase tracking-wider text-xs">Property</th>
                        <th className="pb-4 font-bold uppercase tracking-wider text-xs">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="group hover:bg-white/5">
                           <td className="py-4 font-bold text-zinc-200">Wasi Al-Shatib</td>
                           <td className="py-4">Lake City Concord - Apt 4B</td>
                           <td className="py-4"><span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">New</span></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="lg:col-span-2">
            <UpcomingReminders />
         </div>
      </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = React.useState(null);
  const [pendingProperties, setPendingProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, propsRes] = await Promise.all([
          api.admin.getDashboard(),
          api.admin.getProperties({ status: 'pending' })
        ]);
        setStats(statsRes.data.stats);
        setPendingProperties(propsRes.data.properties.slice(0, 3));
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
       {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-3xl border border-white/5"></div>)}
     </div>
     <div className="h-64 bg-white/5 rounded-3xl border border-white/5"></div>
  </div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="text-blue-500" />
        <StatCard title="Active Listings" value={stats?.activeListings || 0} icon={Building2} color="text-brand-gold" />
        <StatCard title="Pending Approvals" value={stats?.pendingApprovals || 0} icon={Clock} color="text-yellow-500" />
        <StatCard title="Total Properties" value={stats?.totalProperties || 0} icon={TrendingUp} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Approvals Queue */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-100">Pending Approvals</h2>
            <ViewAllLink href="/dashboard/admin/properties" />
          </div>
          <div className="space-y-4">
            {pendingProperties.length > 0 ? (
              pendingProperties.map((property) => (
                <div key={property._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <Building2 size={24} className="text-zinc-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100">{property.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1">Submitted by {property.agent?.name || 'Unknown Agent'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={async () => {
                        try {
                          await api.admin.approveProperty(property._id);
                          setPendingProperties(prev => prev.filter(p => p._id !== property._id));
                          toast.success('Property approved successfully');
                        } catch {
                          toast.error('Failed to approve property');
                        }
                      }}
                      className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          const reason = prompt('Reason for rejection?');
                          if (reason === null) return;
                          await api.admin.rejectProperty(property._id, reason);
                          setPendingProperties(prev => prev.filter(p => p._id !== property._id));
                          toast.success('Property rejected');
                        } catch {
                          toast.error('Failed to reject property');
                        }
                      }}
                      className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500 text-sm">No pending approvals</div>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">System Health</h2>
          <div className="space-y-6">
            {[
              { label: 'Database Connection', status: 'Healthy', color: 'text-emerald-500' },
              { label: 'API Response Time', status: '45ms', color: 'text-emerald-500' },
              { label: 'Storage Usage', status: '45%', color: 'text-blue-500' },
              { label: 'Error Rate', status: '0.01%', color: 'text-emerald-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <span className="text-zinc-400 text-sm font-medium">{item.label}</span>
                <span className={`font-bold text-sm ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connectivity Test */}
        <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-3xl p-8 lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-100 mb-2 flex items-center gap-2">
                <Bell size={20} className="text-brand-gold" />
                System Tools
              </h2>
              <p className="text-zinc-500 text-sm">Manage notifications and email templates.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link 
                href="/dashboard/admin/email-preview"
                className="px-6 py-3 bg-white/5 text-zinc-300 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Mail size={18} /> Email Templates
              </Link>
              <button 
                onClick={async () => {
                  try {
                    await api.notifications.sendTest();
                    toast.success('Test notification sent');
                  } catch {
                    toast.error('Failed to send test notification');
                  }
                }}
                className="px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Send size={18} /> Send Test Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <>
      {user?.role === 'agent' && <AgentDashboard />}
      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'customer' && <CustomerDashboard />}
    </>
  );
};

export default DashboardPage;
