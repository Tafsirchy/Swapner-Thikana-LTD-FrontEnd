'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, Save, Loader2, Lock, Eye, EyeOff, Shield, Calendar, Camera } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.user.updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsPasswordLoading(true);
    try {
      await api.auth.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-zinc-100 flex items-center gap-3">
          <User size={36} className="text-brand-gold" />
          Account Settings
        </h1>
        <p className="text-zinc-400 mt-2 text-lg">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden sticky top-32">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-brand-gold/20 to-royal-deep relative">
               <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
            </div>
            
            {/* Avatar & Info */}
            <div className="px-8 pb-8 -mt-12 relative text-center">
              <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-900 mx-auto flex items-center justify-center text-3xl font-bold text-brand-gold shadow-xl relative overflow-hidden group mb-4">
                 {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                    <span>{user?.name?.[0] || 'U'}</span>
                 )}
                 <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                    <Camera size={20} className="text-white" />
                 </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-wider mb-6">
                {user?.role} Account
              </span>

              <div className="space-y-4 text-left border-t border-white/5 pt-6">
                 <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Mail size={16} className="text-brand-gold" />
                    <span className="truncate">{user?.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Calendar size={16} className="text-brand-gold" />
                    <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Tabs & Forms */}
        <div className="lg:col-span-2 space-y-6">
           {/* Tab Navigation */}
           <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
              <button
                 onClick={() => setActiveTab('general')}
                 className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'general' 
                    ? 'bg-brand-gold text-royal-deep shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                 }`}
              >
                 <User size={16} />
                 General Profile
              </button>
              <button
                 onClick={() => setActiveTab('security')}
                 className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'security' 
                    ? 'bg-brand-gold text-royal-deep shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                 }`}
              >
                 <Shield size={16} />
                 Security
              </button>
           </div>

           {/* Content Area */}
           <div className="bg-white/5 border border-white/5 rounded-3xl p-8 min-h-[500px]">
              <AnimatePresence mode="wait">
                 {activeTab === 'general' ? (
                    <motion.div
                       key="general"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       transition={{ duration: 0.2 }}
                    >
                       <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                       <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Full Name</label>
                                <input 
                                   type="text" 
                                   value={formData.name}
                                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                                   className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Phone Number</label>
                                <input 
                                   type="text" 
                                   value={formData.phone}
                                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                   className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900"
                                />
                             </div>
                          </div>

                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Email Address</label>
                             <div className="relative opacity-50 cursor-not-allowed">
                                <input 
                                   type="email" 
                                   value={user?.email || ''}
                                   disabled
                                   className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none text-zinc-400"
                                />
                                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                             </div>
                             <p className="text-[10px] text-zinc-500">To change your email, please contact support.</p>
                          </div>

                          {user?.role === 'agent' && (
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Bio / About Me</label>
                                <textarea 
                                   value={formData.bio}
                                   onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                   rows={4}
                                   className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-gold/50 text-zinc-100 resize-none transition-all focus:bg-zinc-900"
                                   placeholder="Tell clients about your experience..."
                                />
                             </div>
                          )}

                          <div className="pt-4 flex justify-end">
                             <button 
                                type="submit" 
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-white hover:text-royal-deep transition-all shadow-lg active:scale-95 disabled:opacity-70"
                             >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save Changes
                             </button>
                          </div>
                       </form>
                    </motion.div>
                 ) : (
                    <motion.div
                       key="security"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       transition={{ duration: 0.2 }}
                    >
                       <h3 className="text-xl font-bold text-white mb-6">Password & Security</h3>
                       <form onSubmit={handlePasswordChange} className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Current Password</label>
                             <div className="relative">
                                <input 
                                   type={showPasswords.current ? "text" : "password"}
                                   value={passwordData.currentPassword}
                                   onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                   className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900"
                                   placeholder="••••••••"
                                />
                                <button
                                   type="button"
                                   onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                   className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-gold"
                                >
                                   {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">New Password</label>
                                <div className="relative">
                                   <input 
                                      type={showPasswords.new ? "text" : "password"}
                                      value={passwordData.newPassword}
                                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                      className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900"
                                      placeholder="••••••••"
                                   />
                                   <button
                                      type="button"
                                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-gold"
                                   >
                                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                   </button>
                                </div>
                             </div>

                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Confirm Password</label>
                                <div className="relative">
                                   <input 
                                      type={showPasswords.confirm ? "text" : "password"}
                                      value={passwordData.confirmPassword}
                                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                      className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900"
                                      placeholder="••••••••"
                                   />
                                   <button
                                      type="button"
                                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-gold"
                                   >
                                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                   </button>
                                </div>
                             </div>
                          </div>

                          <div className="pt-4 flex justify-end">
                             <button 
                                type="submit" 
                                disabled={isPasswordLoading}
                                className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-brand-gold hover:text-royal-deep hover:border-brand-gold transition-all shadow-lg active:scale-95 disabled:opacity-70"
                             >
                                {isPasswordLoading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                                Update Security
                             </button>
                          </div>
                       </form>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
