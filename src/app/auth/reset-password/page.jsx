'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }

    setIsLoading(true);
    
    try {
      await api.auth.resetPassword(token, password);
      setIsSuccess(true);
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-6">
        <div className="text-destructive font-bold text-xl uppercase tracking-widest">Invalid Link</div>
        <p className="text-zinc-400">This password reset link is invalid or has expired.</p>
        <Link href="/auth/forgot-password" university className="text-brand-gold hover:underline font-bold">Request New Link</Link>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="Swapner Thikana" className="h-[60px] w-auto" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-zinc-100">Set New Password</h2>
        <p className="text-zinc-400 text-sm mt-2">Almost there! Create a strong password for your account.</p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-gold transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-brand-gold/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder:text-zinc-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Confirm New Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-gold transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-brand-gold/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder:text-zinc-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-[0.98] shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                Update Password
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-8 text-center py-4">
          <div className="flex justify-center">
            <CheckCircle2 size={64} className="text-brand-emerald" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-100">Security Updated</h3>
            <p className="text-zinc-400 leading-relaxed italic">Your password has been changed to something more exclusive. You can now access your dream portfolio.</p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
          >
            Sign In Now
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-deep px-4 py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Suspense fallback={
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6">
            <Loader2 size={40} className="text-brand-gold animate-spin" />
            <p className="text-zinc-400 text-sm font-medium">Protecting your account...</p>
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
