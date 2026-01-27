'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Bell, Loader2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const ReminderForm = ({ leadId, leadName, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: `Follow up with ${leadName}`,
    note: '',
    dueDate: '',
    dueTime: '10:00'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dueDate || !formData.dueTime) {
      toast.error('Please select both date and time');
      return;
    }

    setLoading(true);
    try {
      const combinedDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      await api.reminders.create({
        leadId,
        title: formData.title,
        note: formData.note,
        dueDate: combinedDateTime.toISOString()
      });
      toast.success('Reminder set successfully');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      toast.error('Failed to set reminder');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Bell size={16} className="text-brand-gold" />
          Set Follow-up Reminder
        </h4>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Reminder Title</label>
          <input 
            type="text"
            required
            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Date</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="date"
                required
                className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-brand-gold/50 [color-scheme:dark]"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Time</label>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="time"
                required
                className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-brand-gold/50 [color-scheme:dark]"
                value={formData.dueTime}
                onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Add Note (Optional)</label>
          <textarea 
            rows="2"
            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-100 outline-none focus:border-brand-gold/50 resize-none"
            placeholder="Extra details for the reminder..."
            value={formData.note}
            onChange={(e) => setFormData({...formData, note: e.target.value})}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 text-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Reminder'}
        </button>
      </form>
    </div>
  );
};

export default ReminderForm;
