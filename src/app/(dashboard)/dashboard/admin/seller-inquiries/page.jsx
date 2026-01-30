'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Search, Filter, Mail, Phone, MapPin, 
  Clock, CheckCircle, XCircle, Eye, X, ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
  contacted: { label: 'Contacted', color: 'bg-blue-500/10 text-blue-500', icon: Phone },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-500', icon: XCircle }
};

const InquiryDetailsModal = ({ inquiry, onClose, onUpdateStatus }) => {
  if (!inquiry) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-bold font-cinzel text-zinc-100 italic">Inquiry Details</h2>
            <p className="text-xs text-zinc-500 mt-1">Submitted on {new Date(inquiry.createdAt).toLocaleDateString()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Seller & Property Info */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em]">Seller Information</h3>
                <div className="glass p-5 rounded-2xl border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                      <Users size={16} />
                    </div>
                    <span className="font-bold text-zinc-100">{inquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-400 hover:text-brand-gold transition-colors cursor-pointer">
                    <Mail size={16} className="text-brand-gold/50" />
                    {inquiry.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-400 hover:text-brand-gold transition-colors cursor-pointer">
                    <Phone size={16} className="text-brand-gold/50" />
                    {inquiry.phone}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em]">Property Details</h3>
                <div className="glass p-5 rounded-2xl border-white/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase rounded-md tracking-widest leading-none">
                      {inquiry.propertyType}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-300">
                    <MapPin size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                    {inquiry.address}
                  </div>
                  {inquiry.message && (
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-bold">Additional Message</p>
                      <p className="text-sm text-zinc-400 leading-relaxed italic">&ldquo;{inquiry.message}&rdquo;</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Photos & Status */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em]">Property Photos</h3>
                {inquiry.images && inquiry.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {inquiry.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg">
                        <img src={img} alt={`property-${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink size={16} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass p-8 rounded-2xl border-white/5 border-dashed flex flex-col items-center justify-center text-zinc-500 italic text-sm">
                    No photos uploaded for this inquiry.
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em]">Management</h3>
                <div className="glass p-5 rounded-2xl border-white/5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Status</label>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 ${statusConfig[inquiry.status]?.color}`}>
                        {React.createElement(statusConfig[inquiry.status]?.icon || Clock, { size: 14 })}
                        {statusConfig[inquiry.status]?.label}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Change Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(statusConfig).map(status => (
                        <button
                          key={status}
                          onClick={() => onUpdateStatus(inquiry._id, status)}
                          disabled={inquiry.status === status}
                          className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                            inquiry.status === status
                            ? 'bg-white/5 border-white/10 text-zinc-500 cursor-not-allowed'
                            : 'bg-zinc-800 border-white/5 text-zinc-400 hover:border-brand-gold/50 hover:text-brand-gold'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminSellerInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 100
      };
      const response = await api.seller.getAllInquiries(params);
      setInquiries(response.data.inquiries || []);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await api.seller.updateStatus(id, newStatus);
      
      const updatedInquiries = inquiries.map(item => 
        item._id === id ? { ...item, status: newStatus } : item
      );
      setInquiries(updatedInquiries);
      
      if (selectedInquiry?._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
      
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phone.includes(searchQuery) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 font-cinzel italic tracking-wide">
            <Users className="text-brand-gold" />
            Seller Inquiries
          </h1>
          <p className="text-zinc-400 text-xs tracking-widest mt-1 opacity-70 uppercase font-medium">Manage &quot;Sell with Us&quot; form submissions</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass p-5 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-5 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search inquiries by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-brand-gold/50 transition-all text-sm font-medium placeholder:text-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter size={16} className="text-zinc-500 flex-shrink-0 mr-2" />
          {['all', 'pending', 'contacted', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap border tracking-widest ${
                statusFilter === status 
                ? 'bg-brand-gold border-brand-gold text-royal-deep shadow-lg shadow-brand-gold/20' 
                : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.03]">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Seller Details</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Property Info</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">Retriving inquiries...</span>
                  </div>
                </td>
              </tr>
            ) : filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center text-zinc-600 italic">
                  No inquiries found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-7">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-zinc-100 text-base">{inquiry.name}</span>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Mail size={14} className="text-brand-gold/60" />
                        {inquiry.email}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Phone size={14} className="text-brand-gold/60" />
                        {inquiry.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="max-w-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[9px] font-black uppercase rounded tracking-widest leading-none">
                          {inquiry.propertyType}
                        </span>
                        {inquiry.images?.length > 0 && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded tracking-widest leading-none">
                            {inquiry.images.length} Photos
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-3 text-xs text-zinc-400 line-clamp-1 italic opacity-60">
                        <MapPin size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                        {inquiry.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase inline-flex items-center gap-2 border border-white/5 ${statusConfig[inquiry.status]?.color}`}>
                      {React.createElement(statusConfig[inquiry.status]?.icon || Clock, { size: 12 })}
                      {statusConfig[inquiry.status]?.label}
                    </span>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="p-2.5 bg-white/5 rounded-xl text-zinc-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-all border border-white/5"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <select 
                        value={inquiry.status}
                        disabled={updatingId === inquiry._id}
                        onChange={(e) => handleUpdateStatus(inquiry._id, e.target.value)}
                        className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold uppercase focus:outline-none focus:border-brand-gold tracking-widest transition-all cursor-pointer hover:border-white/30"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <InquiryDetailsModal 
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSellerInquiriesPage;
