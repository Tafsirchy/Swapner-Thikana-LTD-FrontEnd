'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, Building2, MousePointer2, 
  ArrowUpRight, ArrowDownRight, Activity, Calendar
} from 'lucide-react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

const COLORS = ['#D4AF37', '#8B7355', '#1E293B', '#334155', '#475569'];

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-brand-gold/20 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold">
        <Icon size={24} />
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}%
        </div>
      )}
    </div>
    <div>
      <p className="text-zinc-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-zinc-100 mt-1">{value}</h3>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
      <Icon size={120} />
    </div>
  </div>
);

const AnalyticsView = ({ isAdmin = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = isAdmin ? await api.analytics.getAdmin() : await api.analytics.getAgent();
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-12 h-12 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return <div className="text-center py-20 text-zinc-500">No data available</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard title="Overall Growth" value="24%" change="12" icon={TrendingUp} trend="up" />
            <StatCard title="Active Listings" value={data.topProperties?.length || 0} change="5" icon={Building2} trend="up" />
            <StatCard title="New Leads" value={data.leadsTrend?.reduce((acc, curr) => acc + curr.count, 0) || 0} change="8" icon={Activity} trend="up" />
            <StatCard title="Platform Views" value="84.2k" change="2" icon={MousePointer2} trend="down" />
          </>
        ) : (
          <>
            <StatCard title="Listing Views" value={data.listingsPerformance?.reduce((acc, curr) => acc + curr.views, 0) || 0} change="15" icon={MousePointer2} trend="up" />
            <StatCard title="Lead Count" value={data.leadStats?.reduce((acc, curr) => acc + curr.count, 0) || 0} icon={Users} />
            <StatCard title="Active Properties" value={data.listingsPerformance?.filter(p => p.status === 'published').length || 0} icon={Building2} />
            <StatCard title="Recent Interest" value={data.recentLeads?.reduce((acc, curr) => acc + curr.count, 0) || 0} change="20" icon={TrendingUp} trend="up" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Calendar size={20} className="text-brand-gold" />
              {isAdmin ? 'Leads & User Growth' : 'Recent Lead Activity'}
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {isAdmin ? (
                <AreaChart data={data.leadsTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="_id" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#D4AF37" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              ) : (
                <BarChart data={data.recentLeads}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="_id" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar dataKey="count" fill="#D4AF37" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
          <h3 className="text-xl font-bold text-zinc-100 mb-8 flex items-center gap-2">
            <Building2 size={20} className="text-brand-gold" />
            {isAdmin ? 'Property Type Distribution' : 'Lead Status Breakdown'}
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={isAdmin ? data.typeDistribution : data.leadStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {(isAdmin ? data.typeDistribution : data.leadStats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 ml-4">
              {(isAdmin ? data.typeDistribution : data.leadStats).map((entry, index) => (
                <div key={entry._id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs text-zinc-400 capitalize">{entry._id}</span>
                  <span className="text-xs font-bold text-zinc-200">{entry.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h3 className="text-xl font-bold text-zinc-100">
              {isAdmin ? 'Top Performing Properties' : 'My Listings Performance'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-bold">Property</th>
                  <th className="px-8 py-4 font-bold">Price</th>
                  <th className="px-8 py-4 font-bold text-center">Views</th>
                  <th className="px-8 py-4 font-bold">Platform Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(isAdmin ? data.topProperties : data.listingsPerformance)?.slice(0, 5).map((property, idx) => (
                  <tr key={property._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-zinc-100">{property.title}</div>
                      <div className="text-xs text-zinc-500">{property.location?.area || 'Premium Location'}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-brand-gold font-bold">BDT {property.price?.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-sm font-bold text-zinc-300">
                        {property.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-gold h-full rounded-full" 
                          style={{ width: `${Math.max(20, 100 - (idx * 15))}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
