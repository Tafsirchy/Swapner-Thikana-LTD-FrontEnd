'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { user, login } = useAuth(); // We might need a way to refresh user data in context
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '', // For agents
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await api.user.updateProfile(formData);
      // Ideally we should update the global auth context with new user data
      // For now we just show success
      toast.success('Profile updated successfully');
      // Force reload or update context logic would go here
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-zinc-100 mb-8 flex items-center gap-3">
        <User size={32} className="text-brand-gold" />
        Account Settings
      </h1>

      <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-brand-gold flex items-center justify-center text-4xl font-bold text-royal-deep">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-100">{user?.name}</h3>
              <p className="text-zinc-400 capitalize">{user?.role} Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold uppercase text-zinc-400">Email Address</label>
             <div className="relative opacity-50 cursor-not-allowed">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                   type="email" 
                   value={user?.email || ''}
                   disabled
                   className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none"
                />
             </div>
             <p className="text-[10px] text-zinc-500">Email address cannot be changed</p>
          </div>

          {user?.role === 'agent' && (
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-400">Bio / About Me</label>
                <textarea 
                   value={formData.bio}
                   onChange={(e) => setFormData({...formData, bio: e.target.value})}
                   rows={4}
                   className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50 resize-none"
                   placeholder="Tell clients about your experience..."
                />
             </div>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
