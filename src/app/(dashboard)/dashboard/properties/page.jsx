'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Building2, PlusCircle, Edit, Trash2, Eye, MoreVertical, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const AgentPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await api.properties.getMyProperties();
      setProperties(data.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

	// Filter properties by status
	const filteredProperties = useMemo(() => {
		if (statusFilter === 'all') return properties;
		return properties.filter(prop => prop.status === statusFilter);
	}, [properties, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.properties.delete(id);
        setProperties(properties.filter(p => p._id !== id));
        toast.success('Property deleted successfully');
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

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
            <Building2 size={32} className="text-brand-emerald" />
            My Listings
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage your active and pending property listings
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          {properties.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-zinc-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 outline-none focus:border-brand-gold/50 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          )}
          
          <Link 
            href="/dashboard/properties/add" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20"
          >
            <PlusCircle size={18} />
            Add New Property
          </Link>
        </div>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-zinc-300">Property</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-zinc-300">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-zinc-300">Price</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-zinc-300">Views</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-zinc-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProperties.map((property) => (
                  <tr key={property._id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden relative">
                           {property.images?.[0] && (
                              <Image src={property.images[0]} alt="" width={64} height={64} className="w-full h-full object-cover" />
                           )}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-100 line-clamp-1">{property.title}</h4>
                          <p className="text-xs text-zinc-500 mt-1">{property.location?.city}, {property.location?.area}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          property.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                          property.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                       }`}>
                          {property.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-200">
                       {property.price?.toLocaleString()} BDT
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1">
                          <Eye size={14} /> {property.views}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/properties/edit/${property._id}`} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-brand-gold transition-colors">
                             <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDelete(property._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors">
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
