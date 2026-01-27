'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle2, Trash2, Calendar, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UpcomingReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await api.reminders.getAll({ upcoming: true });
      setReminders(res.data.reminders || []);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await api.reminders.complete(id, !currentStatus);
      setReminders(reminders.map(r => r._id === id ? { ...r, isCompleted: !currentStatus } : r));
      toast.success(currentStatus ? 'Reminder reopened' : 'Reminder completed');
    } catch {
      toast.error('Failed to update reminder');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.reminders.delete(id);
      setReminders(reminders.filter(r => r._id !== id));
      toast.success('Reminder deleted');
    } catch {
      toast.error('Failed to delete reminder');
    }
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="animate-spin text-brand-gold" size={24} />
    </div>
  );

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-8 sticky top-28">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Bell className="text-brand-gold" size={20} />
          Upcoming Follow-ups
        </h2>
        <span className="bg-brand-gold/10 text-brand-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {reminders.filter(r => !r.isCompleted).length} Tasks
        </span>
      </div>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {reminders.length > 0 ? (
            reminders.map((reminder) => {
              const isOverdue = new Date(reminder.dueDate) < new Date() && !reminder.isCompleted;
              return (
                <motion.div 
                  key={reminder._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`p-4 rounded-2xl border transition-all group ${
                    reminder.isCompleted 
                      ? 'bg-zinc-800/20 border-white/5 opacity-50' 
                      : isOverdue 
                        ? 'bg-rose-500/5 border-rose-500/20 shadow-lg shadow-rose-500/5' 
                        : 'bg-white/5 border-white/5 hover:border-brand-gold/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={() => handleToggleComplete(reminder._id, reminder.isCompleted)}
                      className={`mt-1 rounded-full transition-colors ${
                        reminder.isCompleted 
                          ? 'text-emerald-500' 
                          : 'text-zinc-600 hover:text-brand-gold'
                      }`}
                    >
                      <CheckCircle2 size={18} fill={reminder.isCompleted ? 'currentColor' : 'none'} />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold truncate ${reminder.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                        {reminder.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={10} className={isOverdue ? 'text-rose-500' : 'text-zinc-500'} />
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${isOverdue ? 'text-rose-500' : 'text-zinc-500'}`}>
                          {formatDueDate(reminder.dueDate)}
                        </span>
                        {isOverdue && <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black">OVERDUE</span>}
                      </div>
                      {reminder.note && (
                        <p className="text-xs text-zinc-500 mt-2 line-clamp-2 italic">&quot;{reminder.note}&quot;</p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDelete(reminder._id)}
                      className="text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-zinc-600" size={24} />
              </div>
              <p className="text-zinc-500 text-sm italic">Focus on your leads.<br/>No reminders for now.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default UpcomingReminders;
