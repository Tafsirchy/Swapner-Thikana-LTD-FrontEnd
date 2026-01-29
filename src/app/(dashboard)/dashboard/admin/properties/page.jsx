'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, CheckCircle, XCircle, Star, Search, Filter, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  published: 'bg-emerald-500/10 text-emerald-500',
  rejected: 'bg-red-500/10 text-red-500',
  sold: 'bg-zinc-500/10 text-zinc-500',
};

const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // For now use mock data until backend API exists
      const data = await api.admin.getProperties();
      setProperties(data.data.properties || []);
      
      // Mock data
      // setProperties([
      //   { 
      //     _id: '1', 
      //     title: 'Luxury Penthouse in Banani', 
      //     agent: { name: 'Agent Smith' },
      //     price: 45000000,
      //     status: 'pending',
      //     featured: false,
      //     location: { area: 'Banani' },
      //     createdAt: '2025-01-20'
      //   },
      //   { 
      //     _id: '2', 
      //     title: 'Modern Villa in Gulshan',
      //     agent: { name: 'John Doe' },
      //     price: 65000000,
      //     status: 'published',
      //     featured: true,
      //     location: { area: 'Gulshan' },
      //     createdAt: '2025-01-18'
      //   },
      // ]);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      await api.admin.approveProperty(propertyId);
      setProperties(properties.map(p => 
        p._id === propertyId ? { ...p, status: 'published' } : p
      ));
      toast.success('Property approved and published');
    } catch {
      toast.error('Failed to approve property');
    }
  };

  const handleReject = async (propertyId) => {
    try {
      const reason = prompt('Reason for rejection (optional):');
      await api.admin.rejectProperty(propertyId, reason);
      setProperties(properties.map(p => 
        p._id === propertyId ? { ...p, status: 'rejected' } : p
      ));
      toast.success('Property rejected');
    } catch {
      toast.error('Failed to reject property');
    }
  };

  const handleToggleFeatured = async (propertyId, currentStatus) => {
    try {
      await api.admin.toggleFeatured(propertyId, !currentStatus);
      setProperties(properties.map(p => 
        p._id === propertyId ? { ...p, featured: !currentStatus } : p
      ));
      toast.success(currentStatus ? 'Removed from featured' : 'Added to featured');
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <Building2 size={32} className="text-brand-gold" />
            Property Management
          </h1>
          <p className="text-zinc-400 mt-1">
            Review and approve property listings
          </p>
        </div>
        <Link
          href="/dashboard/properties/add"
          className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10"
        >
          <Building2 size={18} /> Add New Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Property</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Agent</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Price</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Featured</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProperties.map((property) => (
                <tr key={property._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-zinc-100">{property.title}</div>
                      <div className="text-xs text-zinc-500">{property.location.area}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {property.agent?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-100">
                    ৳{(property.price / 10000000).toFixed(2)}Cr
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${statusColors[property.status]} px-3 py-1 rounded-full font-bold text-xs uppercase`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFeatured(property._id, property.featured)}
                      className={`p-2 rounded-lg transition-all ${
                        property.featured 
                          ? 'bg-yellow-500/20 text-yellow-500' 
                          : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                      }`}
                    >
                      <Star size={18} fill={property.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/properties/${property.slug}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/dashboard/admin/properties/edit/${property._id}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-brand-gold"
                        title="Edit"
                      >
                        <Building2 size={18} />
                      </Link>

                      {property.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(property._id)}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(property._id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No properties found matching your criteria
        </div>
      )}
    </div>
  );
};

export default AdminPropertiesPage;
