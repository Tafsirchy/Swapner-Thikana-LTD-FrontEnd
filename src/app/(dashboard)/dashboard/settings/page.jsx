'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, Save, Loader2, Lock, Eye, EyeOff, Shield, Calendar, Camera, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import SmartImage from '@/components/shared/SmartImage';

const SettingsPage = () => {
  const { user, updateUser, checkAuth } = useAuth();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
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
    specialization: user?.specialization || '',
    experience: user?.experience || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Sync form data with user context when it loads/changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
      });
    }
  }, [user]);

  // Corrected handleDeleteImage to use checkAuth instead of reload
  const handleDeleteImage = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    
    // Optimistic Update: Immediately remove image from UI
    const originalUser = { ...user };
    if (user) {
      updateUser({ ...user, avatar: null, image: null }, false); // False means don't hit API yet
    }
    setPreviewImage(null);
    setIsLoading(true);

    try {
      await api.user.deleteProfileImage();
      await checkAuth(); // Sync with backend
      toast.success('Profile image removed');
    } catch (error) {
      console.error('Delete image failed:', error);
      toast.error('Failed to remove image');
      // Revert if failed
      if (originalUser) updateUser(originalUser, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, avatar: file });
      setPreviewImage(URL.createObjectURL(file));
      // Reset ref so same file can be selected again if needed
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      if (formData.bio) data.append('bio', formData.bio);
      if (formData.specialization) data.append('specialization', formData.specialization);
      if (formData.experience) data.append('experience', formData.experience);
      if (formData.avatar) data.append('avatar', formData.avatar);

      // Use context method to update state immediately
      const result = await updateUser(data);
      
      if (result.success) {
        toast.success('Profile updated successfully');
        setPreviewImage(null); // Clear preview as main image will update
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
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
      <DashboardPageHeader 
        title="Account Settings"
        subtitle="Manage your personal information and security preferences."
        icon={<User />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden sticky top-32">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-brand-gold/20 to-royal-deep relative">
               <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
            </div>
            
            {/* Avatar & Info */}
            <div className="px-5 sm:px-8 pb-8 -mt-12 relative text-center">
              <div 
                className="w-24 h-24 rounded-3xl bg-zinc-900 border-4 border-zinc-900 mx-auto flex items-center justify-center text-3xl font-bold text-brand-gold shadow-xl relative overflow-hidden group mb-4"
              >
                 {previewImage ? (
                    <SmartImage src={previewImage} alt="Preview" fill className="object-cover" />
                 ) : (user?.avatar || user?.image) ? (
                    <SmartImage src={user.avatar || user.image} alt={user.name} fill className="object-cover" />
                 ) : (
                    <User size={48} className="text-zinc-600" />
                 )}
                 
                 {/* Upload & Actions Overlay */}
                 <div 
                    className="absolute inset-0 bg-black/50 flex lg:hidden group-hover:flex items-center justify-center gap-3 transition-all z-20 backdrop-blur-sm rounded-3xl"
                 >
                    {/* Upload Button */}
                    <button
                       onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                       }}
                       className="p-2 bg-brand-gold text-royal-deep rounded-full shadow-lg transition-all transform hover:scale-110"
                       title="Upload Photo"
                    >
                       <Camera size={18} />
                    </button>

                    {/* Delete Button (Only if image exists) */}
                    {(previewImage || user?.avatar || user?.image) && (
                      <button
                         onClick={handleDeleteImage}
                         className="p-2 bg-red-500 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
                         title="Remove Photo"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                 </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
              
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
           <div className="flex items-center gap-1 sm:gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
              <button
                 onClick={() => setActiveTab('general')}
                 className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
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
                 className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
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
           <div className="bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 min-h-[400px] sm:min-h-[500px]">
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
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900 text-sm sm:text-base"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Phone Number</label>
                                <input 
                                   type="text" 
                                   value={formData.phone}
                                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900 text-sm sm:text-base"
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
                                   className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 outline-none text-zinc-400 text-sm sm:text-base"
                                />
                                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                             </div>
                             <p className="text-[10px] sm:text-xs text-zinc-500">To change your email, please contact support.</p>
                          </div>

                          {user?.role === 'agent' && (
                             <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Specialization</label>
                                      <input 
                                         type="text" 
                                         value={formData.specialization}
                                         onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                         className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900 text-sm sm:text-base"
                                         placeholder="e.g. Luxury Villas, Commercial, Apartments"
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Years of Experience</label>
                                      <input 
                                         type="text" 
                                         value={formData.experience}
                                         onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                         className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900 text-sm sm:text-base"
                                         placeholder="e.g. 5 Years"
                                      />
                                   </div>
                                </div>

                                <div className="space-y-2">
                                   <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Bio / About Me</label>
                                   <textarea 
                                      value={formData.bio}
                                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                      rows={4}
                                       className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 resize-none transition-all focus:bg-zinc-900 text-sm sm:text-base"
                                      placeholder="Tell clients about your experience..."
                                   />
                                </div>
                             </>
                          )}

                          <div className="pt-4 flex justify-end">
                             <button 
                                type="submit" 
                                disabled={isLoading || (() => {
                                  if (!user) return true;
                                  const currentValues = {
                                    name: user.name || '',
                                    phone: user.phone || '',
                                    bio: user.bio || '',
                                    specialization: user.specialization || '',
                                    experience: user.experience || '',
                                  };
                                  const formValues = {
                                    name: formData.name || '',
                                    phone: formData.phone || '',
                                    bio: formData.bio || '',
                                    specialization: formData.specialization || '',
                                    experience: formData.experience || '',
                                  };
                                  
                                  const isChanged = JSON.stringify(currentValues) !== JSON.stringify(formValues);
                                  const hasImageChange = !!formData.avatar;
                                  
                                  return !isChanged && !hasImageChange;
                                })()}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 sm:py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-white hover:text-royal-deep transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-zinc-500 disabled:shadow-none text-sm sm:text-base"
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
                                   className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl pl-4 pr-12 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900 text-sm sm:text-base"
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
                                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl pl-4 pr-12 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900 text-sm sm:text-base"
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
                                      className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl pl-4 pr-12 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-zinc-100 transition-all focus:bg-zinc-900 text-sm sm:text-base"
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
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 sm:py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-brand-gold hover:text-royal-deep hover:border-brand-gold transition-all shadow-lg active:scale-95 disabled:opacity-70 text-sm sm:text-base"
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
