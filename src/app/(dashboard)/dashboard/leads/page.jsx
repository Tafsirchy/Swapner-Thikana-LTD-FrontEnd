'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Search, 
  Plus,
  Send,
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import ReminderForm from '@/components/dashboard/ReminderForm';

const STATUS_COLUMNS = [
  { id: 'new', title: 'New Leads', icon: <MessageSquare size={18} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'contacted', title: 'Contacted', icon: <Clock size={18} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'converted', title: 'Converted', icon: <CheckCircle2 size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'closed', title: 'Closed/Lost', icon: <XCircle size={18} />, color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
];

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReminderForm, setShowReminderForm] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await api.leads.getAll();
      setLeads(data.data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.leads.updateStatus(leadId, newStatus);
      setLeads(leads.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await api.leads.addNote(selectedLead._id, newNote);
      const note = response.data.note;
      
      const updatedLeads = leads.map(l => 
        l._id === selectedLead._id 
          ? { ...l, notes: [...(l.notes || []), note] } 
          : l
      );
      setLeads(updatedLeads);
      setSelectedLead({ ...selectedLead, notes: [...(selectedLead.notes || []), note] });
      setNewNote('');
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.propertyName && lead.propertyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getLeadsByStatus = (status) => filteredLeads.filter(l => l.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-zinc-100 flex items-center gap-3">
            <BarChart3 size={32} className="text-brand-gold" />
            Lead Pipeline
          </h1>
          <p className="text-zinc-400 mt-2 text-lg font-sans">Manage and track your property inquiries</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-zinc-100 outline-none focus:border-brand-gold/50 w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATUS_COLUMNS.map(column => (
          <div key={column.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className={`${column.color} ${column.bg} p-1.5 rounded-lg`}>
                  {column.icon}
                </span>
                <h3 className="font-bold text-zinc-200">{column.title}</h3>
                <span className="bg-white/5 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {getLeadsByStatus(column.id).length}
                </span>
              </div>
            </div>

            <div 
              className="flex-1 min-h-[500px] bg-white/[0.02] border border-white/5 rounded-3xl p-3 space-y-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const leadId = e.dataTransfer.getData('leadId');
                if (leadId) handleStatusChange(leadId, column.id);
              }}
            >
              {getLeadsByStatus(column.id).map(lead => (
                <motion.div
                  key={lead._id}
                  layoutId={lead._id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('leadId', lead._id)}
                  onClick={() => setSelectedLead(lead)}
                  className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl hover:border-brand-gold/30 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/70">
                      {lead.interestType || 'Inquiry'}
                    </span>
                    <button className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  <h4 className="font-bold text-zinc-100 mb-1 group-hover:text-brand-gold transition-colors">{lead.name}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-1 mb-3">{lead.propertyName || 'General Inquiry'}</p>
                  
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    {lead.notes?.length > 0 && (
                      <span className="bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded">
                        {lead.notes.length} notes
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {getLeadsByStatus(column.id).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-30 py-8">
                  <div className="w-10 h-10 border-2 border-dashed border-zinc-600 rounded-full mb-2"></div>
                  <span className="text-xs font-medium text-zinc-500 italic">No leads here</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 h-[80vh]">
                {/* Sidebar Info */}
                <div className="md:col-span-2 border-r border-white/5 p-8 bg-white/[0.02]">
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold mb-4">
                      <User size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-100">{selectedLead.name}</h2>
                    <p className="text-zinc-500 text-sm">Lead since {new Date(selectedLead.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Contact Details</p>
                      <div className="space-y-3">
                        <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-3 text-sm text-zinc-300 hover:text-brand-gold transition-colors">
                          <Mail size={16} className="text-zinc-500" />
                          {selectedLead.email}
                        </a>
                        <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-3 text-sm text-zinc-300 hover:text-brand-gold transition-colors">
                          <Phone size={16} className="text-zinc-500" />
                          {selectedLead.phone}
                        </a>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Interest</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                          <Building2 size={16} className="text-zinc-500" />
                          {selectedLead.propertyName || 'General Inquiry'}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 italic">
                          &quot;{selectedLead.message}&quot;
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        {!showReminderForm ? (
                          <button 
                            onClick={() => setShowReminderForm(true)}
                            className="w-full py-4 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-brand-gold/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Bell size={14} /> Set Follow-up Reminder
                          </button>
                        ) : (
                          <ReminderForm 
                            leadId={selectedLead._id}
                            leadName={selectedLead.name}
                            onClose={() => setShowReminderForm(false)}
                            onSuccess={() => setShowReminderForm(false)}
                          />
                        )}

                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Quick Move Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        {STATUS_COLUMNS.map(col => (
                          <button
                            key={col.id}
                            onClick={() => handleStatusChange(selectedLead._id, col.id)}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                              selectedLead.status === col.id 
                                ? 'bg-brand-gold text-royal-deep'
                                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                            }`}
                          >
                            {col.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content: Notes */}
                <div className="md:col-span-3 flex flex-col h-full overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                      <Plus size={20} className="text-brand-gold" />
                      Notes & Timeline
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {selectedLead.notes?.map((note, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-white/5">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 border-2 border-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
                        <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                          <p className="text-sm text-zinc-200 leading-relaxed mb-3">{note.text}</p>
                          <div className="flex items-center justify-between text-[10px] text-zinc-500">
                            <span className="font-bold flex items-center gap-1">
                              <User size={10} />
                              {note.authorName}
                            </span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(!selectedLead.notes || selectedLead.notes.length === 0) && (
                      <div className="text-center py-12">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus size={24} className="text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 text-sm italic">No notes added yet. Keep track of follow-ups here.</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-white/[0.02] border-t border-white/5">
                    <form onSubmit={handleAddNote} className="relative">
                      <input 
                        type="text"
                        placeholder="Add a follow-up note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
                      />
                      <button 
                        type="submit"
                        disabled={!newNote.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-gold text-royal-deep rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-50"
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default LeadsPage;
