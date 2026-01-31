'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, CheckCircle2, Inbox, Calendar } from 'lucide-react';
import { api } from '@/lib/api';

const AllNotificationsModal = ({ isOpen, onClose, onRefreshBell }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread'

  const fetchAllNotifications = useCallback(async (pageNum = 1, tab = activeTab) => {
    try {
      setLoading(true);
      const response = await api.notifications.getAll({ 
        page: pageNum, 
        limit: 10,
        unreadOnly: tab === 'unread'
      });
      
      if (pageNum === 1) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.data.notifications]);
      }
      
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching all notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      fetchAllNotifications(1, activeTab);
    } else {
        // Reset when closed
        setPage(1);
        setNotifications([]);
    }
  }, [isOpen, activeTab, fetchAllNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      if (onRefreshBell) onRefreshBell();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.notifications.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (onRefreshBell) onRefreshBell();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      new_match: '🏠',
      inquiry_response: '💬',
      new_inquiry: '📨',
      property_approved: '✅',
      property_rejected: '❌',
      price_change: '💰',
      new_listing: '🆕',
      system: 'ℹ️'
    };
    return iconMap[type] || '🔔';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-royal-deep border border-white/10 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-zinc-900/50 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl md:text-3xl font-cinzel text-white font-bold tracking-tight">Notification <span className="text-brand-gold">Archive</span></h2>
              <p className="text-zinc-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold mt-2">Historical Records & System Alerts</p>
            </div>
            <button 
              onClick={onClose}
              className="relative z-10 p-3 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors border border-white/5"
            >
              <X size={20} />
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          </div>

          {/* Filters/Tabs */}
          <div className="px-6 md:px-8 py-4 border-b border-white/5 flex items-center gap-6 md:gap-10 bg-black/20">
            {['all', 'unread'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                  setNotifications([]);
                }}
                className={`relative py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  activeTab === tab ? 'text-brand-gold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab} Records
                {activeTab === tab && (
                  <motion.div layoutId="notif-tab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-gold" />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {loading && page === 1 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border border-brand-gold/20 flex items-center justify-center relative">
                   <div className="absolute inset-0 border border-brand-gold animate-ping opacity-20"></div>
                   <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-zinc-500 font-cinzel text-xs tracking-[0.3em] animate-pulse">Consulting Archives...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                   <Inbox size={32} className="text-zinc-600" />
                </div>
                <h3 className="text-2xl font-cinzel text-white mb-2 tracking-wide">The Archive is Clear</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto italic">No {activeTab === 'unread' ? 'new' : ''} messages found in the system registry.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {notifications.map((notif, i) => (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group relative p-5 md:p-8 transition-all duration-500 border ${
                      notif.isRead 
                        ? 'bg-white/[0.01] border-white/5' 
                        : 'bg-brand-gold/[0.02] border-brand-gold/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-8 items-start">
                      <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-zinc-900 border border-white/10 flex items-center justify-center text-2xl md:text-3xl group-hover:border-brand-gold/40 transition-colors duration-500 relative">
                         {getNotificationIcon(notif.type)}
                         {!notif.isRead && (
                             <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-gold rounded-full shadow-[0_0_10px_rgba(180,140,80,0.5)]"></div>
                         )}
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-3">
                          <h4 className="text-lg md:text-xl font-bold text-zinc-100 font-cinzel tracking-wider group-hover:text-brand-gold transition-colors duration-500">
                            {notif.title}
                          </h4>
                          <span className="flex-shrink-0 text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] border border-white/10 px-2 md:px-3 py-1 md:py-1.5 flex items-center gap-2 bg-black/20 w-fit">
                             <Calendar size={10} className="text-brand-gold/50" />
                             {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 italic font-medium">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-4 md:gap-6 border-t border-white/5 pt-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                          {!notif.isRead && (
                             <button 
                               onClick={() => handleMarkAsRead(notif._id)}
                               className="text-[9px] md:text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-white transition-colors"
                             >
                               <CheckCircle2 size={12} /> Resolve
                             </button>
                          )}
                          <button 
                            onClick={() => handleDelete(notif._id)}
                            className="text-[9px] md:text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-red-300 transition-colors ml-auto"
                          >
                            <Trash2 size={12} /> Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Load More */}
                {page < totalPages && (
                  <div className="pt-12 text-center">
                    <button
                      onClick={() => {
                        const next = page + 1;
                        setPage(next);
                        fetchAllNotifications(next);
                      }}
                      disabled={loading}
                      className="group relative px-10 py-4 bg-white/5 hover:bg-brand-gold transition-all duration-500 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="relative z-10 text-brand-gold group-hover:text-royal-deep text-xs font-bold uppercase tracking-[0.3em] transition-colors">
                        {loading ? 'Consulting Archives...' : 'Reveal More History'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Detail */}
          <div className="p-4 border-t border-white/5 bg-black/40 text-center">
             <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em]">Shwapner Thikana Ltd — Systems Registry v2.0</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AllNotificationsModal;
