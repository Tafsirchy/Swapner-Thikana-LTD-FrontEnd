'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Building2, CheckCircle, XCircle, Star, Search, Filter, Eye, ChevronDown, MapPin, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LuxurySelect from '@/components/shared/LuxurySelect';
import LuxuryPagination from '@/components/shared/LuxuryPagination';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import RejectionModal from '@/components/shared/RejectionModal';
import ResponsiveTable from '@/components/shared/ResponsiveTable';


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
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rejectingId, setRejectingId] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchProperties = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        featured: featuredFilter !== 'all' ? featuredFilter : undefined,
        search: searchQuery || undefined,
        sort: sort,
        limit: 10,
        page
      };
      
      const data = await api.admin.getProperties(params);
      setProperties(data.data.properties || []);
      setTotalPages(data.data.pagination?.pages || 1);
      
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
  }, [statusFilter, featuredFilter, sort, searchQuery]);

  useEffect(() => {
    fetchProperties(currentPage);
  }, [fetchProperties, currentPage]);

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
    setRejectingId(propertyId);
    setIsRejectModalOpen(true);
  };

  const confirmReject = async (reason) => {
    try {
      await api.admin.rejectProperty(rejectingId, reason);
      setProperties(properties.map(p => 
        p._id === rejectingId ? { ...p, status: 'rejected' } : p
      ));
      toast.success('Property rejected');
    } catch {
      toast.error('Failed to reject property');
    } finally {
      setRejectingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    
    try {
      await api.properties.delete(id);
      setProperties(properties.filter(p => p._id !== id));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete property');
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

  // Filters now handled on server-side
  const displayProperties = properties;

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
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
            <Building2 className="text-brand-gold w-6 h-6 sm:w-8 sm:h-8" />
            Property Management
          </h1>
          <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-lg">
            Review and approve property listings
          </p>
        </div>
        <Link
          href="/dashboard/properties/add"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/10 text-sm sm:text-base"
        >
          <Building2 size={18} /> ADD NEW PROPERTY
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 text-sm"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3">
          <div className="sm:hidden flex items-center gap-2 text-zinc-500 mb-1">
            <Filter size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Quick Filters</span>
          </div>
          
          <LuxurySelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Published', value: 'published' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Sold', value: 'sold' }
            ]}
            className="!py-2.5"
          />

          <LuxurySelect
            value={featuredFilter}
            onChange={setFeaturedFilter}
            placeholder="Featured: All"
            options={[
              { label: 'Featured: All', value: 'all' },
              { label: 'Featured Only', value: 'true' },
              { label: 'Non-Featured', value: 'false' }
            ]}
            className="!py-2.5"
          />

          <LuxurySelect
            value={sort}
            onChange={setSort}
            placeholder="Newest First"
            options={[
              { label: 'Newest First', value: 'newest' },
              { label: 'Oldest First', value: 'oldest' },
              { label: 'Price: Low to High', value: 'price-asc' },
              { label: 'Price: High to Low', value: 'price-desc' },
              { label: 'Most Popular', value: 'popular' }
            ]}
            className="!py-2.5 sm:col-span-2 lg:col-auto"
          />
        </div>
      </div>

      <ResponsiveTable
        columns={[
          {
            key: 'title',
            label: 'Property',
            renderCell: (property) => (
              <div>
                <div className="font-bold text-zinc-100 truncate max-w-[200px] xl:max-w-none">{property.title}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-tight mt-0.5">{property.location.area}</div>
              </div>
            )
          },
          {
            key: 'agent',
            label: 'Agent',
            renderCell: (property) => <div className="text-xs">{property.agent?.name || 'Unknown'}</div>
          },
          {
            key: 'price',
            label: 'Price',
            renderCell: (property) => <span className="font-bold text-zinc-100">৳{(property.price / 10000000).toFixed(2)}Cr</span>
          },
          {
            key: 'status',
            label: 'Status',
            renderCell: (property) => (
              <span className={`${statusColors[property.status]} px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider`}>
                {property.status}
              </span>
            )
          },
          {
            key: 'featured',
            label: 'Featured',
            renderCell: (property) => (
              <button
                onClick={() => handleToggleFeatured(property._id, property.featured)}
                className={`p-2 rounded-lg transition-all ${
                  property.featured 
                    ? 'bg-yellow-500/20 text-yellow-500' 
                    : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                }`}
              >
                <Star size={16} fill={property.featured ? 'currentColor' : 'none'} />
              </button>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            renderCell: (property) => (
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/properties/${property.slug || property._id}`}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
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
                <button
                  onClick={() => handleDelete(property._id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
        
                {property.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(property._id)}
                      className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(property._id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                  </>
                )}
              </div>
            )
          }
        ]}
        data={displayProperties}
        loading={loading}
        icon={Building2}
        emptyMessage="No properties found matching your criteria"
        renderCard={(property) => (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-zinc-100 line-clamp-2">{property.title}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-tight mt-1 flex items-center gap-1">
                  <MapPin size={10} className="text-brand-gold" />
                  {property.location.area}
                </div>
              </div>
              <span className={`${statusColors[property.status]} px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider`}>
                {property.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-y border-white/5">
              <div className="text-zinc-500">Price</div>
              <div className="font-bold text-zinc-100">৳{(property.price / 10000000).toFixed(2)}Cr</div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/properties/${property.slug || property._id}`}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white"
                  title="View"
                >
                  <Eye size={18} />
                </Link>
                <Link
                  href={`/dashboard/admin/properties/edit/${property._id}`}
                  className="p-2.5 bg-white/5 hover:bg-brand-gold hover:text-royal-deep rounded-xl transition-all text-brand-gold"
                  title="Edit"
                >
                  <Building2 size={18} />
                </Link>
                <button
                  onClick={() => handleToggleFeatured(property._id, property.featured)}
                  className={`p-2.5 rounded-xl transition-all ${
                    property.featured 
                      ? 'bg-yellow-500/20 text-yellow-500' 
                      : 'bg-white/5 text-zinc-500'
                  }`}
                  title="Feature"
                >
                  <Star size={18} fill={property.featured ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors text-zinc-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {property.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(property._id)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    title="Reject"
                  >
                    <XCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleApprove(property._id)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all uppercase"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      />

      <LuxuryPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <RejectionModal 
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={confirmReject}
      />
    </div>
  );
};

const AdminPropertiesPageWrapper = () => (
  <ProtectedRoute allowedRoles={['admin', 'management']}>
    <AdminPropertiesPage />
  </ProtectedRoute>
);

export default AdminPropertiesPageWrapper;
