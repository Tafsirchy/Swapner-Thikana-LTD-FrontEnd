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
  Bell,
  X
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
            <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className={`${column.color} ${column.bg} p-2 rounded-xl border border-white/5 shadow-inner`}>
                  {column.icon}
                </span>
                <h3 className="font-cinzel font-bold text-zinc-100 uppercase tracking-widest text-xs">{column.title}</h3>
              </div>
              <span className="bg-brand-gold/10 text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-gold/20">
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
                  className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-5 rounded-3xl hover:border-brand-gold/40 transition-all cursor-pointer group shadow-xl hover:shadow-brand-gold/5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold/60 px-2 py-0.5 bg-brand-gold/5 rounded-full border border-brand-gold/10">
                      {lead.interestType || 'Inquiry'}
                    </span>
                    <button className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  <h4 className="font-bold text-zinc-100 mb-1.5 group-hover:text-brand-gold transition-colors text-base">{lead.name}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mb-4 font-medium italic">
                    {lead.subject || lead.propertyName || (lead.interestType === 'general' ? 'General Inquiry' : `Inquiry for ${lead.interestType}`)}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-zinc-600" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    {lead.notes?.length > 0 && (
                      <span className="bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-lg border border-brand-gold/10 font-bold">
                        {lead.notes.length} NOTES
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
              className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[85vh] md:h-[80vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedLead(null)}
                className="absolute top-6 right-6 z-[120] p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-brand-gold hover:border-brand-gold/50 transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
                {/* Sidebar Info (Left Column) */}
                <div className="w-full md:w-2/5 border-r border-white/5 p-8 bg-zinc-900/40 backdrop-blur-xl flex flex-col h-full overflow-y-auto custom-scrollbar">
                  <div className="mb-10">
                    <div className="w-20 h-20 bg-brand-gold/10 rounded-[2rem] flex items-center justify-center text-brand-gold mb-6 border border-brand-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                      <User size={40} />
                    </div>
                    <h2 className="text-3xl font-cinzel font-bold text-zinc-100 leading-tight uppercase tracking-tight">{selectedLead.name}</h2>
                    <p className="text-zinc-500 text-xs mt-2 font-medium tracking-widest">LEAD SINCE {new Date(selectedLead.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] backdrop-blur-md">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Contact Details</p>
                      <div className="space-y-4">
                        <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-4 text-sm text-zinc-300 hover:text-brand-gold transition-all group">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-gold/30 transition-colors">
                            <Mail size={14} className="text-zinc-500 group-hover:text-brand-gold transition-colors" />
                          </div>
                          {selectedLead.email}
                        </a>
                        <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-4 text-sm text-zinc-300 hover:text-brand-gold transition-all group">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-gold/30 transition-colors">
                            <Phone size={14} className="text-zinc-500 group-hover:text-brand-gold transition-colors" />
                          </div>
                          {selectedLead.phone}
                        </a>
                      </div>
                    </div>

                    <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] backdrop-blur-md">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Subject & Interest</p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-base text-zinc-100 font-bold font-cinzel uppercase tracking-wide">
                           {selectedLead.subject || (selectedLead.interestType === 'general' ? 'General Inquiry' : `Inquiry for ${selectedLead.interestType}`)}
                        </div>
                        {selectedLead.propertyName && (
                           <div className="flex items-center gap-3 text-sm text-brand-gold/80 font-medium">
                             <Building2 size={16} className="text-brand-gold/60" />
                             {selectedLead.propertyName}
                           </div>
                        )}
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-xs text-zinc-400 italic leading-relaxed">
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

                {/* Main Content: Notes (Right Column) */}
                <div className="w-full md:w-3/5 flex flex-col h-full overflow-hidden bg-zinc-950/20">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/40 backdrop-blur-md sticky top-0 z-10">
                    <h3 className="text-lg font-cinzel font-bold text-zinc-100 flex items-center gap-3 uppercase tracking-widest">
                      <Plus size={20} className="text-brand-gold p-0.5 border border-brand-gold rounded-full" />
                      Activity Timeline
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
                      <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 relative">
                           <MessageSquare size={40} className="text-zinc-600" />
                           <div className="absolute -right-1 -top-1 w-8 h-8 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/20">
                             <Plus size={16} className="text-brand-gold" />
                           </div>
                        </div>
                        <h4 className="text-lg font-cinzel text-zinc-400 mb-2 uppercase tracking-widest">No Activity Record</h4>
                        <p className="text-zinc-500 text-sm italic max-w-xs text-center">Start the conversation by adding your first follow-up note below.</p>
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
