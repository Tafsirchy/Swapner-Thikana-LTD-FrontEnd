'use client';

import React, { useState, useEffect } from 'react';
import { Building2, PlusCircle, Edit, Trash2, Eye, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SmartImage from '@/components/shared/SmartImage';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LuxurySelect from '@/components/shared/LuxurySelect';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';

const AgentPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  const fetchProperties = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: sort
      };
      const data = await api.properties.getMyProperties(params);
      setProperties(data.data.properties || []);
    } catch {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sort]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await api.properties.delete(id);
        setProperties(properties.filter(p => p._id !== id));
        toast.success('Property deleted successfully');
      } catch {
        toast.error('Failed to delete property');
      }
    }
  };

  if (loading) {
    return (
       <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="h-24 sm:h-28 bg-white/5 rounded-2xl sm:rounded-3xl animate-pulse border border-white/5"></div>
          ))}
       </div>
    );
  }


  return (
    <div className="space-y-8">
      <DashboardPageHeader 
        title="My Listings"
        subtitle="Manage your active and pending property listings with real-time analytics"
        icon={<Building2 />}
        iconBg="bg-brand-emerald/10"
        iconColor="text-brand-emerald"
        actions={
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 xl:gap-6 flex-wrap">
            {/* Filters Group */}
            {properties.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 px-3 border-r border-white/10 hidden 2xl:flex">
                  <Filter size={16} className="text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Filters</span>
                </div>
                
                <LuxurySelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { label: 'All Status', value: 'all' },
                    { label: 'Published', value: 'published' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Sold', value: 'sold' }
                  ]}
                  placeholder="All Status"
                  className="!py-2.5 sm:w-36 !bg-transparent !border-none"
                />

                <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

                <LuxurySelect
                  value={sort}
                  onChange={setSort}
                  options={[
                    { label: 'Newest First', value: 'newest' },
                    { label: 'Oldest First', value: 'oldest' },
                    { label: 'Price: Low to High', value: 'price-asc' },
                    { label: 'Price: High to Low', value: 'price-desc' },
                    { label: 'Most Popular', value: 'popular' }
                  ]}
                  placeholder="Sort By"
                  className="!py-2.5 sm:w-44 !bg-transparent !border-none"
                />
              </div>
            )}
            
            <Link 
              href="/dashboard/properties/add" 
              className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-gold text-royal-deep font-bold rounded-2xl hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 whitespace-nowrap text-sm sm:text-base group active:scale-95 shrink-0"
            >
              <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Add Property
            </Link>
          </div>
        }
        className="bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/5"
      />



      {properties.length > 0 ? (
        <div className="space-y-4">
          {/* Mobile Card View (Visible on < LG) */}
          <div className="lg:hidden space-y-4">
            {properties.map((property) => (
              <div key={property._id} className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-6">
                <div className="flex gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-800 shrink-0 overflow-hidden relative border border-white/5">
                    {property.images?.[0] ? (
                      <SmartImage src={property.images[0]} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Building2 size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-zinc-100 text-base line-clamp-1">{property.title}</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1.5 font-medium">{property.location?.area}, {property.location?.city}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border border-current shadow-inner ${
                        property.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                        property.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-400/20' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {property.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold">
                        <Eye size={12} className="text-zinc-600" /> {property.views} views
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="font-bold text-zinc-100 text-sm">
                    ৳{property.price?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/dashboard/properties/edit/${property._id}`} 
                      className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-brand-gold active:scale-95 transition-all"
                      aria-label="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(property._id)} 
                      className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-red-500 active:scale-95 transition-all"
                      aria-label="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    <Link 
                      href={`/properties/${property.slug || property._id}`} 
                      className="p-3 bg-white/5 rounded-xl text-zinc-100 active:scale-95 transition-all"
                      aria-label="View"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Visible on >= LG) */}
          <div className="hidden lg:block bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs text-zinc-500 px-8">Property</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs text-zinc-500">Status</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs text-zinc-500">Price</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs text-zinc-500 border-r border-white/5">Views</th>
                    <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs text-zinc-500 text-right pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {properties.map((property) => (
                    <tr key={property._id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-zinc-800 overflow-hidden relative border border-white/5">
                            {property.images?.[0] ? (
                                <SmartImage src={property.images[0]} alt="" fill className="object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                  <Building2 size={20} />
                               </div>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-zinc-100 truncate">{property.title}</h4>
                            <p className="text-[10px] text-zinc-500 lowercase tracking-tight mt-1 truncate">{property.location?.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            property.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                            property.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-red-500/10 text-red-500'
                         }`}>
                            {property.status}
                         </span>
                      </td>
                      <td className="px-6 py-5 font-bold text-zinc-100">
                         ৳{(property.price / 10000000).toFixed(2)}Cr
                      </td>
                      <td className="px-6 py-5 border-r border-white/5">
                         <div className="flex items-center gap-2">
                            <Eye size={14} className="text-zinc-500" /> {property.views}
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <Link 
                               href={`/properties/${property.slug || property._id}`} 
                               className="p-2.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            >
                               <Eye size={18} />
                            </Link>
                            <Link 
                               href={`/dashboard/properties/edit/${property._id}`} 
                               className="p-2.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-brand-gold transition-colors"
                            >
                               <Edit size={18} />
                            </Link>
                            <button 
                               onClick={() => handleDelete(property._id)} 
                               className="p-2.5 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
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
        </div>

      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={40} className="text-zinc-500" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-300 mb-2">No properties listed</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            You haven&apos;t added any properties yet. Start building your portfolio today.
          </p>
          <Link 
            href="/dashboard/properties/add" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20"
          >
            <PlusCircle size={18} />
            Add First Property
          </Link>
        </div>
      )}
    </div>
  );
};

export default AgentPropertiesPage;
